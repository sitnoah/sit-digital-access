import { IsObject, IsOptional, IsString, Length } from "class-validator";
import { CreateEnquiryDto } from "./create-enquiry.dto";

export class AdminCreateEnquiryDto extends CreateEnquiryDto {
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
