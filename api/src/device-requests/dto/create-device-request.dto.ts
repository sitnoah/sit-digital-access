import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min
} from "class-validator";
import { DeviceCategory } from "../device-request.enums";

export class CreateDeviceRequestDto {
  @IsString()
  @Length(2, 120)
  requesterName: string;

  @IsString()
  @Length(2, 160)
  organisation: string;

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

  @IsEnum(DeviceCategory)
  deviceCategory: DeviceCategory;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  productSlug?: string;

  @IsInt()
  @Min(1)
  @Max(10000)
  quantity: number;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  budgetRange?: string;

  @IsString()
  @Length(10, 1200)
  intendedUse: string;

  @IsString()
  @Length(2, 160)
  deploymentLocation: string;

  @IsOptional()
  @IsDateString()
  requiredBy?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  notes?: string;
}
