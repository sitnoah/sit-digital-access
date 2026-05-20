import type {
  AdminRepairListResponse,
  AdminRepairPart,
  AdminRepairSummary,
  AdminRepairTechnician,
  AdminRepairTicket,
  PublicRepairStatus,
  RepairBookingPayload,
  RepairBookingResponse
} from "@/types/repair";
import type {
  AdminRecyclingListResponse,
  AdminRecyclingPartner,
  AdminRecyclingRecord,
  AdminRecyclingSummary
} from "@/types/recycling";
import type {
  SustainabilityExportResponse,
  SustainabilityReport,
  SustainabilityReportListResponse,
  SustainabilityReportSummary
} from "@/types/sustainability-report";
import type {
  SuccessStory,
  SuccessStoryDraftResponse,
  SuccessStoryListResponse,
  SuccessStorySummary
} from "@/types/success-story";
import type {
  SupportListResponse,
  SupportSummary,
  SupportTicket
} from "@/types/support";
import type {
  TrainingCohort,
  TrainingCohortListResponse,
  TrainingCohortSummary,
  TrainingExportResponse
} from "@/types/training";

export type { PublicRepairStatus, RepairBookingPayload, RepairBookingResponse } from "@/types/repair";

const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export const API_CONFIGURED = Boolean(configuredApiBaseUrl) || process.env.NODE_ENV !== "production";

export const API_BASE_URL = configuredApiBaseUrl ?? "http://localhost:8080/api/v1";

type ApiResponse<T> = {
  data: T;
};

const emptyRepairSummary: AdminRepairSummary = {
  active: 0,
  awaitingApproval: 0,
  slaRisk: 0,
  techniciansAvailable: 0,
  overdue: 0,
  dueWithin24Hours: 0,
  blockedByParts: 0,
  unassigned: 0
};

const emptyRecyclingSummary: AdminRecyclingSummary = {
  totalRecords: 0,
  devicesDiverted: 0,
  estimatedCo2KgAvoided: 0,
  processing: 0,
  secureWipePending: 0,
  esgEvidenceReady: 0,
  overdueCollections: 0,
  partnersActive: 0
};

const emptySustainabilityReportSummary: SustainabilityReportSummary = {
  totalReports: 0,
  co2EstimatedKg: 0,
  devicesDiverted: 0,
  latestReport: null,
  reuseRate: 0,
  recyclingRate: 0,
  devicesReused: 0,
  devicesRecycled: 0,
  evidenceReadiness: 0
};

const emptySuccessStorySummary: SuccessStorySummary = {
  totalStories: 0,
  published: 0,
  drafts: 0,
  regionsRepresented: 0,
  awaitingReview: 0,
  featured: 0,
  storiesWithMedia: 0,
  impactMetricsAttached: 0
};

const emptySupportSummary: SupportSummary = {
  openTickets: 0,
  highPriority: 0,
  inventoryLinked: 0,
  closedTickets: 0,
  slaRisk: 0,
  awaitingCustomer: 0,
  escalated: 0,
  repairLinked: 0
};

const emptyTrainingCohortSummary: TrainingCohortSummary = {
  totalCohorts: 0,
  totalLearners: 0,
  activeCohorts: 0,
  certificationReady: 0,
  sponsorFunded: 0,
  schoolsLinked: 0,
  completionRate: 0,
  attendanceRisk: 0
};

export type EnquiryStatus = "NEW" | "REVIEWING" | "CONTACTED" | "QUALIFIED" | "CLOSED";
export type EnquiryPriority = "LOW" | "MEDIUM" | "HIGH";
export type EnquiryType =
  | "CONTACT"
  | "REQUEST_DEVICES"
  | "PARTNERSHIP"
  | "AFRICA_DEPLOYMENT"
  | "SCHOOL_LAB"
  | "SCHOOL_ENQUIRY"
  | "SME_NGO"
  | "DEVICE_DONATION"
  | "IT_SUPPORT"
  | "SPONSORSHIP"
  | "PROGRAMME_ENQUIRY"
  | "SERVICE_ENQUIRY";

