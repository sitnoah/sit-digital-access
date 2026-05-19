"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const admin_roles_decorator_1 = require("../auth/admin-roles.decorator");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const admin_users_service_1 = require("./admin-users.service");
const invite_admin_user_dto_1 = require("./dto/invite-admin-user.dto");
const update_admin_user_dto_1 = require("./dto/update-admin-user.dto");
const update_user_claims_dto_1 = require("./dto/update-user-claims.dto");
let AdminUsersController = class AdminUsersController {
    adminUsersService;
    constructor(adminUsersService) {
        this.adminUsersService = adminUsersService;
    }
    async list() {
        return {
            data: await this.adminUsersService.listUsers()
        };
    }
    async invite(dto, request) {
        return {
            data: await this.adminUsersService.inviteUser(dto, request.user)
        };
    }
    async updateUser(uid, dto, request) {
        return {
            data: await this.adminUsersService.updateUser(uid, dto, request.user)
        };
    }
    async updateClaims(uid, dto, request) {
        return {
            data: await this.adminUsersService.updateClaims(uid, dto, request.user)
        };
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_roles_decorator_1.AdminRoles)("superAdmin", "admin", "operationsManager", "supportAgent"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("invite"),
    (0, admin_roles_decorator_1.AdminRoles)("superAdmin", "admin"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_admin_user_dto_1.InviteAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)(":uid"),
    (0, admin_roles_decorator_1.AdminRoles)("superAdmin", "admin"),
    __param(0, (0, common_1.Param)("uid")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_user_dto_1.UpdateAdminUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)(":uid/claims"),
    (0, admin_roles_decorator_1.AdminRoles)("superAdmin"),
    __param(0, (0, common_1.Param)("uid")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_claims_dto_1.UpdateUserClaimsDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "updateClaims", null);
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, common_1.Controller)("admin/users"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    __metadata("design:paramtypes", [admin_users_service_1.AdminUsersService])
], AdminUsersController);
//# sourceMappingURL=admin-users.controller.js.map