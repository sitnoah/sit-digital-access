import type {
  Programme,
  ProgrammeFilter,
  ProgrammeSort
} from "@/types/programme";

export const programmeFilters: ProgrammeFilter[] = [
  "All programmes",
  "Learner access",
  "Schools",
  "Community hubs",
  "SMEs",
  "Africa deployment",
  "Sponsored access"
];

export const programmeSortOptions: ProgrammeSort[] = [
  "Recommended",
  "Most scalable",
  "Education-focused",
  "Africa deployment ready",
  "Sponsor-ready"
];

export const programmes: Programme[] = [
  {
    id: "learner-device-access",
    slug: "learner-device-access-scheme",
    title: "Learner Device Access Scheme",
    category: "Learner access",
    shortDescription: "Affordable configured laptops for students and trainees who need reliable access to learning.",
    longDescription:
      "A learner-first access programme for students, trainees and early-career learners who need a dependable device, core software setup and a support route to participate in digital education.",
    image: "/devices/laptop-student.svg",
    icon: "graduation",
    bestFor: ["Students", "Trainees", "Digital skills learners", "Sponsored cohorts"],
    deploymentReadiness: "High",
    trainingIncluded: true,
    supportLevel: "Remote setup and learner support route",
    sponsorReady: true,
    cohortRange: "1-100 learners",
    deviceRange: "1-100 laptops",
    deploymentRegions: ["UK", "Africa deployment partners"],
    useCases: ["Study access", "Digital skills training", "Remote learning", "Sponsored learner cohorts"],
    features: [
      { title: "Study-ready devices", description: "Refurbished laptops configured for learning, productivity and online access.", icon: "laptop" },
      { title: "Skills pathway", description: "Can be paired with digital literacy, productivity, coding or AI literacy routes.", icon: "book" },
      { title: "Sponsor-ready reporting", description: "Suitable for learner sponsorship and simple cohort impact updates.", icon: "chart" }
    ],
    deviceModel: "Refurbished student laptops with OS, productivity software and basic security setup.",
    trainingSupport: "Digital literacy, office productivity, cloud tools, coding basics and AI literacy options.",
    deploymentSetup: "Individual learner handover, account setup guidance and remote support pathway.",
    africaReadiness: "Suitable where learners can charge devices reliably or access shared charging points.",
    maintenanceSupport: "Remote troubleshooting, replacement planning and support escalation can be scoped.",
    sponsorshipOpportunities: ["Sponsor one learner", "Sponsor a cohort", "Fund training hours"],
    impactModel: "Learners supported, devices prepared, training hours enabled and sponsor-ready cohort outputs.",
    deploymentComplexity: "Low",
    scalabilityScore: 82,
    educationScore: 92,
    africaScore: 72,
    sponsorScore: 95,
    faqs: [
      { question: "Can this be sponsored?", answer: "Yes. This programme is designed for one-learner, cohort and donor-supported access models." },
      { question: "Is training included?", answer: "Training can be added through SIT Learning pathways depending on the cohort need." }
    ],
    relatedProgrammes: ["women-youth-digital-access-programme", "community-digital-hub-kit"]
  },
  {
    id: "school-lab-starter",
    slug: "school-computer-lab-starter-kit",
    title: "School Computer Lab Starter Kit",
    category: "Schools",
    shortDescription: "A complete entry-level computer lab package for schools and training centres.",
    longDescription:
      "A practical lab starter model that combines refurbished devices, workstation planning, software setup, classroom readiness and a support model for schools and training centres.",
    image: "/devices/computer-lab.svg",
    icon: "school",
    bestFor: ["Schools", "Training centres", "Academies", "ICT classrooms"],
    deploymentReadiness: "Very high",
    trainingIncluded: true,
    supportLevel: "Setup, handover and maintenance planning",
    sponsorReady: true,
    cohortRange: "20-300 learners",
    deviceRange: "10-30 devices",
    deploymentRegions: ["UK", "Liberia", "Ghana", "Sierra Leone", "Nigeria"],
    useCases: ["ICT labs", "Coding classes", "Digital literacy lessons", "Vocational training"],
    features: [
      { title: "Lab bundle planning", description: "Device count, room layout, software and network needs planned together.", icon: "network" },
      { title: "Classroom setup", description: "Workstations can be configured for shared learning and instructor-led delivery.", icon: "settings" },
      { title: "Support model", description: "Maintenance, replacement and local handover planning can be included.", icon: "headset" }
    ],
    deviceModel: "Laptop, desktop, mini PC or mixed lab bundle with monitors and accessories where needed.",
    trainingSupport: "Instructor onboarding, digital skills pathways and classroom usage guidance.",
    deploymentSetup: "Lab planning, device imaging, asset tagging, network planning and handover support.",
    africaReadiness: "Strong fit for shared labs, low-power mini PCs and offline-first learning planning.",
    maintenanceSupport: "Maintenance model, spares planning, technician enablement and reporting route.",
    sponsorshipOpportunities: ["Sponsor a classroom", "Sponsor a full lab", "Sponsor instructor devices"],
    impactModel: "Schools enabled, learners reached, devices deployed, lab usage and training hours.",
    deploymentComplexity: "Medium",
    scalabilityScore: 90,
    educationScore: 98,
    africaScore: 86,
    sponsorScore: 96,
    faqs: [
      { question: "Can the lab be low power?", answer: "Yes. Mini PCs and efficient displays can be scoped for power-aware environments." },
      { question: "Can this support coding?", answer: "Yes. Coding, productivity and AI literacy bundles can be included." }
    ],
    relatedProgrammes: ["africa-school-tech-enablement", "community-digital-hub-kit"]
  },
  {
    id: "community-digital-hub",
    slug: "community-digital-hub-kit",
    title: "Community Digital Hub Kit",
    category: "Community hubs",
    shortDescription: "Devices and setup for libraries, churches, NGOs and community learning centres.",
    longDescription:
      "A shared-access technology programme for community hubs that need durable devices, account setup, practical training and a model for repeated community use.",
    image: "/devices/all-in-one.svg",
    icon: "users",
    bestFor: ["Libraries", "Churches", "Community centres", "NGOs"],
    deploymentReadiness: "High",
    trainingIncluded: true,
    supportLevel: "Shared-use setup and remote support options",
    sponsorReady: true,
    cohortRange: "30-500 community users",
    deviceRange: "5-20 devices",
    deploymentRegions: ["UK", "Africa deployment partners"],
    useCases: ["Community learning", "Job search access", "Digital literacy", "Youth clubs"],
    features: [
      { title: "Shared access setup", description: "Devices configured for repeated community use and practical supervision.", icon: "users" },
      { title: "Hub-ready training", description: "Learning pathways can support volunteers, learners and community groups.", icon: "book" },
      { title: "Usage reporting", description: "Simple reporting model for sponsors and community partners.", icon: "chart" }
    ],
    deviceModel: "Mini PCs, desktops, all-in-ones or laptops depending on the hub environment.",
    trainingSupport: "Digital literacy, online services, productivity and employability-focused learning.",
    deploymentSetup: "Shared workstations, user account model, asset tagging and basic support route.",
    africaReadiness: "Good fit for community access models, offline resources and shared charging environments.",
    maintenanceSupport: "Remote support and local champion handover can be scoped.",
    sponsorshipOpportunities: ["Sponsor a hub", "Sponsor community access hours", "Sponsor training pathways"],
    impactModel: "Community users reached, training hours, devices deployed and hub sessions enabled.",
    deploymentComplexity: "Medium",
    scalabilityScore: 86,
    educationScore: 84,
    africaScore: 82,
    sponsorScore: 90,
    faqs: [
      { question: "Can volunteers manage the hub?", answer: "Yes. The programme can include local champion setup and usage guidance." },
      { question: "Can it work offline?", answer: "Offline-first learning support can be scoped for low-connectivity sites." }
    ],
    relatedProgrammes: ["learner-device-access-scheme", "women-youth-digital-access-programme"]
  },
  {
    id: "sme-digital-upgrade",
    slug: "sme-digital-upgrade-package",
    title: "SME Digital Upgrade Package",
    category: "SMEs",
    shortDescription: "Affordable devices, cloud productivity setup and practical IT support for small businesses.",
    longDescription:
      "A business-focused upgrade route for SMEs that need reliable refurbished staff devices, productivity tools, security basics, account setup and asset planning.",
    image: "/devices/laptop-business.svg",
    icon: "business",
    bestFor: ["SMEs", "NGO teams", "Field offices", "Small teams"],
    deploymentReadiness: "High",
    trainingIncluded: false,
    supportLevel: "Managed setup and remote support options",
    sponsorReady: false,
    cohortRange: "2-60 staff users",
    deviceRange: "2-60 devices",
    deploymentRegions: ["UK", "Africa field offices"],
    useCases: ["Staff devices", "Office setup", "Cloud productivity", "Cybersecurity basics"],
    features: [
      { title: "Staff-ready hardware", description: "Business laptops and desktops configured for work and productivity.", icon: "laptop" },
      { title: "Cloud setup", description: "Microsoft 365 or Google Workspace setup can be scoped.", icon: "settings" },
      { title: "Asset register", description: "Device tracking and lifecycle planning for small teams.", icon: "database" }
    ],
    deviceModel: "Business laptops, desktop PCs or mini PCs with office productivity setup.",
    trainingSupport: "Optional staff onboarding for productivity, cloud tools and cybersecurity basics.",
    deploymentSetup: "Accounts, antivirus, asset register, device imaging and remote support route.",
    africaReadiness: "Useful for NGO field offices and small teams where support and lifecycle planning matter.",
    maintenanceSupport: "Remote support, replacement planning and endpoint readiness options.",
    sponsorshipOpportunities: ["Corporate partnership", "NGO field office support"],
    impactModel: "Businesses supported, staff devices upgraded, cost savings and productivity enablement.",
    deploymentComplexity: "Low",
    scalabilityScore: 78,
    educationScore: 60,
    africaScore: 68,
    sponsorScore: 58,
    faqs: [
      { question: "Can cloud tools be included?", answer: "Yes. Microsoft 365 and Google Workspace setup can be scoped." },
      { question: "Is training available?", answer: "Yes. Staff onboarding and cybersecurity awareness can be added." }
    ],
    relatedProgrammes: ["community-digital-hub-kit", "africa-school-tech-enablement"]
  },
  {
    id: "women-youth-access",
    slug: "women-youth-digital-access-programme",
    title: "Women & Youth Digital Access Programme",
    category: "Sponsored access",
    shortDescription: "Targeted device access, training and support for underserved women and youth cohorts.",
    longDescription:
      "A sponsor-ready programme for underserved learners that combines device access, skills pathways, cohort support and impact outputs for donors and partners.",
    image: "/devices/ai-learning-lab.svg",
    icon: "heart",
    bestFor: ["Women learners", "Youth cohorts", "Donors", "Community partners"],
    deploymentReadiness: "High",
    trainingIncluded: true,
    supportLevel: "Cohort support and sponsor reporting route",
    sponsorReady: true,
    cohortRange: "10-200 learners",
    deviceRange: "10-200 devices",
    deploymentRegions: ["UK", "Liberia", "Ghana", "Sierra Leone", "Nigeria"],
    useCases: ["Digital skills cohorts", "AI literacy", "Career readiness", "Youth access"],
    features: [
      { title: "Cohort-ready access", description: "Devices and skills pathways planned around a defined learner group.", icon: "users" },
      { title: "Career-focused learning", description: "Training can support productivity, coding, cloud tools and AI literacy.", icon: "graduation" },
      { title: "Impact reporting", description: "Outputs can support donor, CSR and NGO accountability workflows.", icon: "chart" }
    ],
    deviceModel: "Learner laptops or shared lab bundles depending on cohort context.",
    trainingSupport: "Digital literacy, productivity, coding, cyber basics and AI literacy workshops.",
    deploymentSetup: "Cohort planning, onboarding, device handover and support route.",
    africaReadiness: "Strong fit for sponsored cohorts and community learning partners across Africa.",
    maintenanceSupport: "Support route and replacement planning can be built into the programme.",
    sponsorshipOpportunities: ["Sponsor one learner", "Sponsor a cohort", "Sponsor training and devices"],
    impactModel: "Learners supported, training hours delivered, devices deployed and cohort outcomes.",
    deploymentComplexity: "Medium",
    scalabilityScore: 88,
    educationScore: 95,
    africaScore: 84,
    sponsorScore: 98,
    faqs: [
      { question: "Can donors sponsor a cohort?", answer: "Yes. This programme is designed for cohort sponsorship and measurable impact." },
      { question: "Can AI literacy be included?", answer: "Yes. AI literacy and productivity workshops can be part of the training route." }
    ],
    relatedProgrammes: ["learner-device-access-scheme", "africa-school-tech-enablement"]
  },
  {
    id: "africa-school-tech",
    slug: "africa-school-tech-enablement",
    title: "Africa School Tech Enablement",
    category: "Africa deployment",
    shortDescription: "Technology deployment support for African schools, vocational centres and NGO partners.",
    longDescription:
      "A deployment-focused programme for African schools and partners that combines refurbished technology, logistics planning, local support enablement and offline-first learning readiness.",
    image: "/devices/mini-pc.svg",
    icon: "truck",
    bestFor: ["Africa schools", "Vocational centres", "NGOs", "Ministries", "Donors"],
    deploymentReadiness: "Specialist",
    trainingIncluded: true,
    supportLevel: "Deployment planning, local enablement and reporting",
    sponsorReady: true,
    cohortRange: "50-1,000+ learners",
    deviceRange: "10-100+ devices",
    deploymentRegions: ["Liberia", "Ghana", "Sierra Leone", "Nigeria", "Wider Africa"],
    useCases: ["School ICT labs", "Vocational training", "Offline-first learning", "Low-power labs"],
    features: [
      { title: "Power-aware planning", description: "Device strategy can consider solar, generator and low-power constraints.", icon: "sun" },
      { title: "Local technician enablement", description: "Deployment can include local handover and maintenance planning.", icon: "wrench" },
      { title: "Offline-first support", description: "Learning access can be planned for low-bandwidth sites.", icon: "offline" }
    ],
    deviceModel: "Mini PCs, laptops, desktops and lab bundles selected for power, durability and maintainability.",
    trainingSupport: "Instructor onboarding, digital skills pathways and local technician support options.",
    deploymentSetup: "Logistics planning, asset tagging, school lab setup, offline content support and maintenance model.",
    africaReadiness: "Built specifically for Africa deployment realities, including logistics, power and local maintenance.",
    maintenanceSupport: "Local technician enablement, remote escalation, replacement planning and partner reporting.",
    sponsorshipOpportunities: ["Sponsor a lab", "Sponsor a school rollout", "Sponsor technician enablement"],
    impactModel: "Countries reached, schools enabled, learners reached, labs deployed and training hours delivered.",
    deploymentComplexity: "Advanced",
    scalabilityScore: 94,
    educationScore: 90,
    africaScore: 100,
    sponsorScore: 94,
    faqs: [
      { question: "Which countries are supported?", answer: "The current focus includes Liberia, Ghana, Sierra Leone, Nigeria and wider Africa partnerships." },
      { question: "Can low-power labs be planned?", answer: "Yes. Mini PCs, shared labs and offline-first options can be scoped." }
    ],
    relatedProgrammes: ["school-computer-lab-starter-kit", "women-youth-digital-access-programme"]
  }
];

