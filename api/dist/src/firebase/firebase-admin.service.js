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
exports.FirebaseAdminService = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("firebase-admin/auth");
const constants_1 = require("../common/constants");
let FirebaseAdminService = class FirebaseAdminService {
    app;
    firestore;
    storage;
    auth;
    constructor(app, firestore, storage) {
        this.app = app;
        this.firestore = firestore;
        this.storage = storage;
        this.auth = (0, auth_1.getAuth)(app);
    }
    verifyIdToken(token) {
        return this.auth.verifyIdToken(token, true);
    }
};
exports.FirebaseAdminService = FirebaseAdminService;
exports.FirebaseAdminService = FirebaseAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.FIREBASE_APP)),
    __param(1, (0, common_1.Inject)(constants_1.FIRESTORE)),
    __param(2, (0, common_1.Inject)(constants_1.FIREBASE_STORAGE)),
    __metadata("design:paramtypes", [Object, Function, Function])
], FirebaseAdminService);
//# sourceMappingURL=firebase-admin.service.js.map