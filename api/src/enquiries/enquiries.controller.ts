import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { AdminCreateEnquiryDto } from "./dto/admin-create-enquiry.dto";
import { CreateEnquiryDto } from "./dto/create-enquiry.dto";
import { UpdateEnquiryDto } from "./dto/update-enquiry.dto";
import { UpdateEnquiryStatusDto } from "./dto/update-enquiry-status.dto";
import { EnquiriesService } from "./enquiries.service";

@Controller()
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post("enquiries")
  async create(@Body() dto: CreateEnquiryDto) {
    return { data: await this.enquiriesService.create(dto) };
  }

  @Post("admin/enquiries")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "supportAgent")
  async adminCreate(
    @Body() dto: AdminCreateEnquiryDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.enquiriesService.createAdmin(dto, request) };
  }

  @Get("admin/enquiries")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "supportAgent")
  async list() {
    return { data: await this.enquiriesService.list() };
  }

  @Get("admin/enquiries/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "supportAgent")
  async findById(@Param("id") id: string) {
    return { data: await this.enquiriesService.findById(id) };
  }

  @Patch("admin/enquiries/:id/status")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "supportAgent")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateEnquiryStatusDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.enquiriesService.updateStatus(id, dto, request) };
  }

  @Patch("admin/enquiries/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "supportAgent")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateEnquiryDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.enquiriesService.update(id, dto, request) };
  }
}
