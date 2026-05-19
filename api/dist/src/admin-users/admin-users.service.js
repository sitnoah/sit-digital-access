"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const audit_service_1 = require("../audit/audit.service");
const firebase_admin_service_1 = require("../firebase/firebase-admin.service");
const ADMIN_CLAIMS = [
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
function getRequestedClaims(input) {
    return ADMIN_CLAIMS.reduce((claims, role) => {
        const value = input[role];
        if (typeof value === "boolean") {
            claims[role] = value;
        }
        return claims;
    }, {});
}
function getRoleList(claims) {
    return ADMIN_CLAIMS.filter((role) => claims[role] === true);
}
function roleClaims(role) {
    return ADMIN_CLAIMS.reduce((claims, claim) => {
        claims[claim] = claim === role;
        return claims;
    }, {});
}
function statusFromUser(user, profile) {
    if (user.disabled) {
        return "DISABLED";
    }
    if (typeof profile?.status === "string") {
        return profile.status;
    }
    return "ACTIVE";
}
function toUserProfile(user, profile) {
    const claims = user.customClaims ?? {};
    const roles = getRoleList(claims);
    return {
        id: user.uid,
        uid: user.uid,
        fullName: profile?.fullName ?? user.displayName ?? user.email ?? "Admin user",
        email: user.email ?? profile?.email ?? "",
        phone: user.phoneNumber ?? profile?.phone ?? null,
        role: profile?.role ?? roles[0] ?? "supportAgent",
        roles,
        team: profile?.team ?? "Operations",
        country: profile?.country ?? "United Kingdom",
        deploymentRegions: profile?.deploymentRegions ?? [],
        permissions: roles,
        status: statusFromUser(user, profile),
        lastLoginAt: user.metadata.lastSignInTime ?? null,
        createdAt: profile?.createdAt ?? user.metadata.creationTime ?? null,
        updatedAt: profile?.updatedAt ?? null,
        mfaEnabled: (user.multiFactor?.enrolledFactors.length ?? 0) > 0 || Boolean(profile?.mfaEnabled),
        avatarUrl: user.photoURL ?? null,
        bio: profile?.bio ?? "",
        languages: profile?.languages ?? [],
        skills: profile?.skills ?? [],
        certifications: profile?.certifications ?? [],
        availability: profile?.availability ?? "Available",
        currentProjects: profile?.currentProjects ?? [],
        adminClaims: claims,
        disabled: user.disabled
    };
}
let AdminUsersService = class AdminUsersService {
    firebaseAdmin;
    repository;
    auditService;
    constructor(firebaseAdmin, repository, auditService) {
        this.firebaseAdmin = firebaseAdmin;
        this.repository = repository;
        this.auditService = auditService;
    }
    async listUsers() {
        const authUsers = await this.firebaseAdmin.auth.listUsers(1000);
        let profiles = {};
        try {
            const userProfiles = await this.repository.list(constants_1.COLLECTIONS.users, 1000);
            profiles = userProfiles.reduce((acc, profile) => {
                if (typeof profile.id === "string") {
                    acc[profile.id] = profile;
                }
                if (typeof profile.uid === "string") {
                    acc[profile.uid] = profile;
                }
                return acc;
            }, {});
        }
        catch {
            profiles = {};
        }
        return authUsers.users.map((user) => toUserProfile(user, profiles[user.uid]));
    }
    async inviteUser(dto, actor) {
        let user;
        let createdAuthUser = false;
        try {
            user = await this.firebaseAdmin.auth.getUserByEmail(dto.email);
        }
        catch {
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
        let storedProfile = profile;
        try {
            storedProfile = await this.repository.setSingleton(constants_1.COLLECTIONS.users, user.uid, profile);
        }
        catch {
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
    async updateUser(uid, dto, actor) {
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
        let storedProfile = update;
        try {
            storedProfile = await this.repository.setSingleton(constants_1.COLLECTIONS.users, uid, update);
        }
        catch {
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
    async updateClaims(uid, dto, actor) {
        const user = await this.firebaseAdmin.auth.getUser(uid);
        const beforeClaims = user.customClaims ?? {};
        const requestedClaims = getRequestedClaims(dto.claims);
        const afterClaims = {
            ...beforeClaims,
            ...requestedClaims
        };
        await this.firebaseAdmin.auth.setCustomUserClaims(uid, afterClaims);
        const userRecord = await this.repository.setSingleton(constants_1.COLLECTIONS.users, uid, {
            uid,
            email: user.email ?? null,
            displayName: user.displayName ?? null,
            roles: getRoleList(afterClaims),
            adminClaims: requestedClaims,
            disabled: user.disabled
        });
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
    async safeAudit(input) {
        try {
            await this.auditService.log(input);
        }
        catch {
        }
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_admin_service_1.FirebaseAdminService,
        firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map