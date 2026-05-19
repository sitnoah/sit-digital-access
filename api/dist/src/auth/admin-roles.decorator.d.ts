import type { AdminClaim } from "../common/types";
export declare const ADMIN_ROLES_KEY = "adminRoles";
export declare const AdminRoles: (...roles: AdminClaim[]) => import("@nestjs/common").CustomDecorator<string>;
