export type TrainingCohortStatus =
  | "DRAFT"
  | "RECRUITING"
  | "ACTIVE"
  | "CERTIFICATION_READY"
  | "COMPLETED"
  | "ARCHIVED"
  | "AT_RISK";

export type TrainingProgrammeType =
  | "DIGITAL_LITERACY"
  | "AI_LITERACY"
  | "CYBERSECURITY_AWARENESS"
  | "TEACHER_ENABLEMENT"
  | "DEVICE_READINESS"
  | "EMPLOYABILITY_SKILLS"
  | "REPAIR_TECHNICIAN_TRAINING"
  | "COMMUNITY_HUB_TRAINING";

export type TrainingDeliveryMode = "IN_PERSON" | "ONLINE" | "HYBRID";

export type TrainingLearner = {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  attendanceRate?: number;
  completionRate?: number;
  assessmentStatus?: string | null;
  certificateEligible?: boolean;
  importedAt?: string;
};

export type TrainingCertificationArtifact = {
  filename?: string;
  contentType?: string;
  storagePath?: string;
  downloadUrl?: string;
  generatedAt?: string;
};

export type TrainingTimelineEntry = {
  id?: string;
  type?: string;
  title?: string;
  createdAt?: string;
  actorEmail?: string | null;
  metadata?: Record<string, unknown>;
};

export type TrainingCohort = Record<string, unknown> & {
  id: string;
  name?: string;
  title?: string;
  cohortName?: string;
  summary?: string | null;
  programmeType?: TrainingProgrammeType | string;
  trainingPathway?: string;
  audience?: string;
  country?: string;
  hubOrSchool?: string;
  organisation?: string;
  deliveryMode?: TrainingDeliveryMode | string;
  status?: TrainingCohortStatus | string;
  startDate?: string | null;
  endDate?: string | null;
  targetLearners?: number;
  enrolledLearners?: number;
  learnerCount?: number;
  attendanceRate?: number;
  completionRate?: number;
  certificationReadiness?: number;
  certificationEnabled?: boolean;
  attendanceTrackingEnabled?: boolean;
  sponsor?: string | null;
  trainer?: string | null;
  linkedDeploymentId?: string | null;
  linkedDeviceBatchId?: string | null;
  owner?: string | null;
  assignedOwner?: string | null;
  notes?: string | null;
  trainerNotes?: string | null;
  learningOutcomes?: string[];
  learnerRegister?: TrainingLearner[];
  certificationChecklist?: unknown[];
  certificateArtifacts?: {
    pdf?: TrainingCertificationArtifact;
    generatedAt?: string;
    learnerCount?: number;
  };
  timeline?: TrainingTimelineEntry[];
  createdAt?: string;
  updatedAt?: string;
};

export type TrainingCohortSummary = {
  totalCohorts: number;
  totalLearners: number;
  activeCohorts: number;
  certificationReady: number;
  sponsorFunded: number;
  schoolsLinked: number;
  completionRate: number;
  attendanceRisk: number;
};

export type TrainingCohortListResponse = {
  cohorts: TrainingCohort[];
  summary: TrainingCohortSummary;
};

export type TrainingExportResponse = {
  filename: string;
  contentType: "text/csv";
  content: string;
};
