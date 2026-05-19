import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { sanitizePayload } from "../common/sanitize";
import type { AuthenticatedRequest } from "../common/types";
import type { AdminCreateDeviceRequestDto } from "./dto/admin-create-device-request.dto";
import type { CreateDeviceRequestDto } from "./dto/create-device-request.dto";
import type { UpdateDeviceRequestDto } from "./dto/update-device-request.dto";
import type { UpdateDeviceRequestStatusDto } from "./dto/update-device-request-status.dto";
import { DeviceRequestPriority, DeviceRequestStatus } from "./device-request.enums";

@Injectable()
export class DeviceRequestsService {
  constructor(
    private readonly repository: FirestoreRepository,
    private readonly auditService: AuditService
  ) {}

  async create(dto: CreateDeviceRequestDto) {
    return this.repository.create(
      COLLECTIONS.deviceRequests,
      sanitizePayload({
        ...dto,
        phone: dto.phone ?? null,
        budgetRange: dto.budgetRange ?? null,
        productSlug: dto.productSlug ?? null,
        requiredBy: dto.requiredBy ?? null,
        notes: dto.notes ?? null,
        status: DeviceRequestStatus.NEW,
        priority: DeviceRequestPriority.MEDIUM
      })
    );
  }

  async createAdmin(dto: AdminCreateDeviceRequestDto, request: AuthenticatedRequest) {
    const record = await this.repository.create(
      COLLECTIONS.deviceRequests,
      sanitizePayload({
        ...dto,
        phone: dto.phone ?? null,
        budgetRange: dto.budgetRange ?? null,
        productSlug: dto.productSlug ?? null,
        requiredBy: dto.requiredBy ?? null,
        notes: dto.notes ?? null,
        assignedOwner: dto.assignedOwner ?? null,
        internalNotes: dto.internalNotes ?? null,
        fulfilmentPlan: dto.fulfilmentPlan ?? null,
        deploymentType: dto.deploymentType ?? null,
        metadata: dto.metadata ?? null,
        status: DeviceRequestStatus.NEW,
        priority: dto.priority ?? DeviceRequestPriority.MEDIUM
      })
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "CREATE_DEVICE_REQUEST",
      resourceType: COLLECTIONS.deviceRequests,
      resourceId: record.id,
      before: null,
      after: record
    });

    return record;
  }

  async list() {
    return this.repository.list(COLLECTIONS.deviceRequests);
  }

  async findById(id: string) {
    return this.repository.findById(COLLECTIONS.deviceRequests, id);
  }

  async updateStatus(id: string, dto: UpdateDeviceRequestStatusDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.deviceRequests, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_DEVICE_REQUEST_STATUS",
      resourceType: COLLECTIONS.deviceRequests,
      resourceId: id,
      before,
      after
    });

    return after;
  }

  async update(id: string, dto: UpdateDeviceRequestDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.deviceRequests, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_DEVICE_REQUEST",
      resourceType: COLLECTIONS.deviceRequests,
      resourceId: id,
      before,
      after
    });

    return after;
  }
}
