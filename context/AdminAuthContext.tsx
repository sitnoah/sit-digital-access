"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getFirebaseAuthErrorMessage,
  refreshAdminIdToken,
  resetAdminPassword,
  signInAdminWithEmail,
  signInAdminWithGitHub,
  signInAdminWithGoogle,
  signInAdminWithMicrosoft,
  signOutAdmin,
  useFirebaseAuthState
} from "@/lib/auth";

type AdminAuthContextValue = ReturnType<typeof useFirebaseAuthState> & {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshIdToken: () => Promise<void>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  authActionError: string | null;
  authActionMessage: string | null;
  clearAuthMessages: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useFirebaseAuthState();
  const [authActionError, setAuthActionError] = useState<string | null>(null);
  const [authActionMessage, setAuthActionMessage] = useState<string | null>(null);
  const [tokenOverride, setTokenOverride] = useState<{
    token: string;
    claims: NonNullable<AdminAuthContextValue["claims"]>;
    roles: AdminAuthContextValue["roles"];
    expirationTime: string;
  } | null>(null);

  useEffect(() => {
    setTokenOverride(null);
  }, [authState.user?.uid]);

  const clearAuthMessages = () => {
    setAuthActionError(null);
    setAuthActionMessage(null);
  };

  const runAuthAction = async (
    action: () => Promise<void>,
    successMessage?: string
  ) => {
    clearAuthMessages();
    try {
      await action();
      if (successMessage) {
        setAuthActionMessage(successMessage);
      }
    } catch (error) {
      setAuthActionError(getFirebaseAuthErrorMessage(error));
    }
  };

  const refreshedAuthState = tokenOverride
    ? {
        ...authState,
        idToken: tokenOverride.token,
        token: tokenOverride.token,
        claims: tokenOverride.claims,
        roles: tokenOverride.roles,
        isAdmin: tokenOverride.roles.length > 0,
        tokenExpirationTime: tokenOverride.expirationTime
      }
    : authState;

  const value: AdminAuthContextValue = {
    ...refreshedAuthState,
    authActionError,
    authActionMessage,
    clearAuthMessages,
    async signInWithEmail(email: string, password: string) {
      await runAuthAction(() => signInAdminWithEmail(email, password).then(() => undefined));
    },
    async signInWithGoogle() {
      await runAuthAction(() => signInAdminWithGoogle().then(() => undefined));
    },
    async signInWithMicrosoft() {
      await runAuthAction(() => signInAdminWithMicrosoft().then(() => undefined));
    },
    async signInWithGitHub() {
      await runAuthAction(() => signInAdminWithGitHub().then(() => undefined));
    },
    async resetPassword(email: string) {
      await runAuthAction(
        () => resetAdminPassword(email).then(() => undefined),
        "Password reset email sent. Check your inbox."
      );
    },
    async refreshIdToken() {
      await runAuthAction(
        () =>
          refreshAdminIdToken().then((result) => {
            setTokenOverride(result);
          }),
        "Firebase ID token refreshed. Reloading admin data is now safe."
      );
    },
    async logout() {
      await runAuthAction(signOutAdmin);
    },
    async signIn(email: string, password: string) {
      await runAuthAction(() => signInAdminWithEmail(email, password).then(() => undefined));
    },
    async signOut() {
      await runAuthAction(signOutAdmin);
    }
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);

  if (!value) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }

  return value;
}
