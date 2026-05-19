import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";
import { InventoryService } from "./inventory.service";

@Controller("admin/inventory")
@UseGuards(FirebaseAuthGuard, AdminRoleGuard)
@AdminRoles("admin", "operationsManager", "deviceManager")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async list() {
    return { data: await this.inventoryService.list() };
  }

  @Post()
  async create(@Body() dto: CreateInventoryItemDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.inventoryService.create(dto, request) };
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return { data: await this.inventoryService.findById(id) };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateInventoryItemDto,
    @Req() request: AuthenticatedRequest
  ) {
    return { data: await this.inventoryService.update(id, dto, request) };
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    await this.inventoryService.delete(id, request);
    return { data: { id, deleted: true } };
  }
}
