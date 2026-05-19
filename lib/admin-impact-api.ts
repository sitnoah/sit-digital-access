import { API_BASE_URL, type ApiRecord } from "@/lib/api";
import type { AdminEndpointError } from "@/types/admin";
import type {
  ImpactAuditLog,
  ImpactRegion,
  ImpactReuse,
  ImpactSnapshot,
  ImpactStats,
  ImpactStory
} from "@/types/impact";

export type AdminImpactApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AdminEndpointError };

export const defaultImpactStats: ImpactStats = {
  devicesDeployed: 0,
  learnersReached: 0,
  schoolsSupported: 0,
  businessesSupported: 0,
  countriesServed: 0,
  co2SavedKg: 0,
  trainingHoursDelivered: 0,
  costSavingsGenerated: 0,
  stories: [
    {
      id: "student-success",
      title: "Student success story",
      category: "Student",
      summary: "A learner gains reliable access to study, practice and digital skills support.",
      region: "UK / Africa",
      relatedMetric: "learnersReached",
      visible: true
    },
    {
      id: "school-lab",
      title: "School lab transformation",
      category: "School",
      summary: "A training centre launches a practical shared lab using refurbished devices.",
      region: "Wider Africa",
      relatedMetric: "schoolsSupported",
      visible: true
    },
    {
      id: "ngo-upgrade",
      title: "NGO digital upgrade",
      category: "NGO",
      summary: "A community organisation improves operations with secure configured devices.",
      region: "UK",
      relatedMetric: "businessesSupported",
      visible: false
    },
    {
      id: "small-business",
      title: "Small business productivity improvement",
      category: "Business",
      summary: "An SME accesses affordable devices and setup support for everyday work.",
      region: "UK",
      relatedMetric: "costSavingsGenerated",
      visible: false
    }
  ],
  regions: [
    { id: "uk", name: "UK", devicesDeployed: 0, learnersReached: 0, schoolsSupported: 0, activePartnerships: 0, deploymentStatus: "Active" },
    { id: "liberia", name: "Liberia", devicesDeployed: 0, learnersReached: 0, schoolsSupported: 0, activePartnerships: 0, deploymentStatus: "Planning" },
    { id: "ghana", name: "Ghana", devicesDeployed: 0, learnersReached: 0, schoolsSupported: 0, activePartnerships: 0, deploymentStatus: "Planning" },
    { id: "sierra-leone", name: "Sierra Leone", devicesDeployed: 0, learnersReached: 0, schoolsSupported: 0, activePartnerships: 0, deploymentStatus: "Planning" },
    { id: "nigeria", name: "Nigeria", devicesDeployed: 0, learnersReached: 0, schoolsSupported: 0, activePartnerships: 0, deploymentStatus: "Planning" },
    { id: "wider-africa", name: "Wider Africa", devicesDeployed: 0, learnersReached: 0, schoolsSupported: 0, activePartnerships: 0, deploymentStatus: "Planning" }
  ],
  snapshots: [],
  metricVisibility: {
    devicesDeployed: true,
    learnersReached: true,
    schoolsSupported: true,
    businessesSupported: true,
    countriesServed: true,
    co2SavedKg: true,
    trainingHoursDelivered: true,
    costSavingsGenerated: true
  },
  reuse: {
    devicesReused: 0,
    devicesDivertedFromWaste: 0,
    averageCo2KgPerDevice: 85,
    manualCo2Override: false,
    notes: ""
  }
};

function suggestedFix(status: number | undefined, message: string) {
  if (status === 401 || status === 403 || /invalid firebase id token/i.test(message)) {
    return "Refresh the Firebase ID token, then sign out and sign in again if the API still rejects it.";
  }

  if (status === 404 || /not found|not initialised|missing/i.test(message)) {
    return "Initialise impactStats/current from the admin impact page, then retry the request.";
  }

  if (status === 500 || /firestore|internal server|permission_denied|service_disabled/i.test(message)) {
    return "Confirm Firestore is enabled and that the NestJS API has valid Firebase Admin credentials.";
  }

  if (!status) {
    return "Check that the NestJS API is running and NEXT_PUBLIC_API_BASE_URL points to the correct host.";
  }

  return "Retry the request and inspect the API logs if the issue continues.";
}

