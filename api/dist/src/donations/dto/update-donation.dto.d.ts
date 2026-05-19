import { DonationPriority, DonationStatus } from "../donation.enums";
export declare class UpdateDonationDto {
    status?: DonationStatus;
    priority?: DonationPriority;
    assignedOwner?: string;
    internalNotes?: string;
    collectionPlan?: string;
    sponsorshipPlan?: string;
    metadata?: Record<string, unknown>;
}
