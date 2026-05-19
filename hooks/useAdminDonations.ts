"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminDonationsApi } from "@/lib/admin-donations-api";
import { API_BASE_URL } from "@/lib/api";
import { firebaseConfigStatus } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";
import type {
  AdminDonation,
  AdminDonationCreate,
  AdminDonationUpdate,
  DonationDiagnostics
} from "@/types/donation";

export function useAdminDonations() {
  const {
    token,
    user,
    roles,
    claims,
    tokenExpirationTime,
    refreshIdToken,
    logout
  } = useAdminAuth();
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<AdminEndpointError[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    if (typeof token !== "string" || token.length === 0) {
      setLoading(false);
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setActionError(null);

      const result = await adminDonationsApi.list(authToken);

      if (cancelled) return;

      setErrors(result.ok ? [] : [result.error]);
      setDonations(result.ok ? result.data : []);
      setLastSyncedAt(new Date());
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, token]);

  const diagnostics = useMemo<DonationDiagnostics>(() => {
    const firstError = errors[0];
    return {
      apiBaseUrl: API_BASE_URL,
      endpoint: firstError?.path ?? "/admin/donations",
      tokenPresent: Boolean(token),
      tokenExpirationTime,
      userEmail: user?.email ?? null,
      adminClaims: roles,
      firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
      status: firstError?.status,
      message: firstError?.message
    };
  }, [errors, roles, token, tokenExpirationTime, user?.email]);

  const health = useMemo<SystemHealthStatus>(() => {
    const error = errors[0];
    const invalidToken = error ? /invalid firebase id token|missing firebase id token/i.test(error.message) : false;
    const likelyFirestoreIssue = error
      ? /firestore|internal server|permission_denied|service_disabled/i.test(error.message)
      : false;

    return {
      api: error ? (error.status ? "degraded" : "offline") : "online",
      firestore: error ? (likelyFirestoreIssue ? "degraded" : "unknown") : "connected",
      authTokenPresent: Boolean(token) && !invalidToken,
      firebaseProjectConfigured: firebaseConfigStatus.configured,
      apiBaseUrl: API_BASE_URL,
      failingEndpoints: errors
    };
  }, [errors, token]);

  async function refreshTokenAndData() {
    setActionError(null);
    setActionMessage(null);
    try {
      await refreshIdToken();
      setActionMessage("Firebase ID token refreshed.");
      refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to refresh Firebase ID token.");
    }
  }

  async function createDonation(body: AdminDonationCreate) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);
    const result = await adminDonationsApi.create(token, body);

    if (!result.ok) {
      setActionError(result.error.message);
      setErrors([result.error]);
      return null;
    }

    setDonations((current) => [result.data, ...current]);
    setActionMessage("Donation record created.");
    return result.data;
  }

  async function updateDonation(id: string, body: AdminDonationUpdate) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);
    const previous = donations;
    setDonations((current) => current.map((item) => item.id === id ? { ...item, ...body } : item));

    const result = await adminDonationsApi.update(token, id, body);

    if (!result.ok) {
      setDonations(previous);
      setActionError(result.error.message);
      setErrors([result.error]);
      return null;
    }

    setDonations((current) => current.map((item) => item.id === id ? result.data : item));
    setActionMessage("Donation record updated.");
    return result.data;
  }

  async function bulkUpdate(ids: string[], body: AdminDonationUpdate) {
    const updated: AdminDonation[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      const result = await updateDonation(id, body);
      if (result) updated.push(result);
      else failed.push(id);
    }

    if (failed.length) {
      setActionError(`${failed.length} selected donation update${failed.length === 1 ? "" : "s"} failed.`);
    } else if (updated.length) {
      setActionMessage(`${updated.length} selected donation${updated.length === 1 ? "" : "s"} updated.`);
    }

    return { updated, failed };
  }

  return {
    donations,
    loading,
    errors,
    health,
    diagnostics,
    lastSyncedAt,
    actionMessage,
    actionError,
    refresh,
    refreshTokenAndData,
    logout,
    claims,
    createDonation,
    updateDonation,
    bulkUpdate
  };
}
