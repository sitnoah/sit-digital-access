"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminImpactApi, defaultImpactStats } from "@/lib/admin-impact-api";
import { API_BASE_URL } from "@/lib/api";
import { firebaseConfigStatus } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";
import type { ImpactAuditLog, ImpactDiagnostics, ImpactStats } from "@/types/impact";

export function useAdminImpact() {
  const {
    token,
    user,
    roles,
    tokenExpirationTime,
    refreshIdToken,
    logout
  } = useAdminAuth();
  const [stats, setStats] = useState<ImpactStats>(defaultImpactStats);
  const [auditLogs, setAuditLogs] = useState<ImpactAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<AdminEndpointError[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setActionError(null);
      const impactResult = await adminImpactApi.getImpactStats();
      const auditResult = token ? await adminImpactApi.getImpactAuditLogs(token) : { ok: true as const, data: [] };

      if (cancelled) return;

      const nextErrors: AdminEndpointError[] = [];
      if (impactResult.ok) {
        setStats(impactResult.data);
      } else {
        setStats(defaultImpactStats);
        nextErrors.push(impactResult.error);
      }

      if (auditResult.ok) {
        setAuditLogs(auditResult.data);
      } else {
        setAuditLogs([]);
        nextErrors.push(auditResult.error);
      }

      setErrors(nextErrors);
      setLastSyncedAt(new Date());
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, token]);

  const diagnostics = useMemo<ImpactDiagnostics>(() => {
    const firstError = errors[0];
    return {
      apiBaseUrl: API_BASE_URL,
      endpoint: firstError?.path ?? "/impact",
      updateEndpoint: "/admin/impact",
      tokenPresent: Boolean(token),
      tokenExpirationTime,
      userEmail: user?.email ?? null,
      adminClaims: roles,
      firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
      firestoreCollection: "impactStats",
      documentPath: "impactStats/current",
      status: firstError?.status,
      message: firstError?.message
    };
  }, [errors, roles, token, tokenExpirationTime, user?.email]);

  const health = useMemo<SystemHealthStatus>(() => {
    const publicError = errors.find((error) => error.path.includes("/impact"));
    const authError = errors.find((error) => error.status === 401 || error.status === 403 || /invalid firebase id token/i.test(error.message));
    const firestoreError = errors.find((error) => /firestore|internal server|permission_denied|service_disabled/i.test(error.message));

    return {
      api: publicError ? (publicError.status ? "degraded" : "offline") : "online",
      firestore: errors.length === 0 ? "connected" : firestoreError ? "degraded" : "unknown",
      authTokenPresent: Boolean(token) && !authError,
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

  async function updateImpactStats(payload: Partial<ImpactStats>) {
    if (!token) {
      setActionError("No Firebase ID token is available for admin impact updates.");
      return null;
    }

    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    const previous = stats;
    setStats((current) => ({ ...current, ...payload }));
    const result = await adminImpactApi.updateImpactStats(token, payload);
    setSaving(false);

    if (!result.ok) {
      setStats(previous);
      setErrors([result.error]);
      setActionError(result.error.message);
      return null;
    }

    setStats(result.data);
    setActionMessage("Impact stats saved.");
    refresh();
    return result.data;
  }

  async function initialiseImpactStats() {
    if (!token) {
      setActionError("No Firebase ID token is available for admin impact initialisation.");
      return null;
    }

    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    const result = await adminImpactApi.initialiseImpactStats(token);
    setSaving(false);

    if (!result.ok) {
      setErrors([result.error]);
      setActionError(result.error.message);
      return null;
    }

    setStats(result.data);
    setActionMessage("impactStats/current has been initialised.");
    refresh();
    return result.data;
  }

  async function saveImpactSnapshot(label?: string, metrics?: Partial<ImpactStats>) {
    if (!token) {
      setActionError("No Firebase ID token is available for saving snapshots.");
      return null;
    }

    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    const result = await adminImpactApi.saveImpactSnapshot(token, { label, metrics: metrics ?? stats });
    setSaving(false);

    if (!result.ok) {
      setErrors([result.error]);
      setActionError(result.error.message);
      return null;
    }

    setStats(result.data);
    setActionMessage("Monthly impact snapshot saved.");
    refresh();
    return result.data;
  }

  return {
    stats,
    auditLogs,
    loading,
    saving,
    errors,
    health,
    diagnostics,
    lastSyncedAt,
    actionMessage,
    actionError,
    refresh,
    refreshTokenAndData,
    logout,
    updateImpactStats,
    initialiseImpactStats,
    saveImpactSnapshot
  };
}
