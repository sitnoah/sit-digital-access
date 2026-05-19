import { DeviceRequestPriority, DeviceRequestStatus } from "../device-request.enums";
export declare class UpdateDeviceRequestDto {
    status?: DeviceRequestStatus;
    priority?: DeviceRequestPriority;
    assignedOwner?: string;
    internalNotes?: string;
    fulfilmentPlan?: string;
    deploymentType?: string;
    metadata?: Record<string, unknown>;
}
