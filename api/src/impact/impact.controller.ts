import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { SaveImpactSnapshotDto, UpdateImpactStatsDto } from "./dto/update-impact-stats.dto";
import { ImpactService } from "./impact.service";

@Controller()
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Get("impact")
  async getStats() {
    return { data: await this.impactService.getStats() };
  }

  @Patch("admin/impact")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager")
  async updateStats(@Body() dto: UpdateImpactStatsDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.impactService.updateStats(dto, request) };
  }

  @Post("admin/impact/initialise")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager")
  async initialiseStats(@Req() request: AuthenticatedRequest) {
    return { data: await this.impactService.initialiseStats(request) };
  }

  @Post("admin/impact/snapshots")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager")
  async saveSnapshot(@Body() dto: SaveImpactSnapshotDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.impactService.saveSnapshot(dto, request) };
  }
}
