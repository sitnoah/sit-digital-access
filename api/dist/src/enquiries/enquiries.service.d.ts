import { AuditService } from "../audit/audit.service";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuthenticatedRequest } from "../common/types";
import type { AdminCreateEnquiryDto } from "./dto/admin-create-enquiry.dto";
import type { CreateEnquiryDto } from "./dto/create-enquiry.dto";
import type { UpdateEnquiryDto } from "./dto/update-enquiry.dto";
import type { UpdateEnquiryStatusDto } from "./dto/update-enquiry-status.dto";
export declare class EnquiriesService {
    private readonly repository;
    private readonly auditService;
    constructor(repository: FirestoreRepository, auditService: AuditService);
    create(dto: CreateEnquiryDto): Promise<Record<string, unknown> & {
        id: string;
    }>;
    createAdmin(dto: AdminCreateEnquiryDto, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    list(): Promise<unknown[]>;
    findById(id: string): Promise<unknown>;
    updateStatus(id: string, dto: UpdateEnquiryStatusDto, request: AuthenticatedRequest): Promise<unknown>;
    update(id: string, dto: UpdateEnquiryDto, request: AuthenticatedRequest): Promise<unknown>;
}
