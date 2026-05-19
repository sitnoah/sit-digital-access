import { IsEnum, IsObject, IsOptional, IsString, Length } from "class-validator";
import { DeviceRequestPriority, DeviceRequestStatus } from "../device-request.enums";

export class UpdateDeviceRequestDto {
  @IsOptional()
  @IsEnum(DeviceRequestStatus)
  status?: DeviceRequestStatus;

  @IsOptional()
  @IsEnum(DeviceRequestPriority)
  priority?: DeviceRequestPriority;

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
  @Length(0, 3000)
  fulfilmentPlan?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  deploymentType?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
