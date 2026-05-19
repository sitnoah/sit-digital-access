"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationsService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
const donation_enums_1 = require("./donation.enums");
let DonationsService = class DonationsService {
    repository;
    auditService;
    constructor(repository, auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }
    async create(dto) {
        return this.repository.create(constants_1.COLLECTIONS.donations, (0, sanitize_1.sanitizePayload)({
            ...dto,
            organisation: dto.organisation ?? null,
            phone: dto.phone ?? null,
            deviceCount: dto.deviceCount ?? null,
            deviceCondition: dto.deviceCondition ?? null,
            pickupLocation: dto.pickupLocation ?? null,
            sponsorshipAmount: dto.sponsorshipAmount ?? null,
            preferredTimeline: dto.preferredTimeline ?? null,
            message: dto.message ?? null,
            priority: donation_enums_1.DonationPriority.MEDIUM,
            status: donation_enums_1.DonationStatus.NEW
        }));
    }
    async createAdmin(dto, request) {
        const created = await this.repository.create(constants_1.COLLECTIONS.donations, (0, sanitize_1.sanitizePayload)({
            ...dto,
            organisation: dto.organisation ?? null,
            phone: dto.phone ?? null,
            deviceCount: dto.deviceCount ?? null,
            deviceCondition: dto.deviceCondition ?? null,
            pickupLocation: dto.pickupLocation ?? null,
            sponsorshipAmount: dto.sponsorshipAmount ?? null,
            preferredTimeline: dto.preferredTimeline ?? null,
            message: dto.message ?? null,
            priority: dto.priority ?? donation_enums_1.DonationPriority.MEDIUM,
            assignedOwner: dto.assignedOwner ?? null,
            internalNotes: dto.internalNotes ?? null,
            collectionPlan: dto.collectionPlan ?? null,
            sponsorshipPlan: dto.sponsorshipPlan ?? null,
            metadata: dto.metadata ?? null,
            status: donation_enums_1.DonationStatus.NEW
        }));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "CREATE_DONATION",
            resourceType: constants_1.COLLECTIONS.donations,
            resourceId: created.id,
            before: null,
            after: created
        });
        return created;
    }
    async list() {
        return this.repository.list(constants_1.COLLECTIONS.donations);
    }
    async findById(id) {
        return this.repository.findById(constants_1.COLLECTIONS.donations, id);
    }
    async updateStatus(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.donations, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_DONATION_STATUS",
            resourceType: constants_1.COLLECTIONS.donations,
            resourceId: id,
            before,
            after
        });
        return after;
    }
    async update(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.donations, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_DONATION",
            resourceType: constants_1.COLLECTIONS.donations,
            resourceId: id,
            before,
            after
        });
        return after;
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService])
], DonationsService);
//# sourceMappingURL=donations.service.js.map