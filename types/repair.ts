export const repairStatuses = [
  "NEW",
  "TRIAGE",
  "DIAGNOSTICS",
  "ESTIMATE_SENT",
  "AWAITING_APPROVAL",
  "REPAIR_IN_PROGRESS",
  "WAITING_FOR_PARTS",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
  "READY_FOR_RETURN",
  "COMPLETED",
  "CANCELLED",
  "UNREPAIRABLE"
] as const;

export type RepairTicketStatus = (typeof repairStatuses)[number];
export type RepairUrgency = "STANDARD" | "URGENT" | "SCHOOL_LAB_CRITICAL";
export type RepairRoute =
  | "DROP_OFF"
  | "MAIL_IN"
  | "PICKUP_REQUEST"
  | "PARTNER_HANDOVER"
  | "AFRICA_DEPLOYMENT_SUPPORT"
  | "BULK_SCHOOL_LAB_SUPPORT";
export type DeviceChargerIncluded = "yes" | "no";
export type PurchasedFromSit = "YES" | "NO" | "NOT_SURE";
export type PreferredContactMethod = "EMAIL" | "PHONE" | "WHATSAPP";

export type RepairBookingPayload = {
  customerName: string;
  email: string;
  phone?: string;
  organisation?: string;
  country?: string;
  location: string;
  deviceType: string;
  brand?: string;
  model?: string;
  assetTag?: string;
  repairCategory: string;
  serialNumber?: string;
  warrantyReference?: string;
  purchasedFromSit?: PurchasedFromSit;
  issueDescription: string;
  issueStartedAt?: string;
  damagedOrDropped?: boolean;
  dataRecoveryNeeded?: boolean;
  powersOn?: boolean;
  urgency: RepairUrgency;
  repairRoute: RepairRoute | string;
  repairRouteSlug?: string;
  preferredDropOffDate?: string;
  handoverNotes?: string;
  deviceChargerIncluded?: DeviceChargerIncluded;
  pickupAddress?: string;
  preferredPickupDate?: string;
  deviceCount?: number;
  organisationType?: string;
  accessInstructions?: string;
  batchRepairRequired?: boolean;
  preferredContactMethod: PreferredContactMethod;
  dataHandlingConsent: boolean;
  diagnosticAcknowledgement: boolean;
  mailIn?: boolean;
  pickupRequested?: boolean;
  message: string;
};

export type RepairBookingResponse = {
  id: string;
  ticketId: string;
  statusToken: string;
  status: RepairTicketStatus | string;
  createdAt?: string | null;
};

export type PublicRepairTimelineItem = {
  label: string;
  status: RepairTicketStatus;
  completed: boolean;
  active: boolean;
  date?: string | null;
  description?: string;
};

export type PublicRepairStatus = {
  id: string;
  status: RepairTicketStatus;
  priority?: string | null;
  repairCategory?: string | null;
  deviceType?: string | null;
  slaTargetHours?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  publicUpdates?: unknown[];
  timeline: PublicRepairTimelineItem[];
  nextStep: string;
};

export type AdminRepairTicket = {
  id: string;
  repairReference?: string | null;
  title?: string | null;
  summary?: string | null;
  message?: string | null;
  notes?: string | null;
  status: RepairTicketStatus | string;
  priority?: string | null;
  category?: string | null;
  repairCategory?: string | null;
  deviceType?: string | null;
  brand?: string | null;
  model?: string | null;
  organisation?: string | null;
  assetTag?: string | null;
  issueDescription?: string | null;
  urgency?: string | null;
  repairRoute?: string | null;
  repairRouteSlug?: string | null;
  preferredContactMethod?: string | null;
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  serialNumber?: string | null;
  warrantyReference?: string | null;
  faultCategory?: string | null;
  warrantyDecision?: string | null;
  reuseDecision?: string | null;
  estimatedValue?: number | null;
  estimatedCost?: number | null;
  approvedEstimate?: number | null;
  consentCaptured?: boolean | null;
  assignedOwner?: string | null;
  assignedTechnicianId?: string | null;
  inventoryId?: string | null;
  deviceRequestId?: string | null;
  deploymentId?: string | null;
  recyclingId?: string | null;
  sourceType?: string | null;
  channel?: string | null;
  slaTargetHours?: number | null;
  diagnostics?: Record<string, unknown> | null;
  aiTriage?: RepairAiTriage | Record<string, unknown> | null;
  diagnosticChecklist?: RepairDiagnosticChecklistItem[];
  partsRequired?: unknown[];
  requiredPartIds?: unknown[];
  attachments?: RepairAttachment[];
  timeline?: RepairTimelineEntry[];
  internalNotes?: string | null;
  customerCommunication?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

export type RepairAttachment = {
  id: string;
  filename: string;
  originalFilename?: string;
  contentType?: string;
  size?: number;
  storagePath?: string;
  downloadUrl?: string;
  uploadedByEmail?: string | null;
  uploadedAt?: string;
};

export type RepairTimelineEntry = {
  id: string;
  type: string;
  title: string;
  metadata?: Record<string, unknown>;
  actorEmail?: string | null;
  createdAt?: string;
};

export type RepairAiTriage = {
  summary?: string;
  likelyFault?: string;
  recommendedAction?: string;
  partsSuggestion?: string;
  riskFlags?: unknown[];
  confidence?: number;
  provider?: string;
  model?: string;
  generatedAt?: string;
};

export type RepairDiagnosticChecklistItem = {
  label: string;
  done?: boolean;
};

export type AdminRepairSummary = {
  active: number;
  awaitingApproval: number;
  slaRisk: number;
  techniciansAvailable: number;
  overdue: number;
  dueWithin24Hours: number;
  blockedByParts: number;
  unassigned: number;
};

export type AdminRepairListResponse = {
  tickets: AdminRepairTicket[];
  summary: AdminRepairSummary;
};

export type AdminRepairPart = {
  id: string;
  name?: string | null;
  title?: string | null;
  status?: string | null;
  category?: string | null;
  sku?: string | null;
  quantityAvailable?: number | null;
  reorderLevel?: number | null;
  supplier?: string | null;
  compatibleDevices?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

export type AdminRepairTechnician = {
  id: string;
  name?: string | null;
  email?: string | null;
  status?: string | null;
  skills?: unknown[];
  certifications?: unknown[];
  availability?: string | null;
  workload?: number | null;
  completionRate?: number | null;
  createdAt?: string;
  updatedAt?: string;
};
