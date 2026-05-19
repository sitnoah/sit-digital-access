import { DonationPriority } from "../donation.enums";
import { CreateDonationDto } from "./create-donation.dto";
export declare class AdminCreateDonationDto extends CreateDonationDto {
    priority?: DonationPriority;
    assignedOwner?: string;
    internalNotes?: string;
    collectionPlan?: string;
    sponsorshipPlan?: string;
    metadata?: Record<string, unknown>;
}
