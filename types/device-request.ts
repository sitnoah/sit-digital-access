import type { DeviceRequestPayload, DeviceRequestStatus, InventoryStatus } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";

export type DeviceRequestPriority = "LOW" | "MEDIUM" | "HIGH";

export type AdminDeviceCategory =
  | "STUDENT_LAPTOPS"
  | "BUSINESS_LAPTOPS"
  | "DESKTOP_PCS"
  | "MINI_PCS"
  | "ALL_IN_ONE_PCS"
  | "COMPUTER_LAB_BUNDLES"
  | "AI_LEARNING_LAB_BUNDLES"
  | "ACCESSORIES";

export type AdminDeviceRequest = {
  id: string;
  requesterName: string;
  organisation: string;
  email: string;
  phone?: string | null;
  country: string;
  deviceCategory: AdminDeviceCategory;
  quantity: number;
  budgetRange?: string | null;
  intendedUse: string;
  deploymentLocation: string;
  requiredBy?: string | null;
  status: DeviceRequestStatus;
  priority: DeviceRequestPriority;
  assignedOwner?: string | null;
  internalNotes?: string | null;
  fulfilmentPlan?: string | null;
  deploymentType?: string | null;
  notes?: string | null;
  productSlug?: string | null;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown> | null;
};

export type AdminDeviceRequestUpdate = Partial<Pick<
  AdminDeviceRequest,
  "status" | "priority" | "assignedOwner" | "internalNotes" | "fulfilmentPlan" | "deploymentType" | "metadata"
>>;

export type AdminDeviceRequestCreate = DeviceRequestPayload & {
  priority?: DeviceRequestPriority;
  assignedOwner?: string;
  internalNotes?: string;
  fulfilmentPlan?: string;
  deploymentType?: string;
  metadata?: Record<string, unknown>;
};

export type AdminInventoryLite = {
  id: string;
  assetTag?: string;
  deviceType?: string;
  brand?: string;
  model?: string;
  status?: InventoryStatus;
  location?: string;
  notes?: string;
};

export type DeviceRequestViewKey =
  | "all"
  | "newToday"
  | "labBundles"
  | "africaDeployment"
  | "highQuantity"
  | "quoteRequired"
  | "unassigned"
  | "fulfilmentReady";

export type DeviceRequestWorkspaceView = "table" | "pipeline";

export type DeviceRequestSortKey =
  | "createdAt"
  | "updatedAt"
  | "requesterName"
  | "organisation"
  | "deviceCategory"
  | "quantity"
  | "requiredBy"
  | "status"
  | "priority";

export type DeviceRequestFilters = {
  search: string;
  status: "ALL" | DeviceRequestStatus;
  priority: "ALL" | DeviceRequestPriority;
  deviceCategory: "ALL" | AdminDeviceCategory;
  quantityRange: "ALL" | "1_5" | "6_20" | "21_50" | "51_PLUS";
  budgetRange: string;
  country: string;
  deploymentType: string;
  requiredBy: "ALL" | "OVERDUE" | "7_DAYS" | "30_DAYS";
  assignedOwner: string;
  highPriorityOnly: boolean;
};

export type DeviceRequestDiagnostics = {
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

export type AdminDeviceRequestsState = {
  deviceRequests: AdminDeviceRequest[];
  inventory: AdminInventoryLite[];
  loading: boolean;
  errors: AdminEndpointError[];
  health: SystemHealthStatus;
  diagnostics: DeviceRequestDiagnostics;
  lastSyncedAt: Date | null;
};
