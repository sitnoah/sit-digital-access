import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min
} from "class-validator";
import { EnquiryPriority, EnquiryType } from "../enquiry.enums";

export class CreateEnquiryDto {
  @IsString()
  @Length(2, 120)
  fullName: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  organisation?: string;

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

  @IsEnum(EnquiryType)
  enquiryType: EnquiryType;

  @IsString()
  @Length(10, 2000)
  message: string;

  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  organisationType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  deploymentScale?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedLearnerCount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  powerAvailability?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  connectivityProfile?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  timeline?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  deviceQuantity?: number;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  preferredDeviceCategory?: string;

  @IsOptional()
  @IsString()
  @Length(0, 140)
  preferredPackage?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  classroomCount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 260)
  powerConnectivityNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 140)
  programmeSlug?: string;

  @IsOptional()
  @IsString()
  @Length(0, 140)
  serviceSlug?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  learnerCount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 140)
  deploymentRegion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  trainingRequirement?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  deviceRequirement?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  deviceCategories?: string[];

  @IsOptional()
  @IsString()
  @Length(0, 160)
  supportModelRequired?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  deploymentLocation?: string;
}
