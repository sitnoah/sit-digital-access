import type {
  BulkSupportOption,
  DataRiskLevel,
  DataRiskTone,
  EstimateBand,
  RepairEstimateInputs,
  RepairEstimateResult,
  RepairFaqItem,
  RepairPricingApiShell,
  RepairPricingCategory,
  RepairTrustCard,
  RepairWorkflowStep,
  TurnaroundRange,
  WarrantyRule
} from "@/types/repair-pricing";

export const repairCategories: RepairPricingCategory[] = [
  {
    id: "diagnostics-check",
    title: "Diagnostics Check",
    categoryBadge: "Inspection",
    description: "Initial inspection, symptoms review and repair route recommendation.",
    pricing: "Quote required",
    estimateRange: "Quote required after intake",
    includes: [
      "Device assessment",
      "Basic diagnostics",
      "Repair route recommendation",
      "Ticket creation"
    ],
    turnaround: "24-48h triage",
    difficulty: "Medium",
    warrantyEligible: true,
    icon: "search"
  },
  {
    id: "ssd-ram-upgrade",
    title: "SSD / RAM Upgrade",
    categoryBadge: "Performance",
    description: "Performance upgrades for laptops, desktops and mini PCs.",
    pricing: "From £XX placeholder",
    estimateRange: "£XX-£XXX guide band",
    includes: [
      "Hardware compatibility check",
      "Installation",
      "Basic testing"
    ],
    turnaround: "1-3 working days",
    difficulty: "Medium",
    warrantyEligible: true,
    icon: "hardDrive"
  },
  {
    id: "os-recovery",
    title: "OS Recovery",
    categoryBadge: "Software",
    description: "Software recovery, driver setup, account prep and setup checks.",
    pricing: "From £XX placeholder",
    estimateRange: "£XX-£XX guide band",
    includes: [
      "OS reinstall",
      "Driver setup",
      "Basic optimisation"
    ],
    turnaround: "1-2 working days",
    difficulty: "Low",
    warrantyEligible: false,
    icon: "cloud"
  },
  {
    id: "virus-cleanup",
    title: "Virus Cleanup",
    categoryBadge: "Security",
    description: "Malware cleanup, rebuild guidance and baseline security checks.",
    pricing: "From £XX placeholder",
    estimateRange: "£XX-£XX guide band",
    includes: [
      "Malware removal",
      "Security checks",
      "Browser cleanup"
    ],
    turnaround: "1-2 working days",
    difficulty: "Medium",
    warrantyEligible: false,
    icon: "shield"
  },
  {
    id: "screen-replacement",
    title: "Screen Replacement",
    categoryBadge: "Parts",
    description: "Laptop display replacement after compatibility checks.",
    pricing: "Quote required",
    estimateRange: "£XX-£XXX guide band",
    includes: [
      "Screen diagnostics",
      "Panel compatibility",
      "Replacement estimate"
    ],
    turnaround: "3-5 working days",
    difficulty: "High",
    warrantyEligible: true,
    icon: "monitor"
  },
  {
    id: "battery-power-issue",
    title: "Battery / Power Issue",
    categoryBadge: "Power",
    description: "Battery, charging, adapter and power-on diagnostics.",
    pricing: "Quote required",
    estimateRange: "£XX-£XXX guide band",
    includes: [
      "Power diagnostics",
      "Charging checks",
      "Adapter testing"
    ],
    turnaround: "2-5 working days",
    difficulty: "High",
    warrantyEligible: true,
    icon: "sun"
  },
  {
    id: "data-recovery",
    title: "Data Recovery",
    categoryBadge: "Data risk",
    description: "Recovery feasibility depends on failure mode and storage condition.",
    pricing: "Assessment required",
    estimateRange: "Assessment required · £XX-£XXX+ guide band",
    includes: [
      "Recovery assessment",
      "Drive health review",
      "Risk evaluation"
    ],
    turnaround: "3-7 working days",
    difficulty: "Specialist",
    warrantyEligible: false,
    icon: "database"
  },
  {
    id: "bulk-school-lab-support",
    title: "Bulk School Lab Support",
    categoryBadge: "Bulk operations",
    description: "Batch diagnostics, pickup planning, asset tagging and repair reporting.",
    pricing: "Custom quote",
    estimateRange: "Custom quote · batch guide band",
    includes: [
      "Multi-device intake",
      "Lab support planning",
      "Reporting workflow"
    ],
    turnaround: "Planned intake",
    difficulty: "Specialist",
    warrantyEligible: true,
    icon: "school"
  }
];

