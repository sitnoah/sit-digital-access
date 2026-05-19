import type { AdminClaim } from "../../common/types";
export declare const WORKFORCE_ROLES: AdminClaim[];
export declare class InviteAdminUserDto {
    fullName: string;
    email: string;
    role: AdminClaim;
    team: string;
    country?: string;
    deploymentRegion?: string;
    permissionsPreset?: string;
    deploymentRegions?: string[];
}
