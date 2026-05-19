import type { AdminClaim } from "../../common/types";
export declare class UpdateAdminUserDto {
    fullName?: string;
    role?: AdminClaim;
    team?: string;
    country?: string;
    status?: "ACTIVE" | "INVITED" | "SUSPENDED" | "DISABLED";
    deploymentRegions?: string[];
    skills?: string[];
    languages?: string[];
    bio?: string;
    mfaEnabled?: boolean;
}
