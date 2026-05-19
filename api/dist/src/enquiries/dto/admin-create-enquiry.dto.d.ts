import { CreateEnquiryDto } from "./create-enquiry.dto";
export declare class AdminCreateEnquiryDto extends CreateEnquiryDto {
    assignedOwner?: string;
    internalNotes?: string;
    sourcePage?: string;
    metadata?: Record<string, unknown>;
}
