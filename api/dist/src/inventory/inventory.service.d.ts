import { AuditService } from "../audit/audit.service";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuthenticatedRequest } from "../common/types";
import type { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import type { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";
export declare class InventoryService {
    private readonly repository;
    private readonly auditService;
    constructor(repository: FirestoreRepository, auditService: AuditService);
    list(): Promise<unknown[]>;
    create(dto: CreateInventoryItemDto, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    findById(id: string): Promise<unknown>;
    update(id: string, dto: UpdateInventoryItemDto, request: AuthenticatedRequest): Promise<unknown>;
    delete(id: string, request: AuthenticatedRequest): Promise<void>;
}
