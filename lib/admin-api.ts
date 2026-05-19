import {
  API_BASE_URL,
  type ApiRecord,
  type ImpactStats
} from "@/lib/api";
import type { AdminEndpointError, AdminEndpointKey } from "@/types/admin";

type AdminEndpointMeta = {
  key: AdminEndpointKey;
  label: string;
  path: string;
};

export type AdminApiResult<T> =
  | { ok: true; data: T; meta: AdminEndpointMeta }
  | { ok: false; error: AdminEndpointError; meta: AdminEndpointMeta };

const endpointLabels: Record<AdminEndpointKey, string> = {
  enquiries: "Enquiries",
  deviceRequests: "Device requests",
  donations: "Donations",
  inventory: "Inventory",
  repairs: "Repairs",
  repairParts: "Repair parts",
  repairTechnicians: "Repair technicians",
  recycling: "Recycling",
  impact: "Impact stats",
  auditLogs: "Recent activity"
};

function getSuggestedFix(status: number | undefined, message: string) {
  if (status === 401 || status === 403) {
    return "Sign in again with an account that has a valid Firebase admin custom claim.";
  }

  if (status === 500 || /internal server|firestore|permission_denied/i.test(message)) {
    return "Check that Cloud Firestore is enabled, the default database exists, and the API has Firebase Admin credentials.";
  }

  if (!status) {
    return "Check that the NestJS API is running and that NEXT_PUBLIC_API_BASE_URL points to the correct host.";
  }

  return "Retry the request and inspect the API logs if the issue continues.";
}

async function adminRequest<T>(
  key: AdminEndpointKey,
  path: string,
  token: string
): Promise<AdminApiResult<T>> {
  const meta: AdminEndpointMeta = { key, label: endpointLabels[key], path };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const payload = (await response.json().catch(() => null)) as
      | { data?: T; message?: string | string[]; error?: string }
      | T
      | null;

    if (!response.ok) {
      const rawMessage =
        payload && typeof payload === "object" && "message" in payload
          ? payload.message
          : response.statusText;
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(", ")
        : rawMessage || "Admin API request failed.";

      return {
        ok: false,
        meta,
        error: {
          key,
          label: meta.label,
          message,
          status: response.status,
          path,
          suggestedFix: getSuggestedFix(response.status, message)
        }
      };
    }

    const data =
      payload && typeof payload === "object" && "data" in payload
        ? (payload.data as T)
        : (payload as T);

    return { ok: true, data, meta };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach admin API.";

    return {
      ok: false,
      meta,
      error: {
        key,
        label: meta.label,
        message,
        path,
        suggestedFix: getSuggestedFix(undefined, message)
      }
    };
  }
}

export const adminDashboardApi = {
  listEnquiries: (token: string) =>
    adminRequest<ApiRecord[]>("enquiries", "/admin/enquiries", token),
  listDeviceRequests: (token: string) =>
    adminRequest<ApiRecord[]>("deviceRequests", "/admin/device-requests", token),
  listDonations: (token: string) =>
    adminRequest<ApiRecord[]>("donations", "/admin/donations", token),
  listInventory: (token: string) =>
    adminRequest<ApiRecord[]>("inventory", "/admin/inventory", token),
  listRepairs: (token: string) =>
    adminRequest<ApiRecord[]>("repairs", "/admin/repairs", token),
  listRepairParts: (token: string) =>
    adminRequest<ApiRecord[]>("repairParts", "/admin/repair-parts", token),
  listRepairTechnicians: (token: string) =>
    adminRequest<ApiRecord[]>("repairTechnicians", "/admin/repair-technicians", token),
  listRecycling: (token: string) =>
    adminRequest<ApiRecord[]>("recycling", "/admin/recycling", token),
  getImpact: (token: string) => adminRequest<ImpactStats>("impact", "/impact", token),
  listAuditLogs: (token: string) =>
    adminRequest<ApiRecord[]>("auditLogs", "/admin/audit-logs", token)
};