export const estimateBands: EstimateBand[] = repairCategories.map((category) => ({
  categoryId: category.id,
  range: category.estimateRange,
  diagnosticRequirement:
    category.pricing === "Quote required" || category.pricing === "Assessment required" || category.pricing === "Custom quote"
      ? "Diagnostics required before a final quote is confirmed."
      : "Diagnostics recommended before parts, labour and setup are confirmed.",
  recommendedRoute:
    category.id === "bulk-school-lab-support"
      ? "Bulk intake with asset tagging and pickup planning."
      : category.id === "data-recovery"
        ? "Data-aware diagnostics before recovery work proceeds."
        : "Standard diagnostics and estimate confirmation.",
  turnaround: category.turnaround,
  dataRisk:
    category.id === "data-recovery"
      ? "High"
      : category.id === "os-recovery" || category.id === "virus-cleanup"
        ? "Medium"
        : "Low"
}));

export const turnaroundRanges: TurnaroundRange[] = [
  {
    id: "triage",
    label: "Diagnostics triage",
    range: "24-48h",
    description: "Initial review, symptom capture, warranty notes and route recommendation."
  },
  {
    id: "standard",
    label: "Standard repair",
    range: "1-5 working days",
    description: "Typical software, upgrade, screen, battery and power repair window after approval."
  },
  {
    id: "specialist",
    label: "Specialist assessment",
    range: "3-7 working days",
    description: "Data recovery, complex failures and part-availability cases need deeper checks."
  },
  {
    id: "bulk",
    label: "School or NGO batch",
    range: "Planned intake",
    description: "Multi-device diagnostics, pickup scheduling, asset tagging and reporting."
  }
];

export const warrantyRules: WarrantyRule[] = [
  {
    id: "sit-refurbished",
    title: "SIT refurbished devices",
    description: "Order, asset and refurbishment references can be checked before paid work is recommended.",
    appliesTo: "SIT Digital Access refurbished laptops, desktops, mini PCs and lab devices.",
    icon: "badge"
  },
  {
    id: "asset-reference",
    title: "Asset references",
    description: "School, NGO and deployment assets can be linked to repair history and support records.",
    appliesTo: "School labs, training centres, donor devices and partner deployments.",
    icon: "package"
  },
  {
    id: "warranty-decision",
    title: "Warranty decision path",
    description: "Warranty-aware handling separates covered checks from quote-only parts and labour.",
    appliesTo: "Warranty, expired warranty, unknown coverage and donor-device triage.",
    icon: "shield"
  },
  {
    id: "deployment-support",
    title: "Deployment support",
    description: "Repair decisions can account for classroom uptime, spare pools and Africa deployment readiness.",
    appliesTo: "Education, Africa deployment and community access operations.",
    icon: "globe"
  }
];

export const bulkSupportOptions: BulkSupportOption[] = [
  {
    id: "school-ict-labs",
    title: "School ICT labs",
    description: "Classroom and lab diagnostics, shared-device checks, pickup scheduling and spare pool planning.",
    icon: "school"
  },
  {
    id: "ngo-field-devices",
    title: "NGO field devices",
    description: "Repair triage for field teams, donor-funded devices, remote work kits and deployment returns.",
    icon: "heart"
  },
  {
    id: "training-centre-equipment",
    title: "Training centre equipment",
    description: "Batch repairs for instructor devices, learner laptops, mini PCs and support accessories.",
    icon: "graduation"
  },
  {
    id: "africa-deployment-support",
    title: "Africa deployment support",
    description: "Deployment-aware repair planning, part forecasting, support records and escalation routes.",
    icon: "globe"
  }
];

