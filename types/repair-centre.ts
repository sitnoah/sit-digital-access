import type { IconKey } from "@/components/icons";
import type { RepairRoute } from "@/types/repair";

export type RepairCentreRouteId =
  | "repair-desk"
  | "mail-in"
  | "pickup-request"
  | "partner-handover"
  | "africa-deployment"
  | "bulk-school-lab-support";

export type RepairCentreRoute = {
  id: RepairCentreRouteId;
  title: string;
  subtitle: string;
  bestFor: string;
  deviceCount: string;
  turnaround: string;
  requirements: string;
  includes: string[];
  icon: IconKey;
  bookingRoute: RepairRoute;
};

export type RecommenderDeviceCount = "1" | "2-5" | "6-15" | "16+";
export type RecommenderDeviceType = "Laptop" | "Desktop" | "Mini PC" | "Accessories" | "School lab bundle";
export type RecommenderLocation = "UK" | "Africa deployment partner" | "Other";
export type RecommenderUrgency = "Standard" | "Urgent" | "Lab critical";
export type RecommenderPosting = "Yes" | "No" | "Not sure";

export type RepairRouteRecommendation = {
  routeId: RepairCentreRouteId;
  reason: string;
  nextStep: string;
};

export type RepairNetworkNode = {
  id: string;
  label: string;
  region: string;
  detail: string;
  metric: string;
  x: number;
  y: number;
  icon: IconKey;
};

export type RepairInfoCard = {
  title: string;
  description: string;
  icon: IconKey;
};

export type RepairLocationCard = {
  title: string;
  serviceType: string;
  availableRoutes: string;
  bestFor: string;
  routeId: RepairCentreRouteId;
  icon: IconKey;
};

export type RepairCentreFAQ = {
  question: string;
  answer: string;
};
