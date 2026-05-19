import { IsEnum, IsObject, IsOptional, IsString, Length } from "class-validator";
import { EnquiryPriority, EnquiryStatus } from "../enquiry.enums";

export class UpdateEnquiryDto {
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  assignedOwner?: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  internalNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  sourcePage?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
