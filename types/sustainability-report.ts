export type SustainabilityReportStatus = "DRAFT" | "GENERATING" | "READY" | "FAILED" | "ARCHIVED";

export type SustainabilityReportType =
  | "MONTHLY_ESG"
  | "DONOR_IMPACT"
  | "CORPORATE_RECYCLING"
  | "AFRICA_DEPLOYMENT"
  | "BOARD_SUMMARY";

export type SustainabilityArtifact = {
  filename?: string;
  contentType?: string;
  storagePath?: string;
  downloadUrl?: string;
};

export type SustainabilityReport = Record<string, unknown> & {
  id: string;
  name?: string;
  title?: string;
  type?: SustainabilityReportType | string;
  reportType?: SustainabilityReportType | string;
  status?: SustainabilityReportStatus | "GENERATED" | string;
  periodStart?: string | null;
  periodEnd?: string | null;
  devicesIncluded?: number;
  devicesReused?: number;
  devicesRecycled?: number;
  devicesDiverted?: number;
  co2AvoidedKg?: number;
  co2EstimatedKg?: number;
  estimatedCo2SavedKg?: number;
  reuseRate?: number;
  recyclingRate?: number;
  evidenceReadiness?: number;
  dataSources?: unknown[];
  outputFormats?: unknown[];
  reportData?: Record<string, unknown>;
  artifacts?: {
    pdf?: SustainabilityArtifact;
    csv?: SustainabilityArtifact;
    generatedAt?: string;
  };
  timeline?: unknown[];
  createdBy?: string | null;
  createdByEmail?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SustainabilityReportSummary = {
  totalReports: number;
  co2EstimatedKg: number;
  devicesDiverted: number;
  latestReport: {
    id: string;
    name: string;
    createdAt?: string | null;
    status?: string | null;
  } | null;
  reuseRate: number;
  recyclingRate: number;
  devicesReused: number;
  devicesRecycled: number;
  evidenceReadiness?: number;
};

export type SustainabilityReportListResponse = {
  reports: SustainabilityReport[];
  summary: SustainabilityReportSummary;
};

export type SustainabilityExportResponse = {
  available: boolean;
  format: "pdf" | "csv";
  filename?: string;
  contentType?: string;
  storagePath?: string | null;
  downloadUrl?: string | null;
  message?: string;
};
