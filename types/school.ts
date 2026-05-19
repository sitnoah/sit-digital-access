import type { IconKey } from "@/components/icons";

export type SchoolSolution = {
  title: string;
  category: string;
  description: string;
  bestFor: string;
  includes: string[];
  icon: IconKey;
  cta: string;
};

export type LabPackage = {
  title: string;
  deviceCount: string;
  bestFor: string;
  roomSize: string;
  networkNeeds: string;
  supportLevel: string;
  icon: IconKey;
};

export type EducationUseCase = {
  title: string;
  recommendedDevice: string;
  supportRequirement: string;
  trainingPathway: string;
  icon: IconKey;
};

export type SchoolJourneyStep = {
  title: string;
  description: string;
  insight: string;
  icon: IconKey;
};

export type SponsorOption = {
  title: string;
  description: string;
  icon: IconKey;
};

export type SchoolFAQItem = {
  question: string;
  answer: string;
};
