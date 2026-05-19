import type { IconKey } from "@/components/icons";
import type { ApiRecord, ImpactStats } from "@/lib/api";

export type AdminEndpointKey =
  | "enquiries"
  | "deviceRequests"
  | "donations"
  | "inventory"
  | "repairs"
  | "repairParts"
  | "repairTechnicians"
  | "recycling"
  | "impact"
  | "auditLogs";

export type AdminEndpointError = {
  key: AdminEndpointKey;
  label: string;
  message: string;
  status?: number;
  path: string;
  suggestedFix: string;
};

export type SystemHealthStatus = {
  api: "online" | "degraded" | "offline";
  firestore: "connected" | "degraded" | "unknown";
  authTokenPresent: boolean;
  firebaseProjectConfigured: boolean;
  apiBaseUrl: string;
  failingEndpoints: AdminEndpointError[];
};

export type AdminDashboardData = {
  enquiries: ApiRecord[];
  deviceRequests: ApiRecord[];
  donations: ApiRecord[];
  inventory: ApiRecord[];
  repairs: ApiRecord[];
  repairParts: ApiRecord[];
  repairTechnicians: ApiRecord[];
  recycling: ApiRecord[];
  impact: ImpactStats | null;
  auditLogs: ApiRecord[];
};

export type AdminMetric = {
  id: string;
  label: string;
  value: number | string;
  icon: IconKey;
  href: string;
  accent: "orange" | "black" | "green" | "blue" | "purple";
  trend: string;
  status: string;
  series: number[];
};

export type PriorityAction = {
  id: string;
  type: string;
  organisation: string;
  priority: string;
  status: string;
  createdAt?: string;
  assignedOwner: string;
  href: string;
};

export type PipelineStage = {
  label: string;
  enquiries: number;
  deviceRequests: number;
  donations: number;
};

export type InventoryStatusSummary = {
  status: string;
  count: number;
  icon: IconKey;
};

export type DeploymentReadinessItem = {
  label: string;
  value: number;
  description: string;
  icon: IconKey;
};
