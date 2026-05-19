import {
  Allow,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min
} from "class-validator";

export class EcosystemRecordDto {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  summary?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  status?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  priority?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  location?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  assignedOwner?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  owner?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  sourceType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  sourceId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  resourceType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  resourceId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  linkedResourceType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  linkedResourceId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  linkedHref?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  actionHref?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  actionLabel?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  message?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  notes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  internalNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  workspace?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  viewKey?: string;

  @IsOptional()
  @IsArray()
  filters?: unknown[];

  @IsOptional()
  @IsArray()
  columns?: unknown[];

  @IsOptional()
  @IsArray()
  tags?: unknown[];

  @IsOptional()
  @IsArray()
  metrics?: unknown[];

  @IsOptional()
  @IsArray()
  steps?: unknown[];

  @IsOptional()
  @IsArray()
  inventoryIds?: unknown[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  quoteDraft?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  reservationPlan?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  reportPayload?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  reportData?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  diagnostics?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  aiTriage?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  diagnosticChecklist?: unknown[];

  @IsOptional()
  @IsArray()
  attachments?: unknown[];

  @IsOptional()
  @IsArray()
  timeline?: unknown[];

  @IsOptional()
  @IsArray()
  customerCommunication?: unknown[];

  @IsOptional()
  @IsArray()
  requiredPartIds?: unknown[];

  @IsOptional()
  @IsString()
  @Length(0, 240)
  visualAsset?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  deliveryStatus?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  provider?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  reportType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  cohortName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  trainingPathway?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  certificationTarget?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  customerName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  organisation?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  deviceType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  brand?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  model?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  repairCategory?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  serialNumber?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  assetTag?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  warrantyReference?: string;

  @IsOptional()
  @IsString()
  @Length(0, 40)
  purchasedFromSit?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  issueDescription?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  issueStartedAt?: string;

  @IsOptional()
  @IsBoolean()
  damagedOrDropped?: boolean;

  @IsOptional()
  @IsBoolean()
  dataRecoveryNeeded?: boolean;

  @IsOptional()
  @IsBoolean()
  powersOn?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  urgency?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  repairRoute?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  repairReference?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  faultCategory?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  warrantyDecision?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  reuseDecision?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  approvedEstimate?: number;

  @IsOptional()
  @IsBoolean()
  consentCaptured?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  repairRouteSlug?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  preferredDropOffDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  handoverNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  deviceChargerIncluded?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  pickupAddress?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  preferredPickupDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  organisationType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  accessInstructions?: string;

  @IsOptional()
  @IsBoolean()
  batchRepairRequired?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  preferredContactMethod?: string;

  @IsOptional()
  @IsBoolean()
  dataHandlingConsent?: boolean;

  @IsOptional()
  @IsBoolean()
  diagnosticAcknowledgement?: boolean;

  @IsOptional()
  @IsBoolean()
  mailIn?: boolean;

  @IsOptional()
  @IsBoolean()
  pickupRequested?: boolean;

  @IsOptional()
  @IsBoolean()
  shared?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  channel?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  deviceRequestId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  donationId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  enquiryId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  inventoryId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  deploymentId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  recyclingId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  assignedTechnicianId?: string;

  @IsOptional()
  @IsArray()
  partsRequired?: unknown[];

  @IsOptional()
  @IsString()
  @Length(0, 160)
  sku?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  supplier?: string;

  @IsOptional()
  @IsArray()
  compatibleDevices?: unknown[];

  @IsOptional()
  @IsArray()
  skills?: unknown[];

  @IsOptional()
  @IsArray()
  certifications?: unknown[];

  @IsOptional()
  @IsString()
  @Length(0, 160)
  availability?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  collectionDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  collectionWindow?: string;

  @IsOptional()
  @IsString()
  @Length(0, 240)
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  processingStage?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  powerProfile?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  connectivityProfile?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  logisticsPlan?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  fulfilmentPlan?: string;

  @IsOptional()
  @IsString()
  @Length(0, 240)
  localPartner?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedCo2SavedKg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  devicesDiverted?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  deviceCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  learnerCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  readinessScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  attempts?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  slaTargetHours?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityAvailable?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  workload?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedUnitPrice?: number;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  lastError?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  dueDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  periodStart?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  periodEnd?: string;

  @Allow()
  createdBy?: unknown;
}

export class AdminSearchQueryDto {
  @IsOptional()
  @IsString()
  @Length(0, 120)
  q?: string;
}
