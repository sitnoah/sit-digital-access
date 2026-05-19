"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminInventoryApi } from "@/lib/admin-inventory-api";
import { API_BASE_URL } from "@/lib/api";
import { firebaseConfigStatus } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";
import type {
  AdminInventoryCreate,
  AdminInventoryItem,
  AdminInventoryUpdate,
  InventoryDiagnostics
} from "@/types/inventory";

export function useAdminInventory() {
  const {
    token,
    user,
    roles,
    claims,
    tokenExpirationTime,
    refreshIdToken,
    logout
  } = useAdminAuth();
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
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

      const result = await adminInventoryApi.list(authToken);

      if (cancelled) return;

      setErrors(result.ok ? [] : [result.error]);
      setInventory(result.ok ? result.data : []);
      setLastSyncedAt(new Date());
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, token]);

  const diagnostics = useMemo<InventoryDiagnostics>(() => {
    const firstError = errors[0];
    return {
      apiBaseUrl: API_BASE_URL,
      endpoint: firstError?.path ?? "/admin/inventory",
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

  async function createItem(body: AdminInventoryCreate) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);
    const result = await adminInventoryApi.create(token, body);

    if (!result.ok) {
      setActionError(result.error.message);
      setErrors([result.error]);
      return null;
    }

    setInventory((current) => [result.data, ...current]);
    setActionMessage("Inventory item created.");
    return result.data;
  }

  async function updateItem(id: string, body: AdminInventoryUpdate) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);
    const previous = inventory;
    setInventory((current) => current.map((item) => item.id === id ? { ...item, ...body } : item));

    const result = await adminInventoryApi.update(token, id, body);

    if (!result.ok) {
      setInventory(previous);
      setActionError(result.error.message);
      setErrors([result.error]);
      return null;
    }

    setInventory((current) => current.map((item) => item.id === id ? result.data : item));
    setActionMessage("Inventory item updated.");
    return result.data;
  }

  async function deleteItem(id: string) {
    if (!token) return false;
    setActionError(null);
    setActionMessage(null);
    const previous = inventory;
    setInventory((current) => current.filter((item) => item.id !== id));

    const result = await adminInventoryApi.delete(token, id);

    if (!result.ok) {
      setInventory(previous);
      setActionError(result.error.message);
      setErrors([result.error]);
      return false;
    }

    setActionMessage("Inventory item deleted.");
    return true;
  }

  async function openRepairTicket(id: string, body: Record<string, unknown> = {}) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);

    const result = await adminInventoryApi.openRepairTicket(token, id, body);

    if (!result.ok) {
      setActionError(result.error.message);
      setErrors([result.error]);
      return null;
    }

    setActionMessage(`Repair ticket ${result.data.id} opened.`);
    refresh();
    return result.data;
  }

  async function bulkUpdate(ids: string[], body: AdminInventoryUpdate) {
    const updated: AdminInventoryItem[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      const result = await updateItem(id, body);
      if (result) updated.push(result);
      else failed.push(id);
    }

    if (failed.length) {
      setActionError(`${failed.length} selected inventory update${failed.length === 1 ? "" : "s"} failed.`);
    } else if (updated.length) {
      setActionMessage(`${updated.length} selected inventory item${updated.length === 1 ? "" : "s"} updated.`);
    }

    return { updated, failed };
  }

  return {
    inventory,
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
    createItem,
    updateItem,
    deleteItem,
    openRepairTicket,
    bulkUpdate
  };
}
