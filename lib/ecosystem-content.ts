import type { IconKey } from "@/components/icons";

export type EcosystemMetric = {
  value: string;
  label: string;
  detail: string;
  icon: IconKey;
};

export type EcosystemFeature = {
  title: string;
  description: string;
  icon: IconKey;
  metadata?: string;
};

export type EcosystemPathway = EcosystemFeature & {
  steps: string[];
  ctaLabel: string;
  href: string;
};

export type EcosystemStory = {
  title: string;
  category: "Learner" | "School" | "NGO" | "Community" | "Business";
  region: string;
  summary: string;
  metrics: string[];
};

export type DeploymentMapRegion = {
  name: string;
  status: "Planning" | "Active" | "Scaling";
  readiness: number;
  focus: string;
  power: string;
  connectivity: string;
  partners: string;
};

export const sustainabilityMetrics: EcosystemMetric[] = [
  {
    value: "Reuse first",
    label: "circular technology model",
    detail: "Prioritise useful second-life devices before responsible recycling.",
    icon: "recycle"
  },
  {
    value: "CO2",
    label: "estimated emissions avoided",
    detail: "Reuse impact can be estimated from deployed and diverted devices.",
    icon: "leaf"
  },
  {
    value: "Wipe",
    label: "data protection workflow",
    detail: "Secure wipe guidance, asset records and handover controls.",
    icon: "shield"
  },
  {
    value: "Deploy",
    label: "education and community reuse",
    detail: "Prepared hardware routes into schools, hubs, NGOs and Africa deployments.",
    icon: "globe"
  }
];

export const reuseJourney: EcosystemFeature[] = [
  {
    title: "Collect",
    description: "Plan donor handover, device counts, pickup location and corporate release notes.",
    icon: "truck",
    metadata: "Donation and CSR intake"
  },
  {
    title: "Secure",
    description: "Apply data wipe guidance, triage condition and decide reuse, repair or recycle route.",
    icon: "shield",
    metadata: "Data protection first"
  },
  {
    title: "Refurbish",
    description: "Grade, test, upgrade, configure and tag assets for real deployment conditions.",
    icon: "wrench",
    metadata: "Quality and readiness"
  },
  {
    title: "Redeploy",
    description: "Match devices to learners, labs, hubs, NGOs and Africa partners with impact reporting.",
    icon: "package",
    metadata: "Social impact route"
  }
];

export const csrPartnerships: EcosystemPathway[] = [
  {
    title: "Corporate device recycling",
    description: "Turn retired laptops, desktops and accessories into a measurable circular technology programme.",
    icon: "recycle",
    metadata: "ESG and CSR",
    steps: ["Device audit", "Collection plan", "Secure wipe route", "Impact report"],
    ctaLabel: "Discuss recycling",
    href: "/donate#donation-form"
  },
  {
    title: "Sponsor school and hub labs",
    description: "Fund classroom, training-centre or community hub device bundles with clear deployment outcomes.",
    icon: "school",
    metadata: "Education access",
    steps: ["Choose bundle", "Confirm site", "Prepare devices", "Report outcomes"],
    ctaLabel: "Sponsor a lab",
    href: "/donate"
  },
  {
    title: "Sponsor digital skills cohorts",
    description: "Connect refurbished devices with practical AI, productivity, cybersecurity and digital literacy pathways.",
    icon: "graduation",
    metadata: "Skills enablement",
    steps: ["Define cohort", "Match devices", "Plan training", "Track completion"],
    ctaLabel: "Plan a cohort",
    href: "/contact?type=PARTNERSHIP#contact-form"
  }
];

