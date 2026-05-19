"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const admin_users_module_1 = require("./admin-users/admin-users.module");
const audit_module_1 = require("./audit/audit.module");
const device_requests_module_1 = require("./device-requests/device-requests.module");
const donations_module_1 = require("./donations/donations.module");
const enquiries_module_1 = require("./enquiries/enquiries.module");
const ecosystem_module_1 = require("./ecosystem/ecosystem.module");
const firebase_admin_module_1 = require("./firebase/firebase-admin.module");
const health_module_1 = require("./health/health.module");
const impact_module_1 = require("./impact/impact.module");
const inventory_module_1 = require("./inventory/inventory.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60_000,
                    limit: 40
                }
            ]),
            firebase_admin_module_1.FirebaseAdminModule,
            health_module_1.HealthModule,
            audit_module_1.AuditModule,
            enquiries_module_1.EnquiriesModule,
            device_requests_module_1.DeviceRequestsModule,
            donations_module_1.DonationsModule,
            inventory_module_1.InventoryModule,
            impact_module_1.ImpactModule,
            admin_users_module_1.AdminUsersModule,
            ecosystem_module_1.EcosystemModule
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard
            }
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map