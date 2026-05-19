import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AdminClaim, AuthenticatedRequest } from "../common/types";
import { AuditService } from "../audit/audit.service";
import { FirebaseAdminService } from "../firebase/firebase-admin.service";
import type { InviteAdminUserDto } from "./dto/invite-admin-user.dto";
import type { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import type { UpdateUserClaimsDto } from "./dto/update-user-claims.dto";
export declare class AdminUsersService {
    private readonly firebaseAdmin;
    private readonly repository;
    private readonly auditService;
    constructor(firebaseAdmin: FirebaseAdminService, repository: FirestoreRepository, auditService: AuditService);
    listUsers(): Promise<{
        id: string;
        uid: string;
        fullName: string;
        email: string;
        phone: string | null;
        role: string;
        roles: AdminClaim[];
        team: string;
        country: string;
        deploymentRegions: string[];
        permissions: AdminClaim[];
        status: string;
        lastLoginAt: string;
        createdAt: string;
        updatedAt: string | null;
        mfaEnabled: boolean;
        avatarUrl: string | null;
        bio: string;
        languages: string[];
        skills: string[];
        certifications: string[];
        availability: string;
        currentProjects: string[];
        adminClaims: {
            [key: string]: any;
        };
        disabled: boolean;
    }[]>;
    inviteUser(dto: InviteAdminUserDto, actor: AuthenticatedRequest["user"]): Promise<Record<string, unknown>>;
    updateUser(uid: string, dto: UpdateAdminUserDto, actor: AuthenticatedRequest["user"]): Promise<Record<string, unknown>>;
    updateClaims(uid: string, dto: UpdateUserClaimsDto, actor: AuthenticatedRequest["user"]): Promise<Record<string, unknown>>;
    private safeAudit;
}
