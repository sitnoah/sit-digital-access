import { Injectable } from "@nestjs/common";
import type { UserRecord } from "firebase-admin/auth";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AdminClaim, AuthenticatedRequest } from "../common/types";
import { AuditService } from "../audit/audit.service";
import { FirebaseAdminService } from "../firebase/firebase-admin.service";
import type { InviteAdminUserDto } from "./dto/invite-admin-user.dto";
import type { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import type { UpdateUserClaimsDto } from "./dto/update-user-claims.dto";

const ADMIN_CLAIMS: AdminClaim[] = [
  "superAdmin",
  "admin",
  "operationsManager",
  "deviceManager",
  "donationsManager",
  "supportAgent",
  "deploymentCoordinator",
  "countryManager",
  "inventoryManager",
  "analyticsManager"
];

function getRequestedClaims(input: UpdateUserClaimsDto["claims"]): Partial<Record<AdminClaim, boolean>> {
  return ADMIN_CLAIMS.reduce<Partial<Record<AdminClaim, boolean>>>((claims, role) => {
    const value = input[role];

    if (typeof value === "boolean") {
      claims[role] = value;
    }

    return claims;
  }, {});
}

function getRoleList(claims: Record<string, unknown>): AdminClaim[] {
  return ADMIN_CLAIMS.filter((role) => claims[role] === true);
}

function roleClaims(role: AdminClaim): Partial<Record<AdminClaim, boolean>> {
  return ADMIN_CLAIMS.reduce<Partial<Record<AdminClaim, boolean>>>((claims, claim) => {
    claims[claim] = claim === role;
    return claims;
  }, {});
}

function statusFromUser(user: UserRecord, profile?: Record<string, unknown>): string {
  if (user.disabled) {
    return "DISABLED";
  }

  if (typeof profile?.status === "string") {
    return profile.status;
  }

  return "ACTIVE";
}

function toUserProfile(user: UserRecord, profile?: Record<string, unknown>) {
  const claims = user.customClaims ?? {};
  const roles = getRoleList(claims);

  return {
    id: user.uid,
    uid: user.uid,
    fullName: (profile?.fullName as string | undefined) ?? user.displayName ?? user.email ?? "Admin user",
    email: user.email ?? (profile?.email as string | undefined) ?? "",
    phone: user.phoneNumber ?? (profile?.phone as string | undefined) ?? null,
    role: (profile?.role as string | undefined) ?? roles[0] ?? "supportAgent",
    roles,
    team: (profile?.team as string | undefined) ?? "Operations",
    country: (profile?.country as string | undefined) ?? "United Kingdom",
    deploymentRegions: (profile?.deploymentRegions as string[] | undefined) ?? [],
    permissions: roles,
    status: statusFromUser(user, profile),
    lastLoginAt: user.metadata.lastSignInTime ?? null,
    createdAt: (profile?.createdAt as string | undefined) ?? user.metadata.creationTime ?? null,
    updatedAt: (profile?.updatedAt as string | undefined) ?? null,
    mfaEnabled: (user.multiFactor?.enrolledFactors.length ?? 0) > 0 || Boolean(profile?.mfaEnabled),
    avatarUrl: user.photoURL ?? null,
    bio: (profile?.bio as string | undefined) ?? "",
    languages: (profile?.languages as string[] | undefined) ?? [],
    skills: (profile?.skills as string[] | undefined) ?? [],
    certifications: (profile?.certifications as string[] | undefined) ?? [],
    availability: (profile?.availability as string | undefined) ?? "Available",
    currentProjects: (profile?.currentProjects as string[] | undefined) ?? [],
    adminClaims: claims,
    disabled: user.disabled
  };
}

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly repository: FirestoreRepository,
    private readonly auditService: AuditService
  ) {}

  async listUsers() {
    const authUsers = await this.firebaseAdmin.auth.listUsers(1000);
    let profiles: Record<string, Record<string, unknown>> = {};

    try {
      const userProfiles = await this.repository.list<Record<string, unknown>>(COLLECTIONS.users, 1000);
      profiles = userProfiles.reduce<Record<string, Record<string, unknown>>>((acc, profile) => {
        if (typeof profile.id === "string") {
          acc[profile.id] = profile;
        }
        if (typeof profile.uid === "string") {
          acc[profile.uid] = profile;
        }
        return acc;
      }, {});
    } catch {
      profiles = {};
    }

    return authUsers.users.map((user) => toUserProfile(user, profiles[user.uid]));
  }

  async inviteUser(dto: InviteAdminUserDto, actor: AuthenticatedRequest["user"]) {
    let user: UserRecord;
    let createdAuthUser = false;

    try {
      user = await this.firebaseAdmin.auth.getUserByEmail(dto.email);
    } catch {
      user = await this.firebaseAdmin.auth.createUser({
        email: dto.email,
        displayName: dto.fullName,
        disabled: false,
        emailVerified: false
      });
      createdAuthUser = true;
    }

    const beforeClaims = user.customClaims ?? {};
    const afterClaims = {
      ...beforeClaims,
      ...roleClaims(dto.role)
    };

    await this.firebaseAdmin.auth.setCustomUserClaims(user.uid, afterClaims);

    const profile = {
      uid: user.uid,
      fullName: dto.fullName,
      email: dto.email,
      role: dto.role,
      roles: getRoleList(afterClaims),
      team: dto.team,
      country: dto.country ?? null,
      deploymentRegions: dto.deploymentRegions ?? (dto.deploymentRegion ? [dto.deploymentRegion] : []),
      permissionsPreset: dto.permissionsPreset ?? dto.role,
      status: createdAuthUser ? "INVITED" : "ACTIVE",
      disabled: false
    };

    let storedProfile: Record<string, unknown> = profile;
    try {
      storedProfile = await this.repository.setSingleton<Record<string, unknown>>(
        COLLECTIONS.users,
        user.uid,
        profile
      );
    } catch {
      storedProfile = {
        id: user.uid,
        ...profile,
        persistenceWarning: "Firestore profile could not be written."
      };
    }

    await this.safeAudit({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: "ADMIN_USER_INVITED",
      resourceType: "users",
      resourceId: user.uid,
      before: beforeClaims,
      after: storedProfile
    });

    return storedProfile;
  }

  async updateUser(uid: string, dto: UpdateAdminUserDto, actor: AuthenticatedRequest["user"]) {
    const user = await this.firebaseAdmin.auth.getUser(uid);
    const beforeClaims = user.customClaims ?? {};
    const shouldDisable = dto.status === "DISABLED" || dto.status === "SUSPENDED";

    if (typeof dto.fullName === "string" || typeof dto.status === "string") {
      await this.firebaseAdmin.auth.updateUser(uid, {
        ...(typeof dto.fullName === "string" ? { displayName: dto.fullName } : {}),
        ...(typeof dto.status === "string" ? { disabled: shouldDisable } : {})
      });
    }

    let afterClaims = beforeClaims;
    if (dto.role) {
      afterClaims = {
        ...beforeClaims,
        ...roleClaims(dto.role)
      };
      await this.firebaseAdmin.auth.setCustomUserClaims(uid, afterClaims);
    }

    const update = {
      uid,
      ...(dto.fullName ? { fullName: dto.fullName } : {}),
      ...(dto.role ? { role: dto.role, roles: getRoleList(afterClaims) } : {}),
      ...(dto.team ? { team: dto.team } : {}),
      ...(dto.country ? { country: dto.country } : {}),
      ...(dto.status ? { status: dto.status, disabled: shouldDisable } : {}),
      ...(dto.deploymentRegions ? { deploymentRegions: dto.deploymentRegions } : {}),
      ...(dto.skills ? { skills: dto.skills } : {}),
      ...(dto.languages ? { languages: dto.languages } : {}),
      ...(dto.bio ? { bio: dto.bio } : {}),
      ...(typeof dto.mfaEnabled === "boolean" ? { mfaEnabled: dto.mfaEnabled } : {})
    };

    let storedProfile: Record<string, unknown> = update;
    try {
      storedProfile = await this.repository.setSingleton<Record<string, unknown>>(
        COLLECTIONS.users,
        uid,
        update
      );
    } catch {
      storedProfile = {
        id: uid,
        ...update,
        persistenceWarning: "Firestore profile could not be written."
      };
    }

    await this.safeAudit({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: "ADMIN_USER_UPDATED",
      resourceType: "users",
      resourceId: uid,
      before: beforeClaims,
      after: storedProfile
    });

    return storedProfile;
  }

  async updateClaims(uid: string, dto: UpdateUserClaimsDto, actor: AuthenticatedRequest["user"]) {
    const user = await this.firebaseAdmin.auth.getUser(uid);
    const beforeClaims = user.customClaims ?? {};
    const requestedClaims = getRequestedClaims(dto.claims);
    const afterClaims = {
      ...beforeClaims,
      ...requestedClaims
    };

    await this.firebaseAdmin.auth.setCustomUserClaims(uid, afterClaims);

    const userRecord = await this.repository.setSingleton<Record<string, unknown>>(
      COLLECTIONS.users,
      uid,
      {
        uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        roles: getRoleList(afterClaims),
        adminClaims: requestedClaims,
        disabled: user.disabled
      }
    );

    await this.auditService.log({
      actorUid: actor.uid,
      actorEmail: actor.email,
      action: "ADMIN_USER_CLAIMS_UPDATED",
      resourceType: "users",
      resourceId: uid,
      before: beforeClaims,
      after: afterClaims
    });

    return userRecord;
  }

  private async safeAudit(input: Parameters<AuditService["log"]>[0]) {
    try {
      await this.auditService.log(input);
    } catch {
      // Audit logging depends on Firestore. User management should still return diagnostics
      // if Firestore is not yet enabled during setup.
    }
  }
}
