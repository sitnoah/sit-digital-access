import type { AdminRole } from "@/lib/auth";
import type { IconKey } from "@/components/icons";

export type WorkforceRole =
  | AdminRole
  | "deploymentCoordinator"
  | "countryManager"
  | "inventoryManager"
  | "analyticsManager";

export type WorkforceUserStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "DISABLED";

export type WorkforceUser = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: WorkforceRole;
  roles: WorkforceRole[];
  team: string;
  country: string;
  deploymentRegions: string[];
  permissions: string[];
  status: WorkforceUserStatus;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  mfaEnabled: boolean;
  bio?: string;
  department?: string;
  languages: string[];
  skills: string[];
  certifications: string[];
  availability: "Available" | "Busy" | "On deployment" | "Offline";
  currentProjects: string[];
  adminClaims?: Record<string, unknown>;
};

export type WorkforceInvitePayload = {
  fullName: string;
  email: string;
  role: WorkforceRole;
  team: string;
  country?: string;
  deploymentRegion?: string;
  permissionsPreset?: string;
};

export type WorkforceUpdatePayload = Partial<{
  fullName: string;
  role: WorkforceRole;
  team: string;
  country: string;
  status: WorkforceUserStatus;
  deploymentRegions: string[];
  skills: string[];
  languages: string[];
  bio: string;
  mfaEnabled: boolean;
}>;

export type WorkforceTeam = {
  id: string;
  name: string;
  description: string;
  lead: string;
  members: number;
  activeProjects: number;
  countriesCovered: string[];
  workload: number;
  kpis: string[];
  icon: IconKey;
};

export type WorkforcePermission = {
  id: string;
  label: string;
  description: string;
  pages: string[];
};

export type WorkforceRoleDefinition = {
  id: WorkforceRole;
  label: string;
  description: string;
  permissions: string[];
  accessAreas: string[];
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  claim: WorkforceRole;
};

export type WorkforceActivityLog = {
  id: string;
  actor: string;
  action: string;
  resource: string;
  resourceType: string;
  timestamp: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
  ipAddress?: string;
};

export type WorkforceNotification = {
  id: string;
  title: string;
  message: string;
  category:
    | "Enquiry"
    | "Device Request"
    | "Donation"
    | "Deployment"
    | "Inventory"
    | "Security"
    | "System";
  priority: "Low" | "Medium" | "High";
  read: boolean;
  createdAt: string;
  actionHref?: string;
};

export type WorkforceMetric = {
  label: string;
  value: string | number;
  detail: string;
  icon: IconKey;
  filter?: string;
  tone?: "orange" | "green" | "blue" | "red" | "slate";
};

export type WorkforceDiagnostic = {
  label: string;
  value: string;
  status: "Healthy" | "Warning" | "Error" | "Unknown";
};
