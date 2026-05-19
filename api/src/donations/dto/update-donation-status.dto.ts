import { IsEnum } from "class-validator";
import { DonationStatus } from "../donation.enums";

export class UpdateDonationStatusDto {
  @IsEnum(DonationStatus)
  status: DonationStatus;
}
