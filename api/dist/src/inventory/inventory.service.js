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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
let InventoryService = class InventoryService {
    repository;
    auditService;
    constructor(repository, auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }
    async list() {
        return this.repository.list(constants_1.COLLECTIONS.inventory);
    }
    async create(dto, request) {
        const after = await this.repository.create(constants_1.COLLECTIONS.inventory, (0, sanitize_1.sanitizePayload)({
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
        }));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "CREATE_INVENTORY_ITEM",
            resourceType: constants_1.COLLECTIONS.inventory,
            resourceId: after.id,
            before: null,
            after
        });
        return after;
    }
    async findById(id) {
        return this.repository.findById(constants_1.COLLECTIONS.inventory, id);
    }
    async update(id, dto, request) {
        const before = await this.findById(id);
        const after = await this.repository.update(constants_1.COLLECTIONS.inventory, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_INVENTORY_ITEM",
            resourceType: constants_1.COLLECTIONS.inventory,
            resourceId: id,
            before,
            after
        });
        return after;
    }
    async delete(id, request) {
        const before = await this.findById(id);
        await this.repository.delete(constants_1.COLLECTIONS.inventory, id);
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "DELETE_INVENTORY_ITEM",
            resourceType: constants_1.COLLECTIONS.inventory,
            resourceId: id,
            before,
            after: null
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map