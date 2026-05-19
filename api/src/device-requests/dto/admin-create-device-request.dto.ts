import { IsEnum, IsObject, IsOptional, IsString, Length } from "class-validator";
import { DeviceRequestPriority } from "../device-request.enums";
import { CreateDeviceRequestDto } from "./create-device-request.dto";

export class AdminCreateDeviceRequestDto extends CreateDeviceRequestDto {
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
