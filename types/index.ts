import type { IconKey } from "@/components/icons";

export type LinkItem = {
  label: string;
  href: string;
  hasMenu?: boolean;
};

export type Metric = {
  value: string;
  label: string;
  detail?: string;
  icon?: IconKey;
};

export type Feature = {
  title: string;
  description: string;
  icon: IconKey;
};

export type DeviceCategory = {
  title: string;
  icon: IconKey;
  bestFor: string;
  specification: string;
  price: string;
  warranty: string;
  conditionGrade?: string;
  supportIncluded?: string;
  tags?: string[];
};

export type Programme = {
  title: string;
  description: string;
  icon: IconKey;
  outcomes: string[];
};

export type ProcessStep = {
  title: string;
  description: string;
  icon: IconKey;
};

export type ImpactStory = {
  title: string;
  quote: string;
  role: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type DonationOption = Feature;

export type MegaMenuLink = {
  title: string;
  description: string;
  href: string;
  icon: IconKey;
};

export type MegaMenuColumn = {
  title: string;
  cta: LinkItem;
  links: MegaMenuLink[];
};

export type AfricaCountryProfile = {
  country: string;
  summary: string;
  marker: {
    x: number;
    y: number;
  };
  typicalDeploymentType: string;
  powerRealities: string;
  connectivityProfile: string;
  suggestedDeviceStrategy: string;
  exampleLabConfiguration: string;
  recommendedSupportModel: string;
  readiness: number;
  logisticsComplexity: number;
  offlineSupport: number;
};

export type AfricaStrategy = Feature & {
  insight: string;
};

export type AfricaLifecycleStep = ProcessStep & {
  metadata: string;
  insight: string;
};

export type AfricaOperationalCard = Feature & {
  insight: string;
};
