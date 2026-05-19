"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminEnquiriesApi } from "@/lib/admin-enquiries-api";
import { API_BASE_URL } from "@/lib/api";
import { firebaseConfigStatus } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";
import type { AdminEnquiry, AdminEnquiryCreate, AdminEnquiryUpdate } from "@/types/enquiry";

export function useAdminEnquiries() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
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

    const authToken: string = token;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setActionError(null);
      const result = await adminEnquiriesApi.list(authToken);

      if (cancelled) return;

      if (!result.ok) {
        if (result.error.status === 401 || result.error.status === 403) {
          router.replace("/admin/login");
          return;
        }
        setEnquiries([]);
        setErrors([result.error]);
        setLastSyncedAt(new Date());
        setLoading(false);
        return;
      }

      setEnquiries(result.data);
      setErrors([]);
      setLastSyncedAt(new Date());
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, router, token]);

  const health = useMemo<SystemHealthStatus>(() => {
    const error = errors[0];
    const likelyFirestoreIssue = error
      ? /firestore|internal server|permission_denied|service_disabled/i.test(error.message)
      : false;

    return {
      api: error ? (error.status ? "degraded" : "offline") : "online",
      firestore: error ? (likelyFirestoreIssue ? "degraded" : "unknown") : "connected",
      authTokenPresent: Boolean(token),
      firebaseProjectConfigured: firebaseConfigStatus.configured,
      apiBaseUrl: API_BASE_URL,
      failingEndpoints: errors
    };
  }, [errors, token]);

  async function createEnquiry(body: AdminEnquiryCreate) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);
    const result = await adminEnquiriesApi.create(token, body);

    if (!result.ok) {
      setActionError(result.error.message);
      return null;
    }

    setEnquiries((current) => [result.data, ...current]);
    setActionMessage("Enquiry created.");
    return result.data;
  }

  async function updateEnquiry(id: string, body: AdminEnquiryUpdate) {
    if (!token) return null;
    setActionError(null);
    setActionMessage(null);

    const previous = enquiries;
    setEnquiries((current) => current.map((item) => item.id === id ? { ...item, ...body } : item));

    const result = await adminEnquiriesApi.update(token, id, body);

    if (!result.ok) {
      setEnquiries(previous);
      setActionError(result.error.message);
      return null;
    }

    setEnquiries((current) => current.map((item) => item.id === id ? result.data : item));
    setActionMessage("Enquiry updated.");
    return result.data;
  }

  async function bulkUpdate(ids: string[], body: AdminEnquiryUpdate) {
    const updated: AdminEnquiry[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      const result = await updateEnquiry(id, body);
      if (result) {
        updated.push(result);
      } else {
        failed.push(id);
      }
    }

    if (failed.length) {
      setActionError(`${failed.length} selected enquiry update${failed.length === 1 ? "" : "s"} failed.`);
    } else if (updated.length) {
      setActionMessage(`${updated.length} selected enquiry${updated.length === 1 ? "" : "ies"} updated.`);
    }

    return { updated, failed };
  }

  return {
    enquiries,
    loading,
    errors,
    health,
    lastSyncedAt,
    actionMessage,
    actionError,
    refresh,
    createEnquiry,
    updateEnquiry,
    bulkUpdate
  };
}
