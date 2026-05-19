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
var EcosystemIntegrationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosystemIntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
let EcosystemIntegrationsService = EcosystemIntegrationsService_1 = class EcosystemIntegrationsService {
    repository;
    config;
    logger = new common_1.Logger(EcosystemIntegrationsService_1.name);
    constructor(repository, config) {
        this.repository = repository;
        this.config = config;
    }
    async enqueue(input) {
        const provider = input.provider ?? this.providerFor(input.type);
        const deliveryStatus = provider === "noop" ? "LOGGED" : "QUEUED";
        const record = await this.repository.create(constants_1.COLLECTIONS.outboxEvents, (0, sanitize_1.sanitizePayload)({
            ...input,
            provider,
            deliveryStatus,
            attempts: 0,
            lastError: null
        }));
        if (provider === "noop") {
            this.logger.log(`No-op ${input.type.toLowerCase()} event logged for ${input.resourceType}/${input.resourceId}`);
        }
        return record;
    }
    providerFor(type) {
        const configured = this.config.get(`SIT_${type}_PROVIDER`);
        return configured?.trim() || "noop";
    }
};
exports.EcosystemIntegrationsService = EcosystemIntegrationsService;
exports.EcosystemIntegrationsService = EcosystemIntegrationsService = EcosystemIntegrationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        config_1.ConfigService])
], EcosystemIntegrationsService);
//# sourceMappingURL=integrations.service.js.map