function numberValue(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normaliseStory(value: unknown, index: number): ImpactStory {
  const record = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  const fallback = defaultImpactStats.stories[index % defaultImpactStats.stories.length];
  return {
    id: String(record.id ?? fallback.id ?? `story-${index}`),
    title: String(record.title ?? fallback.title),
    category: String(record.category ?? fallback.category) as ImpactStory["category"],
    summary: String(record.summary ?? fallback.summary),
    region: String(record.region ?? fallback.region),
    relatedMetric: String(record.relatedMetric ?? fallback.relatedMetric) as ImpactStory["relatedMetric"],
    visible: typeof record.visible === "boolean" ? record.visible : Boolean(fallback.visible)
  };
}

function normaliseRegion(value: unknown, index: number): ImpactRegion {
  const record = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  const fallback = defaultImpactStats.regions[index % defaultImpactStats.regions.length];
  return {
    id: String(record.id ?? fallback.id ?? `region-${index}`),
    name: String(record.name ?? fallback.name) as ImpactRegion["name"],
    devicesDeployed: numberValue(record.devicesDeployed),
    learnersReached: numberValue(record.learnersReached),
    schoolsSupported: numberValue(record.schoolsSupported),
    activePartnerships: numberValue(record.activePartnerships),
    deploymentStatus: String(record.deploymentStatus ?? fallback.deploymentStatus) as ImpactRegion["deploymentStatus"]
  };
}

function normaliseSnapshot(value: unknown, index: number): ImpactSnapshot {
  const record = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  return {
    id: String(record.id ?? `snapshot-${index}`),
    label: String(record.label ?? "Monthly snapshot"),
    metrics: typeof record.metrics === "object" && record.metrics !== null ? record.metrics as Partial<ImpactStats> : {},
    createdAt: String(record.createdAt ?? new Date().toISOString())
  };
}

function normaliseReuse(value: unknown): ImpactReuse {
  const record = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  return {
    devicesReused: numberValue(record.devicesReused),
    devicesDivertedFromWaste: numberValue(record.devicesDivertedFromWaste),
    averageCo2KgPerDevice: numberValue(record.averageCo2KgPerDevice) || 85,
    manualCo2Override: Boolean(record.manualCo2Override),
    notes: String(record.notes ?? "")
  };
}

export function normaliseImpactStats(data: unknown): ImpactStats {
  const record: Record<string, unknown> = typeof data === "object" && data !== null ? data as ApiRecord : {};
  return {
    ...defaultImpactStats,
    id: String(record.id ?? "current"),
    devicesDeployed: numberValue(record.devicesDeployed),
    learnersReached: numberValue(record.learnersReached),
    schoolsSupported: numberValue(record.schoolsSupported),
    businessesSupported: numberValue(record.businessesSupported),
    countriesServed: numberValue(record.countriesServed),
    co2SavedKg: numberValue(record.co2SavedKg),
    trainingHoursDelivered: numberValue(record.trainingHoursDelivered),
    costSavingsGenerated: numberValue(record.costSavingsGenerated),
    stories: Array.isArray(record.stories)
      ? record.stories.map(normaliseStory)
      : defaultImpactStats.stories,
    regions: Array.isArray(record.regions)
      ? record.regions.map(normaliseRegion)
      : defaultImpactStats.regions,
    snapshots: Array.isArray(record.snapshots)
      ? record.snapshots.map(normaliseSnapshot)
      : [],
    reuse: normaliseReuse(record.reuse),
    metricVisibility: typeof record.metricVisibility === "object" && record.metricVisibility !== null
      ? record.metricVisibility as ImpactStats["metricVisibility"]
      : defaultImpactStats.metricVisibility,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : undefined,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : undefined
  };
}

function normaliseAuditLog(data: unknown): ImpactAuditLog {
  const record = typeof data === "object" && data !== null ? data as ApiRecord : { id: "" };
  return {
    id: String(record.id ?? ""),
    actorUid: record.actorUid ? String(record.actorUid) : undefined,
    actorEmail: record.actorEmail ? String(record.actorEmail) : undefined,
    action: String(record.action ?? "UNKNOWN_ACTION"),
    resourceType: String(record.resourceType ?? "impactStats"),
    resourceId: String(record.resourceId ?? "current"),
    before: record.before,
    after: record.after,
    createdAt: record.createdAt ? String(record.createdAt) : undefined
  };
}

async function impactRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    token?: string;
    body?: unknown;
    map: (data: unknown) => T;
    label?: string;
  }
): Promise<AdminImpactApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
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
        : rawMessage || "Admin impact API request failed.";

      return {
        ok: false,
        error: {
          key: "impact",
          label: options.label ?? "Impact",
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
    const message = error instanceof Error ? error.message : "Unable to reach impact API.";
    return {
      ok: false,
      error: {
        key: "impact",
        label: options.label ?? "Impact",
        message,
        path,
        suggestedFix: suggestedFix(undefined, message)
      }
    };
  }
}

export const adminImpactApi = {
  getImpactStats() {
    return impactRequest<ImpactStats>("/impact", {
      label: "Public Impact API",
      map: normaliseImpactStats
    });
  },
  updateImpactStats(token: string, body: Partial<ImpactStats>) {
    return impactRequest<ImpactStats>("/admin/impact", {
      method: "PATCH",
      token,
      body,
      label: "Update Impact",
      map: normaliseImpactStats
    });
  },
  initialiseImpactStats(token: string) {
    return impactRequest<ImpactStats>("/admin/impact/initialise", {
      method: "POST",
      token,
      label: "Initialise Impact",
      map: normaliseImpactStats
    });
  },
  saveImpactSnapshot(token: string, body: { label?: string; metrics?: Partial<ImpactStats> }) {
    return impactRequest<ImpactStats>("/admin/impact/snapshots", {
      method: "POST",
      token,
      body,
      label: "Save Impact Snapshot",
      map: normaliseImpactStats
    });
  },
  getImpactAuditLogs(token: string) {
    return impactRequest<ImpactAuditLog[]>("/admin/audit-logs?resourceType=impactStats&resourceId=current", {
      token,
      label: "Impact Audit Logs",
      map: (data) => Array.isArray(data) ? data.map(normaliseAuditLog) : []
    });
  }
};
