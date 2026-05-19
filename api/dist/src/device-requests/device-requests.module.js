"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const audit_module_1 = require("../audit/audit.module");
const firebase_admin_module_1 = require("../firebase/firebase-admin.module");
const device_requests_controller_1 = require("./device-requests.controller");
const device_requests_service_1 = require("./device-requests.service");
let DeviceRequestsModule = class DeviceRequestsModule {
};
exports.DeviceRequestsModule = DeviceRequestsModule;
exports.DeviceRequestsModule = DeviceRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_admin_module_1.FirebaseAdminModule, audit_module_1.AuditModule],
        controllers: [device_requests_controller_1.DeviceRequestsController],
        providers: [device_requests_service_1.DeviceRequestsService]
    })
], DeviceRequestsModule);
//# sourceMappingURL=device-requests.module.js.map