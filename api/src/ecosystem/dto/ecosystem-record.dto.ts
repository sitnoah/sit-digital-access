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
  @Length(0, 180)
  subject?: string;

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
  @Length(0, 120)
  role?: string;

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
  @Length(0, 5000)
  internalNote?: string;

  @IsOptional()
  @IsArray()
  internalNoteLog?: unknown[];

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
  @IsArray()
  dataSources?: unknown[];

  @IsOptional()
  @IsArray()
  outputFormats?: unknown[];

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
  artifacts?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  diagnostics?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  aiTriage?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  aiRecommendation?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  diagnosticChecklist?: unknown[];

  @IsOptional()
  @IsArray()
  secureWipeChecklist?: unknown[];

  @IsOptional()
  @IsArray()
  attachments?: unknown[];

  @IsOptional()
  @IsArray()
  timeline?: unknown[];

  @IsOptional()
  @IsArray()
  chainOfCustodyLog?: unknown[];

  @IsOptional()
  @IsArray()
  reportPacks?: unknown[];

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
  @IsString()
  @Length(0, 180)
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  type?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  storyType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  beneficiaryName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 12000)
  body?: string;

  @IsOptional()
  @IsString()
  @Length(0, 12000)
  fullStory?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  quote?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2500)
  beforeSituation?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2500)
  afterImpact?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  devicesProvided?: number;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  trainingLinked?: string;

  @IsOptional()
  @IsArray()
  skillsGained?: unknown[];

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  outcome?: string;

  @IsOptional()
  @IsArray()
  mediaUrls?: unknown[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  consentConfirmed?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  deviceDonationId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  trainingCohortId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  beneficiaryType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  tone?: string;

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
  @Length(0, 120)
  programmeType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  audience?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  hubOrSchool?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  deliveryMode?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  startDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  endDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  trainer?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  sponsor?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  linkedDeviceBatchId?: string;

  @IsOptional()
  @IsBoolean()
  certificationEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  attendanceTrackingEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  trainerApprovalComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  sponsorReportReady?: boolean;

  @IsOptional()
  @IsBoolean()
  certificateTemplateSelected?: boolean;

  @IsOptional()
  @IsArray()
  learnerRegister?: unknown[];

  @IsOptional()
  @IsArray()
  certificationChecklist?: unknown[];

  @IsOptional()
  @IsObject()
  certificateArtifacts?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  learningOutcomes?: unknown[];

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  trainerNotes?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  customerName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  requesterName?: string;

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
  @Length(0, 160)
  requesterEmail?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  requesterPhone?: string;

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
  linkedInventoryId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  deploymentId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  linkedDeploymentId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  recyclingId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  linkedDonationId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  linkedRepairTicketId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  repairTicketId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  assignedTechnicianId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 180)
  assignedTo?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  supportReference?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  reference?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  slaTarget?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  slaDueAt?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  lastActivityAt?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  linkRecordType?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  linkRecordId?: string;

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
  collectionRoute?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  collectionWindow?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  contactPerson?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  donorOrganisation?: string;

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
  @Length(0, 80)
  recyclingReference?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  recyclingPartnerId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  partnerName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  driverStatus?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  logisticsStatus?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  secureWipeStatus?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  wipeCertificateStatus?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  assignedTechnician?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  reuseRecycleDecision?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  deviceCondition?: string;

  @IsOptional()
  @IsString()
  @Length(0, 240)
  africaDeploymentSuitability?: string;

  @IsOptional()
  @IsArray()
  assetTypes?: unknown[];

  @IsOptional()
  @IsArray()
  complianceDocuments?: unknown[];

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
  @IsNumber()
  @Min(0)
  estimatedCo2KgAvoided?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  refurbishmentCostEstimate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  partsValueEstimate?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  devicesDiverted?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  deviceQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  devicesIncluded?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  devicesReused?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  devicesRecycled?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  dataBearingDeviceCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  dataBearingDevicesCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  deviceCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  targetLearners?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  enrolledLearners?: number;

  @IsOptional()
  @IsBoolean()
  chainOfCustodyRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  secureWipeRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  esgReportRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  generateEstimatedCo2Impact?: boolean;

  @IsOptional()
  @IsBoolean()
  generateReuseEvidence?: boolean;

  @IsOptional()
  @IsBoolean()
  generateDonorReadySummary?: boolean;

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
  @IsInt()
  @Min(0)
  activeJobs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  completedJobs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  slaRisk?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  attendanceRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  certificationReadiness?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  co2AvoidedKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  co2EstimatedKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  reuseRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  recyclingRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  evidenceReadiness?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

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
