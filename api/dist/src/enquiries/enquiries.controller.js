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
exports.EnquiriesController = void 0;
const common_1 = require("@nestjs/common");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const admin_roles_decorator_1 = require("../auth/admin-roles.decorator");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const admin_create_enquiry_dto_1 = require("./dto/admin-create-enquiry.dto");
const create_enquiry_dto_1 = require("./dto/create-enquiry.dto");
const update_enquiry_dto_1 = require("./dto/update-enquiry.dto");
const update_enquiry_status_dto_1 = require("./dto/update-enquiry-status.dto");
const enquiries_service_1 = require("./enquiries.service");
let EnquiriesController = class EnquiriesController {
    enquiriesService;
    constructor(enquiriesService) {
        this.enquiriesService = enquiriesService;
    }
    async create(dto) {
        return { data: await this.enquiriesService.create(dto) };
    }
    async adminCreate(dto, request) {
        return { data: await this.enquiriesService.createAdmin(dto, request) };
    }
    async list() {
        return { data: await this.enquiriesService.list() };
    }
    async findById(id) {
        return { data: await this.enquiriesService.findById(id) };
    }
    async updateStatus(id, dto, request) {
        return { data: await this.enquiriesService.updateStatus(id, dto, request) };
    }
    async update(id, dto, request) {
        return { data: await this.enquiriesService.update(id, dto, request) };
    }
};
exports.EnquiriesController = EnquiriesController;
__decorate([
    (0, common_1.Post)("enquiries"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enquiry_dto_1.CreateEnquiryDto]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("admin/enquiries"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "supportAgent"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_create_enquiry_dto_1.AdminCreateEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.Get)("admin/enquiries"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "supportAgent"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("admin/enquiries/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)("admin/enquiries/:id/status"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_enquiry_status_dto_1.UpdateEnquiryStatusDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)("admin/enquiries/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_enquiry_dto_1.UpdateEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiriesController.prototype, "update", null);
exports.EnquiriesController = EnquiriesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [enquiries_service_1.EnquiriesService])
], EnquiriesController);
//# sourceMappingURL=enquiries.controller.js.map