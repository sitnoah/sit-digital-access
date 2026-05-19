export declare class UpdateImpactStatsDto {
    devicesDeployed?: number;
    learnersReached?: number;
    schoolsSupported?: number;
    businessesSupported?: number;
    countriesServed?: number;
    co2SavedKg?: number;
    trainingHoursDelivered?: number;
    costSavingsGenerated?: number;
    stories?: Record<string, unknown>[];
    regions?: Record<string, unknown>[];
    snapshots?: Record<string, unknown>[];
    reuse?: Record<string, unknown>;
    metricVisibility?: Record<string, boolean>;
}
export declare class SaveImpactSnapshotDto {
    label?: string;
    metrics?: Record<string, unknown>;
}
export declare class ImpactStoryDto {
    id?: string;
    title: string;
    category: string;
    summary: string;
    region?: string;
    relatedMetric?: string;
    visible?: boolean;
}
