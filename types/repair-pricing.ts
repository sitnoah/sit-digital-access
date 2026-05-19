import type { IconKey } from "@/components/icons";

export type RepairDifficulty = "Low" | "Medium" | "High" | "Specialist";
export type DataRiskLevel = "Low" | "Medium" | "High";
export type DataRiskTone = "green" | "amber" | "red";

export type RepairPricingCategory = {
  id: string;
  title: string;
  categoryBadge: string;
  description: string;
  pricing: string;
  estimateRange: string;
  includes: string[];
  turnaround: string;
  difficulty: RepairDifficulty;
  warrantyEligible: boolean;
  icon: IconKey;
};

export type RepairEstimateInputs = {
  deviceType: string;
  brand: string;
  issueCategory: string;
  warrantyStatus: string;
  urgency: string;
  organisationSupport: boolean;
  pickupRequired: boolean;
};

export type RepairEstimateResult = {
  estimateRange: string;
  diagnosticRequirement: string;
  recommendedRoute: string;
  typicalTurnaround: string;
  dataRisk: DataRiskLevel;
  dataRiskTone: DataRiskTone;
  notes: string[];
};

export type EstimateBand = {
  categoryId: string;
  range: string;
  diagnosticRequirement: string;
  recommendedRoute: string;
  turnaround: string;
  dataRisk: DataRiskLevel;
};

export type TurnaroundRange = {
  id: string;
  label: string;
  range: string;
  description: string;
};

export type WarrantyRule = {
  id: string;
  title: string;
  description: string;
  appliesTo: string;
  icon: IconKey;
};

export type BulkSupportOption = {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
};

export type RepairWorkflowStep = {
  title: string;
  description: string;
  indicator: string;
  checkpoint: string;
  icon: IconKey;
};

export type RepairTrustCard = {
  title: string;
  description: string;
  icon: IconKey;
};

export type RepairFaqItem = {
  question: string;
  answer: string;
};

export type RepairPricingApiShell = {
  repairPricing: {
    method: "GET";
    path: "/api/v1/repair-pricing";
    returns: string;
  };
  repairEstimate: {
    method: "GET";
    path: "/api/v1/repairs/estimate";
    returns: string;
  };
  createRepair: {
    method: "POST";
    path: "/api/v1/repairs";
    body: string;
  };
};
