import { AuditService } from "../audit/audit.service";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuthenticatedRequest } from "../common/types";
import type { AdminCreateDonationDto } from "./dto/admin-create-donation.dto";
import type { CreateDonationDto } from "./dto/create-donation.dto";
import type { UpdateDonationDto } from "./dto/update-donation.dto";
import type { UpdateDonationStatusDto } from "./dto/update-donation-status.dto";
export declare class DonationsService {
    private readonly repository;
    private readonly auditService;
    constructor(repository: FirestoreRepository, auditService: AuditService);
    create(dto: CreateDonationDto): Promise<Record<string, unknown> & {
        id: string;
    }>;
    createAdmin(dto: AdminCreateDonationDto, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    list(): Promise<unknown[]>;
    findById(id: string): Promise<unknown>;
    updateStatus(id: string, dto: UpdateDonationStatusDto, request: AuthenticatedRequest): Promise<unknown>;
    update(id: string, dto: UpdateDonationDto, request: AuthenticatedRequest): Promise<unknown>;
}
