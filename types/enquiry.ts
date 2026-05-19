import type { EnquiryPayload, EnquiryPriority, EnquiryStatus, EnquiryType } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";

export type AdminEnquiry = {
  id: string;
  fullName: string;
  organisation?: string | null;
  email: string;
  phone?: string | null;
  country: string;
  enquiryType: EnquiryType;
  organisationType?: string | null;
  message: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  assignedOwner?: string | null;
  internalNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  sourcePage?: string | null;
  metadata?: Record<string, unknown> | null;
  deploymentLocation?: string | null;
  deploymentRegion?: string | null;
  preferredDeviceCategory?: string | null;
  deviceQuantity?: number | null;
  timeline?: string | null;
};

export type AdminEnquiryUpdate = Partial<Pick<
  AdminEnquiry,
  "status" | "priority" | "assignedOwner" | "internalNotes" | "sourcePage" | "metadata"
>>;

export type AdminEnquiryCreate = EnquiryPayload & {
  assignedOwner?: string;
  internalNotes?: string;
  sourcePage?: string;
  metadata?: Record<string, unknown>;
};

export type EnquiryViewKey =
  | "all"
  | "newToday"
  | "africa"
  | "deviceRequests"
  | "partnership"
  | "highPriority"
  | "unassigned";

export type EnquiryTableView = "table" | "pipeline";

export type EnquirySortKey =
  | "createdAt"
  | "updatedAt"
  | "fullName"
  | "organisation"
  | "status"
  | "priority"
  | "enquiryType";

export type EnquiryFilters = {
  search: string;
  status: "ALL" | EnquiryStatus;
  priority: "ALL" | EnquiryPriority;
  enquiryType: "ALL" | EnquiryType;
  organisationType: string;
  country: string;
  dateRange: "ALL" | "TODAY" | "7_DAYS" | "30_DAYS";
  assignedOwner: string;
  hasNotes: boolean;
  highPriorityOnly: boolean;
};

export type AdminEnquiriesState = {
  enquiries: AdminEnquiry[];
  loading: boolean;
  errors: AdminEndpointError[];
  health: SystemHealthStatus;
  lastSyncedAt: Date | null;
};