export const communityHubPackages: EcosystemPathway[] = [
  {
    title: "Starter access hub",
    description: "A compact package for libraries, churches, charities and small community organisations.",
    icon: "building",
    metadata: "5-10 devices",
    steps: ["Shared laptops", "Basic accessories", "Asset list", "Remote support route"],
    ctaLabel: "Request starter hub",
    href: "/devices?categories=Student%20laptops,Accessories#device-catalogue"
  },
  {
    title: "Training room hub",
    description: "A structured learning room for digital literacy, employability, coding or AI literacy sessions.",
    icon: "users",
    metadata: "10-24 seats",
    steps: ["Lab devices", "Instructor device", "Cloud setup", "Training pathway"],
    ctaLabel: "Build training hub",
    href: "/devices?categories=Computer%20lab%20bundles#device-catalogue"
  },
  {
    title: "Africa-ready community lab",
    description: "Power-aware, support-conscious hub planning for local partners and shared access models.",
    icon: "globe",
    metadata: "Low-power deployment",
    steps: ["Mini PCs", "Offline-first plan", "Partner handover", "Maintenance owner"],
    ctaLabel: "Explore deployment",
    href: "/africa-deployment"
  }
];

export const marketplaceTrustFeatures: EcosystemFeature[] = [
  {
    title: "Transparent grading",
    description: "Grade A, B and C descriptions make condition tradeoffs clear before a request is made.",
    icon: "badge"
  },
  {
    title: "Lifecycle readiness",
    description: "Devices can be tracked through test, wipe, configure, deploy, support and retirement states.",
    icon: "database"
  },
  {
    title: "Warranty workflow",
    description: "Support, replacement planning and documented checks are visible at product and admin level.",
    icon: "shield"
  },
  {
    title: "Sustainability signals",
    description: "Estimated reuse savings and low-power fit help buyers understand the environmental story.",
    icon: "leaf"
  }
];

export const successStories: EcosystemStory[] = [
  {
    title: "Learner device access pathway",
    category: "Learner",
    region: "UK and Africa",
    summary: "A sponsored refurbished laptop helps a learner move from phone-only access to reliable study, practice and portfolio work.",
    metrics: ["1 device reused", "40+ study hours enabled", "Digital skills pathway ready"]
  },
  {
    title: "Timetable-ready school lab",
    category: "School",
    region: "School deployment",
    summary: "A school can move from ad hoc shared devices to a planned lab with asset records, support ownership and practical class rotation.",
    metrics: ["24-seat lab model", "Instructor device included", "Shared usage plan"]
  },
  {
    title: "Community hub launch",
    category: "Community",
    region: "Community access",
    summary: "A local hub can offer digital inclusion sessions, job-search support and guided learning with prepared devices and accessories.",
    metrics: ["10-24 devices", "Shared access model", "Remote support route"]
  },
  {
    title: "NGO field office refresh",
    category: "NGO",
    region: "NGO operations",
    summary: "An NGO team can standardise laptops, cloud tools and asset records for staff, volunteers and field coordination.",
    metrics: ["Business laptops", "Cloud setup", "Asset register"]
  },
  {
    title: "Corporate reuse partnership",
    category: "Business",
    region: "CSR programme",
    summary: "A business device refresh can become a secure reuse pipeline with collection planning, wipe guidance and impact reporting.",
    metrics: ["Collection workflow", "Reuse reporting", "CSR evidence"]
  }
];

export const deploymentMapRegions: DeploymentMapRegion[] = [
  {
    name: "Liberia",
    status: "Planning",
    readiness: 72,
    focus: "School labs, vocational learning and donor-backed access.",
    power: "Power planning and backup assumptions required.",
    connectivity: "Offline-first content and browser-ready tools.",
    partners: "Local education and community delivery partners."
  },
  {
    name: "Ghana",
    status: "Active",
    readiness: 82,
    focus: "Urban and regional school, SME and community hub deployments.",
    power: "Mixed grid reliability with low-power lab opportunities.",
    connectivity: "Cloud tools in connected areas, offline planning for rural sites.",
    partners: "School, NGO and training-centre partnerships."
  },
  {
    name: "Sierra Leone",
    status: "Planning",
    readiness: 68,
    focus: "Offline-ready school labs and sponsored learner access.",
    power: "Solar or generator readiness often needed.",
    connectivity: "Offline-first setup and partner reporting templates.",
    partners: "Regional partner onboarding and maintenance ownership."
  },
  {
    name: "Nigeria",
    status: "Scaling",
    readiness: 78,
    focus: "Partner-led labs, community hubs and workforce access.",
    power: "Low-power and staged deployment planning recommended.",
    connectivity: "Cloud and offline hybrid models by region.",
    partners: "NGO, education and workforce-development partners."
  }
];

