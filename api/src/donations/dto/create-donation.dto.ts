import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min
} from "class-validator";
import { DonationType, DonorType } from "../donation.enums";

export class CreateDonationDto {
  @IsString()
  @Length(2, 120)
  donorName: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  organisation?: string;

  @IsEnum(DonorType)
  donorType: DonorType;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(0, 40)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  country: string;

  @IsEnum(DonationType)
  donationType: DonationType;

  @IsOptional()
  @IsInt()
  @Min(0)
  deviceCount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  deviceCondition?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  pickupLocation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sponsorshipAmount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  preferredTimeline?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  message?: string;
}
