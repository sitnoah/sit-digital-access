import type { IconKey } from "@/components/icons";

export type RepairService = {
  title: string;
  description: string;
  price: string;
  sla: string;
  icon: IconKey;
};

export type RepairCategoryCard = {
  title: string;
  value: string;
  description: string;
  turnaround: string;
  priceLabel: string;
  icon: IconKey;
};

export type RepairRouteCard = {
  title: string;
  value: "DROP_OFF" | "MAIL_IN" | "PICKUP_REQUEST";
  bestFor: string;
  requirements: string;
  icon: IconKey;
  available: boolean;
};

export const repairServices: RepairService[] = [
  { title: "Laptop diagnostics", description: "Hardware, battery, storage, thermal, port and OS checks with a clear repair route.", price: "From quote", sla: "24-48h diagnosis", icon: "laptop" },
  { title: "Screen replacement", description: "Panel sourcing, replacement, display testing and quality-check reporting.", price: "Part + labour", sla: "3-5 working days", icon: "monitor" },
  { title: "SSD / RAM upgrades", description: "Performance upgrades for learner, business and lab-ready refurbished devices.", price: "From parts cost", sla: "1-3 working days", icon: "hardDrive" },
  { title: "Keyboard and battery", description: "Common laptop part replacement with post-repair testing and warranty notes.", price: "Part + labour", sla: "3-5 working days", icon: "wrench" },
  { title: "OS recovery", description: "Windows recovery, driver setup, antivirus, account prep and learner-ready configuration.", price: "Fixed service", sla: "1-2 working days", icon: "settings" },
  { title: "Data recovery triage", description: "Safe first-line triage for recoverable files, failed drives and migration planning.", price: "Assessment first", sla: "3-7 working days", icon: "database" }
];

export const repairServiceCards: Array<{ title: string; description: string; icon: IconKey }> = [
  {
    title: "Diagnostics first",
    description: "Capture symptoms, warranty details and likely repair path before work is approved.",
    icon: "search"
  },
  {
    title: "Tracked repair tickets",
    description: "Every repair moves through a visible queue from booking to quality check and collection.",
    icon: "list"
  },
  {
    title: "Reuse before replacement",
    description: "Repairs, upgrades and parts recovery extend device life before recycling is considered.",
    icon: "wrench"
  },
  {
    title: "Deployment-ready aftercare",
    description: "Repaired devices can return to learners, staff teams, labs or circular inventory workflows.",
    icon: "shield"
  }
];

export const repairCategories = [
  "Laptop repair",
  "Desktop repair",
  "Mini PC repair",
  "Screen issue",
  "Battery or power issue",
  "Keyboard / touchpad issue",
  "SSD / RAM upgrade",
  "Operating system recovery",
  "Virus / malware cleanup",
  "Data recovery request",
  "Slow performance",
  "School lab device support",
  "Warranty / refurbished device support"
];

