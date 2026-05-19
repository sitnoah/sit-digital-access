import { IsEnum, IsOptional } from "class-validator";
import { EnquiryPriority, EnquiryStatus } from "../enquiry.enums";

export class UpdateEnquiryStatusDto {
  @IsEnum(EnquiryStatus)
  status: EnquiryStatus;

  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;
}
