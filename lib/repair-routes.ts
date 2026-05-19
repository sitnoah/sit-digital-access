import type { IconKey } from "@/components/icons";
import type { RepairRoute } from "@/types/repair";

export type RepairRouteSlug =
  | "drop-off-handover"
  | "mail-in-repair"
  | "pickup-request"
  | "partner-handover"
  | "africa-deployment-support"
  | "bulk-school-lab-support";

export type RepairRouteOption = {
  slug: RepairRouteSlug;
  label: string;
  description: string;
  bestFor: string;
  requirements: string | string[];
  icon: IconKey;
  value: RepairRoute;
  guidanceTitle: string;
  guidanceMessage: string;
  requiresPickupDetails?: boolean;
  requiresBulkDetails?: boolean;
};

export const repairRouteOptions: RepairRouteOption[] = [
  {
    slug: "drop-off-handover",
    label: "Drop-off / handover",
    description: "Best for customers who can safely hand over or arrange local drop-off of a device.",
    bestFor: "Individuals, schools, SMEs and local handover arrangements",
    requirements: [
      "Bring the device, charger and any relevant warranty or asset reference.",
      "Back up important data before handover where possible.",
      "Keep your ticket ID and status token after booking."
    ],
    icon: "package",
    value: "DROP_OFF",
    guidanceTitle: "Drop-off / handover selected",
    guidanceMessage: "This route is best when you can safely hand over the device directly or through an arranged local drop-off point. Include your charger, warranty reference, asset tag or order reference where available."
  },
  {
    slug: "mail-in-repair",
    label: "Mail-in repair",
    description: "Post the device securely after booking so the repair team can triage it on arrival.",
    bestFor: "Individuals, SMEs and schools outside a local handover area with devices that can be packaged safely.",
    requirements: "Use protective packaging and include charger, ticket details and any warranty reference.",
    icon: "mail",
    value: "MAIL_IN",
    guidanceTitle: "Mail-in repair selected",
    guidanceMessage: "This route is best for devices that can be packaged safely and sent to the repair intake workflow."
  },
  {
    slug: "pickup-request",
    label: "Pickup request",
    description: "Coordinated collection for organisations, bulk repairs, school labs and device refreshes.",
    bestFor: "Schools, SMEs, NGOs, bulk repairs, lab assets or organisations that need coordinated device collection.",
    requirements: "Share pickup address, preferred date, device count, access instructions and any school/lab requirements.",
    icon: "truck",
    value: "PICKUP_REQUEST",
    guidanceTitle: "Pickup request selected",
    guidanceMessage: "This route is best for schools, SMEs, NGOs, bulk repairs, lab assets or organisations that need coordinated device collection.",
    requiresPickupDetails: true
  },
  {
    slug: "partner-handover",
    label: "Partner handover",
    description: "Use an approved school, hub or partner location as the handover point.",
    bestFor: "Community hubs, training centres, school partners and local support models.",
    requirements: "Provide partner name, handover location, device list and repair ticket references where available.",
    icon: "handshake",
    value: "PARTNER_HANDOVER",
    guidanceTitle: "Partner handover selected",
    guidanceMessage: "This route is best when a trusted partner, hub or school is coordinating device handover and repair tracking."
  },
  {
    slug: "africa-deployment-support",
    label: "Africa deployment support",
    description: "Deployment-aware triage for Africa school labs, hubs and community technology partners.",
    bestFor: "Africa deployment partners, school labs, local technician support and spare-pool planning.",
    requirements: "Include country, partner contact, power/connectivity notes, criticality and any device list details.",
    icon: "globe",
    value: "AFRICA_DEPLOYMENT_SUPPORT",
    guidanceTitle: "Africa deployment support selected",
    guidanceMessage: "This route is best for partner-led deployment repairs where remote triage, local support and spare planning matter.",
    requiresPickupDetails: true
  },
  {
    slug: "bulk-school-lab-support",
    label: "Bulk school/lab support",
    description: "Batch repair intake for computer labs, learner devices, device trolleys and training centres.",
    bestFor: "School ICT labs, NGO training centres, bulk learner devices and classroom equipment.",
    requirements: "Provide organisation, location, device count, deadline, asset tags and any lab uptime constraints.",
    icon: "school",
    value: "BULK_SCHOOL_LAB_SUPPORT",
    guidanceTitle: "Bulk school/lab support selected",
    guidanceMessage: "This route is best for multiple devices where asset tracking, lab priorities, pickup planning and reporting are needed.",
    requiresPickupDetails: true,
    requiresBulkDetails: true
  }
];

export const repairRoutes = repairRouteOptions;

export const defaultRepairRoute = repairRouteOptions[0];

export const repairRouteSlugByCentreRouteId: Record<string, RepairRouteSlug> = {
  "repair-desk": "drop-off-handover",
  "mail-in": "mail-in-repair",
  "pickup-request": "pickup-request",
  "partner-handover": "partner-handover",
  "africa-deployment": "africa-deployment-support",
  "africa-deployment-support": "africa-deployment-support",
  "bulk-school-lab-support": "bulk-school-lab-support"
};

export function getRepairRouteBySlug(value?: string | null) {
  if (!value) return null;
  return repairRoutes.find((route) => route.slug === value) ?? null;
}

export function getRepairRouteByValue(value?: RepairRoute | string | null) {
  if (!value) return null;
  return repairRoutes.find((route) => route.value === value) ?? null;
}

export function getRepairRouteSlugForCentreRoute(routeId: string): RepairRouteSlug {
  return repairRouteSlugByCentreRouteId[routeId] ?? defaultRepairRoute.slug;
}

export function repairRouteBookingHref(slug: RepairRouteSlug) {
  return `/book-repair?route=${slug}`;
}