export const programmeDeliverySteps = [
  {
    title: "Needs assessment",
    timeline: "Week 1",
    support: "Discovery and scoping",
    description: "Clarify learners, location, device quantity, training needs and support model.",
    consideration: "Power, connectivity, cohort size and deployment context.",
    icon: "search"
  },
  {
    title: "Device & cohort planning",
    timeline: "Week 1-2",
    support: "Specification and bundle design",
    description: "Select the device model, cohort structure, software stack and handover approach.",
    consideration: "Budget, device grade, training path and sponsor requirements.",
    icon: "laptop"
  },
  {
    title: "Configured delivery",
    timeline: "Week 2-4",
    support: "Preparation and documentation",
    description: "Prepare, image, asset tag, configure and document the device or lab bundle.",
    consideration: "Security wipe, OS setup, accounts and deployment records.",
    icon: "settings"
  },
  {
    title: "Training & onboarding",
    timeline: "Launch phase",
    support: "SIT Learning pathway",
    description: "Onboard learners, instructors or staff with the right digital skills pathway.",
    consideration: "Digital literacy, productivity, coding, cyber basics or AI literacy.",
    icon: "graduation"
  },
  {
    title: "Deployment & setup",
    timeline: "Launch phase",
    support: "Remote or site-aware handover",
    description: "Deploy devices, labs or hubs with local setup and practical usage guidance.",
    consideration: "Classroom layout, power, connectivity, logistics and local ownership.",
    icon: "truck"
  },
  {
    title: "Ongoing support & reporting",
    timeline: "Ongoing",
    support: "Maintenance and impact outputs",
    description: "Track usage, support needs, maintenance, replacements and sponsor reporting.",
    consideration: "Impact metrics, support route, local technician enablement and sustainability.",
    icon: "chart"
  }
] as const;

