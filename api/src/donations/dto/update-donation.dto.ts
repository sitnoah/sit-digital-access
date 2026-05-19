import { IsEnum, IsObject, IsOptional, IsString, Length } from "class-validator";
import { DonationPriority, DonationStatus } from "../donation.enums";

export class UpdateDonationDto {
  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;

  @IsOptional()
  @IsEnum(DonationPriority)
  priority?: DonationPriority;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  assignedOwner?: string;

  @IsOptional()
  @IsString()
  @Length(0, 4000)
  internalNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 4000)
  collectionPlan?: string;

  @IsOptional()
  @IsString()
  @Length(0, 4000)
  sponsorshipPlan?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
