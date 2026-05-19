import { AuditService } from "../audit/audit.service";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuthenticatedRequest } from "../common/types";
import type { AdminCreateDeviceRequestDto } from "./dto/admin-create-device-request.dto";
import type { CreateDeviceRequestDto } from "./dto/create-device-request.dto";
import type { UpdateDeviceRequestDto } from "./dto/update-device-request.dto";
import type { UpdateDeviceRequestStatusDto } from "./dto/update-device-request-status.dto";
export declare class DeviceRequestsService {
    private readonly repository;
    private readonly auditService;
    constructor(repository: FirestoreRepository, auditService: AuditService);
    create(dto: CreateDeviceRequestDto): Promise<Record<string, unknown> & {
        id: string;
    }>;
    createAdmin(dto: AdminCreateDeviceRequestDto, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    list(): Promise<unknown[]>;
    findById(id: string): Promise<unknown>;
    updateStatus(id: string, dto: UpdateDeviceRequestStatusDto, request: AuthenticatedRequest): Promise<unknown>;
    update(id: string, dto: UpdateDeviceRequestDto, request: AuthenticatedRequest): Promise<unknown>;
}