export const programmeAudienceCards = [
  { title: "Schools", description: "ICT labs, student devices, instructor devices and digital skills pathways.", icon: "school" },
  { title: "NGOs", description: "Community access, field office kits, sponsored cohorts and reporting.", icon: "heart" },
  { title: "SMEs", description: "Affordable staff devices, cloud setup and practical IT support.", icon: "business" },
  { title: "Community hubs", description: "Shared workstations, digital literacy and local champion models.", icon: "users" },
  { title: "Ministries", description: "Education infrastructure planning and scalable access partnerships.", icon: "building" },
  { title: "Sponsors", description: "Learner, classroom, cohort and lab sponsorship with impact outputs.", icon: "handshake" }
] as const;

export const programmeEcosystem = [
  { title: "Devices", description: "Refurbished laptops, desktops, mini PCs and lab bundles.", icon: "laptop" },
  { title: "Setup", description: "Imaging, OS setup, accounts, security and asset tagging.", icon: "settings" },
  { title: "Training", description: "Digital skills, productivity, coding, cyber basics and AI literacy.", icon: "book" },
  { title: "Deployment", description: "Classroom, community, SME and Africa deployment planning.", icon: "truck" },
  { title: "Support", description: "Remote support, maintenance planning and local handover.", icon: "headset" },
  { title: "Reporting", description: "Programme-level outputs for partners, donors and sponsors.", icon: "chart" }
] as const;

