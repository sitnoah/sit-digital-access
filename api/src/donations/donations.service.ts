import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { sanitizePayload } from "../common/sanitize";
import type { AuthenticatedRequest } from "../common/types";
import { DonationPriority, DonationStatus } from "./donation.enums";
import type { AdminCreateDonationDto } from "./dto/admin-create-donation.dto";
import type { CreateDonationDto } from "./dto/create-donation.dto";
import type { UpdateDonationDto } from "./dto/update-donation.dto";
import type { UpdateDonationStatusDto } from "./dto/update-donation-status.dto";

@Injectable()
export class DonationsService {
  constructor(
    private readonly repository: FirestoreRepository,
    private readonly auditService: AuditService
  ) {}

  async create(dto: CreateDonationDto) {
    return this.repository.create(
      COLLECTIONS.donations,
      sanitizePayload({
        ...dto,
        organisation: dto.organisation ?? null,
        phone: dto.phone ?? null,
        deviceCount: dto.deviceCount ?? null,
        deviceCondition: dto.deviceCondition ?? null,
        pickupLocation: dto.pickupLocation ?? null,
        sponsorshipAmount: dto.sponsorshipAmount ?? null,
        preferredTimeline: dto.preferredTimeline ?? null,
        message: dto.message ?? null,
        priority: DonationPriority.MEDIUM,
        status: DonationStatus.NEW
      })
    );
  }

  async createAdmin(dto: AdminCreateDonationDto, request: AuthenticatedRequest) {
    const created = await this.repository.create(
      COLLECTIONS.donations,
      sanitizePayload({
        ...dto,
        organisation: dto.organisation ?? null,
        phone: dto.phone ?? null,
        deviceCount: dto.deviceCount ?? null,
        deviceCondition: dto.deviceCondition ?? null,
        pickupLocation: dto.pickupLocation ?? null,
        sponsorshipAmount: dto.sponsorshipAmount ?? null,
        preferredTimeline: dto.preferredTimeline ?? null,
        message: dto.message ?? null,
        priority: dto.priority ?? DonationPriority.MEDIUM,
        assignedOwner: dto.assignedOwner ?? null,
        internalNotes: dto.internalNotes ?? null,
        collectionPlan: dto.collectionPlan ?? null,
        sponsorshipPlan: dto.sponsorshipPlan ?? null,
        metadata: dto.metadata ?? null,
        status: DonationStatus.NEW
      })
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "CREATE_DONATION",
      resourceType: COLLECTIONS.donations,
      resourceId: created.id,
      before: null,
      after: created
    });

    return created;
  }

  async list() {
    return this.repository.list(COLLECTIONS.donations);
  }

  async findById(id: string) {
    return this.repository.findById(COLLECTIONS.donations, id);
  }

  async updateStatus(id: string, dto: UpdateDonationStatusDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.donations, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_DONATION_STATUS",
      resourceType: COLLECTIONS.donations,
      resourceId: id,
      before,
      after
    });

    return after;
  }

  async update(id: string, dto: UpdateDonationDto, request: AuthenticatedRequest) {
    const before = await this.findById(id);
    const after = await this.repository.update(COLLECTIONS.donations, id, sanitizePayload(dto));

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_DONATION",
      resourceType: COLLECTIONS.donations,
      resourceId: id,
      before,
      after
    });

    return after;
  }
}