export type DeviceRequestStatus =
  | "NEW"
  | "REVIEWING"
  | "QUOTED"
  | "RESERVED"
  | "FULFILLED"
  | "CLOSED";

export type DonationStatus =
  | "NEW"
  | "REVIEWING"
  | "CONTACTED"
  | "COLLECTION_NEEDED"
  | "COLLECTION_ARRANGED"
  | "PROCESSING"
  | "RECEIVED"
  | "COMPLETED"
  | "CLOSED";

export type InventoryStatus = "AVAILABLE" | "RESERVED" | "DEPLOYED" | "REPAIR" | "RETIRED";
export type ConditionGrade = "A" | "B" | "C" | "PARTS_REPAIR";
export type AdminClaim =
  | "superAdmin"
  | "admin"
  | "operationsManager"
  | "deviceManager"
  | "donationsManager"
  | "supportAgent"
  | "deploymentCoordinator"
  | "countryManager"
  | "inventoryManager"
  | "analyticsManager";

export type AdminClaimPayload = Partial<Record<AdminClaim, boolean>>;

export type EcosystemRecordPayload = Record<string, unknown> & {
  title?: string | null;
  name?: string | null;
  summary?: string | null;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  category?: string | null;
  assignedOwner?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type EnquiryPayload = {
  fullName: string;
  organisation?: string;
  email: string;
  phone?: string;
  country: string;
  enquiryType: EnquiryType;
  message: string;
  priority?: EnquiryPriority;
  organisationType?: string;
  deploymentScale?: string;
  estimatedLearnerCount?: number;
  powerAvailability?: string;
  connectivityProfile?: string;
  timeline?: string;
  deviceQuantity?: number;
  preferredDeviceCategory?: string;
  preferredPackage?: string;
  classroomCount?: number;
  powerConnectivityNotes?: string;
  programmeSlug?: string;
  serviceSlug?: string;
  learnerCount?: number;
  deploymentRegion?: string;
  trainingRequirement?: string;
  deviceRequirement?: string;
  deviceCategories?: string[];
  supportModelRequired?: string;
  deploymentLocation?: string;
};

export type DeviceRequestPayload = {
  requesterName: string;
  organisation: string;
  email: string;
  phone?: string;
  country: string;
  deviceCategory:
    | "STUDENT_LAPTOPS"
    | "BUSINESS_LAPTOPS"
    | "DESKTOP_PCS"
    | "MINI_PCS"
    | "ALL_IN_ONE_PCS"
    | "COMPUTER_LAB_BUNDLES"
    | "AI_LEARNING_LAB_BUNDLES"
    | "ACCESSORIES";
  quantity: number;
  budgetRange?: string;
  intendedUse: string;
  deploymentLocation: string;
  requiredBy?: string;
  notes?: string;
  productSlug?: string;
};

export type DonationPayload = {
  donorName: string;
  organisation?: string;
  donorType: "INDIVIDUAL" | "COMPANY" | "NGO" | "SCHOOL" | "FOUNDATION" | "GOVERNMENT";
  email: string;
  phone?: string;
  country: string;
  donationType:
    | "USED_LAPTOPS"
    | "DESKTOPS"
    | "MINI_PCS"
    | "ACCESSORIES"
    | "CORPORATE_RECYCLING"
    | "SPONSOR_LEARNER"
    | "SPONSOR_CLASSROOM_BUNDLE"
    | "SPONSOR_FULL_LAB"
    | "MONTHLY_DONOR";
  deviceCount?: number;
  deviceCondition?: string;
  pickupLocation?: string;
  sponsorshipAmount?: number;
  preferredTimeline?: string;
  message?: string;
};

export type InventoryPayload = {
  assetTag: string;
  deviceType: string;
  brand: string;
  model: string;
  processor?: string;
  ram?: string;
  storage?: string;
  conditionGrade: ConditionGrade;
  status: InventoryStatus;
  location: string;
  assignedTo?: string;
  costPrice?: number;
  suggestedPrice?: number;
  warrantyMonths?: number;
  africaReady?: boolean;
  lowPowerSuitable?: boolean;
  labBundleReady?: boolean;
  notes?: string;
  lifecycle?: Record<string, unknown>;
  supportHistory?: unknown[];
  metadata?: Record<string, unknown>;
};

export type ApiRecord = Record<string, unknown> & {
  id: string;
  status?: string | null;
  priority?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ImpactStats = {
  id?: string;
  devicesDeployed: number;
  learnersReached: number;
  schoolsSupported: number;
  businessesSupported: number;
  countriesServed: number;
  co2SavedKg: number;
  trainingHoursDelivered: number;
  costSavingsGenerated: number;
};

async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
  } = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string | string[]; error?: string }
    | null;

  if (!response.ok) {
    const message = payload && "message" in payload ? payload.message : response.statusText;
    throw new Error(Array.isArray(message) ? message.join(", ") : message ?? "API request failed");
  }

  return payload && "data" in payload ? payload.data : (payload as T);
}

