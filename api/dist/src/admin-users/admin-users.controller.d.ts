import type { AuthenticatedRequest } from "../common/types";
import { AdminUsersService } from "./admin-users.service";
import { InviteAdminUserDto } from "./dto/invite-admin-user.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { UpdateUserClaimsDto } from "./dto/update-user-claims.dto";
export declare class AdminUsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    list(): Promise<{
        data: {
            id: string;
            uid: string;
            fullName: string;
            email: string;
            phone: string | null;
            role: string;
            roles: import("../common/types").AdminClaim[];
            team: string;
            country: string;
            deploymentRegions: string[];
            permissions: import("../common/types").AdminClaim[];
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
        }[];
    }>;
    invite(dto: InviteAdminUserDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown>;
    }>;
    updateUser(uid: string, dto: UpdateAdminUserDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown>;
    }>;
    updateClaims(uid: string, dto: UpdateUserClaimsDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown>;
    }>;
}
