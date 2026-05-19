import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ADMIN_ROLES_KEY } from "./admin-roles.decorator";
import type { AdminClaim, AuthenticatedRequest } from "../common/types";

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

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const requiredRoles =
      this.reflector.getAllAndOverride<AdminClaim[]>(ADMIN_ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]) ?? ADMIN_CLAIMS;

    if (!user) {
      throw new ForbiddenException("Admin user context was not found");
    }

    if (user.superAdmin === true) {
      return true;
    }

    const hasAnyRequiredRole = requiredRoles.some((role) => user[role] === true);

    if (!hasAnyRequiredRole) {
      throw new ForbiddenException("Insufficient admin permissions");
    }

    return true;
  }
}