export const deploymentExamples = [
  { title: "School ICT rollout", description: "A 20-device school lab with training, setup and maintenance planning.", icon: "school" },
  { title: "NGO field deployment", description: "Staff devices and setup for distributed programme teams.", icon: "business" },
  { title: "Women & youth cohort", description: "Sponsored devices plus practical digital skills training.", icon: "heart" },
  { title: "Community learning hub", description: "Shared access workstations for local digital inclusion.", icon: "users" }
] as const;

export const programmeImpactMetrics = [
  { value: "500+", label: "devices target", icon: "laptop" },
  { value: "1,000+", label: "learners supported", icon: "graduation" },
  { value: "50+", label: "schools enabled", icon: "school" },
  { value: "5+", label: "countries reached", icon: "globe" },
  { value: "2,000+", label: "training hours", icon: "book" },
  { value: "20+", label: "sponsored cohorts", icon: "handshake" }
] as const;

export const sponsorshipModels = [
  "Sponsor one learner",
  "Sponsor a classroom",
  "Sponsor a cohort",
  "Sponsor a lab",
  "Corporate partnership"
];

export const africaReadinessCards = [
  { title: "Offline-first readiness", description: "Plan access where bandwidth is limited or intermittent.", icon: "offline" },
  { title: "Solar/generator planning", description: "Shape device strategy around real power conditions.", icon: "sun" },
  { title: "Local technician enablement", description: "Build handover and support capacity into deployments.", icon: "wrench" },
  { title: "Shared lab usage", description: "Support multi-user classrooms and community learning hubs.", icon: "users" },
  { title: "Low-power device strategies", description: "Use mini PCs and efficient hardware where appropriate.", icon: "cpu" },
  { title: "Logistics planning", description: "Coordinate shipping, handover, asset records and support routes.", icon: "truck" }
] as const;

export const africaReadinessIndicators = [
  "Power-aware",
  "Offline capable",
  "Scalable",
  "Sponsor-ready",
  "Community deployable"
];

export function getProgrammeBySlug(slug: string) {
  return programmes.find((programme) => programme.slug === slug);
}

export function getRelatedProgrammes(programme: Programme) {
  return programme.relatedProgrammes
    .map((slug) => getProgrammeBySlug(slug))
    .filter((item): item is Programme => Boolean(item));
}

export function sortProgrammes(items: Programme[], sort: ProgrammeSort) {
  const scoreMap: Record<ProgrammeSort, (programme: Programme) => number> = {
    Recommended: (programme) =>
      programme.scalabilityScore + programme.educationScore + programme.sponsorScore,
    "Most scalable": (programme) => programme.scalabilityScore,
    "Education-focused": (programme) => programme.educationScore,
    "Africa deployment ready": (programme) => programme.africaScore,
    "Sponsor-ready": (programme) => programme.sponsorScore
  };

  return [...items].sort((a, b) => scoreMap[sort](b) - scoreMap[sort](a));
}
