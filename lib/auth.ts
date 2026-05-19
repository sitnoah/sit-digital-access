"use client";

import { useEffect, useRef, useState } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User
} from "firebase/auth";
import { assertFirebaseAuth, firebaseAuth, firebaseConfigStatus } from "@/lib/firebase";

export const ADMIN_ROLES = [
  "superAdmin",
  "admin",
  "operationsManager",
  "deviceManager",
  "donationsManager",
  "supportAgent",
  "deploymentCoordinator",
  "countryManager",
  "inventoryManager",
  "analyticsManager"
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
export type AdminClaims = Partial<Record<AdminRole, boolean>> & Record<string, unknown>;

export type AdminAuthState = {
  user: User | null;
  idToken: string | null;
  token: string | null;
  claims: AdminClaims | null;
  roles: AdminRole[];
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  tokenExpirationTime: string | null;
};

export function extractAdminRoles(claims: Record<string, unknown> | null | undefined): AdminRole[] {
  if (!claims) return [];
  return ADMIN_ROLES.filter((role) => claims[role] === true);
}

export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

  const messages: Record<string, string> = {
    "auth/configuration-not-found":
      "Firebase Authentication is not fully configured for this project yet.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/user-not-found": "No admin account was found for this email address.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/popup-closed-by-user": "The sign-in popup was closed before authentication completed.",
    "auth/network-request-failed": "A network error stopped the sign-in request. Please try again.",
    "auth/operation-not-allowed": "This sign-in provider is not enabled in Firebase Console yet.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using another sign-in method.",
    "auth/too-many-requests": "Too many sign-in attempts. Please wait and try again.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/missing-password": "Enter your password.",
    "auth/email-already-in-use": "This email address is already linked to another account."
  };

  if (code && messages[code]) {
    return messages[code];
  }

  if (!firebaseConfigStatus.configured) {
    return firebaseConfigStatus.message ?? "Firebase client configuration is missing.";
  }

  return error instanceof Error ? error.message : "Unable to complete the authentication request.";
}

export function useFirebaseAuthState(): AdminAuthState {
  const accessDeniedMessage = useRef<string | null>(null);
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    idToken: null,
    token: null,
    claims: null,
    roles: [],
    isAdmin: false,
    loading: Boolean(firebaseAuth),
    error: firebaseConfigStatus.configured ? null : firebaseConfigStatus.message,
    tokenExpirationTime: null
  });

  useEffect(() => {
    if (!firebaseAuth) {
      setState({
        user: null,
        idToken: null,
        token: null,
        claims: null,
        roles: [],
        isAdmin: false,
        loading: false,
        error: firebaseConfigStatus.message,
        tokenExpirationTime: null
      });
      return;
    }

    const auth = firebaseAuth;

    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        const error = accessDeniedMessage.current;
        accessDeniedMessage.current = null;
        setState({
          user: null,
          idToken: null,
          token: null,
          claims: null,
          roles: [],
          isAdmin: false,
          loading: false,
          error,
          tokenExpirationTime: null
        });
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult(true);
        const roles = extractAdminRoles(tokenResult.claims);

        if (roles.length === 0) {
          const message = "This account does not have admin access.";
          accessDeniedMessage.current = message;
          await signOut(auth);
          setState({
            user: null,
            idToken: null,
            token: null,
            claims: null,
            roles: [],
            isAdmin: false,
            loading: false,
            error: message,
            tokenExpirationTime: null
          });
          return;
        }

        setState({
          user,
          idToken: tokenResult.token,
          token: tokenResult.token,
          claims: tokenResult.claims as AdminClaims,
          roles,
          isAdmin: true,
          loading: false,
          error: null,
          tokenExpirationTime: tokenResult.expirationTime
        });
      } catch (authError) {
        setState({
          user: null,
          idToken: null,
          token: null,
          claims: null,
          roles: [],
          isAdmin: false,
          loading: false,
          error: getFirebaseAuthErrorMessage(authError),
          tokenExpirationTime: null
        });
      }
    });
  }, []);

  return state;
}

export async function signInAdminWithEmail(email: string, password: string) {
  const auth = assertFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInAdminWithGoogle() {
  const auth = assertFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

export async function signInAdminWithMicrosoft() {
  const auth = assertFirebaseAuth();
  const provider = new OAuthProvider("microsoft.com");
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

export async function signInAdminWithGitHub() {
  const auth = assertFirebaseAuth();
  const provider = new GithubAuthProvider();
  provider.addScope("read:user");
  provider.addScope("user:email");
  return signInWithPopup(auth, provider);
}

export async function resetAdminPassword(email: string) {
  const auth = assertFirebaseAuth();
  return sendPasswordResetEmail(auth, email);
}

export async function signOutAdmin() {
  const auth = assertFirebaseAuth();
  await signOut(auth);
}

export async function refreshAdminIdToken() {
  const auth = assertFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No signed-in Firebase user is available.");
  }

  const tokenResult = await user.getIdTokenResult(true);
  return {
    token: tokenResult.token,
    claims: tokenResult.claims as AdminClaims,
    roles: extractAdminRoles(tokenResult.claims),
    expirationTime: tokenResult.expirationTime
  };
}
