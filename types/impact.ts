import type { ImpactStats as CoreImpactStats } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";

export type ImpactStory = {
  id: string;
  title: string;
  category: "Student" | "School" | "NGO" | "Business" | "Community";
  summary: string;
  region: string;
  relatedMetric: keyof CoreImpactStats | "devicesReused" | "training";
  visible: boolean;
};

export type ImpactRegion = {
  id: string;
  name: "UK" | "Liberia" | "Ghana" | "Sierra Leone" | "Nigeria" | "Wider Africa";
  devicesDeployed: number;
  learnersReached: number;
  schoolsSupported: number;
  activePartnerships: number;
  deploymentStatus: "Planning" | "Active" | "Scaling" | "Paused";
};

export type ImpactSnapshot = {
  id: string;
  label: string;
  metrics: Partial<ImpactStats>;
  createdAt: string;
};

export type ImpactReuse = {
  devicesReused: number;
  devicesDivertedFromWaste: number;
  averageCo2KgPerDevice: number;
  manualCo2Override: boolean;
  notes: string;
};

export type ImpactStats = CoreImpactStats & {
  id?: string;
  stories: ImpactStory[];
  regions: ImpactRegion[];
  snapshots: ImpactSnapshot[];
  reuse: ImpactReuse;
  metricVisibility?: Partial<Record<keyof CoreImpactStats, boolean>>;
  createdAt?: string;
  updatedAt?: string;
};

export type ImpactAuditLog = {
  id: string;
  actorUid?: string;
  actorEmail?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: unknown;
  after?: unknown;
  createdAt?: string;
};

export type ImpactDiagnostics = {
  apiBaseUrl: string;
  endpoint: string;
  updateEndpoint: string;
  tokenPresent: boolean;
  tokenExpirationTime: string | null;
  userEmail: string | null;
  adminClaims: string[];
  firebaseProjectId: string | null;
  firestoreCollection: "impactStats";
  documentPath: "impactStats/current";
  status?: number;
  message?: string;
};

export type ImpactApiState = {
  stats: ImpactStats;
  auditLogs: ImpactAuditLog[];
  loading: boolean;
  saving: boolean;
  errors: AdminEndpointError[];
  health: SystemHealthStatus;
  diagnostics: ImpactDiagnostics;
  lastSyncedAt: Date | null;
  actionMessage: string | null;
  actionError: string | null;
};
