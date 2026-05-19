import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min
} from "class-validator";
import { ConditionGrade, InventoryStatus } from "../inventory.enums";

export class CreateInventoryItemDto {
  @IsString()
  @Length(2, 80)
  assetTag: string;

  @IsString()
  @Length(2, 80)
  deviceType: string;

  @IsString()
  @Length(1, 80)
  brand: string;

  @IsString()
  @Length(1, 120)
  model: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  processor?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  ram?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  storage?: string;

  @IsEnum(ConditionGrade)
  conditionGrade: ConditionGrade;

  @IsEnum(InventoryStatus)
  status: InventoryStatus;

  @IsString()
  @Length(2, 120)
  location: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  assignedTo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  suggestedPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  warrantyMonths?: number;

  @IsOptional()
  @IsBoolean()
  africaReady?: boolean;

  @IsOptional()
  @IsBoolean()
  lowPowerSuitable?: boolean;

  @IsOptional()
  @IsBoolean()
  labBundleReady?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  notes?: string;

  @IsOptional()
  @IsObject()
  lifecycle?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  supportHistory?: unknown[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
