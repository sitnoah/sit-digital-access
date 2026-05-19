import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { sanitizePayload } from "../common/sanitize";
import type { AuthenticatedRequest } from "../common/types";
import type { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import type { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";

@Injectable()
export class InventoryService {
  constructor(
    private readonly repository: FirestoreRepository,
    private readonly auditService: AuditService
  ) {}

  async list() {
    return this.repository.list(COLLECTIONS.inventory);
  }

  async create(dto: CreateInventoryItemDto, request: AuthenticatedRequest) {
    const after = await this.repository.create(
      COLLECTIONS.inventory,
      sanitizePayload({
        ...dto,
        processor: dto.processor ?? null,
        ram: dto.ram ?? null,
        storage: dto.storage ?? null,
        assignedTo: dto.assignedTo ?? null,
        costPrice: dto.costPrice ?? null,
        suggestedPrice: dto.suggestedPrice ?? null,
        warrantyMonths: dto.warrantyMonths ?? null,
        africaReady: dto.africaReady ?? false,
        lowPowerSuitable: dto.lowPowerSuitable ?? false,
        labBundleReady: dto.labBundleReady ?? false,
        notes: dto.notes ?? null,
        lifecycle: dto.lifecycle ?? null,
        supportHistory: dto.supportHistory ?? [],
        metadata: dto.metadata ?? null
      })
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "CREATE_INVENTORY_ITEM",
      resourceType: COLLECTIONS.inventory,
      resourceId: after.id as string,
      before: null,
      after
    });

    return after;
  }

  async findById(id: string) {
    return this.repository.findById(COLLECTIONS.inventory, id);
  }

  async update(id: string, dto: UpdateInventoryItemDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.inventory, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_INVENTORY_ITEM",
      resourceType: COLLECTIONS.inventory,
      resourceId: id,
      before,
      after
    });

    return after;
  }

  async delete(id: string, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    await this.repository.delete(COLLECTIONS.inventory, id);

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "DELETE_INVENTORY_ITEM",
      resourceType: COLLECTIONS.inventory,
      resourceId: id,
      before,
      after: null
    });
  }
}
