import type { IconKey } from "@/components/icons";

export type ProgrammeCategory =
  | "Learner access"
  | "Schools"
  | "Community hubs"
  | "SMEs"
  | "Africa deployment"
  | "Sponsored access";

export type ProgrammeSort =
  | "Recommended"
  | "Most scalable"
  | "Education-focused"
  | "Africa deployment ready"
  | "Sponsor-ready";

export type ProgrammeFilter = "All programmes" | ProgrammeCategory;

export type ProgrammeFaq = {
  question: string;
  answer: string;
};

export type ProgrammeFeature = {
  title: string;
  description: string;
  icon: IconKey;
};

export type Programme = {
  id: string;
  slug: string;
  title: string;
  category: ProgrammeCategory;
  shortDescription: string;
  longDescription: string;
  image: string;
  icon: IconKey;
  bestFor: string[];
  deploymentReadiness: "High" | "Very high" | "Specialist";
  trainingIncluded: boolean;
  supportLevel: string;
  sponsorReady: boolean;
  cohortRange: string;
  deviceRange: string;
  deploymentRegions: string[];
  useCases: string[];
  features: ProgrammeFeature[];
  deviceModel: string;
  trainingSupport: string;
  deploymentSetup: string;
  africaReadiness: string;
  maintenanceSupport: string;
  sponsorshipOpportunities: string[];
  impactModel: string;
  deploymentComplexity: "Low" | "Medium" | "Advanced";
  scalabilityScore: number;
  educationScore: number;
  africaScore: number;
  sponsorScore: number;
  faqs: ProgrammeFaq[];
  relatedProgrammes: string[];
};

export type ProgrammeEnquiryPayload = {
  programmeSlug?: string;
  programmeTitle?: string;
  learnerCount?: number;
  deploymentRegion?: string;
  trainingRequirement?: string;
  deviceRequirement?: string;
};
