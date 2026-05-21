import type { DeviceRequestPayload } from "@/lib/api";

export type DeviceAvailability = "Available now" | "Limited stock" | "Quote required" | "Bundle only" | "Coming soon";

export type DeviceSortOption =
  | "Recommended"
  | "Lowest price"
  | "Best performance"
  | "Best for Africa deployment"
  | "Lowest power usage"
  | "Most sustainable"
  | "Best for schools"
  | "Best for NGOs"
  | "Recently added";

export type DeviceViewMode = "grid" | "list";

export type DeviceSpecification = {
  label: string;
  value: string;
};

export type DeviceFaq = {
  question: string;
  answer: string;
};

export type DeviceProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  requestCategory: DeviceRequestPayload["deviceCategory"];
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery: string[];
  bestFor: string;
  tags: string[];
  useCases: string[];
  processorOptions: string[];
  ramOptions: string[];
  storageOptions: string[];
  conditionGrades: string[];
  priceLabel: string;
  fromPrice?: number;
  availability: DeviceAvailability;
  supportIncluded: string[];
  deploymentTypes: string[];
  warranty: string;
  idealFor: string[];
  specifications: DeviceSpecification[];
  includedServices: string[];
  bundleOptions: string[];
  faqs: DeviceFaq[];
  estimatedCo2SavedKg?: number;
  lifecycleLabels?: string[];
  trustBadges?: string[];
  warrantyHighlights?: string[];
  gradeDescriptions?: DeviceSpecification[];
  sustainabilityHighlights?: string[];
  featured?: boolean;
  educationFit?: number;
  africaFit?: number;
  lowPowerScore?: number;
  performanceScore?: number;
};

export type DeviceFilterState = {
  categories: string[];
  useCases: string[];
  processors: string[];
  ram: string[];
  storage: string[];
  conditionGrades: string[];
  priceRanges: string[];
  deploymentTypes: string[];
  supportIncluded: string[];
  availability: string[];
};

export type DeviceFilterGroup = {
  id: keyof DeviceFilterState;
  label: string;
  options: string[];
};
