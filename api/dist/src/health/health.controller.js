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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
function configured(value) {
    return Boolean(value && value.trim().length > 0);
}
let HealthController = class HealthController {
    getHealth() {
        return {
            data: {
                status: "ok",
                service: "sit-digital-access-api",
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV ?? "local",
                uptimeSeconds: Math.round(process.uptime()),
                backendConfig: {
                    FIREBASE_PROJECT_ID: configured(process.env.FIREBASE_PROJECT_ID),
                    FIREBASE_CLIENT_EMAIL: configured(process.env.FIREBASE_CLIENT_EMAIL),
                    FIREBASE_PRIVATE_KEY: configured(process.env.FIREBASE_PRIVATE_KEY),
                    ADMIN_WEB_ORIGINS: configured(process.env.ADMIN_WEB_ORIGINS),
                    PORT: configured(process.env.PORT)
                }
            }
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)()
], HealthController);
//# sourceMappingURL=health.controller.js.map