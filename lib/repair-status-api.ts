import { API_BASE_URL, API_CONFIGURED } from "@/lib/api";
import { RepairStatusError, type RepairStatusResult } from "@/types/repair-status";

type ApiResponse<T> = {
  data: T;
};

function publicErrorForStatus(status: number) {
  if (status === 401 || status === 403 || status === 404) {
    return new RepairStatusError("INVALID_LOOKUP", "Ticket not found or token is incorrect.");
  }
  if (status === 410) {
    return new RepairStatusError("TOKEN_EXPIRED", "This repair status token has expired.");
  }
  return new RepairStatusError("SERVER_ERROR", "Repair status could not be loaded.");
}

async function repairStatusRequest<T>(path: string): Promise<T> {
  if (!API_CONFIGURED) {
    throw new RepairStatusError("MISSING_API", "Repair status API is not configured yet.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    throw new RepairStatusError("NETWORK_ERROR", "Repair status could not be loaded.");
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok) {
    throw publicErrorForStatus(response.status);
  }

  return payload && "data" in payload ? payload.data : (payload as T);
}

export const repairStatusApi = {
  lookup(ticketId: string, token: string) {
    const params = new URLSearchParams({ ticketId, token });
    return repairStatusRequest<RepairStatusResult>(`/repairs/status?${params.toString()}`);
  }
};
