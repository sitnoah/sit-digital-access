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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const admin_roles_decorator_1 = require("./admin-roles.decorator");
const ADMIN_CLAIMS = [
    "superAdmin",
    "admin",
    "operationsManager",
    "deviceManager",
    "donationsManager",
    "supportAgent",
    "deploymentCoordinator",
    "countryManager",
    "inventoryManager",
    "analyticsManager"
];
let AdminRoleGuard = class AdminRoleGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const requiredRoles = this.reflector.getAllAndOverride(admin_roles_decorator_1.ADMIN_ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]) ?? ADMIN_CLAIMS;
        if (!user) {
            throw new common_1.ForbiddenException("Admin user context was not found");
        }
        if (user.superAdmin === true) {
            return true;
        }
        const hasAnyRequiredRole = requiredRoles.some((role) => user[role] === true);
        if (!hasAnyRequiredRole) {
            throw new common_1.ForbiddenException("Insufficient admin permissions");
        }
        return true;
    }
};
exports.AdminRoleGuard = AdminRoleGuard;
exports.AdminRoleGuard = AdminRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AdminRoleGuard);
//# sourceMappingURL=admin-role.guard.js.map