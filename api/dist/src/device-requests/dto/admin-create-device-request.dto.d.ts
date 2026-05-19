import { DeviceRequestPriority } from "../device-request.enums";
import { CreateDeviceRequestDto } from "./create-device-request.dto";
export declare class AdminCreateDeviceRequestDto extends CreateDeviceRequestDto {
    priority?: DeviceRequestPriority;
    assignedOwner?: string;
    internalNotes?: string;
    fulfilmentPlan?: string;
    deploymentType?: string;
    metadata?: Record<string, unknown>;
}
