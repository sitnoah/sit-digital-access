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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
let AuditService = class AuditService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async log(input) {
        await this.repository.create(constants_1.COLLECTIONS.auditLogs, {
            actorUid: input.actorUid,
            actorEmail: input.actorEmail ?? null,
            action: input.action,
            resourceType: input.resourceType,
            resourceId: input.resourceId,
            before: input.before ?? null,
            after: input.after ?? null
        });
    }
    async listForResource(resourceType, resourceId) {
        let query = this.repository.collection(constants_1.COLLECTIONS.auditLogs).orderBy("createdAt", "desc").limit(50);
        if (resourceType) {
            query = query.where("resourceType", "==", resourceType);
        }
        if (resourceId) {
            query = query.where("resourceId", "==", resourceId);
        }
        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository])
], AuditService);
//# sourceMappingURL=audit.service.js.map