export const repairCategoryCards: RepairCategoryCard[] = [
  { title: "Laptop repair", value: "Laptop repair", description: "Diagnostics for screens, ports, keyboards, batteries and performance faults.", turnaround: "24-48h triage", priceLabel: "Quote required", icon: "laptop" },
  { title: "Desktop repair", value: "Desktop repair", description: "Tower, SFF and workstation checks for power, storage, OS and component issues.", turnaround: "24-48h triage", priceLabel: "Quote required", icon: "monitor" },
  { title: "Mini PC repair", value: "Mini PC repair", description: "Compact device diagnostics, low-power deployment checks and rebuild support.", turnaround: "24-48h triage", priceLabel: "Quote required", icon: "cpu" },
  { title: "Screen issue", value: "Screen issue", description: "Display faults, panel damage, external monitor checks and cable triage.", turnaround: "3-5 days", priceLabel: "Quote required", icon: "monitor" },
  { title: "Battery or power issue", value: "Battery or power issue", description: "Charging, adapter, battery, thermal and power-on fault diagnostics.", turnaround: "2-5 days", priceLabel: "Quote required", icon: "sun" },
  { title: "Keyboard / touchpad issue", value: "Keyboard / touchpad issue", description: "Input faults, stuck keys, damaged touchpads and accessibility impact checks.", turnaround: "2-5 days", priceLabel: "Part + labour", icon: "settings" },
  { title: "SSD / RAM upgrade", value: "SSD / RAM upgrade", description: "Performance upgrades for learner, SME and lab-ready refurbished devices.", turnaround: "1-3 days", priceLabel: "From parts cost", icon: "hardDrive" },
  { title: "Operating system recovery", value: "Operating system recovery", description: "Windows recovery, drivers, user setup and learner-ready configuration.", turnaround: "1-2 days", priceLabel: "From guide price", icon: "cloud" },
  { title: "Virus / malware cleanup", value: "Virus / malware cleanup", description: "Malware triage, cleanup, security checks and safe rebuild recommendations.", turnaround: "1-2 days", priceLabel: "From guide price", icon: "shield" },
  { title: "Data recovery request", value: "Data recovery request", description: "First-line recovery assessment for failed drives, user data and migration risks.", turnaround: "Assessment first", priceLabel: "Assessment required", icon: "database" },
  { title: "Slow performance", value: "Slow performance", description: "Storage, memory, startup, thermal and OS health checks with upgrade options.", turnaround: "24-48h triage", priceLabel: "Quote required", icon: "chart" },
  { title: "School lab device support", value: "School lab device support", description: "Bulk diagnostics for shared labs, trolleys, instructor devices and spares.", turnaround: "Planned intake", priceLabel: "Custom quote", icon: "school" },
  { title: "Warranty / refurbished device support", value: "Warranty / refurbished device support", description: "Reference validation, refurbished support checks and lifecycle repair history.", turnaround: "24-48h triage", priceLabel: "Warranty check", icon: "badge" }
];

export const repairRouteCards: RepairRouteCard[] = [
  {
    title: "Drop-off / handover",
    value: "DROP_OFF",
    bestFor: "Local repair handover, school or office collection point, or arranged delivery.",
    requirements: "Bring the device, charger and any warranty or asset reference.",
    icon: "package",
    available: true
  },
  {
    title: "Mail-in repair",
    value: "MAIL_IN",
    bestFor: "Customers who can package and send the device safely.",
    requirements: "Use protective packaging and include ticket details after booking.",
    icon: "mail",
    available: true
  },
  {
    title: "Pickup request",
    value: "PICKUP_REQUEST",
    bestFor: "Schools, SMEs, NGOs, bulk devices, lab support and corporate repair queues.",
    requirements: "Share device count, location, access constraints and urgency.",
    icon: "truck",
    available: true
  }
];

export const repairStatuses = [
  "New",
  "Triage",
  "Diagnostics",
  "Estimate sent",
  "Awaiting approval",
  "Repair in progress",
  "Waiting for parts",
  "Quality check",
  "Ready for pickup",
  "Ready for return",
  "Completed",
  "Cancelled",
  "Unrepairable"
];

export const repairCentres = [
  {
    name: "SIT Digital Access repair desk",
    region: "UK operations",
    location: "UK-wide intake",
    focus: "Refurbished laptops, desktops, mini PCs and school lab assets.",
    detail: "Suitable for laptops, mini PCs and accessories that can be shipped or handed over safely."
  },
  {
    name: "School and hub support route",
    region: "Partner sites",
    location: "Schools, SMEs and partner organisations",
    focus: "Scheduled maintenance visits, swaps, spares and remote support.",
    detail: "Best for batches, lab assets and corporate recycling-linked repair work."
  },
  {
    name: "Africa deployment repair route",
    region: "Partner network",
    location: "Deployment and community partners",
    focus: "Local technician enablement, spare part planning and escalation.",
    detail: "Used for school labs, community hubs and Africa deployment support models."
  }
];

