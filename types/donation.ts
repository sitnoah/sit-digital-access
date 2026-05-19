import type { IconKey } from "@/components/icons";
import type { DonationPayload, DonationStatus } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";

export type DonorTypeValue =
  | "INDIVIDUAL"
  | "COMPANY"
  | "NGO"
  | "SCHOOL"
  | "FOUNDATION"
  | "GOVERNMENT";

export type DonationTypeValue =
  | "USED_LAPTOPS"
  | "DESKTOPS"
  | "MINI_PCS"
  | "ACCESSORIES"
  | "CORPORATE_RECYCLING"
  | "SPONSOR_LEARNER"
  | "SPONSOR_CLASSROOM_BUNDLE"
  | "SPONSOR_FULL_LAB"
  | "MONTHLY_DONOR";

export type DonationPathway = {
  title: string;
  description: string;
  bestFor: string;
  impactBadge: string;
  includes: string[];
  ctaLabel: string;
  ctaHref: string;
  icon: IconKey;
};

export type SponsorshipPackage = {
  title: string;
  audience: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  quoteLabel: string;
  recommended?: boolean;
  icon: IconKey;
};

export type DonationMetric = {
  value: string;
  label: string;
  detail: string;
  icon: IconKey;
};

export type DonationImpactExample = {
  title: string;
  description: string;
  icon: IconKey;
};

export type DonationTrustCard = {
  title: string;
  description: string;
  icon: IconKey;
};

export type DonationJourneyStep = {
  title: string;
  description: string;
  icon: IconKey;
};

export type DonationSelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type DonationPriority = "LOW" | "MEDIUM" | "HIGH";

export type AdminDonationStatus = DonationStatus;

export type AdminDonation = {
  id: string;
  donorName: string;
  donorType: DonorTypeValue;
  organisation?: string | null;
  email: string;
  phone?: string | null;
  country: string;
  donationType: DonationTypeValue;
  deviceCount?: number | null;
  deviceCondition?: string | null;
  pickupLocation?: string | null;
  sponsorshipAmount?: number | null;
  preferredTimeline?: string | null;
  message?: string | null;
  status: AdminDonationStatus;
  priority: DonationPriority;
  assignedOwner?: string | null;
  internalNotes?: string | null;
  collectionPlan?: string | null;
  sponsorshipPlan?: string | null;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown> | null;
};

export type AdminDonationUpdate = Partial<Pick<
  AdminDonation,
  "status" | "priority" | "assignedOwner" | "internalNotes" | "collectionPlan" | "sponsorshipPlan" | "metadata"
>>;

export type AdminDonationCreate = DonationPayload & {
  priority?: DonationPriority;
  assignedOwner?: string;
  internalNotes?: string;
  collectionPlan?: string;
  sponsorshipPlan?: string;
  metadata?: Record<string, unknown>;
};

export type DonationViewKey =
  | "all"
  | "newToday"
  | "corporateRecycling"
  | "sponsorships"
  | "deviceDonations"
  | "fullLabSponsors"
  | "collectionRequired"
  | "highPriority"
  | "unassigned";

export type DonationWorkspaceView = "table" | "pipeline";

export type DonationSortKey =
  | "createdAt"
  | "updatedAt"
  | "donorName"
  | "organisation"
  | "donorType"
  | "donationType"
  | "deviceCount"
  | "sponsorshipAmount"
  | "status"
  | "priority";

export type DonationFilters = {
  search: string;
  status: "ALL" | AdminDonationStatus;
  donorType: "ALL" | DonorTypeValue;
  donationType: "ALL" | DonationTypeValue;
  deviceCondition: string;
  deviceCountRange: "ALL" | "1_5" | "6_20" | "21_50" | "51_PLUS";
  sponsorshipAmountRange: "ALL" | "1_500" | "501_2500" | "2501_10000" | "10001_PLUS";
  country: string;
  pickupRequired: boolean;
  assignedOwner: string;
  dateRange: "ALL" | "TODAY" | "7_DAYS" | "30_DAYS";
  highPriorityOnly: boolean;
};

export type DonationDiagnostics = {
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

export type AdminDonationsState = {
  donations: AdminDonation[];
  loading: boolean;
  errors: AdminEndpointError[];
  health: SystemHealthStatus;
  diagnostics: DonationDiagnostics;
  lastSyncedAt: Date | null;
};
