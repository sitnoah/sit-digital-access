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
exports.DeviceRequestsService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
const device_request_enums_1 = require("./device-request.enums");
let DeviceRequestsService = class DeviceRequestsService {
    repository;
    auditService;
    constructor(repository, auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }
    async create(dto) {
        return this.repository.create(constants_1.COLLECTIONS.deviceRequests, (0, sanitize_1.sanitizePayload)({
            ...dto,
            phone: dto.phone ?? null,
            budgetRange: dto.budgetRange ?? null,
            productSlug: dto.productSlug ?? null,
            requiredBy: dto.requiredBy ?? null,
            notes: dto.notes ?? null,
            status: device_request_enums_1.DeviceRequestStatus.NEW,
            priority: device_request_enums_1.DeviceRequestPriority.MEDIUM
        }));
    }
    async createAdmin(dto, request) {
        const record = await this.repository.create(constants_1.COLLECTIONS.deviceRequests, (0, sanitize_1.sanitizePayload)({
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
            status: device_request_enums_1.DeviceRequestStatus.NEW,
            priority: dto.priority ?? device_request_enums_1.DeviceRequestPriority.MEDIUM
        }));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "CREATE_DEVICE_REQUEST",
            resourceType: constants_1.COLLECTIONS.deviceRequests,
            resourceId: record.id,
            before: null,
            after: record
        });
        return record;
    }
    async list() {
        return this.repository.list(constants_1.COLLECTIONS.deviceRequests);
    }
    async findById(id) {
        return this.repository.findById(constants_1.COLLECTIONS.deviceRequests, id);
    }
    async updateStatus(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.deviceRequests, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_DEVICE_REQUEST_STATUS",
            resourceType: constants_1.COLLECTIONS.deviceRequests,
            resourceId: id,
            before,
            after
        });
        return after;
    }
    async update(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.deviceRequests, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_DEVICE_REQUEST",
            resourceType: constants_1.COLLECTIONS.deviceRequests,
            resourceId: id,
            before,
            after
        });
        return after;
    }
};
exports.DeviceRequestsService = DeviceRequestsService;
exports.DeviceRequestsService = DeviceRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService])
], DeviceRequestsService);
//# sourceMappingURL=device-requests.service.js.map