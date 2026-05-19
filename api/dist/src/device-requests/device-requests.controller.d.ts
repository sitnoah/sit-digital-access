import type { AuthenticatedRequest } from "../common/types";
import { DeviceRequestsService } from "./device-requests.service";
import { AdminCreateDeviceRequestDto } from "./dto/admin-create-device-request.dto";
import { CreateDeviceRequestDto } from "./dto/create-device-request.dto";
import { UpdateDeviceRequestDto } from "./dto/update-device-request.dto";
import { UpdateDeviceRequestStatusDto } from "./dto/update-device-request-status.dto";
export declare class DeviceRequestsController {
    private readonly deviceRequestsService;
    constructor(deviceRequestsService: DeviceRequestsService);
    create(dto: CreateDeviceRequestDto): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    adminCreate(dto: AdminCreateDeviceRequestDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    list(): Promise<{
        data: unknown[];
    }>;
    findById(id: string): Promise<{
        data: unknown;
    }>;
    updateStatus(id: string, dto: UpdateDeviceRequestStatusDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    update(id: string, dto: UpdateDeviceRequestDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
}
