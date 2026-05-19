import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { AuditService } from "./audit.service";

@Controller("admin/audit-logs")
@UseGuards(FirebaseAuthGuard, AdminRoleGuard)
@AdminRoles("admin", "operationsManager", "supportAgent")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async list(
    @Query("resourceType") resourceType?: string,
    @Query("resourceId") resourceId?: string
  ) {
    return {
      data: await this.auditService.listForResource(resourceType, resourceId)
    };
  }
}
