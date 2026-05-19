import { DeviceCategory } from "../device-request.enums";
export declare class CreateDeviceRequestDto {
    requesterName: string;
    organisation: string;
    email: string;
    phone?: string;
    country: string;
    deviceCategory: DeviceCategory;
    productSlug?: string;
    quantity: number;
    budgetRange?: string;
    intendedUse: string;
    deploymentLocation: string;
    requiredBy?: string;
    notes?: string;
}
