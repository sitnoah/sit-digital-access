import { Inject, Injectable } from "@nestjs/common";
import type { App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import type { Storage } from "firebase-admin/storage";
import { FIREBASE_APP, FIREBASE_STORAGE, FIRESTORE } from "../common/constants";

@Injectable()
export class FirebaseAdminService {
  readonly auth: Auth;

  constructor(
    @Inject(FIREBASE_APP) readonly app: App,
    @Inject(FIRESTORE) readonly firestore: Firestore,
    @Inject(FIREBASE_STORAGE) readonly storage: Storage
  ) {
    this.auth = getAuth(app);
  }

  verifyIdToken(token: string) {
    return this.auth.verifyIdToken(token, true);
  }
}