export const repairWorkflowSteps: RepairWorkflowStep[] = [
  {
    title: "Book repair",
    description: "Create a repair request with device, issue, route and contact details.",
    indicator: "Ticket created",
    checkpoint: "Intake confirms route and urgency.",
    icon: "wrench"
  },
  {
    title: "Diagnostics & triage",
    description: "Symptoms, power, storage, display, software and warranty context are reviewed.",
    indicator: "Diagnostics active",
    checkpoint: "Data and warranty risks are flagged.",
    icon: "search"
  },
  {
    title: "Estimate confirmation",
    description: "The repair path is confirmed with parts, labour, warranty and turnaround context.",
    indicator: "Estimate prepared",
    checkpoint: "Quote-only cases stay pending.",
    icon: "cost"
  },
  {
    title: "Approval before work",
    description: "Paid repair work only proceeds after approval, parts confirmation or support decision.",
    indicator: "Approval gate",
    checkpoint: "Customer decision captured.",
    icon: "shield"
  },
  {
    title: "Repair or upgrade",
    description: "Approved replacement, recovery, rebuild or performance upgrade work is completed.",
    indicator: "Work in progress",
    checkpoint: "Technician notes update the ticket.",
    icon: "settings"
  },
  {
    title: "Quality check",
    description: "Post-repair checks validate power, display, storage, OS and readiness before release.",
    indicator: "QC required",
    checkpoint: "Return only after checks pass.",
    icon: "check"
  },
  {
    title: "Return or deployment",
    description: "The device is returned, collected, redeployed or moved into a school support workflow.",
    indicator: "Ready",
    checkpoint: "Lifecycle visibility retained.",
    icon: "truck"
  }
];

export const repairTrustCards: RepairTrustCard[] = [
  {
    title: "Approval before paid work",
    description: "Repairs pause at the estimate stage until the customer, school or organisation approves the route.",
    icon: "check"
  },
  {
    title: "Transparent diagnostics",
    description: "Symptoms, findings, warranty context and route recommendations are treated as part of the ticket.",
    icon: "search"
  },
  {
    title: "Data-aware handling",
    description: "Data recovery and OS work are flagged before actions that may affect user files or storage health.",
    icon: "database"
  },
  {
    title: "Warranty checks",
    description: "SIT refurbished references, asset tags and warranty details are checked before paid work proceeds.",
    icon: "badge"
  },
  {
    title: "Replacement part validation",
    description: "Screens, batteries, chargers, RAM and SSDs are checked against model compatibility.",
    icon: "package"
  },
  {
    title: "Repair tracking",
    description: "Ticket ID and status token keep public updates separate from internal diagnostic records.",
    icon: "list"
  },
  {
    title: "Technician review",
    description: "Repair recommendations are shaped by device condition, urgency, support history and reuse value.",
    icon: "headset"
  },
  {
    title: "Quality check before return",
    description: "Devices move through testing before collection, return dispatch or deployment handover.",
    icon: "shield"
  }
];

