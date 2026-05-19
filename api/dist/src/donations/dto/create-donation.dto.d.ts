import { DonationType, DonorType } from "../donation.enums";
export declare class CreateDonationDto {
    donorName: string;
    organisation?: string;
    donorType: DonorType;
    email: string;
    phone?: string;
    country: string;
    donationType: DonationType;
    deviceCount?: number;
    deviceCondition?: string;
    pickupLocation?: string;
    sponsorshipAmount?: number;
    preferredTimeline?: string;
    message?: string;
}
