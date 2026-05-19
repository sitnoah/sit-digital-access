import {
  API_BASE_URL,
  type ApiRecord,
  type ConditionGrade,
  type InventoryStatus
} from "@/lib/api";
import type { AdminEndpointError } from "@/types/admin";
import type { AdminRepairTicket } from "@/types/repair";
import type {
  AdminInventoryCreate,
  AdminInventoryItem,
  AdminInventoryUpdate,
  InventoryLifecycle,
  SupportHistoryItem
} from "@/types/inventory";

export type AdminInventoryApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdminEndpointError };

function suggestedFix(status: number | undefined, message: string) {
  if (status === 401 || status === 403 || /invalid firebase id token/i.test(message)) {
    return "Refresh the Firebase ID token, then sign out and sign in again if the API still rejects it.";
  }

  if (status === 500 || /firestore|internal server|permission_denied|service_disabled/i.test(message)) {
    return "Enable Cloud Firestore, create the default database, and confirm the NestJS API has Firebase Admin credentials.";
  }

  if (!status) {
    return "Check that the NestJS API is running and NEXT_PUBLIC_API_BASE_URL points to the correct host.";
  }

  return "Retry the request and inspect the API logs if the issue continues.";
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normaliseLifecycle(value: unknown): InventoryLifecycle | null {
  return typeof value === "object" && value !== null ? (value as InventoryLifecycle) : null;
}

function normaliseSupportHistory(value: unknown): SupportHistoryItem[] {
  return Array.isArray(value) ? value as SupportHistoryItem[] : [];
}

function normaliseInventoryItem(record: ApiRecord): AdminInventoryItem {
  return {
    id: record.id,
    assetTag: String(record.assetTag ?? ""),
    deviceType: String(record.deviceType ?? "Device"),
    brand: String(record.brand ?? "Unknown"),
    model: String(record.model ?? "Unknown"),
    processor: record.processor ? String(record.processor) : null,
    ram: record.ram ? String(record.ram) : null,
    storage: record.storage ? String(record.storage) : null,
    conditionGrade: String(record.conditionGrade ?? "A") as ConditionGrade,
    status: String(record.status ?? "AVAILABLE") as InventoryStatus,
    location: String(record.location ?? "Not provided"),
    assignedTo: record.assignedTo ? String(record.assignedTo) : null,
    costPrice: toNumber(record.costPrice),
    suggestedPrice: toNumber(record.suggestedPrice),
    warrantyMonths: toNumber(record.warrantyMonths),
    africaReady: Boolean(record.africaReady),
    lowPowerSuitable: Boolean(record.lowPowerSuitable),
    labBundleReady: Boolean(record.labBundleReady),
    notes: record.notes ? String(record.notes) : null,
    lifecycle: normaliseLifecycle(record.lifecycle),
    supportHistory: normaliseSupportHistory(record.supportHistory),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    metadata: typeof record.metadata === "object" && record.metadata !== null
      ? (record.metadata as Record<string, unknown>)
      : null
  };
}

async function adminInventoryRequest<T>(
  path: string,
  token: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    map: (data: unknown) => T;
  }
): Promise<AdminInventoryApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const payload = (await response.json().catch(() => null)) as
      | { data?: unknown; message?: string | string[]; error?: string }
      | null;

    if (!response.ok) {
      const rawMessage = payload && "message" in payload ? payload.message : response.statusText;
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(", ")
        : rawMessage || "Admin inventory API request failed.";

      return {
        ok: false,
        error: {
          key: "inventory",
          label: "Inventory",
          message,
          status: response.status,
          path,
          suggestedFix: suggestedFix(response.status, message)
        }
      };
    }

    return {
      ok: true,
      data: options.map(payload?.data ?? payload)
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach admin inventory API.";

    return {
      ok: false,
      error: {
        key: "inventory",
        label: "Inventory",
        message,
        path,
        suggestedFix: suggestedFix(undefined, message)
      }
    };
  }
}

export const adminInventoryApi = {
  list(token: string) {
    return adminInventoryRequest<AdminInventoryItem[]>("/admin/inventory", token, {
      map: (data) => Array.isArray(data) ? data.map((item) => normaliseInventoryItem(item as ApiRecord)) : []
    });
  },
  get(token: string, id: string) {
    return adminInventoryRequest<AdminInventoryItem>(`/admin/inventory/${id}`, token, {
      map: (data) => normaliseInventoryItem(data as ApiRecord)
    });
  },
  create(token: string, body: AdminInventoryCreate) {
    return adminInventoryRequest<AdminInventoryItem>("/admin/inventory", token, {
      method: "POST",
      body,
      map: (data) => normaliseInventoryItem(data as ApiRecord)
    });
  },
  update(token: string, id: string, body: AdminInventoryUpdate) {
    return adminInventoryRequest<AdminInventoryItem>(`/admin/inventory/${id}`, token, {
      method: "PATCH",
      body,
      map: (data) => normaliseInventoryItem(data as ApiRecord)
    });
  },
  delete(token: string, id: string) {
    return adminInventoryRequest<{ id: string; deleted: boolean }>(`/admin/inventory/${id}`, token, {
      method: "DELETE",
      map: (data) => data as { id: string; deleted: boolean }
    });
  },
  openRepairTicket(token: string, id: string, body: Record<string, unknown> = {}) {
    return adminInventoryRequest<AdminRepairTicket>(`/admin/inventory/${id}/repair-ticket`, token, {
      method: "POST",
      body,
      map: (data) => data as AdminRepairTicket
    });
  }
};