async function apiUpload<T>(path: string, token: string, body: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string | string[]; error?: string }
    | null;

  if (!response.ok) {
    const message = payload && "message" in payload ? payload.message : response.statusText;
    throw new Error(Array.isArray(message) ? message.join(", ") : message ?? "API upload failed");
  }

  return payload && "data" in payload ? payload.data : (payload as T);
}

function normaliseRepairOperations(
  value: AdminRepairTicket[] | AdminRepairListResponse | null
): AdminRepairListResponse {
  if (Array.isArray(value)) {
    return { tickets: value, summary: emptyRepairSummary };
  }

  return {
    tickets: Array.isArray(value?.tickets) ? value.tickets : [],
    summary: { ...emptyRepairSummary, ...(value?.summary ?? {}) }
  };
}

function normaliseRecyclingOperations(
  value: AdminRecyclingRecord[] | AdminRecyclingListResponse | null
): AdminRecyclingListResponse {
  if (Array.isArray(value)) {
    return { records: value, summary: emptyRecyclingSummary };
  }

  return {
    records: Array.isArray(value?.records) ? value.records : [],
    summary: { ...emptyRecyclingSummary, ...(value?.summary ?? {}) }
  };
}

function normaliseSustainabilityReports(
  value: SustainabilityReport[] | SustainabilityReportListResponse | null
): SustainabilityReportListResponse {
  if (Array.isArray(value)) {
    return { reports: value, summary: emptySustainabilityReportSummary };
  }

  return {
    reports: Array.isArray(value?.reports) ? value.reports : [],
    summary: { ...emptySustainabilityReportSummary, ...(value?.summary ?? {}) }
  };
}

function normaliseSuccessStories(
  value: SuccessStory[] | SuccessStoryListResponse | null
): SuccessStoryListResponse {
  if (Array.isArray(value)) {
    return { stories: value, summary: emptySuccessStorySummary };
  }

  return {
    stories: Array.isArray(value?.stories) ? value.stories : [],
    summary: { ...emptySuccessStorySummary, ...(value?.summary ?? {}) }
  };
}

function normaliseSupportOperations(
  value: SupportTicket[] | SupportListResponse | null
): SupportListResponse {
  if (Array.isArray(value)) {
    return { tickets: value, summary: emptySupportSummary };
  }

  return {
    tickets: Array.isArray(value?.tickets) ? value.tickets : [],
    summary: { ...emptySupportSummary, ...(value?.summary ?? {}) }
  };
}

function normaliseTrainingCohorts(
  value: TrainingCohort[] | TrainingCohortListResponse | null
): TrainingCohortListResponse {
  if (Array.isArray(value)) {
    return { cohorts: value, summary: emptyTrainingCohortSummary };
  }

  return {
    cohorts: Array.isArray(value?.cohorts) ? value.cohorts : [],
    summary: { ...emptyTrainingCohortSummary, ...(value?.summary ?? {}) }
  };
}

