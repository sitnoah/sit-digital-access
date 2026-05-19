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
exports.DonationsController = void 0;
const common_1 = require("@nestjs/common");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const admin_roles_decorator_1 = require("../auth/admin-roles.decorator");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const donations_service_1 = require("./donations.service");
const admin_create_donation_dto_1 = require("./dto/admin-create-donation.dto");
const create_donation_dto_1 = require("./dto/create-donation.dto");
const update_donation_dto_1 = require("./dto/update-donation.dto");
const update_donation_status_dto_1 = require("./dto/update-donation-status.dto");
let DonationsController = class DonationsController {
    donationsService;
    constructor(donationsService) {
        this.donationsService = donationsService;
    }
    async create(dto) {
        return { data: await this.donationsService.create(dto) };
    }
    async createAdmin(dto, request) {
        return { data: await this.donationsService.createAdmin(dto, request) };
    }
    async list() {
        return { data: await this.donationsService.list() };
    }
    async findById(id) {
        return { data: await this.donationsService.findById(id) };
    }
    async updateStatus(id, dto, request) {
        return { data: await this.donationsService.updateStatus(id, dto, request) };
    }
    async update(id, dto, request) {
        return { data: await this.donationsService.update(id, dto, request) };
    }
};
exports.DonationsController = DonationsController;
__decorate([
    (0, common_1.Post)("donations"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_donation_dto_1.CreateDonationDto]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("admin/donations"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "donationsManager", "supportAgent"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_create_donation_dto_1.AdminCreateDonationDto, Object]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Get)("admin/donations"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "donationsManager", "supportAgent"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("admin/donations/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "donationsManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)("admin/donations/:id/status"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "donationsManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_donation_status_dto_1.UpdateDonationStatusDto, Object]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)("admin/donations/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "donationsManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_donation_dto_1.UpdateDonationDto, Object]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "update", null);
exports.DonationsController = DonationsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [donations_service_1.DonationsService])
], DonationsController);
//# sourceMappingURL=donations.controller.js.map