export const repairPricingBands = [
  { category: "Diagnostics check", range: "Quote required", detail: "Initial inspection, symptoms review and repair route recommendation." },
  { category: "SSD / RAM upgrade", range: "From price placeholder", detail: "Performance upgrades for laptops, desktops and mini PCs." },
  { category: "OS recovery", range: "From price placeholder", detail: "Software recovery, driver setup, account prep and basic setup checks." },
  { category: "Virus cleanup", range: "From price placeholder", detail: "Malware cleanup, rebuild guidance and basic security checks." },
  { category: "Screen replacement", range: "Quote required", detail: "Laptop display replacement after model and panel compatibility checks." },
  { category: "Battery/power issue", range: "Quote required", detail: "Battery, charging, adapter, board and power-on diagnostics." },
  { category: "Data recovery", range: "Assessment required", detail: "Recovery feasibility depends on failure mode, media condition and data risk." },
  { category: "Bulk school lab support", range: "Custom quote", detail: "Batch diagnostics, pickup planning, asset tagging and repair reporting." }
];

export const repairWorkflowSteps = [
  "Submit repair booking",
  "Receive ticket ID and status token",
  "Triage and diagnostics",
  "Repair estimate or warranty check",
  "Approval before paid work",
  "Repair or upgrade",
  "Quality check",
  "Return / pickup / handover"
];

export const bulkRepairFeatures = [
  "Bulk device intake",
  "Lab device diagnostics",
  "Spare pool planning",
  "Replacement recommendations",
  "Pickup route",
  "Support history",
  "Asset tagging",
  "Repair reports"
];

export const repairTrustCards: Array<{ title: string; description: string; icon: IconKey }> = [
  { title: "Data handling consent", description: "Capture consent before diagnostics touches user data or recovery paths.", icon: "shield" },
  { title: "Secure wipe when requested", description: "Document wipe or recovery needs as part of the repair record.", icon: "database" },
  { title: "Diagnostic records", description: "Keep symptoms, findings and repair route in a tracked ticket.", icon: "list" },
  { title: "Warranty/reference tracking", description: "Record warranty, order and refurbished device references.", icon: "badge" },
  { title: "Asset tag support", description: "Useful for schools, hubs, SMEs and donation refurbishment workflows.", icon: "package" },
  { title: "Status tracking", description: "Ticket ID and token expose only customer-safe updates.", icon: "search" },
  { title: "Quality check before return", description: "Devices move through test and release before pickup or handover.", icon: "check" },
  { title: "Admin audit trail", description: "Admin operations can track assignment, status and lifecycle decisions.", icon: "settings" }
];

export const lifecycleStages = [
  "Procurement",
  "Diagnostics",
  "Repair",
  "Refurbishment",
  "Inventory",
  "Marketplace",
  "Deployment",
  "Support",
  "Recovery",
  "Recycling",
  "Retirement"
];

export const lifecycleSteps = [
  { title: "Procurement", description: "Source donated, sponsored, purchased or recovered devices.", icon: "package" as IconKey },
  { title: "Diagnostics", description: "Assess condition, data handling, specifications and repair needs.", icon: "search" as IconKey },
  { title: "Repair", description: "Replace parts, recover software, upgrade performance and document outcomes.", icon: "wrench" as IconKey },
  { title: "Refurbishment", description: "Clean, wipe, configure and prepare devices for reliable second-life use.", icon: "settings" as IconKey },
  { title: "Inventory", description: "Track asset tags, grades, warranty, location and deployment readiness.", icon: "database" as IconKey },
  { title: "Marketplace / deployment", description: "Supply devices through requests, bundles, sponsorship or public catalogue routes.", icon: "truck" as IconKey },
  { title: "Support", description: "Record aftercare, maintenance, repair history and customer communication.", icon: "headset" as IconKey },
  { title: "Recovery", description: "Bring devices back from deployments, donors or corporate refresh cycles.", icon: "recycle" as IconKey },
  { title: "Recycling", description: "Recover parts and process e-waste responsibly when reuse is no longer practical.", icon: "leaf" as IconKey },
  { title: "Retirement", description: "Close lifecycle records with impact, evidence and final route documented.", icon: "badge" as IconKey }
];
