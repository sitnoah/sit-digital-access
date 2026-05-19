import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { FIREBASE_APP, FIREBASE_STORAGE, FIRESTORE } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { FirebaseAdminService } from "./firebase-admin.service";

@Module({
  providers: [
    {
      provide: FIREBASE_APP,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const existingApp = getApps()[0];

        if (existingApp) {
          return existingApp;
        }

        const projectId = config.getOrThrow<string>("FIREBASE_PROJECT_ID");
        const clientEmail = config.getOrThrow<string>("FIREBASE_CLIENT_EMAIL");
        const privateKey = config
          .getOrThrow<string>("FIREBASE_PRIVATE_KEY")
          .replace(/\\n/g, "\n");

        return initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey
          }),
          storageBucket: config.get<string>("FIREBASE_STORAGE_BUCKET")
        });
      }
    },
    {
      provide: FIRESTORE,
      inject: [FIREBASE_APP],
      useFactory: (app: App) => getFirestore(app)
    },
    {
      provide: FIREBASE_STORAGE,
      inject: [FIREBASE_APP],
      useFactory: (app: App) => getStorage(app)
    },
    FirebaseAdminService,
    FirestoreRepository,
    FirebaseAuthGuard,
    AdminRoleGuard
  ],
  exports: [
    FIREBASE_APP,
    FIRESTORE,
    FIREBASE_STORAGE,
    FirebaseAdminService,
    FirestoreRepository,
    FirebaseAuthGuard,
    AdminRoleGuard
  ]
})
export class FirebaseAdminModule {}
