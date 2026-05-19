import { AuditService } from "../audit/audit.service";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuthenticatedRequest } from "../common/types";
import type { UpdateImpactStatsDto } from "./dto/update-impact-stats.dto";
export declare const defaultImpactStats: {
    id: string;
    devicesDeployed: number;
    learnersReached: number;
    schoolsSupported: number;
    businessesSupported: number;
    countriesServed: number;
    co2SavedKg: number;
    trainingHoursDelivered: number;
    costSavingsGenerated: number;
    stories: never[];
    regions: never[];
    snapshots: never[];
    metricVisibility: {
        devicesDeployed: boolean;
        learnersReached: boolean;
        schoolsSupported: boolean;
        businessesSupported: boolean;
        countriesServed: boolean;
        co2SavedKg: boolean;
        trainingHoursDelivered: boolean;
        costSavingsGenerated: boolean;
    };
    reuse: {
        devicesReused: number;
        devicesDivertedFromWaste: number;
        averageCo2KgPerDevice: number;
        manualCo2Override: boolean;
        notes: string;
    };
};
export declare class ImpactService {
    private readonly repository;
    private readonly auditService;
    constructor(repository: FirestoreRepository, auditService: AuditService);
    getStats(): Promise<{
        metadata: {
            degraded: boolean;
            message: string;
            suggestedFix: string;
        };
        id: string;
        devicesDeployed: number;
        learnersReached: number;
        schoolsSupported: number;
        businessesSupported: number;
        countriesServed: number;
        co2SavedKg: number;
        trainingHoursDelivered: number;
        costSavingsGenerated: number;
        stories: never[];
        regions: never[];
        snapshots: never[];
        metricVisibility: {
            devicesDeployed: boolean;
            learnersReached: boolean;
            schoolsSupported: boolean;
            businessesSupported: boolean;
            countriesServed: boolean;
            co2SavedKg: boolean;
            trainingHoursDelivered: boolean;
            costSavingsGenerated: boolean;
        };
        reuse: {
            devicesReused: number;
            devicesDivertedFromWaste: number;
            averageCo2KgPerDevice: number;
            manualCo2Override: boolean;
            notes: string;
        };
    } | {
        stories: never[];
        regions: never[];
        snapshots: never[];
        metricVisibility: {
            devicesDeployed: boolean;
            learnersReached: boolean;
            schoolsSupported: boolean;
            businessesSupported: boolean;
            countriesServed: boolean;
            co2SavedKg: boolean;
            trainingHoursDelivered: boolean;
            costSavingsGenerated: boolean;
        };
        reuse: {
            devicesReused: number;
            devicesDivertedFromWaste: number;
            averageCo2KgPerDevice: number;
            manualCo2Override: boolean;
            notes: string;
        };
        id: string;
        devicesDeployed: number;
        learnersReached: number;
        schoolsSupported: number;
        businessesSupported: number;
        countriesServed: number;
        co2SavedKg: number;
        trainingHoursDelivered: number;
        costSavingsGenerated: number;
    }>;
    initialiseStats(request: AuthenticatedRequest): Promise<{
        id: string;
        devicesDeployed: number;
        learnersReached: number;
        schoolsSupported: number;
        businessesSupported: number;
        countriesServed: number;
        co2SavedKg: number;
        trainingHoursDelivered: number;
        costSavingsGenerated: number;
        stories: never[];
        regions: never[];
        snapshots: never[];
        metricVisibility: {
            devicesDeployed: boolean;
            learnersReached: boolean;
            schoolsSupported: boolean;
            businessesSupported: boolean;
            countriesServed: boolean;
            co2SavedKg: boolean;
            trainingHoursDelivered: boolean;
            costSavingsGenerated: boolean;
        };
        reuse: {
            devicesReused: number;
            devicesDivertedFromWaste: number;
            averageCo2KgPerDevice: number;
            manualCo2Override: boolean;
            notes: string;
        };
    }>;
    updateStats(dto: UpdateImpactStatsDto, request: AuthenticatedRequest): Promise<unknown>;
    saveSnapshot(dto: {
        label?: string;
        metrics?: Record<string, unknown>;
    }, request: AuthenticatedRequest): Promise<unknown>;
}
