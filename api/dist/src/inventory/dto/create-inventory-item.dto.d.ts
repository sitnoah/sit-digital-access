import { ConditionGrade, InventoryStatus } from "../inventory.enums";
export declare class CreateInventoryItemDto {
    assetTag: string;
    deviceType: string;
    brand: string;
    model: string;
    processor?: string;
    ram?: string;
    storage?: string;
    conditionGrade: ConditionGrade;
    status: InventoryStatus;
    location: string;
    assignedTo?: string;
    costPrice?: number;
    suggestedPrice?: number;
    warrantyMonths?: number;
    africaReady?: boolean;
    lowPowerSuitable?: boolean;
    labBundleReady?: boolean;
    notes?: string;
    lifecycle?: Record<string, unknown>;
    supportHistory?: unknown[];
    metadata?: Record<string, unknown>;
}
