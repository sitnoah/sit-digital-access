import { EnquiryPriority, EnquiryStatus } from "../enquiry.enums";
export declare class UpdateEnquiryDto {
    status?: EnquiryStatus;
    priority?: EnquiryPriority;
    assignedOwner?: string;
    internalNotes?: string;
    sourcePage?: string;
    metadata?: Record<string, unknown>;
}
