import type { AdminClaim } from "@/lib/api";
import type { IconKey } from "@/components/icons";

export type SettingsTab =
  | "overview"
  | "firebase"
  | "api"
  | "roles"
  | "firestore"
  | "security"
  | "deployment"
  | "integrations"
  | "audit"
  | "danger";

export type SettingsStatus = "Healthy" | "Warning" | "Missing" | "Error" | "Unknown";

export type ConfigHealthItem = {
  id: string;
  label: string;
  status: SettingsStatus;
  icon: IconKey;
  explanation: string;
  fixAction: string;
  diagnostics: string;
};

export type FirebaseConfigStatus = {
  key: string;
  configured: boolean;
  maskedValue: string;
  description: string;
};

export type ApiHealthStatus = {
  apiBaseUrl: string;
  healthStatus: SettingsStatus;
  impactStatus: SettingsStatus;
  adminStatus: SettingsStatus;
  lastChecked?: string;
  responseStatus?: number;
  latencyMs?: number;
  errorMessage?: string;
  backendConfig?: Record<string, boolean>;
};

export type AdminRoleDefinition = {
  role: AdminClaim;
  description: string;
  permissions: string[];
  accessAreas: string[];
  riskLevel: "Critical" | "High" | "Medium" | "Low";
};

export type FirestoreCollectionStatus = {
  name: string;
  purpose: string;
  access: string;
  apiModule: string;
  documentCount: string;
  lastUpdated: string;
  status: SettingsStatus;
};

export type SecurityChecklistItem = {
  label: string;
  status: SettingsStatus;
  description: string;
};

export type DeploymentChecklistItem = {
  label: string;
  complete: boolean;
  description: string;
};

export type IntegrationStatus = {
  name: string;
  status: SettingsStatus;
  icon: IconKey;
  description: string;
  setupAction: string;
};

export type SettingsDiagnostic = {
  label: string;
  value: string;
  status: SettingsStatus;
};

export type AuditLogSummary = {
  id: string;
  actorEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  createdAt?: string;
};
