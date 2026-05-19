import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsOptional, ValidateNested } from "class-validator";

export class AdminClaimsDto {
  @IsOptional()
  @IsBoolean()
  superAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;

  @IsOptional()
  @IsBoolean()
  operationsManager?: boolean;

  @IsOptional()
  @IsBoolean()
  deviceManager?: boolean;

  @IsOptional()
  @IsBoolean()
  donationsManager?: boolean;

  @IsOptional()
  @IsBoolean()
  supportAgent?: boolean;

  @IsOptional()
  @IsBoolean()
  deploymentCoordinator?: boolean;

  @IsOptional()
  @IsBoolean()
  countryManager?: boolean;

  @IsOptional()
  @IsBoolean()
  inventoryManager?: boolean;

  @IsOptional()
  @IsBoolean()
  analyticsManager?: boolean;
}

export class UpdateUserClaimsDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => AdminClaimsDto)
  claims!: AdminClaimsDto;
}
