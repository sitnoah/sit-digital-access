import type { IconKey } from "@/components/icons";

export type ServiceCategory =
  | "Devices"
  | "Setup"
  | "Cloud"
  | "Labs"
  | "Training"
  | "Security"
  | "Africa Deployment"
  | "Support";

export type ServiceFilter = "All" | ServiceCategory;

export type ServiceSort =
  | "Most requested"
  | "Deployment-ready"
  | "Education-focused"
  | "SME-focused"
  | "Africa-ready";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceItem = {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  longDescription: string;
  icon: IconKey;
  bestFor: string[];
  includedFeatures: string[];
  deliveryModel: string[];
  deploymentReadiness: "Standard" | "High" | "Advanced" | "Specialist";
  supportLevel: string;
  africaReady: boolean;
  trainingLinked: boolean;
  deliveryComplexity: "Low" | "Medium" | "Advanced";
  requestedScore: number;
  deploymentScore: number;
  educationScore: number;
  smeScore: number;
  africaScore: number;
  relatedServices: string[];
  faqs: ServiceFaq[];
};
