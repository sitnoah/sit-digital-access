"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersModule = void 0;
const common_1 = require("@nestjs/common");
const audit_module_1 = require("../audit/audit.module");
const firebase_admin_module_1 = require("../firebase/firebase-admin.module");
const admin_users_controller_1 = require("./admin-users.controller");
const admin_users_service_1 = require("./admin-users.service");
let AdminUsersModule = class AdminUsersModule {
};
exports.AdminUsersModule = AdminUsersModule;
exports.AdminUsersModule = AdminUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_admin_module_1.FirebaseAdminModule, audit_module_1.AuditModule],
        controllers: [admin_users_controller_1.AdminUsersController],
        providers: [admin_users_service_1.AdminUsersService]
    })
], AdminUsersModule);
//# sourceMappingURL=admin-users.module.js.map