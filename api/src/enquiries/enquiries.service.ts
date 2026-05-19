import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { sanitizePayload } from "../common/sanitize";
import type { AuthenticatedRequest } from "../common/types";
import type { AdminCreateEnquiryDto } from "./dto/admin-create-enquiry.dto";
import type { CreateEnquiryDto } from "./dto/create-enquiry.dto";
import type { UpdateEnquiryDto } from "./dto/update-enquiry.dto";
import type { UpdateEnquiryStatusDto } from "./dto/update-enquiry-status.dto";
import { EnquiryPriority, EnquiryStatus } from "./enquiry.enums";

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly repository: FirestoreRepository,
    private readonly auditService: AuditService
  ) {}

  async create(dto: CreateEnquiryDto) {
    return this.repository.create(
      COLLECTIONS.enquiries,
      sanitizePayload({
        ...dto,
        organisation: dto.organisation ?? null,
        phone: dto.phone ?? null,
        status: EnquiryStatus.NEW,
        priority: dto.priority ?? EnquiryPriority.MEDIUM
      })
    );
  }

  async createAdmin(dto: AdminCreateEnquiryDto, request: AuthenticatedRequest) {
    const record = await this.repository.create(
      COLLECTIONS.enquiries,
      sanitizePayload({
        ...dto,
        organisation: dto.organisation ?? null,
        phone: dto.phone ?? null,
        assignedOwner: dto.assignedOwner ?? null,
        internalNotes: dto.internalNotes ?? null,
        sourcePage: dto.sourcePage ?? "admin",
        metadata: dto.metadata ?? null,
        status: EnquiryStatus.NEW,
        priority: dto.priority ?? EnquiryPriority.MEDIUM
      })
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "CREATE_ENQUIRY",
      resourceType: COLLECTIONS.enquiries,
      resourceId: record.id,
      before: null,
      after: record
    });

    return record;
  }

  async list() {
    return this.repository.list(COLLECTIONS.enquiries);
  }

  async findById(id: string) {
    return this.repository.findById(COLLECTIONS.enquiries, id);
  }

  async updateStatus(id: string, dto: UpdateEnquiryStatusDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.enquiries, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_ENQUIRY_STATUS",
      resourceType: COLLECTIONS.enquiries,
      resourceId: id,
      before,
      after
    });

    return after;
  }

  async update(id: string, dto: UpdateEnquiryDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.enquiries, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_ENQUIRY",
      resourceType: COLLECTIONS.enquiries,
      resourceId: id,
      before,
      after
    });

    return after;
  }
}
