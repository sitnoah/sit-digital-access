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
exports.DeviceRequestsController = void 0;
const common_1 = require("@nestjs/common");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const admin_roles_decorator_1 = require("../auth/admin-roles.decorator");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const device_requests_service_1 = require("./device-requests.service");
const admin_create_device_request_dto_1 = require("./dto/admin-create-device-request.dto");
const create_device_request_dto_1 = require("./dto/create-device-request.dto");
const update_device_request_dto_1 = require("./dto/update-device-request.dto");
const update_device_request_status_dto_1 = require("./dto/update-device-request-status.dto");
let DeviceRequestsController = class DeviceRequestsController {
    deviceRequestsService;
    constructor(deviceRequestsService) {
        this.deviceRequestsService = deviceRequestsService;
    }
    async create(dto) {
        return { data: await this.deviceRequestsService.create(dto) };
    }
    async adminCreate(dto, request) {
        return { data: await this.deviceRequestsService.createAdmin(dto, request) };
    }
    async list() {
        return { data: await this.deviceRequestsService.list() };
    }
    async findById(id) {
        return { data: await this.deviceRequestsService.findById(id) };
    }
    async updateStatus(id, dto, request) {
        return { data: await this.deviceRequestsService.updateStatus(id, dto, request) };
    }
    async update(id, dto, request) {
        return { data: await this.deviceRequestsService.update(id, dto, request) };
    }
};
exports.DeviceRequestsController = DeviceRequestsController;
__decorate([
    (0, common_1.Post)("device-requests"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_device_request_dto_1.CreateDeviceRequestDto]),
    __metadata("design:returntype", Promise)
], DeviceRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("admin/device-requests"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "deviceManager", "supportAgent"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_create_device_request_dto_1.AdminCreateDeviceRequestDto, Object]),
    __metadata("design:returntype", Promise)
], DeviceRequestsController.prototype, "adminCreate", null);
__decorate([
    (0, common_1.Get)("admin/device-requests"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "deviceManager", "supportAgent"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeviceRequestsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("admin/device-requests/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "deviceManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeviceRequestsController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)("admin/device-requests/:id/status"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "deviceManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_device_request_status_dto_1.UpdateDeviceRequestStatusDto, Object]),
    __metadata("design:returntype", Promise)
], DeviceRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)("admin/device-requests/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager", "deviceManager", "supportAgent"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_device_request_dto_1.UpdateDeviceRequestDto, Object]),
    __metadata("design:returntype", Promise)
], DeviceRequestsController.prototype, "update", null);
exports.DeviceRequestsController = DeviceRequestsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [device_requests_service_1.DeviceRequestsService])
], DeviceRequestsController);
//# sourceMappingURL=device-requests.controller.js.map