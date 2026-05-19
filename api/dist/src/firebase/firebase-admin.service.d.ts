import type { App } from "firebase-admin/app";
import { type Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import type { Storage } from "firebase-admin/storage";
export declare class FirebaseAdminService {
    readonly app: App;
    readonly firestore: Firestore;
    readonly storage: Storage;
    readonly auth: Auth;
    constructor(app: App, firestore: Firestore, storage: Storage);
    verifyIdToken(token: string): Promise<import("firebase-admin/auth").DecodedIdToken>;
}
