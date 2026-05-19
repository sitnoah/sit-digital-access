import type {
  RepairCentreFAQ,
  RepairCentreRoute,
  RepairInfoCard,
  RepairLocationCard,
  RepairNetworkNode,
  RepairRouteRecommendation
} from "@/types/repair-centre";

export const repairRoutes: RepairCentreRoute[] = [
  {
    id: "repair-desk",
    title: "SIT Digital Access Repair Desk",
    subtitle: "UK-wide intake",
    bestFor: "Single laptops, mini PCs, desktops and accessories that can be safely shipped or handed over.",
    deviceCount: "1-2 devices",
    turnaround: "Diagnostics usually starts after intake",
    requirements: "Device, charger, ticket details and any warranty or asset reference.",
    includes: ["Ticket creation", "Diagnostics", "Repair estimate", "Quality check", "Return handover"],
    icon: "package",
    bookingRoute: "DROP_OFF"
  },
  {
    id: "mail-in",
    title: "Mail-in Repair",
    subtitle: "Ship your device safely",
    bestFor: "Individuals, SMEs and schools outside local handover areas.",
    deviceCount: "1-5 devices",
    turnaround: "Depends on dispatch and diagnostics",
    requirements: "Protective packaging, charger where relevant and ticket reference inside the parcel.",
    includes: ["Packing guidance", "Ticket tracking", "Diagnostics update", "Return route"],
    icon: "mail",
    bookingRoute: "MAIL_IN"
  },
  {
    id: "pickup-request",
    title: "Pickup Request",
    subtitle: "Best for schools, SMEs, NGOs and bulk repairs",
    bestFor: "Multiple devices, lab assets, corporate refreshes and urgent repair batches.",
    deviceCount: "2-50+ devices",
    turnaround: "Planned around pickup window and urgency",
    requirements: "Device count, pickup location, access constraints, deadline and asset tag details where possible.",
    includes: ["Pickup planning", "Batch intake", "Asset tagging", "Repair report"],
    icon: "truck",
    bookingRoute: "PICKUP_REQUEST"
  },
  {
    id: "partner-handover",
    title: "Partner Handover Route",
    subtitle: "Through approved schools, hubs or partners",
    bestFor: "Community hubs, training centres and local partner support models.",
    deviceCount: "1-15 devices",
    turnaround: "Depends on partner handover schedule",
    requirements: "Partner name, handover point, device list and repair ticket references.",
    includes: ["Handover checklist", "Partner intake log", "Status tracking", "Support escalation"],
    icon: "handshake",
    bookingRoute: "DROP_OFF"
  },
  {
    id: "africa-deployment",
    title: "Africa Deployment Repair Route",
    subtitle: "Deployment and community partner support",
    bestFor: "School labs, community hubs and Africa deployment support models.",
    deviceCount: "Lab, hub and partner batches",
    turnaround: "Planned with partner capacity and spare pools",
    requirements: "Country, partner contact, power/connectivity context, device list and criticality.",
    includes: ["Remote diagnostics", "Local technician support", "Spare pool planning", "Replacement guidance"],
    icon: "globe",
    bookingRoute: "AFRICA_DEPLOYMENT_SUPPORT"
  },
  {
    id: "bulk-school-lab-support",
    title: "Bulk School/Lab Support",
    subtitle: "Batch diagnostics and lab reporting",
    bestFor: "School ICT labs, training centres, NGO equipment and shared learner-device pools.",
    deviceCount: "2-50+ devices",
    turnaround: "Planned around lab urgency and pickup window",
    requirements: "Organisation, location, device count, deadline, asset tags and school/lab requirements.",
    includes: ["Batch intake", "Asset tagging", "Lab support planning", "Repair report"],
    icon: "school",
    bookingRoute: "BULK_SCHOOL_LAB_SUPPORT"
  }
];

export const routeRecommenderRules: Record<string, RepairRouteRecommendation> = {
  singlePostable: {
    routeId: "mail-in",
    reason: "A single postable device is usually simplest to track through the mail-in route.",
    nextStep: "Book a repair, choose mail-in and include the device model, charger details and symptoms."
  },
  singleNoPost: {
    routeId: "repair-desk",
    reason: "If a single device cannot be posted, a handover-style repair desk route is safer.",
    nextStep: "Book a repair and choose drop-off / handover so operations can confirm intake."
  },
  smallBatchNoPost: {
    routeId: "pickup-request",
    reason: "Small batches that cannot be posted benefit from a planned pickup and batch intake.",
    nextStep: "Book a repair with pickup request and include device count, location and deadline."
  },
  bulk: {
    routeId: "bulk-school-lab-support",
    reason: "Larger batches need pickup planning, asset tagging and repair reporting.",
    nextStep: "Book bulk school/lab support and include device count, asset tags and lab or office constraints."
  },
  labCritical: {
    routeId: "bulk-school-lab-support",
    reason: "Lab-critical repairs need prioritisation, spare planning and route coordination.",
    nextStep: "Book bulk school/lab support and mark urgency as school/lab critical."
  },
  africa: {
    routeId: "africa-deployment",
    reason: "Africa deployment partners need remote triage, local technician support and spare pool planning.",
    nextStep: "Discuss Africa repair support with deployment context, country and partner details."
  },
  partner: {
    routeId: "partner-handover",
    reason: "Partner handover keeps local hub or school intake visible while preserving status tracking.",
    nextStep: "Book a repair and include the partner, hub or handover point in the location field."
  }
};

