import {
  API_BASE_URL,
  type ApiRecord,
  type EnquiryPriority,
  type EnquiryStatus
} from "@/lib/api";
import type { AdminEndpointError } from "@/types/admin";
import type { AdminEnquiry, AdminEnquiryCreate, AdminEnquiryUpdate } from "@/types/enquiry";

export type AdminEnquiryApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdminEndpointError };

function suggestedFix(status: number | undefined, message: string) {
  if (status === 401 || status === 403) {
    return "Sign in again with an account that has a valid Firebase admin custom claim.";
  }

  if (status === 500 || /firestore|internal server|permission_denied|service_disabled/i.test(message)) {
    return "Enable Cloud Firestore, create the default database, and confirm the NestJS API has Firebase Admin credentials.";
  }

  if (!status) {
    return "Check that the NestJS API is running and NEXT_PUBLIC_API_BASE_URL points to the correct host.";
  }

  return "Retry the request and inspect the API logs if the issue continues.";
}

function normaliseEnquiry(record: ApiRecord): AdminEnquiry {
  return {
    id: record.id,
    fullName: String(record.fullName ?? "Unknown enquirer"),
    organisation: record.organisation ? String(record.organisation) : null,
    email: String(record.email ?? ""),
    phone: record.phone ? String(record.phone) : null,
    country: String(record.country ?? "Not provided"),
    enquiryType: String(record.enquiryType ?? "CONTACT") as AdminEnquiry["enquiryType"],
    organisationType: record.organisationType ? String(record.organisationType) : null,
    message: String(record.message ?? ""),
    status: String(record.status ?? "NEW") as EnquiryStatus,
    priority: String(record.priority ?? "MEDIUM") as EnquiryPriority,
    assignedOwner: record.assignedOwner ? String(record.assignedOwner) : null,
    internalNotes: record.internalNotes ? String(record.internalNotes) : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    sourcePage: record.sourcePage ? String(record.sourcePage) : null,
    metadata: typeof record.metadata === "object" && record.metadata !== null
      ? (record.metadata as Record<string, unknown>)
      : null,
    deploymentLocation: record.deploymentLocation ? String(record.deploymentLocation) : null,
    deploymentRegion: record.deploymentRegion ? String(record.deploymentRegion) : null,
    preferredDeviceCategory: record.preferredDeviceCategory ? String(record.preferredDeviceCategory) : null,
    deviceQuantity: typeof record.deviceQuantity === "number" ? record.deviceQuantity : null,
    timeline: record.timeline ? String(record.timeline) : null
  };
}

async function adminEnquiryRequest<T>(
  path: string,
  token: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    body?: unknown;
    map: (data: unknown) => T;
  }
): Promise<AdminEnquiryApiResult<T>> {
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
        : rawMessage || "Admin enquiries API request failed.";

      return {
        ok: false,
        error: {
          key: "enquiries",
          label: "Enquiries",
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
    const message = error instanceof Error ? error.message : "Unable to reach admin enquiries API.";

    return {
      ok: false,
      error: {
        key: "enquiries",
        label: "Enquiries",
        message,
        path,
        suggestedFix: suggestedFix(undefined, message)
      }
    };
  }
}

export const adminEnquiriesApi = {
  list(token: string) {
    return adminEnquiryRequest<AdminEnquiry[]>("/admin/enquiries", token, {
      map: (data) => Array.isArray(data) ? data.map((item) => normaliseEnquiry(item as ApiRecord)) : []
    });
  },
  get(token: string, id: string) {
    return adminEnquiryRequest<AdminEnquiry>(`/admin/enquiries/${id}`, token, {
      map: (data) => normaliseEnquiry(data as ApiRecord)
    });
  },
  create(token: string, body: AdminEnquiryCreate) {
    return adminEnquiryRequest<AdminEnquiry>("/admin/enquiries", token, {
      method: "POST",
      body,
      map: (data) => normaliseEnquiry(data as ApiRecord)
    });
  },
  update(token: string, id: string, body: AdminEnquiryUpdate) {
    return adminEnquiryRequest<AdminEnquiry>(`/admin/enquiries/${id}`, token, {
      method: "PATCH",
      body,
      map: (data) => normaliseEnquiry(data as ApiRecord)
    });
  }
};
