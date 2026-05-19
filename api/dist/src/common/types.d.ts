import type { Request } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
export type AdminClaim = "superAdmin" | "admin" | "operationsManager" | "deviceManager" | "donationsManager" | "supportAgent" | "deploymentCoordinator" | "countryManager" | "inventoryManager" | "analyticsManager";
export type AuthenticatedRequest = Request & {
    user: DecodedIdToken;
};
export type ListResponse<T> = {
    data: T[];
};
export type SingleResponse<T> = {
    data: T;
};