export const repairNetworkNodes: RepairNetworkNode[] = [
  {
    id: "uk-intake",
    label: "UK repair intake",
    region: "UK-wide",
    detail: "Mail-in, handover and repair desk coordination.",
    metric: "Tickets tracked",
    x: 25,
    y: 34,
    icon: "package"
  },
  {
    id: "schools",
    label: "Schools and hubs",
    region: "Partner routes",
    detail: "Batch pickup, partner handover and lab maintenance.",
    metric: "Batch repairs",
    x: 46,
    y: 52,
    icon: "school"
  },
  {
    id: "corporate",
    label: "Corporate refresh",
    region: "SME and CSR",
    detail: "Bulk diagnostics, repair vs reuse and reporting.",
    metric: "Partner handovers",
    x: 58,
    y: 28,
    icon: "business"
  },
  {
    id: "africa",
    label: "Africa deployment support",
    region: "Liberia, Ghana, Sierra Leone, Nigeria and wider Africa",
    detail: "Remote triage, local technicians and spare planning.",
    metric: "Quality checks",
    x: 76,
    y: 64,
    icon: "globe"
  }
];

export const batchRepairFeatures: RepairInfoCard[] = [
  { title: "Bulk diagnostics", description: "Assess repeated faults, lab-wide issues and priority repairs.", icon: "search" },
  { title: "Device intake sheet", description: "Capture device count, model, issue, charger and route information.", icon: "list" },
  { title: "Asset tag matching", description: "Match school, lab, SME or donor asset tags to repair tickets.", icon: "badge" },
  { title: "Repair prioritisation", description: "Separate urgent learner or operational devices from lower-priority repairs.", icon: "sliders" },
  { title: "Spare pool planning", description: "Plan temporary replacements or spare devices for learning continuity.", icon: "database" },
  { title: "Lab uptime support", description: "Support shared computer labs, trolleys and instructor devices.", icon: "school" },
  { title: "Repair report", description: "Summarise repair outcomes, unrepairable items and recommended next routes.", icon: "chart" },
  { title: "Return coordination", description: "Coordinate handover, pickup, mail-back or redeployment routes.", icon: "truck" }
];

export const africaRepairSupport: RepairInfoCard[] = [
  { title: "Remote triage", description: "Support first-line diagnostics before devices move between partners.", icon: "headset" },
  { title: "Local technician enablement", description: "Guide local repair, escalation and maintenance workflows.", icon: "wrench" },
  { title: "Spare device planning", description: "Plan spares for labs and community hubs where uptime matters.", icon: "package" },
  { title: "Replacement guidance", description: "Decide when repair, replacement, parts recovery or recycling is best.", icon: "recycle" },
  { title: "Offline-first lab support", description: "Account for offline learning environments and low-connectivity support.", icon: "offline" },
  { title: "Power-aware strategy", description: "Consider solar, generator and low-power device constraints.", icon: "sun" },
  { title: "Repair vs replace decisions", description: "Use lifecycle thinking before devices are retired or redeployed.", icon: "settings" }
];

export const africaRepairCountries = ["Liberia", "Ghana", "Sierra Leone", "Nigeria", "Wider Africa"];

export const repairRouteWorkflow: RepairInfoCard[] = [
  { title: "Book repair", description: "Submit the intake form with device and issue details.", icon: "wrench" },
  { title: "Choose route", description: "Select mail-in, pickup, handover or deployment support.", icon: "sliders" },
  { title: "Receive tracking", description: "Keep the ticket ID and status token for customer-safe updates.", icon: "shield" },
  { title: "Handover", description: "Post, hand over, prepare pickup or coordinate partner intake.", icon: "truck" },
  { title: "Diagnostics", description: "Confirm repair route, estimate, warranty or replacement recommendation.", icon: "search" },
  { title: "Repair decision", description: "Proceed with repair, upgrade, replacement or lifecycle recovery.", icon: "settings" },
  { title: "Quality check", description: "Test before return, pickup, redeployment or closure.", icon: "check" },
  { title: "Return route", description: "Return, hand over, redeploy or report final outcome.", icon: "package" }
];