export const repairFaq: RepairFaqItem[] = [
  {
    question: "Why are some repairs quote-only?",
    answer: "Part prices, model compatibility, failure mode and warranty status can change the final route, so SIT Digital Access confirms quote-only repairs after diagnostics."
  },
  {
    question: "Does diagnostics cost extra?",
    answer: "Diagnostics are confirmed during intake. Some routes may require an assessment fee or quote before paid repair work begins."
  },
  {
    question: "Can I approve work after diagnostics?",
    answer: "Yes. Paid repair work waits for estimate confirmation, approval, parts validation or a warranty decision."
  },
  {
    question: "Do you support school lab repairs?",
    answer: "Yes. SIT Digital Access supports bulk school lab intake, asset tagging, pickup planning, spare pool guidance and repair reporting."
  },
  {
    question: "Can devices be picked up?",
    answer: "Pickup can be planned for schools, NGOs, businesses, bulk device batches and selected repair operations."
  },
  {
    question: "Do you support Africa deployment repairs?",
    answer: "Yes. Repair planning can account for Africa deployment readiness, local partner support, part availability and classroom uptime."
  },
  {
    question: "What if parts are unavailable?",
    answer: "The repair route may change to alternative sourcing, upgrade recommendation, refurbishment route, parts recovery or recycling guidance."
  },
  {
    question: "Can I request upgrades instead of repairs?",
    answer: "Yes. SSD, RAM, OS recovery and performance work can be recommended when an upgrade is a better route than replacement."
  },
  {
    question: "Is data recovery guaranteed?",
    answer: "No. Data recovery depends on failure mode, storage condition, prior damage and whether the drive remains readable."
  },
  {
    question: "How are refurbished device warranties handled?",
    answer: "SIT Digital Access can validate refurbished device references, asset tags and support history before confirming warranty-aware handling."
  }
];

export const repairPricingApiShell: RepairPricingApiShell = {
  repairPricing: {
    method: "GET",
    path: "/api/v1/repair-pricing",
    returns: "Repair pricing categories, estimate bands, turnaround ranges, warranty rules and bulk support options."
  },
  repairEstimate: {
    method: "GET",
    path: "/api/v1/repairs/estimate",
    returns: "A non-final repair estimate band, diagnostic requirement, recommended route, turnaround and data-risk signal."
  },
  createRepair: {
    method: "POST",
    path: "/api/v1/repairs",
    body: "Existing repair booking payload used by the current repair intake workflow."
  }
};

const defaultEstimate = estimateBands[0];

function riskTone(risk: DataRiskLevel): DataRiskTone {
  if (risk === "High") return "red";
  if (risk === "Medium") return "amber";
  return "green";
}

export function calculateRepairEstimate(inputs: RepairEstimateInputs): RepairEstimateResult {
  const category = repairCategories.find((item) => item.id === inputs.issueCategory) ?? repairCategories[0];
  const band = estimateBands.find((item) => item.categoryId === category.id) ?? defaultEstimate;
  const warrantyAware = inputs.warrantyStatus === "sit-refurbished" || inputs.warrantyStatus === "manufacturer";
  const urgent = inputs.urgency === "urgent" || inputs.urgency === "school-lab-critical";
  const bulkRoute = inputs.organisationSupport || inputs.pickupRequired || category.id === "bulk-school-lab-support";
  const highRisk = category.id === "data-recovery";
  const mediumRisk = category.id === "os-recovery" || category.id === "virus-cleanup";
  const dataRisk: DataRiskLevel = highRisk ? "High" : mediumRisk ? "Medium" : band.dataRisk;

  const route = bulkRoute
    ? "Bulk repair operations route with asset tracking and pickup planning."
    : warrantyAware
      ? "Warranty validation followed by diagnostics and estimate confirmation."
      : urgent
        ? "Priority diagnostics route, subject to technician capacity and part availability."
        : band.recommendedRoute;

  const notes = [
    "This is not a final quote. Diagnostics confirm the final repair estimate.",
    warrantyAware
      ? "Warranty or refurbished-device references should be checked before paid work proceeds."
      : "Warranty status may change the final repair route.",
    inputs.brand.trim()
      ? `${inputs.brand.trim()} model compatibility and parts availability still need validation.`
      : "Brand, model and serial details can improve estimate accuracy."
  ];

  return {
    estimateRange: urgent ? `${band.range} · urgency may affect turnaround` : band.range,
    diagnosticRequirement: band.diagnosticRequirement,
    recommendedRoute: route,
    typicalTurnaround: urgent ? "Priority triage, then confirmed after diagnostics" : band.turnaround,
    dataRisk,
    dataRiskTone: riskTone(dataRisk),
    notes
  };
}
