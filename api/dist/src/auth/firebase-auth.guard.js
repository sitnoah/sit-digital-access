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
exports.FirebaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_service_1 = require("../firebase/firebase-admin.service");
let FirebaseAuthGuard = class FirebaseAuthGuard {
    firebaseAdmin;
    constructor(firebaseAdmin) {
        this.firebaseAdmin = firebaseAdmin;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractBearerToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException("Missing Firebase ID token");
        }
        try {
            request.user = await this.firebaseAdmin.verifyIdToken(token);
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException("Invalid Firebase ID token");
        }
    }
    extractBearerToken(request) {
        const header = request.headers.authorization;
        if (!header) {
            return undefined;
        }
        const [scheme, token] = header.split(" ");
        return scheme === "Bearer" ? token : undefined;
    }
};
exports.FirebaseAuthGuard = FirebaseAuthGuard;
exports.FirebaseAuthGuard = FirebaseAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_admin_service_1.FirebaseAdminService])
], FirebaseAuthGuard);
//# sourceMappingURL=firebase-auth.guard.js.map