import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { DeviceRequestsService } from "./device-requests.service";
import { AdminCreateDeviceRequestDto } from "./dto/admin-create-device-request.dto";
import { CreateDeviceRequestDto } from "./dto/create-device-request.dto";
import { UpdateDeviceRequestDto } from "./dto/update-device-request.dto";
import { UpdateDeviceRequestStatusDto } from "./dto/update-device-request-status.dto";

@Controller()
export class DeviceRequestsController {
  constructor(private readonly deviceRequestsService: DeviceRequestsService) {}

  @Post("device-requests")
  async create(@Body() dto: CreateDeviceRequestDto) {
    return { data: await this.deviceRequestsService.create(dto) };
  }

  @Post("admin/device-requests")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "deviceManager", "supportAgent")
  async adminCreate(
    @Body() dto: AdminCreateDeviceRequestDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.deviceRequestsService.createAdmin(dto, request) };
  }

  @Get("admin/device-requests")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "deviceManager", "supportAgent")
  async list() {
    return { data: await this.deviceRequestsService.list() };
  }

  @Get("admin/device-requests/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "deviceManager", "supportAgent")
  async findById(@Param("id") id: string) {
    return { data: await this.deviceRequestsService.findById(id) };
  }

  @Patch("admin/device-requests/:id/status")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "deviceManager", "supportAgent")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateDeviceRequestStatusDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.deviceRequestsService.updateStatus(id, dto, request) };
  }

  @Patch("admin/device-requests/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles("admin", "operationsManager", "deviceManager", "supportAgent")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateDeviceRequestDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.deviceRequestsService.update(id, dto, request) };
  }
}
