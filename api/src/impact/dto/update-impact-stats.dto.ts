import { IsArray, IsBoolean, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

export class UpdateImpactStatsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  devicesDeployed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  learnersReached?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  schoolsSupported?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  businessesSupported?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  countriesServed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  co2SavedKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trainingHoursDelivered?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costSavingsGenerated?: number;

  @IsOptional()
  @IsArray()
  stories?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  regions?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  snapshots?: Record<string, unknown>[];

  @IsOptional()
  @IsObject()
  reuse?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metricVisibility?: Record<string, boolean>;
}

export class SaveImpactSnapshotDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsObject()
  metrics?: Record<string, unknown>;
}

export class ImpactStoryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title!: string;

  @IsString()
  category!: string;

  @IsString()
  summary!: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  relatedMetric?: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
