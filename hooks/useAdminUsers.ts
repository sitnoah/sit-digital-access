"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { firebaseConfigStatus } from "@/lib/firebase";
import { API_BASE_URL } from "@/lib/api";
import { AdminWorkforceApiError, adminWorkforceApi } from "@/lib/admin-workforce-api";
import type {
  WorkforceDiagnostic,
  WorkforceInvitePayload,
  WorkforceUpdatePayload,
  WorkforceUser
} from "@/types/workforce";

type WorkforceError = {
  title: string;
  message: string;
  status?: number;
  endpoint?: string;
};

export function useAdminUsers() {
  const { idToken, user, roles, tokenExpirationTime, refreshIdToken, logout } = useAdminAuth();
  const [users, setUsers] = useState<WorkforceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<WorkforceError | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!idToken) {
      setUsers([]);
      setLoading(false);
      setError({
        title: "Admin authentication needs attention.",
        message: "No Firebase ID token is available for this admin session."
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const records = await adminWorkforceApi.listUsers(idToken);
      setUsers(records);
      setLastSyncedAt(new Date().toISOString());
    } catch (requestError) {
      const apiError =
        requestError instanceof AdminWorkforceApiError ? requestError : null;
      setUsers([]);
      setError({
        title:
          apiError?.status === 401 || apiError?.status === 403
            ? "Admin authentication needs attention."
            : "User data could not be loaded.",
        message:
          apiError?.message ??
          "The workforce workspace is available, but the user API request failed.",
        status: apiError?.status,
        endpoint: apiError?.endpoint
      });
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const inviteUser = useCallback(
    async (payload: WorkforceInvitePayload) => {
      if (!idToken) {
        throw new Error("No Firebase ID token is available.");
      }

      setSaving(true);
      try {
        await adminWorkforceApi.inviteUser(idToken, payload);
        await loadUsers();
      } finally {
        setSaving(false);
      }
    },
    [idToken, loadUsers]
  );

  const updateUser = useCallback(
    async (uid: string, payload: WorkforceUpdatePayload) => {
      if (!idToken) {
        throw new Error("No Firebase ID token is available.");
      }

      setSaving(true);
      try {
        await adminWorkforceApi.updateUser(idToken, uid, payload);
        await loadUsers();
      } finally {
        setSaving(false);
      }
    },
    [idToken, loadUsers]
  );

  const diagnostics: WorkforceDiagnostic[] = useMemo(
    () => [
      {
        label: "Frontend Firebase project",
        value: firebaseConfigStatus.projectId ?? "Missing",
        status: firebaseConfigStatus.configured ? "Healthy" : "Error"
      },
      {
        label: "API base URL",
        value: API_BASE_URL,
        status: "Unknown"
      },
      {
        label: "Token present",
        value: idToken ? "Yes" : "No",
        status: idToken ? "Healthy" : "Error"
      },
      {
        label: "Token expiry",
        value: tokenExpirationTime ?? "Unavailable",
        status: tokenExpirationTime ? "Healthy" : "Warning"
      },
      {
        label: "User email",
        value: user?.email ?? "Not signed in",
        status: user?.email ? "Healthy" : "Warning"
      },
      {
        label: "Admin claims",
        value: roles.length ? roles.join(", ") : "None detected",
        status: roles.length ? "Healthy" : "Error"
      },
      {
        label: "Last response",
        value: error?.status ? `${error.status} ${error.message}` : "No error",
        status: error ? "Error" : "Healthy"
      },
      {
        label: "Endpoint called",
        value: error?.endpoint ?? "/admin/users",
        status: error ? "Warning" : "Healthy"
      }
    ],
    [error, idToken, roles, tokenExpirationTime, user?.email]
  );

  return {
    users,
    loading,
    saving,
    error,
    diagnostics,
    lastSyncedAt,
    retry: loadUsers,
    inviteUser,
    updateUser,
    refreshToken: refreshIdToken,
    logout
  };
}
