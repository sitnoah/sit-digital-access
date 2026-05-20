export type SupportTicketStatus =
  | "NEW"
  | "OPEN"
  | "AWAITING_CUSTOMER"
  | "AWAITING_INTERNAL"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type SupportTicketCategory =
  | "GENERAL_ENQUIRY"
  | "DEVICE_REQUEST"
  | "DONATION_SUPPORT"
  | "INVENTORY_ISSUE"
  | "REPAIR_SUPPORT"
  | "RECYCLING_SUPPORT"
  | "DEPLOYMENT_SUPPORT"
  | "TRAINING_SUPPORT"
  | "ACCOUNT_ACCESS";

export type SupportTimelineEntry = {
  id?: string;
  type?: string;
  title?: string;
  createdAt?: string;
  actorEmail?: string | null;
  metadata?: Record<string, unknown>;
};

export type SupportInternalNote = {
  id?: string;
  note: string;
  createdAt?: string;
  author?: string | null;
};

export type SupportTicket = Record<string, unknown> & {
  id: string;
  reference?: string;
  supportReference?: string;
  title?: string;
  subject?: string;
  summary?: string;
  requesterName?: string | null;
  requesterEmail?: string | null;
  requesterPhone?: string | null;
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
  organisation?: string | null;
  category?: SupportTicketCategory | string;
  priority?: SupportTicketPriority | string;
  status?: SupportTicketStatus | string;
  channel?: string | null;
  description?: string;
  message?: string;
  internalNotes?: SupportInternalNote[] | string;
  internalNoteLog?: SupportInternalNote[];
  assignedTo?: string | null;
  assignedOwner?: string | null;
  owner?: string | null;
  linkedInventoryId?: string | null;
  linkedRepairTicketId?: string | null;
  linkedDonationId?: string | null;
  linkedDeploymentId?: string | null;
  inventoryId?: string | null;
  repairTicketId?: string | null;
  donationId?: string | null;
  deploymentId?: string | null;
  slaDueAt?: string | null;
  lastActivityAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  timeline?: SupportTimelineEntry[];
  attachments?: unknown[];
};

export type SupportSummary = {
  openTickets: number;
  highPriority: number;
  inventoryLinked: number;
  closedTickets: number;
  slaRisk: number;
  awaitingCustomer: number;
  escalated: number;
  repairLinked?: number;
};

export type SupportListResponse = {
  tickets: SupportTicket[];
  summary: SupportSummary;
};
