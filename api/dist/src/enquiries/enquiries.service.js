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
exports.EnquiriesService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
const enquiry_enums_1 = require("./enquiry.enums");
let EnquiriesService = class EnquiriesService {
    repository;
    auditService;
    constructor(repository, auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }
    async create(dto) {
        return this.repository.create(constants_1.COLLECTIONS.enquiries, (0, sanitize_1.sanitizePayload)({
            ...dto,
            organisation: dto.organisation ?? null,
            phone: dto.phone ?? null,
            status: enquiry_enums_1.EnquiryStatus.NEW,
            priority: dto.priority ?? enquiry_enums_1.EnquiryPriority.MEDIUM
        }));
    }
    async createAdmin(dto, request) {
        const record = await this.repository.create(constants_1.COLLECTIONS.enquiries, (0, sanitize_1.sanitizePayload)({
            ...dto,
            organisation: dto.organisation ?? null,
            phone: dto.phone ?? null,
            assignedOwner: dto.assignedOwner ?? null,
            internalNotes: dto.internalNotes ?? null,
            sourcePage: dto.sourcePage ?? "admin",
            metadata: dto.metadata ?? null,
            status: enquiry_enums_1.EnquiryStatus.NEW,
            priority: dto.priority ?? enquiry_enums_1.EnquiryPriority.MEDIUM
        }));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "CREATE_ENQUIRY",
            resourceType: constants_1.COLLECTIONS.enquiries,
            resourceId: record.id,
            before: null,
            after: record
        });
        return record;
    }
    async list() {
        return this.repository.list(constants_1.COLLECTIONS.enquiries);
    }
    async findById(id) {
        return this.repository.findById(constants_1.COLLECTIONS.enquiries, id);
    }
    async updateStatus(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.enquiries, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_ENQUIRY_STATUS",
            resourceType: constants_1.COLLECTIONS.enquiries,
            resourceId: id,
            before,
            after
        });
        return after;
    }
    async update(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.enquiries, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_ENQUIRY",
            resourceType: constants_1.COLLECTIONS.enquiries,
            resourceId: id,
            before,
            after
        });
        return after;
    }
};
exports.EnquiriesService = EnquiriesService;
exports.EnquiriesService = EnquiriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService])
], EnquiriesService);
//# sourceMappingURL=enquiries.service.js.map