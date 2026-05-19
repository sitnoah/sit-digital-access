import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { COLLECTIONS, IMPACT_STATS_DOCUMENT_ID } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { sanitizePayload } from "../common/sanitize";
import type { AuthenticatedRequest } from "../common/types";
import type { UpdateImpactStatsDto } from "./dto/update-impact-stats.dto";

export const defaultImpactStats = {
  id: IMPACT_STATS_DOCUMENT_ID,
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

@Injectable()
export class ImpactService {
  constructor(
    private readonly repository: FirestoreRepository,
    private readonly auditService: AuditService
  ) {}

  async getStats() {
    let stats: typeof defaultImpactStats & Record<string, unknown>;

    try {
      stats = await this.repository.getSingleton(
        COLLECTIONS.impactStats,
        IMPACT_STATS_DOCUMENT_ID,
        defaultImpactStats
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impact Firestore data is unavailable.";
      return {
        ...defaultImpactStats,
        metadata: {
          degraded: true,
          message,
          suggestedFix: "Enable Cloud Firestore for this Firebase project and retry."
        }
      };
    }

    return {
      ...defaultImpactStats,
      ...stats,
      stories: Array.isArray((stats as typeof defaultImpactStats).stories)
        ? (stats as typeof defaultImpactStats).stories
        : [],
      regions: Array.isArray((stats as typeof defaultImpactStats).regions)
        ? (stats as typeof defaultImpactStats).regions
        : [],
      snapshots: Array.isArray((stats as typeof defaultImpactStats).snapshots)
        ? (stats as typeof defaultImpactStats).snapshots
        : [],
      metricVisibility: {
        ...defaultImpactStats.metricVisibility,
        ...(typeof (stats as typeof defaultImpactStats).metricVisibility === "object" && (stats as typeof defaultImpactStats).metricVisibility !== null
          ? (stats as typeof defaultImpactStats).metricVisibility
          : {})
      },
      reuse: {
        ...defaultImpactStats.reuse,
        ...(typeof (stats as typeof defaultImpactStats).reuse === "object" && (stats as typeof defaultImpactStats).reuse !== null
          ? (stats as typeof defaultImpactStats).reuse
          : {})
      }
    };
  }

  async initialiseStats(request: AuthenticatedRequest) {
    const before = await this.getStats();
    const after = await this.repository.setSingleton<typeof defaultImpactStats>(
      COLLECTIONS.impactStats,
      IMPACT_STATS_DOCUMENT_ID,
      defaultImpactStats
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "INITIALISE_IMPACT_STATS",
      resourceType: COLLECTIONS.impactStats,
      resourceId: IMPACT_STATS_DOCUMENT_ID,
      before,
      after
    });

    return after;
  }

  async updateStats(dto: UpdateImpactStatsDto, request: AuthenticatedRequest) {
    const before = await this.getStats();
    const payload = sanitizePayload(dto);
    const after = await this.repository.setSingleton(
      COLLECTIONS.impactStats,
      IMPACT_STATS_DOCUMENT_ID,
      payload
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "UPDATE_IMPACT_STATS",
      resourceType: COLLECTIONS.impactStats,
      resourceId: IMPACT_STATS_DOCUMENT_ID,
      before,
      after
    });

    return after;
  }

  async saveSnapshot(dto: { label?: string; metrics?: Record<string, unknown> }, request: AuthenticatedRequest) {
    const before = await this.getStats();
    const snapshot = sanitizePayload({
      id: `snapshot-${Date.now()}`,
      label: dto.label ?? new Date().toISOString().slice(0, 7),
      metrics: dto.metrics ?? before,
      createdAt: new Date().toISOString()
    });
    const existingSnapshots = Array.isArray(before.snapshots) ? before.snapshots : [];
    const after = await this.repository.setSingleton(
      COLLECTIONS.impactStats,
      IMPACT_STATS_DOCUMENT_ID,
      {
        snapshots: [snapshot, ...existingSnapshots].slice(0, 24)
      }
    );

    await this.auditService.log({
      actorUid: request.user.uid,
      actorEmail: request.user.email,
      action: "SAVE_IMPACT_SNAPSHOT",
      resourceType: COLLECTIONS.impactStats,
      resourceId: IMPACT_STATS_DOCUMENT_ID,
      before,
      after
    });

    return after;
  }
}
