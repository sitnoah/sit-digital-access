import {
  API_BASE_URL,
  type ApiRecord,
  type DonationStatus
} from "@/lib/api";
import type { AdminEndpointError } from "@/types/admin";
import type {
  AdminDonation,
  AdminDonationCreate,
  AdminDonationUpdate,
  DonationPriority,
  DonationTypeValue,
  DonorTypeValue
} from "@/types/donation";

export type AdminDonationApiResult<T> =
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

function normaliseDonation(record: ApiRecord): AdminDonation {
  return {
    id: record.id,
    donorName: String(record.donorName ?? "Unknown donor"),
    donorType: String(record.donorType ?? "INDIVIDUAL") as DonorTypeValue,
    organisation: record.organisation ? String(record.organisation) : null,
    email: String(record.email ?? ""),
    phone: record.phone ? String(record.phone) : null,
    country: String(record.country ?? "Not provided"),
    donationType: String(record.donationType ?? "USED_LAPTOPS") as DonationTypeValue,
    deviceCount: typeof record.deviceCount === "number" ? record.deviceCount : record.deviceCount ? Number(record.deviceCount) : null,
    deviceCondition: record.deviceCondition ? String(record.deviceCondition) : null,
    pickupLocation: record.pickupLocation ? String(record.pickupLocation) : null,
    sponsorshipAmount: typeof record.sponsorshipAmount === "number" ? record.sponsorshipAmount : record.sponsorshipAmount ? Number(record.sponsorshipAmount) : null,
    preferredTimeline: record.preferredTimeline ? String(record.preferredTimeline) : null,
    message: record.message ? String(record.message) : null,
    status: String(record.status ?? "NEW") as DonationStatus,
    priority: String(record.priority ?? "MEDIUM") as DonationPriority,
    assignedOwner: record.assignedOwner ? String(record.assignedOwner) : null,
    internalNotes: record.internalNotes ? String(record.internalNotes) : null,
    collectionPlan: record.collectionPlan ? String(record.collectionPlan) : null,
    sponsorshipPlan: record.sponsorshipPlan ? String(record.sponsorshipPlan) : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    metadata: typeof record.metadata === "object" && record.metadata !== null
      ? (record.metadata as Record<string, unknown>)
      : null
  };
}

async function adminDonationRequest<T>(
  path: string,
  token: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    body?: unknown;
    map: (data: unknown) => T;
  }
): Promise<AdminDonationApiResult<T>> {
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
        : rawMessage || "Admin donations API request failed.";

      return {
        ok: false,
        error: {
          key: "donations",
          label: "Donations",
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
    const message = error instanceof Error ? error.message : "Unable to reach admin donations API.";

    return {
      ok: false,
      error: {
        key: "donations",
        label: "Donations",
        message,
        path,
        suggestedFix: suggestedFix(undefined, message)
      }
    };
  }
}

export const adminDonationsApi = {
  list(token: string) {
    return adminDonationRequest<AdminDonation[]>("/admin/donations", token, {
      map: (data) => Array.isArray(data) ? data.map((item) => normaliseDonation(item as ApiRecord)) : []
    });
  },
  get(token: string, id: string) {
    return adminDonationRequest<AdminDonation>(`/admin/donations/${id}`, token, {
      map: (data) => normaliseDonation(data as ApiRecord)
    });
  },
  create(token: string, body: AdminDonationCreate) {
    return adminDonationRequest<AdminDonation>("/admin/donations", token, {
      method: "POST",
      body,
      map: (data) => normaliseDonation(data as ApiRecord)
    });
  },
  update(token: string, id: string, body: AdminDonationUpdate) {
    return adminDonationRequest<AdminDonation>(`/admin/donations/${id}`, token, {
      method: "PATCH",
      body,
      map: (data) => normaliseDonation(data as ApiRecord)
    });
  }
};
