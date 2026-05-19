import type { ConditionGrade, InventoryPayload, InventoryStatus } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";

export type InventoryConditionGrade = ConditionGrade;
export type AdminInventoryStatus = InventoryStatus;

export type InventoryLifecycle = {
  sourcedDate?: string | null;
  testedDate?: string | null;
  wipedDate?: string | null;
  configuredDate?: string | null;
  deployedDate?: string | null;
  retiredDate?: string | null;
  lastInspection?: string | null;
  screenSize?: string | null;
  batteryHealth?: string | null;
  osInstalled?: string | null;
  accessoriesIncluded?: string | null;
  assignedOrganisation?: string | null;
  organisationType?: string | null;
  deploymentCountry?: string | null;
  programmeOrCohort?: string | null;
  supportOwner?: string | null;
};

export type SupportHistoryItem = {
  note: string;
  createdAt?: string;
  author?: string;
};

export type AdminInventoryItem = {
  id: string;
  assetTag: string;
  deviceType: string;
  brand: string;
  model: string;
  processor?: string | null;
  ram?: string | null;
  storage?: string | null;
  conditionGrade: InventoryConditionGrade;
  status: AdminInventoryStatus;
  location: string;
  assignedTo?: string | null;
  costPrice?: number | null;
  suggestedPrice?: number | null;
  warrantyMonths?: number | null;
  africaReady?: boolean;
  lowPowerSuitable?: boolean;
  labBundleReady?: boolean;
  notes?: string | null;
  lifecycle?: InventoryLifecycle | null;
  supportHistory?: SupportHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown> | null;
};

export type AdminInventoryCreate = InventoryPayload;
export type AdminInventoryUpdate = Partial<Omit<InventoryPayload, "lifecycle" | "supportHistory">> & {
  lifecycle?: InventoryLifecycle | Record<string, unknown>;
  supportHistory?: SupportHistoryItem[];
  metadata?: Record<string, unknown>;
};

export type InventoryViewKey =
  | "all"
  | "available"
  | "reserved"
  | "deployed"
  | "repair"
  | "retired"
  | "labReady"
  | "africaReady"
  | "missingAssetTags"
  | "lowStock";

export type InventoryWorkspaceView = "table" | "board" | "category";

export type InventorySortKey =
  | "assetTag"
  | "deviceType"
  | "brand"
  | "model"
  | "processor"
  | "ram"
  | "storage"
  | "conditionGrade"
  | "status"
  | "location"
  | "assignedTo"
  | "suggestedPrice"
  | "warrantyMonths"
  | "updatedAt";

export type InventoryFilters = {
  search: string;
  deviceType: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  conditionGrade: "ALL" | InventoryConditionGrade;
  status: "ALL" | AdminInventoryStatus;
  location: string;
  assignedTo: string;
  warrantyMonths: "ALL" | "NONE" | "1_6" | "7_12" | "13_PLUS";
  priceRange: "ALL" | "0_150" | "151_300" | "301_600" | "601_PLUS";
  africaReadyOnly: boolean;
  lowPowerOnly: boolean;
  labBundleReadyOnly: boolean;
  missingAssetTagOnly: boolean;
  dateAdded: "ALL" | "TODAY" | "7_DAYS" | "30_DAYS";
};

export type InventoryDiagnostics = {
  apiBaseUrl: string;
  endpoint: string;
  tokenPresent: boolean;
  tokenExpirationTime: string | null;
  userEmail: string | null;
  adminClaims: string[];
  firebaseProjectId: string | null;
  status?: number;
  message?: string;
};

export type AdminInventoryState = {
  inventory: AdminInventoryItem[];
  loading: boolean;
  errors: AdminEndpointError[];
  health: SystemHealthStatus;
  diagnostics: InventoryDiagnostics;
  lastSyncedAt: Date | null;
};