export const repairCentreTrustCards: RepairInfoCard[] = [
  { title: "Ticket-based tracking", description: "Every route begins with a tracked repair ticket.", icon: "list" },
  { title: "Status token access", description: "Public status uses a private token rather than exposing internal data.", icon: "shield" },
  { title: "Data handling consent", description: "Consent is captured before diagnostics touches data-sensitive paths.", icon: "badge" },
  { title: "Secure wipe where requested", description: "Data wipe and recovery needs can be logged in the repair workflow.", icon: "database" },
  { title: "Quality check before return", description: "Devices are tested before pickup, return or redeployment.", icon: "check" },
  { title: "Asset tag support", description: "Useful for schools, SMEs, donors and deployment partners.", icon: "package" },
  { title: "Batch repair reporting", description: "Bulk repairs can produce practical operations summaries.", icon: "chart" },
  { title: "Admin audit trail", description: "Operational updates are traceable inside the admin command centre.", icon: "settings" }
];

export const repairLocationCards: RepairLocationCard[] = [
  {
    title: "UK-wide intake",
    serviceType: "Repair desk and mail-in coordination",
    availableRoutes: "Repair desk, mail-in, partner handover",
    bestFor: "Individuals, SMEs and single-device school repairs.",
    routeId: "repair-desk",
    icon: "map"
  },
  {
    title: "Local partner handover placeholder",
    serviceType: "Partner route",
    availableRoutes: "Approved school, hub or partner handover",
    bestFor: "Community hubs and training centres with local intake points.",
    routeId: "partner-handover",
    icon: "handshake"
  },
  {
    title: "School pickup request",
    serviceType: "Batch repair intake",
    availableRoutes: "Pickup request, batch diagnostics, repair report",
    bestFor: "Schools, labs, device trolleys and learner device pools.",
    routeId: "pickup-request",
    icon: "school"
  },
  {
    title: "Bulk school/lab support",
    serviceType: "Batch diagnostics and repair reporting",
    availableRoutes: "Bulk school/lab support, pickup planning, asset tagging",
    bestFor: "School labs, training centres, device trolleys and learner pools.",
    routeId: "bulk-school-lab-support",
    icon: "school"
  },
  {
    title: "Corporate refresh intake",
    serviceType: "SME and CSR repair route",
    availableRoutes: "Pickup, repair-vs-reuse triage, reporting",
    bestFor: "Device refreshes, donated devices and bulk workplace repairs.",
    routeId: "pickup-request",
    icon: "business"
  },
  {
    title: "Africa deployment support",
    serviceType: "Remote and partner-enabled support",
    availableRoutes: "Remote triage, local technician support, spare planning",
    bestFor: "Deployment partners, school labs and community hubs.",
    routeId: "africa-deployment",
    icon: "globe"
  }
];

export const repairCentreFAQs: RepairCentreFAQ[] = [
  {
    question: "Do you have physical repair centres?",
    answer: "SIT Digital Access currently presents repair routes rather than a public walk-in shop list. Repair desk, mail-in, pickup and partner handover routes are coordinated through tracked tickets."
  },
  {
    question: "Can I mail in a device?",
    answer: "Yes. Mail-in repair is suitable when a device can be packaged safely and the charger or relevant accessories can be included where needed."
  },
  {
    question: "Can schools request pickup?",
    answer: "Yes. Schools should use the pickup request route and include device count, location, deadline, access details and any asset tags in the booking."
  },
  {
    question: "Can you repair multiple devices at once?",
    answer: "Yes. Bulk diagnostics and batch intake are designed for schools, SMEs, NGOs, corporate refreshes and lab maintenance."
  },
  {
    question: "Do you support Africa deployment repairs?",
    answer: "Yes. Africa support is partner-led and can include remote triage, local technician enablement, spare device planning and replacement guidance."
  },
  {
    question: "How do I track my repair?",
    answer: "After booking, keep the ticket ID and status token. Use the Repair Status page to see customer-safe progress updates."
  },
  {
    question: "What happens if a device is unrepairable?",
    answer: "The team can advise replacement, parts recovery, reuse, recycling or retirement routes depending on condition and context."
  },
  {
    question: "Can repair be linked to warranty or asset tag?",
    answer: "Yes. The booking flow captures warranty references, serial numbers and asset tags to support school, SME and refurbished-device workflows."
  },
  {
    question: "Can you repair donated devices?",
    answer: "Yes. Donated equipment can be triaged for repair, refurbishment, parts recovery or responsible recycling."
  },
  {
    question: "Can you support corporate refresh batches?",
    answer: "Yes. Corporate refreshes can use pickup request for batch intake, diagnostics, repair-vs-reuse decisioning and reporting."
  }
];
