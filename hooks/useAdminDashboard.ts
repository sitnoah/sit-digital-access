"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminDashboardApi, type AdminApiResult } from "@/lib/admin-api";
import { API_BASE_URL, type ApiRecord, type ImpactStats } from "@/lib/api";
import { firebaseConfigStatus } from "@/lib/firebase";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import type {
  AdminDashboardData,
  AdminEndpointError,
  SystemHealthStatus
} from "@/types/admin";

const emptyData: AdminDashboardData = {
  enquiries: [],
  deviceRequests: [],
  donations: [],
  inventory: [],
  repairs: [],
  repairParts: [],
  repairTechnicians: [],
  recycling: [],
  impact: null,
  auditLogs: []
};

type DashboardResults = [
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ApiRecord[]>,
  AdminApiResult<ImpactStats>,
  AdminApiResult<ApiRecord[]>
];

export function useAdminDashboard() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [data, setData] = useState<AdminDashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<AdminEndpointError[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    if (typeof token !== "string" || token.length === 0) {
      setLoading(false);
      return;
    }

    const authToken: string = token;
    let cancelled = false;

    async function load() {
      setLoading(true);

      const requests = [
        {
          key: "enquiries",
          label: "Enquiries",
          path: "/admin/enquiries",
          promise: adminDashboardApi.listEnquiries(authToken)
        },
        {
          key: "deviceRequests",
          label: "Device requests",
          path: "/admin/device-requests",
          promise: adminDashboardApi.listDeviceRequests(authToken)
        },
        {
          key: "donations",
          label: "Donations",
          path: "/admin/donations",
          promise: adminDashboardApi.listDonations(authToken)
        },
        {
          key: "inventory",
          label: "Inventory",
          path: "/admin/inventory",
          promise: adminDashboardApi.listInventory(authToken)
        },
        {
          key: "repairs",
          label: "Repairs",
          path: "/admin/repairs",
          promise: adminDashboardApi.listRepairs(authToken)
        },
        {
          key: "repairParts",
          label: "Repair parts",
          path: "/admin/repair-parts",
          promise: adminDashboardApi.listRepairParts(authToken)
        },
        {
          key: "repairTechnicians",
          label: "Repair technicians",
          path: "/admin/repair-technicians",
          promise: adminDashboardApi.listRepairTechnicians(authToken)
        },
        {
          key: "recycling",
          label: "Recycling",
          path: "/admin/recycling",
          promise: adminDashboardApi.listRecycling(authToken)
        },
        {
          key: "impact",
          label: "Impact stats",
          path: "/impact",
          promise: adminDashboardApi.getImpact(authToken)
        },
        {
          key: "auditLogs",
          label: "Recent activity",
          path: "/admin/audit-logs",
          promise: adminDashboardApi.listAuditLogs(authToken)
        }
      ] as const;

      const settled = await Promise.allSettled(requests.map((request) => request.promise));
      const results = settled.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        }

        const request = requests[index];
        const message = result.reason instanceof Error
          ? result.reason.message
          : "Unexpected admin dashboard request failure.";

        return {
          ok: false,
          meta: {
            key: request.key,
            label: request.label,
            path: request.path
          },
          error: {
            key: request.key,
            label: request.label,
            message,
            path: request.path,
            suggestedFix: "Retry the dashboard request and inspect the browser or API logs if the issue continues."
          }
        };
      }) as DashboardResults;

      if (cancelled) return;

      const nextErrors = results.flatMap((result) => (result.ok ? [] : [result.error]));
      const hasAuthFailure = nextErrors.some((error) => error.status === 401 || error.status === 403);

      if (hasAuthFailure) {
        router.replace("/admin/login");
        return;
      }

      setData({
        enquiries: results[0].ok ? results[0].data : [],
        deviceRequests: results[1].ok ? results[1].data : [],
        donations: results[2].ok ? results[2].data : [],
        inventory: results[3].ok ? results[3].data : [],
        repairs: results[4].ok ? results[4].data : [],
        repairParts: results[5].ok ? results[5].data : [],
        repairTechnicians: results[6].ok ? results[6].data : [],
        recycling: results[7].ok ? results[7].data : [],
        impact: results[8].ok ? results[8].data : null,
        auditLogs: results[9].ok ? results[9].data : []
      });
      setErrors(nextErrors);
      setLastSyncedAt(new Date());
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, router, token]);

  const health = useMemo<SystemHealthStatus>(() => {
    const hasErrors = errors.length > 0;
    const allEndpointsFailed = errors.length >= 10;
    const likelyFirestoreIssue = errors.some((error) =>
      /firestore|internal server|permission_denied/i.test(error.message)
    );

    return {
      api: allEndpointsFailed ? "offline" : hasErrors ? "degraded" : "online",
      firestore: hasErrors && likelyFirestoreIssue ? "degraded" : hasErrors ? "unknown" : "connected",
      authTokenPresent: Boolean(token),
      firebaseProjectConfigured: firebaseConfigStatus.configured,
      apiBaseUrl: API_BASE_URL,
      failingEndpoints: errors
    };
  }, [errors, token]);

  return { data, loading, health, errors, lastSyncedAt, retry };
}
