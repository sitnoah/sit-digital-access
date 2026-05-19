import { IsEnum, IsObject, IsOptional, IsString, Length } from "class-validator";
import { DonationPriority } from "../donation.enums";
import { CreateDonationDto } from "./create-donation.dto";

export class AdminCreateDonationDto extends CreateDonationDto {
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
