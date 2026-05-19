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
exports.ImpactService = exports.defaultImpactStats = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
exports.defaultImpactStats = {
    id: constants_1.IMPACT_STATS_DOCUMENT_ID,
    devicesDeployed: 0,
    learnersReached: 0,
    schoolsSupported: 0,
    businessesSupported: 0,
    countriesServed: 0,
    co2SavedKg: 0,
    trainingHoursDelivered: 0,
    costSavingsGenerated: 0,
    stories: [],
    regions: [],
    snapshots: [],
    metricVisibility: {
        devicesDeployed: true,
        learnersReached: true,
        schoolsSupported: true,
        businessesSupported: true,
        countriesServed: true,
        co2SavedKg: true,
        trainingHoursDelivered: true,
        costSavingsGenerated: true
    },
    reuse: {
        devicesReused: 0,
        devicesDivertedFromWaste: 0,
        averageCo2KgPerDevice: 85,
        manualCo2Override: false,
        notes: ""
    }
};
let ImpactService = class ImpactService {
    repository;
    auditService;
    constructor(repository, auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }
    async getStats() {
        let stats;
        try {
            stats = await this.repository.getSingleton(constants_1.COLLECTIONS.impactStats, constants_1.IMPACT_STATS_DOCUMENT_ID, exports.defaultImpactStats);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Impact Firestore data is unavailable.";
            return {
                ...exports.defaultImpactStats,
                metadata: {
                    degraded: true,
                    message,
                    suggestedFix: "Enable Cloud Firestore for this Firebase project and retry."
                }
            };
        }
        return {
            ...exports.defaultImpactStats,
            ...stats,
            stories: Array.isArray(stats.stories)
                ? stats.stories
                : [],
            regions: Array.isArray(stats.regions)
                ? stats.regions
                : [],
            snapshots: Array.isArray(stats.snapshots)
                ? stats.snapshots
                : [],
            metricVisibility: {
                ...exports.defaultImpactStats.metricVisibility,
                ...(typeof stats.metricVisibility === "object" && stats.metricVisibility !== null
                    ? stats.metricVisibility
                    : {})
            },
            reuse: {
                ...exports.defaultImpactStats.reuse,
                ...(typeof stats.reuse === "object" && stats.reuse !== null
                    ? stats.reuse
                    : {})
            }
        };
    }
    async initialiseStats(request) {
        const before = await this.getStats();
        const after = await this.repository.setSingleton(constants_1.COLLECTIONS.impactStats, constants_1.IMPACT_STATS_DOCUMENT_ID, exports.defaultImpactStats);
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "INITIALISE_IMPACT_STATS",
            resourceType: constants_1.COLLECTIONS.impactStats,
            resourceId: constants_1.IMPACT_STATS_DOCUMENT_ID,
            before,
            after
        });
        return after;
    }
    async updateStats(dto, request) {
        const before = await this.getStats();
        const payload = (0, sanitize_1.sanitizePayload)(dto);
        const after = await this.repository.setSingleton(constants_1.COLLECTIONS.impactStats, constants_1.IMPACT_STATS_DOCUMENT_ID, payload);
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "UPDATE_IMPACT_STATS",
            resourceType: constants_1.COLLECTIONS.impactStats,
            resourceId: constants_1.IMPACT_STATS_DOCUMENT_ID,
            before,
            after
        });
        return after;
    }
    async saveSnapshot(dto, request) {
        const before = await this.getStats();
        const snapshot = (0, sanitize_1.sanitizePayload)({
            id: `snapshot-${Date.now()}`,
            label: dto.label ?? new Date().toISOString().slice(0, 7),
            metrics: dto.metrics ?? before,
            createdAt: new Date().toISOString()
        });
        const existingSnapshots = Array.isArray(before.snapshots) ? before.snapshots : [];
        const after = await this.repository.setSingleton(constants_1.COLLECTIONS.impactStats, constants_1.IMPACT_STATS_DOCUMENT_ID, {
            snapshots: [snapshot, ...existingSnapshots].slice(0, 24)
        });
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action: "SAVE_IMPACT_SNAPSHOT",
            resourceType: constants_1.COLLECTIONS.impactStats,
            resourceId: constants_1.IMPACT_STATS_DOCUMENT_ID,
            before,
            after
        });
        return after;
    }
};
exports.ImpactService = ImpactService;
exports.ImpactService = ImpactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService])
], ImpactService);
//# sourceMappingURL=impact.service.js.map