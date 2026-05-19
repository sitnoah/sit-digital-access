import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { DonationsService } from "./donations.service";
import { AdminCreateDonationDto } from "./dto/admin-create-donation.dto";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { UpdateDonationStatusDto } from "./dto/update-donation-status.dto";

@Controller()
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post("donations")
  async create(@Body() dto: CreateDonationDto) {
    return { data: await this.donationsService.create(dto) };
  }

  @Post("admin/donations")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "donationsManager", "supportAgent")
  async createAdmin(
    @Body() dto: AdminCreateDonationDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.donationsService.createAdmin(dto, request) };
  }

  @Get("admin/donations")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "donationsManager", "supportAgent")
  async list() {
    return { data: await this.donationsService.list() };
  }

  @Get("admin/donations/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "donationsManager", "supportAgent")
  async findById(@Param("id") id: string) {
    return { data: await this.donationsService.findById(id) };
  }

  @Patch("admin/donations/:id/status")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "donationsManager", "supportAgent")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateDonationStatusDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.donationsService.updateStatus(id, dto, request) };
  }

  @Patch("admin/donations/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "donationsManager", "supportAgent")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateDonationDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.donationsService.update(id, dto, request) };
  }
}
