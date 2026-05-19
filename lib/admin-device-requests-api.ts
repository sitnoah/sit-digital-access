import {
  API_BASE_URL,
  type ApiRecord,
  type DeviceRequestStatus,
  type InventoryStatus
} from "@/lib/api";
import type { AdminEndpointError } from "@/types/admin";
import type {
  AdminDeviceCategory,
  AdminDeviceRequest,
  AdminDeviceRequestCreate,
  AdminDeviceRequestUpdate,
  AdminInventoryLite,
  DeviceRequestPriority
} from "@/types/device-request";

export type AdminDeviceRequestApiResult<T> =
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

function normaliseDeviceRequest(record: ApiRecord): AdminDeviceRequest {
  return {
    id: record.id,
    requesterName: String(record.requesterName ?? "Unknown requester"),
    organisation: String(record.organisation ?? "Not provided"),
    email: String(record.email ?? ""),
    phone: record.phone ? String(record.phone) : null,
    country: String(record.country ?? "Not provided"),
    deviceCategory: String(record.deviceCategory ?? "STUDENT_LAPTOPS") as AdminDeviceCategory,
    quantity: typeof record.quantity === "number" ? record.quantity : Number(record.quantity ?? 0),
    budgetRange: record.budgetRange ? String(record.budgetRange) : null,
    intendedUse: String(record.intendedUse ?? ""),
    deploymentLocation: String(record.deploymentLocation ?? "Not provided"),
    requiredBy: record.requiredBy ? String(record.requiredBy) : null,
    status: String(record.status ?? "NEW") as DeviceRequestStatus,
    priority: String(record.priority ?? "MEDIUM") as DeviceRequestPriority,
    assignedOwner: record.assignedOwner ? String(record.assignedOwner) : null,
    internalNotes: record.internalNotes ? String(record.internalNotes) : null,
    fulfilmentPlan: record.fulfilmentPlan ? String(record.fulfilmentPlan) : null,
    deploymentType: record.deploymentType ? String(record.deploymentType) : null,
    notes: record.notes ? String(record.notes) : null,
    productSlug: record.productSlug ? String(record.productSlug) : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    metadata: typeof record.metadata === "object" && record.metadata !== null
      ? (record.metadata as Record<string, unknown>)
      : null
  };
}

function normaliseInventory(record: ApiRecord): AdminInventoryLite {
  return {
    id: record.id,
    assetTag: record.assetTag ? String(record.assetTag) : undefined,
    deviceType: record.deviceType ? String(record.deviceType) : undefined,
    brand: record.brand ? String(record.brand) : undefined,
    model: record.model ? String(record.model) : undefined,
    status: record.status ? (String(record.status) as InventoryStatus) : undefined,
    location: record.location ? String(record.location) : undefined,
    notes: record.notes ? String(record.notes) : undefined
  };
}

async function adminDeviceRequest<T>(
  path: string,
  token: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    body?: unknown;
    map: (data: unknown) => T;
  }
): Promise<AdminDeviceRequestApiResult<T>> {
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
        : rawMessage || "Admin device requests API request failed.";

      return {
        ok: false,
        error: {
          key: "deviceRequests",
          label: "Device requests",
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
    const message = error instanceof Error ? error.message : "Unable to reach admin device requests API.";

    return {
      ok: false,
      error: {
        key: "deviceRequests",
        label: "Device requests",
        message,
        path,
        suggestedFix: suggestedFix(undefined, message)
      }
    };
  }
}

export const adminDeviceRequestsApi = {
  list(token: string) {
    return adminDeviceRequest<AdminDeviceRequest[]>("/admin/device-requests", token, {
      map: (data) => Array.isArray(data) ? data.map((item) => normaliseDeviceRequest(item as ApiRecord)) : []
    });
  },
  get(token: string, id: string) {
    return adminDeviceRequest<AdminDeviceRequest>(`/admin/device-requests/${id}`, token, {
      map: (data) => normaliseDeviceRequest(data as ApiRecord)
    });
  },
  create(token: string, body: AdminDeviceRequestCreate) {
    return adminDeviceRequest<AdminDeviceRequest>("/admin/device-requests", token, {
      method: "POST",
      body,
      map: (data) => normaliseDeviceRequest(data as ApiRecord)
    });
  },
  update(token: string, id: string, body: AdminDeviceRequestUpdate) {
    return adminDeviceRequest<AdminDeviceRequest>(`/admin/device-requests/${id}`, token, {
      method: "PATCH",
      body,
      map: (data) => normaliseDeviceRequest(data as ApiRecord)
    });
  },
  listInventory(token: string) {
    return adminDeviceRequest<AdminInventoryLite[]>("/admin/inventory", token, {
      map: (data) => Array.isArray(data) ? data.map((item) => normaliseInventory(item as ApiRecord)) : []
    });
  }
};
