import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import type { AdminClaim } from "../../common/types";

export const WORKFORCE_ROLES: AdminClaim[] = [
  "superAdmin",
  "admin",
  "operationsManager",
  "deviceManager",
  "donationsManager",
  "supportAgent",
  "deploymentCoordinator",
  "countryManager",
  "inventoryManager",
  "analyticsManager"
];

export class InviteAdminUserDto {
  @IsString()
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsIn(WORKFORCE_ROLES)
  role!: AdminClaim;

  @IsString()
  @MaxLength(80)
  team!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  deploymentRegion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  permissionsPreset?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  deploymentRegions?: string[];
}
