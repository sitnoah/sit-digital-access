import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseEnvKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
] as const;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const missingFirebaseConfigKeys = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId]
]
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const hasFirebaseConfig = missingFirebaseConfigKeys.length === 0;

export const firebaseConfigStatus = {
  configured: hasFirebaseConfig,
  projectId: firebaseConfig.projectId ?? null,
  missingKeys: missingFirebaseConfigKeys,
  message: hasFirebaseConfig
    ? null
    : "Firebase client configuration is missing. Add NEXT_PUBLIC_FIREBASE_* variables to .env.local."
};

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseStorage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;

export function assertFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    throw new Error(firebaseConfigStatus.message ?? "Firebase client configuration is missing.");
  }

  return firebaseAuth;
}
