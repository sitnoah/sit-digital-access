import type { RepairTicketStatus } from "@/types/repair";

export type RepairStatusActionType =
  | "APPROVE_ESTIMATE"
  | "UPLOAD_INFORMATION"
  | "CONTACT_REPAIR_OPERATIONS"
  | "BOOK_ANOTHER_REPAIR"
  | "DOWNLOAD_SUMMARY";

export type RepairStatusTimelineItem = {
  status: RepairTicketStatus;
  label: string;
  publicNote: string;
  timestamp?: string | null;
  completed: boolean;
  active?: boolean;
};

export type RepairStatusCustomerAction = {
  type: RepairStatusActionType;
  label: string;
  enabled: boolean;
  href?: string | null;
  description?: string | null;
};

export type RepairStatusResult = {
  ticketId: string;
  deviceType?: string | null;
  brand?: string | null;
  model?: string | null;
  repairCategory?: string | null;
  status: RepairTicketStatus;
  publicStatusLabel: string;
  publicMessage: string;
  nextStep: string;
  progressPercent: number;
  repairRoute?: string | null;
  location?: string | null;
  customerActionRequired: boolean;
  estimatedTurnaround?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  timeline: RepairStatusTimelineItem[];
  customerActions: RepairStatusCustomerAction[];
};

export type RepairStatusErrorCode =
  | "MISSING_API"
  | "INVALID_LOOKUP"
  | "TOKEN_EXPIRED"
  | "SERVER_ERROR"
  | "NETWORK_ERROR";

export class RepairStatusError extends Error {
  code: RepairStatusErrorCode;

  constructor(code: RepairStatusErrorCode, message: string) {
    super(message);
    this.name = "RepairStatusError";
    this.code = code;
  }
}
