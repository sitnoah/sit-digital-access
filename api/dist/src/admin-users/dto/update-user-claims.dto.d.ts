export declare class AdminClaimsDto {
    superAdmin?: boolean;
    admin?: boolean;
    operationsManager?: boolean;
    deviceManager?: boolean;
    donationsManager?: boolean;
    supportAgent?: boolean;
    deploymentCoordinator?: boolean;
    countryManager?: boolean;
    inventoryManager?: boolean;
    analyticsManager?: boolean;
}
export declare class UpdateUserClaimsDto {
    claims: AdminClaimsDto;
}
