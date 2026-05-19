import { API_BASE_URL } from "@/lib/api";
import type {
  WorkforceActivityLog,
  WorkforceInvitePayload,
  WorkforceUpdatePayload,
  WorkforceUser
} from "@/types/workforce";

type ApiEnvelope<T> = {
  data: T;
};

export class AdminWorkforceApiError extends Error {
  status: number;
  endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "AdminWorkforceApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

async function request<T>(
  path: string,
  token: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    body?: unknown;
  } = {}
): Promise<T> {
  const endpoint = `${API_BASE_URL}${path}`;
  const response = await fetch(endpoint, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { message?: string | string[]; error?: string }
    | null;

  if (!response.ok) {
    const message = payload && "message" in payload ? payload.message : response.statusText;
    throw new AdminWorkforceApiError(
      Array.isArray(message) ? message.join(", ") : message ?? "API request failed",
      response.status,
      path
    );
  }

  return payload && "data" in payload ? payload.data : (payload as T);
}

export const adminWorkforceApi = {
  listUsers(token: string) {
    return request<WorkforceUser[]>("/admin/users", token);
  },
  inviteUser(token: string, body: WorkforceInvitePayload) {
    return request<WorkforceUser>("/admin/users/invite", token, {
      method: "POST",
      body
    });
  },
  updateUser(token: string, uid: string, body: WorkforceUpdatePayload) {
    return request<WorkforceUser>(`/admin/users/${uid}`, token, {
      method: "PATCH",
      body
    });
  },
  listActivityLogs(token: string) {
    return request<WorkforceActivityLog[]>("/admin/audit-logs", token);
  }
};
