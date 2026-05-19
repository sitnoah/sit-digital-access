"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAdminModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const firebase_admin_service_1 = require("./firebase-admin.service");
let FirebaseAdminModule = class FirebaseAdminModule {
};
exports.FirebaseAdminModule = FirebaseAdminModule;
exports.FirebaseAdminModule = FirebaseAdminModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: constants_1.FIREBASE_APP,
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const existingApp = (0, app_1.getApps)()[0];
                    if (existingApp) {
                        return existingApp;
                    }
                    const projectId = config.getOrThrow("FIREBASE_PROJECT_ID");
                    const clientEmail = config.getOrThrow("FIREBASE_CLIENT_EMAIL");
                    const privateKey = config
                        .getOrThrow("FIREBASE_PRIVATE_KEY")
                        .replace(/\\n/g, "\n");
                    return (0, app_1.initializeApp)({
                        credential: (0, app_1.cert)({
                            projectId,
                            clientEmail,
                            privateKey
                        }),
                        storageBucket: config.get("FIREBASE_STORAGE_BUCKET")
                    });
                }
            },
            {
                provide: constants_1.FIRESTORE,
                inject: [constants_1.FIREBASE_APP],
                useFactory: (app) => (0, firestore_1.getFirestore)(app)
            },
            {
                provide: constants_1.FIREBASE_STORAGE,
                inject: [constants_1.FIREBASE_APP],
                useFactory: (app) => (0, storage_1.getStorage)(app)
            },
            firebase_admin_service_1.FirebaseAdminService,
            firestore_repository_1.FirestoreRepository,
            firebase_auth_guard_1.FirebaseAuthGuard,
            admin_role_guard_1.AdminRoleGuard
        ],
        exports: [
            constants_1.FIREBASE_APP,
            constants_1.FIRESTORE,
            constants_1.FIREBASE_STORAGE,
            firebase_admin_service_1.FirebaseAdminService,
            firestore_repository_1.FirestoreRepository,
            firebase_auth_guard_1.FirebaseAuthGuard,
            admin_role_guard_1.AdminRoleGuard
        ]
    })
], FirebaseAdminModule);
//# sourceMappingURL=firebase-admin.module.js.map