export const publicApi = {
  createEnquiry: (body: EnquiryPayload) =>
    apiRequest<ApiRecord>("/enquiries", { method: "POST", body }),
  createDeviceRequest: (body: DeviceRequestPayload) =>
    apiRequest<ApiRecord>("/device-requests", { method: "POST", body }),
  createDonation: (body: DonationPayload) =>
    apiRequest<ApiRecord>("/donations", { method: "POST", body }),
  bookRepair: (body: RepairBookingPayload) =>
    apiRequest<RepairBookingResponse>("/repairs", { method: "POST", body }),
  getRepairStatus: (ticketId: string, token: string) => {
    const params = new URLSearchParams({ ticketId, token });
    return apiRequest<PublicRepairStatus>(`/repairs/status?${params.toString()}`);
  },
  getImpact: () => apiRequest<ImpactStats>("/impact"),
  getSuccessStories: () => apiRequest<ApiRecord[]>("/success-stories"),
  getSustainabilitySummary: () => apiRequest<ApiRecord>("/sustainability/summary")
};

export function submitEnquiry(body: EnquiryPayload) {
  if (!API_CONFIGURED) {
    throw new Error("Your enquiry could not be submitted because the API is not configured yet.");
  }

  return publicApi.createEnquiry(body);
}

export const adminApi = {
  listEnquiries: (token: string) => apiRequest<ApiRecord[]>("/admin/enquiries", { token }),
  getEnquiry: (token: string, id: string) => apiRequest<ApiRecord>(`/admin/enquiries/${id}`, { token }),
  updateEnquiryStatus: (
    token: string,
    id: string,
    body: { status: EnquiryStatus; priority?: EnquiryPriority }
  ) => apiRequest<ApiRecord>(`/admin/enquiries/${id}/status`, { method: "PATCH", body, token }),
  listDeviceRequests: (token: string) =>
    apiRequest<ApiRecord[]>("/admin/device-requests", { token }),
  getDeviceRequest: (token: string, id: string) =>
    apiRequest<ApiRecord>(`/admin/device-requests/${id}`, { token }),
  updateDeviceRequestStatus: (
    token: string,
    id: string,
    body: { status: DeviceRequestStatus }
  ) =>
    apiRequest<ApiRecord>(`/admin/device-requests/${id}/status`, {
      method: "PATCH",
      body,
      token
    }),
  listDonations: (token: string) => apiRequest<ApiRecord[]>("/admin/donations", { token }),
  getDonation: (token: string, id: string) => apiRequest<ApiRecord>(`/admin/donations/${id}`, { token }),
  updateDonationStatus: (token: string, id: string, body: { status: DonationStatus }) =>
    apiRequest<ApiRecord>(`/admin/donations/${id}/status`, { method: "PATCH", body, token }),
  listInventory: (token: string) => apiRequest<ApiRecord[]>("/admin/inventory", { token }),
  getInventoryItem: (token: string, id: string) =>
    apiRequest<ApiRecord>(`/admin/inventory/${id}`, { token }),
  createInventoryItem: (token: string, body: InventoryPayload) =>
    apiRequest<ApiRecord>("/admin/inventory", { method: "POST", body, token }),
  updateInventoryItem: (token: string, id: string, body: Partial<InventoryPayload>) =>
    apiRequest<ApiRecord>(`/admin/inventory/${id}`, { method: "PATCH", body, token }),
  createSupportTicketFromInventory: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<ApiRecord>(`/admin/inventory/${id}/support-ticket`, { method: "POST", body, token }),
  createRepairTicketFromInventory: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<AdminRepairTicket>(`/admin/inventory/${id}/repair-ticket`, { method: "POST", body, token }),
  deleteInventoryItem: (token: string, id: string) =>
    apiRequest<{ id: string; deleted: boolean }>(`/admin/inventory/${id}`, {
      method: "DELETE",
      token
    }),
  getImpact: (token?: string) => apiRequest<ImpactStats>("/impact", token ? { token } : {}),
  updateImpact: (token: string, body: Partial<ImpactStats>) =>
    apiRequest<ImpactStats>("/admin/impact", { method: "PATCH", body, token }),
  listDeployments: (token: string) => apiRequest<ApiRecord[]>("/admin/deployments", { token }),
  createDeployment: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<ApiRecord>("/admin/deployments", { method: "POST", body, token }),
  updateDeployment: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<ApiRecord>(`/admin/deployments/${id}`, { method: "PATCH", body, token }),
  convertDeviceRequestToDeployment: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<ApiRecord>(`/admin/device-requests/${id}/convert-deployment`, { method: "POST", body, token }),
  createQuoteDraft: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<ApiRecord>(`/admin/device-requests/${id}/quote`, { method: "POST", body, token }),
  reserveInventoryForRequest: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<ApiRecord>(`/admin/device-requests/${id}/reserve`, { method: "POST", body, token }),
  getRecyclingOperations: async (token: string) =>
    normaliseRecyclingOperations(await apiRequest<AdminRecyclingRecord[] | AdminRecyclingListResponse>("/admin/recycling", { token })),
  listRecycling: async (token: string) =>
    (await adminApi.getRecyclingOperations(token)).records,
  createRecycling: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRecyclingRecord>("/admin/recycling", { method: "POST", body, token }),
  updateRecycling: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRecyclingRecord>(`/admin/recycling/${id}`, { method: "PATCH", body, token }),
  uploadRecyclingAttachment: (token: string, id: string, body: FormData) =>
    apiUpload<AdminRecyclingRecord>(`/admin/recycling/${id}/attachments`, token, body),
  recommendRecyclingRoute: (token: string, id: string) =>
    apiRequest<AdminRecyclingRecord>(`/admin/recycling/${id}/recommendation`, { method: "POST", token }),
  generateRecyclingReportPack: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<AdminRecyclingRecord>(`/admin/recycling/${id}/report-pack`, { method: "POST", body, token }),
  listRecyclingPartners: (token: string) => apiRequest<AdminRecyclingPartner[]>("/admin/recycling-partners", { token }),
  createRecyclingPartner: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRecyclingPartner>("/admin/recycling-partners", { method: "POST", body, token }),
  updateRecyclingPartner: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRecyclingPartner>(`/admin/recycling-partners/${id}`, { method: "PATCH", body, token }),
  scheduleDonationCollection: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<ApiRecord>(`/admin/donations/${id}/schedule-collection`, { method: "POST", body, token }),
  getSupportOperations: async (token: string) =>
    normaliseSupportOperations(await apiRequest<SupportTicket[] | SupportListResponse>("/admin/support", { token })),
  listSupportTickets: async (token: string) =>
    (await adminApi.getSupportOperations(token)).tickets,
  getSupportTicket: (token: string, id: string) =>
    apiRequest<SupportTicket>(`/admin/support/${id}`, { token }),
  createSupportTicket: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<SupportTicket>("/admin/support", { method: "POST", body, token }),
  updateSupportTicket: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<SupportTicket>(`/admin/support/${id}`, { method: "PATCH", body, token }),
  assignSupportTicket: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<SupportTicket>(`/admin/support/${id}/assign`, { method: "POST", body, token }),
  escalateSupportTicket: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<SupportTicket>(`/admin/support/${id}/escalate`, { method: "POST", body, token }),
  closeSupportTicket: (token: string, id: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<SupportTicket>(`/admin/support/${id}/close`, { method: "POST", body, token }),
  linkSupportRecord: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<SupportTicket>(`/admin/support/${id}/link-record`, { method: "POST", body, token }),
  getRepairOperations: async (token: string) =>
    normaliseRepairOperations(await apiRequest<AdminRepairTicket[] | AdminRepairListResponse>("/admin/repairs", { token })),
  listRepairTickets: async (token: string) =>
    (await adminApi.getRepairOperations(token)).tickets,
  createRepairTicket: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRepairTicket>("/admin/repairs", { method: "POST", body, token }),
  updateRepairTicket: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRepairTicket>(`/admin/repairs/${id}`, { method: "PATCH", body, token }),
  uploadRepairAttachment: (token: string, id: string, body: FormData) =>
    apiUpload<AdminRepairTicket>(`/admin/repairs/${id}/attachments`, token, body),
  triageRepairTicket: (token: string, id: string) =>
    apiRequest<AdminRepairTicket>(`/admin/repairs/${id}/triage`, { method: "POST", token }),
  listRepairParts: (token: string) => apiRequest<AdminRepairPart[]>("/admin/repair-parts", { token }),
  createRepairPart: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRepairPart>("/admin/repair-parts", { method: "POST", body, token }),
  updateRepairPart: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRepairPart>(`/admin/repair-parts/${id}`, { method: "PATCH", body, token }),
  listRepairTechnicians: (token: string) => apiRequest<AdminRepairTechnician[]>("/admin/repair-technicians", { token }),
  createRepairTechnician: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRepairTechnician>("/admin/repair-technicians", { method: "POST", body, token }),
  updateRepairTechnician: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<AdminRepairTechnician>(`/admin/repair-technicians/${id}`, { method: "PATCH", body, token }),
  listNotifications: (token: string) => apiRequest<ApiRecord[]>("/admin/notifications", { token }),
  createNotification: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<ApiRecord>("/admin/notifications", { method: "POST", body, token }),
  markNotificationRead: (token: string, id: string) =>
    apiRequest<ApiRecord>(`/admin/notifications/${id}/read`, { method: "POST", token }),
  markNotificationUnread: (token: string, id: string) =>
    apiRequest<ApiRecord>(`/admin/notifications/${id}/unread`, { method: "POST", token }),
  retryNotification: (token: string, id: string) =>
    apiRequest<ApiRecord>(`/admin/notifications/${id}/retry`, { method: "POST", token }),
  listSavedViews: (token: string, workspace?: string) => {
    const query = workspace ? `?workspace=${encodeURIComponent(workspace)}` : "";
    return apiRequest<ApiRecord[]>(`/admin/saved-views${query}`, { token });
  },
  createSavedView: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<ApiRecord>("/admin/saved-views", { method: "POST", body, token }),
  updateSavedView: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<ApiRecord>(`/admin/saved-views/${id}`, { method: "PATCH", body, token }),
  deleteSavedView: (token: string, id: string) =>
    apiRequest<{ id: string; deleted: boolean }>(`/admin/saved-views/${id}`, { method: "DELETE", token }),
  getSuccessStoryOperations: async (token: string) =>
    normaliseSuccessStories(await apiRequest<SuccessStory[] | SuccessStoryListResponse>("/admin/success-stories", { token })),
  listSuccessStories: async (token: string) =>
    (await adminApi.getSuccessStoryOperations(token)).stories,
  createSuccessStory: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<SuccessStory>("/admin/success-stories", { method: "POST", body, token }),
  updateSuccessStory: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<SuccessStory>(`/admin/success-stories/${id}`, { method: "PATCH", body, token }),
  deleteSuccessStory: (token: string, id: string) =>
    apiRequest<{ id: string; deleted: boolean }>(`/admin/success-stories/${id}`, { method: "DELETE", token }),
  publishSuccessStory: (token: string, id: string) =>
    apiRequest<SuccessStory>(`/admin/success-stories/${id}/publish`, { method: "POST", token }),
  unpublishSuccessStory: (token: string, id: string) =>
    apiRequest<SuccessStory>(`/admin/success-stories/${id}/unpublish`, { method: "POST", token }),
  featureSuccessStory: (token: string, id: string) =>
    apiRequest<SuccessStory>(`/admin/success-stories/${id}/feature`, { method: "POST", token }),
  generateSuccessStoryDraft: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<SuccessStoryDraftResponse>("/admin/success-stories/ai-draft", { method: "POST", body, token }),
  seedSuccessStories: (token: string) =>
    apiRequest<SuccessStory[]>("/admin/success-stories/seed", { method: "POST", token }),
  getTrainingCohortOperations: async (token: string) =>
    normaliseTrainingCohorts(await apiRequest<TrainingCohort[] | TrainingCohortListResponse>("/admin/training-cohorts", { token })),
  listTrainingCohorts: async (token: string) =>
    (await adminApi.getTrainingCohortOperations(token)).cohorts,
  getTrainingCohort: (token: string, id: string) =>
    apiRequest<TrainingCohort>(`/admin/training-cohorts/${id}`, { token }),
  createTrainingCohort: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<TrainingCohort>("/admin/training-cohorts", { method: "POST", body, token }),
  updateTrainingCohort: (token: string, id: string, body: EcosystemRecordPayload) =>
    apiRequest<TrainingCohort>(`/admin/training-cohorts/${id}`, { method: "PATCH", body, token }),
  importTrainingLearners: (token: string, id: string, body: FormData) =>
    apiUpload<TrainingCohort>(`/admin/training-cohorts/${id}/import-learners`, token, body),
  generateTrainingCertificates: (token: string, id: string) =>
    apiRequest<TrainingCohort>(`/admin/training-cohorts/${id}/generate-certificates`, { method: "POST", token }),
  markTrainingCohortActive: (token: string, id: string) =>
    apiRequest<TrainingCohort>(`/admin/training-cohorts/${id}/mark-active`, { method: "POST", token }),
  completeTrainingCohort: (token: string, id: string) =>
    apiRequest<TrainingCohort>(`/admin/training-cohorts/${id}/complete`, { method: "POST", token }),
  exportTrainingRegister: (token: string, id: string) =>
    apiRequest<TrainingExportResponse>(`/admin/training-cohorts/${id}/export-register`, { token }),
  getSustainabilityReportOperations: async (token: string) =>
    normaliseSustainabilityReports(await apiRequest<SustainabilityReport[] | SustainabilityReportListResponse>("/admin/sustainability-reports", { token })),
  listSustainabilityReports: async (token: string) =>
    (await adminApi.getSustainabilityReportOperations(token)).reports,
  createSustainabilityReport: (token: string, body: EcosystemRecordPayload) =>
    apiRequest<SustainabilityReport>("/admin/sustainability-reports", { method: "POST", body, token }),
  generateSustainabilityReport: (token: string, body: EcosystemRecordPayload = {}) =>
    apiRequest<SustainabilityReport>("/admin/sustainability-reports/generate", { method: "POST", body, token }),
  getSustainabilityReport: (token: string, id: string) =>
    apiRequest<SustainabilityReport>(`/admin/sustainability-reports/${id}`, { token }),
  exportSustainabilityReportPdf: (token: string, id: string) =>
    apiRequest<SustainabilityExportResponse>(`/admin/sustainability-reports/${id}/export/pdf`, { token }),
  exportSustainabilityReportCsv: (token: string, id: string) =>
    apiRequest<SustainabilityExportResponse>(`/admin/sustainability-reports/${id}/export/csv`, { token }),
  search: (token: string, q: string) =>
    apiRequest<ApiRecord[]>(`/admin/search?q=${encodeURIComponent(q)}`, { token }),
  setUserClaims: (token: string, uid: string, claims: AdminClaimPayload) =>
    apiRequest<ApiRecord>(`/admin/users/${uid}/claims`, {
      method: "POST",
      body: { claims },
      token
    }),
  listAuditLogs: (token: string, resourceType?: string, resourceId?: string) => {
    const params = new URLSearchParams();
    if (resourceType) params.set("resourceType", resourceType);
    if (resourceId) params.set("resourceId", resourceId);
    const query = params.toString() ? `?${params}` : "";
    return apiRequest<ApiRecord[]>(`/admin/audit-logs${query}`, { token });
  }
};
