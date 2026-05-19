import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { AdminUsersService } from "./admin-users.service";
import { InviteAdminUserDto } from "./dto/invite-admin-user.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { UpdateUserClaimsDto } from "./dto/update-user-claims.dto";

@Controller("admin/users")
@UseGuards(FirebaseAuthGuard, AdminRoleGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @AdminRoles("superAdmin", "admin", "operationsManager", "supportAgent")
  async list() {
    return {
      data: await this.adminUsersService.listUsers()
    };
  }

  @Post("invite")
  @AdminRoles("superAdmin", "admin")
  async invite(
    @Body() dto: InviteAdminUserDto,
    @Req() request: AuthenticatedRequest
  ) {
    return {
      data: await this.adminUsersService.inviteUser(dto, request.user)
    };
  }

  @Patch(":uid")
  @AdminRoles("superAdmin", "admin")
  async updateUser(
    @Param("uid") uid: string,
    @Body() dto: UpdateAdminUserDto,
    @Req() request: AuthenticatedRequest
  ) {
    return {
      data: await this.adminUsersService.updateUser(uid, dto, request.user)
    };
  }

  @Post(":uid/claims")
  @AdminRoles("superAdmin")
  async updateClaims(
    @Param("uid") uid: string,
    @Body() dto: UpdateUserClaimsDto,
    @Req() request: AuthenticatedRequest
  ) {
    return {
      data: await this.adminUsersService.updateClaims(uid, dto, request.user)
    };
  }
}
