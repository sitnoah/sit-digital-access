import type { AuthenticatedRequest } from "../common/types";
import { AdminCreateEnquiryDto } from "./dto/admin-create-enquiry.dto";
import { CreateEnquiryDto } from "./dto/create-enquiry.dto";
import { UpdateEnquiryDto } from "./dto/update-enquiry.dto";
import { UpdateEnquiryStatusDto } from "./dto/update-enquiry-status.dto";
import { EnquiriesService } from "./enquiries.service";
export declare class EnquiriesController {
    private readonly enquiriesService;
    constructor(enquiriesService: EnquiriesService);
    create(dto: CreateEnquiryDto): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    adminCreate(dto: AdminCreateEnquiryDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    list(): Promise<{
        data: unknown[];
    }>;
    findById(id: string): Promise<{
        data: unknown;
    }>;
    updateStatus(id: string, dto: UpdateEnquiryStatusDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    update(id: string, dto: UpdateEnquiryDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
}
