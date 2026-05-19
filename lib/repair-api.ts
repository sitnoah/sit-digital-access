import { API_BASE_URL, API_CONFIGURED } from "@/lib/api";
import type { PublicRepairStatus, RepairBookingPayload, RepairBookingResponse } from "@/types/repair";

export const REPAIR_API_CONFIGURED = API_CONFIGURED;

type ApiResponse<T> = {
  data: T;
};

async function repairRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
  } = {}
): Promise<T> {
  if (!API_CONFIGURED) {
    throw new Error("Repair booking is temporarily unavailable because the API is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string | string[]; error?: string }
    | null;

  if (!response.ok) {
    const message = payload && "message" in payload ? payload.message : response.statusText;
    throw new Error(Array.isArray(message) ? message.join(", ") : message ?? "Repair API request failed");
  }

  return payload && "data" in payload ? payload.data : (payload as T);
}

export const repairApi = {
  bookRepair(body: RepairBookingPayload) {
    return repairRequest<RepairBookingResponse>("/repairs", { method: "POST", body });
  },
  getRepairStatus(ticketId: string, token: string) {
    const params = new URLSearchParams({ ticketId, token });
    return repairRequest<PublicRepairStatus>(`/repairs/status?${params.toString()}`);
  }
};
