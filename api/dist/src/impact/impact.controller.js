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
exports.ImpactController = void 0;
const common_1 = require("@nestjs/common");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const admin_roles_decorator_1 = require("../auth/admin-roles.decorator");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const update_impact_stats_dto_1 = require("./dto/update-impact-stats.dto");
const impact_service_1 = require("./impact.service");
let ImpactController = class ImpactController {
    impactService;
    constructor(impactService) {
        this.impactService = impactService;
    }
    async getStats() {
        return { data: await this.impactService.getStats() };
    }
    async updateStats(dto, request) {
        return { data: await this.impactService.updateStats(dto, request) };
    }
    async initialiseStats(request) {
        return { data: await this.impactService.initialiseStats(request) };
    }
    async saveSnapshot(dto, request) {
        return { data: await this.impactService.saveSnapshot(dto, request) };
    }
};
exports.ImpactController = ImpactController;
__decorate([
    (0, common_1.Get)("impact"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImpactController.prototype, "getStats", null);
__decorate([
    (0, common_1.Patch)("admin/impact"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_impact_stats_dto_1.UpdateImpactStatsDto, Object]),
    __metadata("design:returntype", Promise)
], ImpactController.prototype, "updateStats", null);
__decorate([
    (0, common_1.Post)("admin/impact/initialise"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImpactController.prototype, "initialiseStats", null);
__decorate([
    (0, common_1.Post)("admin/impact/snapshots"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)("admin", "operationsManager"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_impact_stats_dto_1.SaveImpactSnapshotDto, Object]),
    __metadata("design:returntype", Promise)
], ImpactController.prototype, "saveSnapshot", null);
exports.ImpactController = ImpactController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [impact_service_1.ImpactService])
], ImpactController);
//# sourceMappingURL=impact.controller.js.map