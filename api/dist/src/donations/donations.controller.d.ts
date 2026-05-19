import type { AuthenticatedRequest } from "../common/types";
import { DonationsService } from "./donations.service";
import { AdminCreateDonationDto } from "./dto/admin-create-donation.dto";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { UpdateDonationStatusDto } from "./dto/update-donation-status.dto";
export declare class DonationsController {
    private readonly donationsService;
    constructor(donationsService: DonationsService);
    create(dto: CreateDonationDto): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    createAdmin(dto: AdminCreateDonationDto, request: AuthenticatedRequest): Promise<{
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
    updateStatus(id: string, dto: UpdateDonationStatusDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    update(id: string, dto: UpdateDonationDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
}
