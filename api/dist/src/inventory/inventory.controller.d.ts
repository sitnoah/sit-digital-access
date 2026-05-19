import type { AuthenticatedRequest } from "../common/types";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";
import { InventoryService } from "./inventory.service";
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    list(): Promise<{
        data: unknown[];
    }>;
    create(dto: CreateInventoryItemDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    findById(id: string): Promise<{
        data: unknown;
    }>;
    update(id: string, dto: UpdateInventoryItemDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    delete(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            id: string;
            deleted: boolean;
        };
    }>;
}
