import { SetMetadata } from "@nestjs/common";
import type { AdminClaim } from "../common/types";

export const ADMIN_ROLES_KEY = "adminRoles";
export const AdminRoles = (...roles: AdminClaim[]) => SetMetadata(ADMIN_ROLES_KEY, roles);
