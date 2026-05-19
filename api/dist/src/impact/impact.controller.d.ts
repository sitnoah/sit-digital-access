import type { AuthenticatedRequest } from "../common/types";
import { SaveImpactSnapshotDto, UpdateImpactStatsDto } from "./dto/update-impact-stats.dto";
import { ImpactService } from "./impact.service";
export declare class ImpactController {
    private readonly impactService;
    constructor(impactService: ImpactService);
    getStats(): Promise<{
        data: {
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
        };
    }>;
    updateStats(dto: UpdateImpactStatsDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    initialiseStats(request: AuthenticatedRequest): Promise<{
        data: {
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
    }>;
    saveSnapshot(dto: SaveImpactSnapshotDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
}
