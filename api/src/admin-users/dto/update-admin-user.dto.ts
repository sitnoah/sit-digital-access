import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import { WORKFORCE_ROLES } from "./invite-admin-user.dto";
import type { AdminClaim } from "../../common/types";

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsIn(WORKFORCE_ROLES)
  role?: AdminClaim;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  team?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  status?: "ACTIVE" | "INVITED" | "SUSPENDED" | "DISABLED";

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  deploymentRegions?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(24)
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(240)
  bio?: string;

  @IsOptional()
  @IsBoolean()
  mfaEnabled?: boolean;
}
