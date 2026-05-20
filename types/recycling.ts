export const recyclingStatuses = [
  "INTAKE_CREATED",
  "COLLECTION_SCHEDULED",
  "COLLECTED",
  "SECURE_WIPE_PENDING",
  "SECURE_WIPE_COMPLETE",
  "ASSESSMENT",
  "REFURBISH_APPROVED",
  "RECYCLE_APPROVED",
  "ESG_EVIDENCE_READY",
  "COMPLETED"
] as const;

export type RecyclingStatus = (typeof recyclingStatuses)[number];

export type RecyclingAttachment = {
  id: string;
  evidenceType?: string;
  filename: string;
  originalFilename?: string;
  contentType?: string;
  size?: number;
  storagePath?: string;
  downloadUrl?: string;
  uploadedByEmail?: string | null;
  uploadedAt?: string;
};

export type RecyclingTimelineEntry = {
  id: string;
  type: string;
  title: string;
  metadata?: Record<string, unknown>;
  actorEmail?: string | null;
  createdAt?: string;
};

export type RecyclingAiRecommendation = {
  summary?: string;
  recommendation?: string;
  reason?: string;
  refurbishmentCostEstimate?: number;
  partsValueEstimate?: number;
  africaDeploymentSuitability?: string;
  riskFlags?: string[];
  confidence?: number;
  provider?: "openai" | "heuristic" | string;
  model?: string;
  generatedAt?: string;
};

export type RecyclingReportPack = {
  id: string;
  title?: string;
  generatedAt?: string;
  generatedByEmail?: string | null;
  pdf?: {
    filename?: string;
    downloadUrl?: string;
    storagePath?: string;
  };
  csv?: {
    filename?: string;
    downloadUrl?: string;
    storagePath?: string;
  };
};

export type AdminRecyclingRecord = Record<string, unknown> & {
  id: string;
  recyclingReference?: string;
  title?: string | null;
  summary?: string | null;
  status?: RecyclingStatus | string | null;
  priority?: string | null;
  donorOrganisation?: string | null;
  organisation?: string | null;
  contactPerson?: string | null;
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
  collectionRoute?: string | null;
  pickupAddress?: string | null;
  pickupLocation?: string | null;
  collectionDate?: string | null;
  driverStatus?: string | null;
  logisticsStatus?: string | null;
  recyclingPartnerId?: string | null;
  partnerName?: string | null;
  deviceQuantity?: number;
  deviceCount?: number;
  devicesDiverted?: number;
  assetTypes?: unknown[];
  dataBearingDeviceCount?: number;
  dataBearingDevicesCount?: number;
  estimatedWeightKg?: number;
  estimatedCo2KgAvoided?: number;
  estimatedCo2SavedKg?: number;
  chainOfCustodyRequired?: boolean;
  secureWipeRequired?: boolean;
  esgReportRequired?: boolean;
  secureWipeStatus?: string | null;
  wipeCertificateStatus?: string | null;
  assignedTechnician?: string | null;
  assignedTechnicianId?: string | null;
  reuseRecycleDecision?: string | null;
  reuseDecision?: string | null;
  deviceCondition?: string | null;
  refurbishmentCostEstimate?: number;
  partsValueEstimate?: number;
  africaDeploymentSuitability?: string | null;
  aiRecommendation?: RecyclingAiRecommendation;
  attachments?: RecyclingAttachment[];
  timeline?: RecyclingTimelineEntry[];
  chainOfCustodyLog?: RecyclingTimelineEntry[];
  secureWipeChecklist?: Array<{ id?: string; label?: string; completed?: boolean }>;
  reportPacks?: RecyclingReportPack[];
  notes?: string | null;
  internalNotes?: string | null;
  donationId?: string | null;
  inventoryId?: string | null;
  repairId?: string | null;
  deploymentId?: string | null;
  sustainabilityReportId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminRecyclingSummary = {
  totalRecords: number;
  devicesDiverted: number;
  estimatedCo2KgAvoided: number;
  processing: number;
  secureWipePending: number;
  esgEvidenceReady: number;
  overdueCollections: number;
  partnersActive: number;
};

export type AdminRecyclingListResponse = {
  records: AdminRecyclingRecord[];
  summary: AdminRecyclingSummary;
};

export type AdminRecyclingPartner = Record<string, unknown> & {
  id: string;
  name?: string | null;
  organisation?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  region?: string | null;
  status?: string | null;
  pickupPerformance?: number;
  complianceDocuments?: unknown[];
  certifications?: unknown[];
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
