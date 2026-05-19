import type { ServiceFilter, ServiceItem, ServiceSort } from "@/types/service";

export const serviceFilters: ServiceFilter[] = [
  "All",
  "Devices",
  "Setup",
  "Cloud",
  "Labs",
  "Training",
  "Security",
  "Africa Deployment",
  "Support"
];

export const serviceSortOptions: ServiceSort[] = [
  "Most requested",
  "Deployment-ready",
  "Education-focused",
  "SME-focused",
  "Africa-ready"
];

export const services: ServiceItem[] = [
  {
    id: "refurbished-device-procurement",
    slug: "refurbished-device-procurement",
    title: "Refurbished Device Procurement",
    category: "Devices",
    shortDescription: "Source affordable refurbished laptops, desktops, mini PCs and accessories for practical access projects.",
    longDescription:
      "A procurement service for schools, SMEs, NGOs, donors and deployment partners that need reliable refurbished technology matched to user needs, budget, supportability and deployment context.",
    icon: "package",
    bestFor: ["Schools", "SMEs", "NGOs", "Donors", "Training centres"],
    includedFeatures: ["Device sourcing", "Specification matching", "Bundle planning", "Availability checks"],
    deliveryModel: ["Needs assessment", "Device recommendation", "Procurement route", "Preparation handover"],
    deploymentReadiness: "High",
    supportLevel: "Procurement planning and device matching",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 98,
    deploymentScore: 86,
    educationScore: 90,
    smeScore: 88,
    africaScore: 84,
    relatedServices: ["device-testing-and-grading", "device-imaging", "asset-tagging"],
    faqs: [
      { question: "Can devices be sourced for bulk orders?", answer: "Yes. Procurement can be scoped around learner, staff, classroom, lab or Africa deployment quantities." },
      { question: "Can you recommend specifications?", answer: "Yes. Device recommendations can be matched to budget, user group, software and deployment environment." }
    ]
  },
  {
    id: "device-testing-and-grading",
    slug: "device-testing-and-grading",
    title: "Device Testing and Grading",
    category: "Devices",
    shortDescription: "Assess refurbished hardware condition, performance and readiness before devices are deployed.",
    longDescription:
      "A quality assurance service for checking device condition, core hardware performance, screen, battery, storage, ports and deployment readiness before handover.",
    icon: "badge",
    bestFor: ["Device donations", "Schools", "CSR teams", "Inventory managers"],
    includedFeatures: ["Hardware checks", "Condition grading", "Performance notes", "Deployment recommendation"],
    deliveryModel: ["Receive device list", "Inspect hardware", "Grade condition", "Document readiness"],
    deploymentReadiness: "High",
    supportLevel: "Quality assurance and readiness reporting",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Low",
    requestedScore: 86,
    deploymentScore: 88,
    educationScore: 78,
    smeScore: 72,
    africaScore: 82,
    relatedServices: ["data-wiping", "laptop-desktop-upgrades", "asset-tagging"],
    faqs: [
      { question: "What grades are used?", answer: "Devices can be graded around practical condition and suitability for learner, business or lab use." },
      { question: "Can donated devices be checked?", answer: "Yes. Testing and grading is useful for donated or retired corporate devices." }
    ]
  },
  {
    id: "laptop-desktop-upgrades",
    slug: "laptop-desktop-upgrades",
    title: "Laptop/Desktop Upgrades",
    category: "Devices",
    shortDescription: "Upgrade refurbished laptops and desktops so they remain usable for learning, work and support.",
    longDescription:
      "A device improvement service for extending the life of laptops and desktops with practical hardware upgrades, performance checks and deployment-ready configuration.",
    icon: "wrench",
    bestFor: ["Learners", "Schools", "SMEs", "Community hubs"],
    includedFeatures: ["Upgrade planning", "Parts recommendation", "Performance testing", "Device documentation"],
    deliveryModel: ["Assess device", "Recommend upgrades", "Install parts", "Retest performance"],
    deploymentReadiness: "High",
    supportLevel: "Upgrade planning and testing",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 82,
    deploymentScore: 80,
    educationScore: 78,
    smeScore: 84,
    africaScore: 76,
    relatedServices: ["ssd-ram-upgrades", "windows-installation", "device-testing-and-grading"],
    faqs: [
      { question: "What upgrades make the biggest difference?", answer: "SSD and RAM upgrades usually provide the strongest practical performance improvements." },
      { question: "Can upgrades be included in a device order?", answer: "Yes. Upgrades can be planned before devices are delivered or deployed." }
    ]
  },
  {
    id: "ssd-ram-upgrades",
    slug: "ssd-ram-upgrades",
    title: "SSD/RAM Upgrades",
    category: "Devices",
    shortDescription: "Improve speed and reliability with storage and memory upgrades for refurbished devices.",
    longDescription:
      "A focused upgrade service for replacing slow storage, increasing memory and preparing devices for everyday education, business and training workloads.",
    icon: "hardDrive",
    bestFor: ["Older laptops", "Desktop PCs", "Training labs", "Office refreshes"],
    includedFeatures: ["SSD installation", "RAM compatibility checks", "Performance testing", "Upgrade documentation"],
    deliveryModel: ["Compatibility review", "Install upgrade", "Run checks", "Update asset record"],
    deploymentReadiness: "High",
    supportLevel: "Hardware upgrade and performance check",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Low",
    requestedScore: 84,
    deploymentScore: 78,
    educationScore: 76,
    smeScore: 82,
    africaScore: 74,
    relatedServices: ["laptop-desktop-upgrades", "windows-installation", "device-imaging"],
    faqs: [
      { question: "Can this make older devices useful again?", answer: "Often, yes. SSD and RAM upgrades can extend useful life when the base device is still sound." },
      { question: "Are upgrades tested?", answer: "Yes. Devices should be tested after upgrade before deployment." }
    ]
  },
  {
    id: "windows-installation",
    slug: "windows-installation",
    title: "Windows Installation",
    category: "Setup",
    shortDescription: "Install and configure Windows with updates, drivers and learner or staff-ready defaults.",
    longDescription:
      "A setup service for preparing refurbished devices with a clean Windows installation, driver readiness, updates, local user configuration and practical defaults for education or work.",
    icon: "settings",
    bestFor: ["Student laptops", "Business devices", "Computer labs", "SME teams"],
    includedFeatures: ["Fresh install", "Driver setup", "Updates", "Local accounts", "Education-ready defaults"],
    deliveryModel: ["Confirm licence route", "Install OS", "Apply updates", "Configure user defaults"],
    deploymentReadiness: "High",
    supportLevel: "Operating system setup and handover",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Low",
    requestedScore: 95,
    deploymentScore: 86,
    educationScore: 88,
    smeScore: 84,
    africaScore: 80,
    relatedServices: ["device-imaging", "microsoft-365-setup", "antivirus-endpoint-protection"],
    faqs: [
      { question: "Can devices be prepared for schools?", answer: "Yes. Windows setup can include classroom-friendly defaults and handover guidance." },
      { question: "Can this be repeated across many devices?", answer: "Yes. For larger batches, device imaging may be the better route." }
    ]
  },
  {
    id: "microsoft-365-setup",
    slug: "microsoft-365-setup",
    title: "Microsoft 365 Setup",
    category: "Cloud",
    shortDescription: "Prepare Microsoft 365 accounts, productivity tools and basic security settings for teams and classrooms.",
    longDescription:
      "A cloud productivity setup service for organisations that need Microsoft 365 account readiness, basic user structure, productivity apps and practical onboarding.",
    icon: "cloud",
    bestFor: ["Schools", "SMEs", "NGOs", "Training teams"],
    includedFeatures: ["Account structure", "App readiness", "Basic security", "User guidance"],
    deliveryModel: ["Scope users", "Prepare tenant settings", "Configure apps", "Support onboarding"],
    deploymentReadiness: "High",
    supportLevel: "Cloud setup and onboarding support",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Medium",
    requestedScore: 90,
    deploymentScore: 82,
    educationScore: 86,
    smeScore: 92,
    africaScore: 76,
    relatedServices: ["google-workspace-setup", "cybersecurity-awareness", "remote-support"],
    faqs: [
      { question: "Can this support staff onboarding?", answer: "Yes. Setup can include practical account and app onboarding." },
      { question: "Can you help with Microsoft 365 basics?", answer: "Yes. Microsoft 365 setup can include email, productivity apps and basic security readiness." }
    ]
  },
  {
    id: "google-workspace-setup",
    slug: "google-workspace-setup",
    title: "Google Workspace Setup",
    category: "Cloud",
    shortDescription: "Configure Google Workspace for schools, NGOs and teams that need collaborative productivity tools.",
    longDescription:
      "A productivity setup service for preparing Google Workspace accounts, collaboration tools, basic admin structure and user guidance for teams or learning environments.",
    icon: "globe",
    bestFor: ["Schools", "NGOs", "Community teams", "SMEs"],
    includedFeatures: ["Account planning", "Workspace setup", "Shared drive guidance", "User onboarding"],
    deliveryModel: ["Confirm requirements", "Configure workspace", "Prepare users", "Support onboarding"],
    deploymentReadiness: "High",
    supportLevel: "Cloud productivity setup and onboarding",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Medium",
    requestedScore: 82,
    deploymentScore: 76,
    educationScore: 82,
    smeScore: 82,
    africaScore: 76,
    relatedServices: ["microsoft-365-setup", "digital-skills-bootcamps", "remote-support"],
    faqs: [
      { question: "Can this be used in classrooms?", answer: "Yes. Google Workspace can support classroom collaboration and shared learning workflows." },
      { question: "Can users be trained?", answer: "Yes. Training can be linked through digital skills or productivity workshops." }
    ]
  },
  {
    id: "antivirus-endpoint-protection",
    slug: "antivirus-endpoint-protection",
    title: "Antivirus and Endpoint Protection",
    category: "Security",
    shortDescription: "Prepare devices with practical endpoint protection and security baseline guidance.",
    longDescription:
      "A security readiness service for adding antivirus, endpoint protection guidance, update practices and basic user security preparation before devices are handed over.",
    icon: "shield",
    bestFor: ["Schools", "SMEs", "NGOs", "Shared labs"],
    includedFeatures: ["Antivirus setup", "Update guidance", "Security baseline", "User safety notes"],
    deliveryModel: ["Review device context", "Install protection", "Configure baseline", "Document support route"],
    deploymentReadiness: "High",
    supportLevel: "Endpoint readiness and security guidance",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Low",
    requestedScore: 88,
    deploymentScore: 84,
    educationScore: 82,
    smeScore: 86,
    africaScore: 78,
    relatedServices: ["cybersecurity-awareness", "windows-installation", "remote-support"],
    faqs: [
      { question: "Is this suitable for shared devices?", answer: "Yes. Shared labs and community hubs benefit from practical endpoint protection and user guidance." },
      { question: "Can cybersecurity awareness be included?", answer: "Yes. Awareness training can be linked to this service." }
    ]
  },
  {
    id: "data-wiping",
    slug: "data-wiping",
    title: "Data Wiping",
    category: "Security",
    shortDescription: "Securely wipe donated, retired or redeployed devices before refurbishment and reuse.",
    longDescription:
      "A secure preparation service for wiping data from used laptops, desktops and storage before devices are refurbished, donated, redeployed or responsibly processed.",
    icon: "shield",
    bestFor: ["Corporate donations", "Device recycling", "Schools", "NGOs"],
    includedFeatures: ["Wipe guidance", "Preparation checks", "Reuse readiness", "Documentation route"],
    deliveryModel: ["Intake devices", "Confirm wipe process", "Prepare devices", "Record outcome"],
    deploymentReadiness: "High",
    supportLevel: "Secure wipe workflow and documentation",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 92,
    deploymentScore: 88,
    educationScore: 78,
    smeScore: 82,
    africaScore: 82,
    relatedServices: ["device-testing-and-grading", "device-donation-processing", "asset-tagging"],
    faqs: [
      { question: "Is data wiping important for donations?", answer: "Yes. Corporate and individual donors need a secure wipe route before devices enter reuse." },
      { question: "Can wiped devices be refurbished after?", answer: "Yes. Wiping is usually followed by testing, grading and configuration." }
    ]
  },
  {
    id: "device-imaging",
    slug: "device-imaging",
    title: "Device Imaging",
    category: "Setup",
    shortDescription: "Prepare batches of devices with consistent software, configuration and deployment defaults.",
    longDescription:
      "A batch preparation service for schools, labs, SMEs and NGOs that need multiple devices configured consistently with repeatable setup and documentation.",
    icon: "database",
    bestFor: ["Computer labs", "School rollouts", "SME teams", "NGO field kits"],
    includedFeatures: ["Standard image", "Software baseline", "Configuration consistency", "Batch documentation"],
    deliveryModel: ["Define baseline", "Prepare image", "Apply to devices", "Test sample devices"],
    deploymentReadiness: "Advanced",
    supportLevel: "Batch setup and consistent configuration",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 84,
    deploymentScore: 94,
    educationScore: 88,
    smeScore: 80,
    africaScore: 86,
    relatedServices: ["windows-installation", "asset-tagging", "computer-lab-setup"],
    faqs: [
      { question: "When is imaging useful?", answer: "Imaging is useful when multiple devices need the same configuration and software baseline." },
      { question: "Can this support labs?", answer: "Yes. Imaging is especially useful for classroom and computer lab bundles." }
    ]
  },
  {
    id: "asset-tagging",
    slug: "asset-tagging",
    title: "Asset Tagging",
    category: "Setup",
    shortDescription: "Track prepared devices with labels, records and handover-ready documentation.",
    longDescription:
      "An asset management readiness service for tagging devices, creating simple inventory records and supporting accountability across schools, SMEs, NGOs and donor-funded deployments.",
    icon: "badge",
    bestFor: ["Schools", "NGOs", "Corporate donations", "Lab deployments"],
    includedFeatures: ["Asset labels", "Inventory record", "Deployment notes", "Handover documentation"],
    deliveryModel: ["Create asset structure", "Tag devices", "Record details", "Share handover summary"],
    deploymentReadiness: "High",
    supportLevel: "Asset records and documentation",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Low",
    requestedScore: 80,
    deploymentScore: 90,
    educationScore: 84,
    smeScore: 78,
    africaScore: 88,
    relatedServices: ["device-imaging", "computer-lab-setup", "data-wiping"],
    faqs: [
      { question: "Why tag devices?", answer: "Asset tagging makes device ownership, support, replacement and reporting easier to manage." },
      { question: "Can this support donor reporting?", answer: "Yes. Asset records can support partner and donor accountability workflows." }
    ]
  },
  {
    id: "computer-lab-setup",
    slug: "computer-lab-setup",
    title: "Computer Lab Setup",
    category: "Labs",
    shortDescription: "Plan and set up classroom-ready labs with devices, networking, layout and support model.",
    longDescription:
      "A lab deployment service for schools and training centres that need workstation planning, shared usage structure, device configuration, networking and classroom readiness.",
    icon: "school",
    bestFor: ["Schools", "Training centres", "ICT classrooms", "Sponsored labs"],
    includedFeatures: ["Device positioning", "Networking", "Shared usage planning", "Asset tracking", "Classroom readiness"],
    deliveryModel: ["Assess room", "Plan devices", "Configure lab", "Handover and support route"],
    deploymentReadiness: "Advanced",
    supportLevel: "Lab planning, setup and handover",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Advanced",
    requestedScore: 96,
    deploymentScore: 98,
    educationScore: 100,
    smeScore: 60,
    africaScore: 94,
    relatedServices: ["network-setup", "device-imaging", "it-training"],
    faqs: [
      { question: "Can schools request complete labs?", answer: "Yes. Lab setup can include devices, networking, software, shared-use planning and handover." },
      { question: "Can labs be low power?", answer: "Yes. Mini PCs and low-power strategies can be scoped for suitable environments." }
    ]
  },
  {
    id: "network-setup",
    slug: "network-setup",
    title: "Network Setup",
    category: "Labs",
    shortDescription: "Prepare basic networking for classrooms, labs, SMEs and community access environments.",
    longDescription:
      "A practical network setup service for supporting device connectivity, classroom lab usage, shared workstations and deployment-ready environments.",
    icon: "network",
    bestFor: ["Computer labs", "SMEs", "Community hubs", "Training centres"],
    includedFeatures: ["Connectivity review", "Router/switch planning", "Basic setup", "Usage guidance"],
    deliveryModel: ["Assess connectivity", "Plan network", "Set up devices", "Document support route"],
    deploymentReadiness: "High",
    supportLevel: "Network planning and setup guidance",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 84,
    deploymentScore: 88,
    educationScore: 82,
    smeScore: 84,
    africaScore: 80,
    relatedServices: ["computer-lab-setup", "remote-support", "offline-first-setup"],
    faqs: [
      { question: "Can you help plan lab connectivity?", answer: "Yes. Network setup can be scoped around classrooms and shared learning spaces." },
      { question: "What if connectivity is limited?", answer: "Offline-first setup and low-bandwidth planning can be considered." }
    ]
  },
  {
    id: "remote-support",
    slug: "remote-support",
    title: "Remote Support",
    category: "Support",
    shortDescription: "Provide practical support routes for device issues, account support and deployment maintenance.",
    longDescription:
      "A support service for organisations that need a clear route for device troubleshooting, account readiness, basic issue handling and ongoing deployment support.",
    icon: "headset",
    bestFor: ["Schools", "SMEs", "NGOs", "Community hubs"],
    includedFeatures: ["Issue triage", "Account support", "Device guidance", "Escalation route"],
    deliveryModel: ["Define support scope", "Set contact route", "Triage requests", "Escalate or resolve"],
    deploymentReadiness: "High",
    supportLevel: "Remote support and issue handling",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 88,
    deploymentScore: 86,
    educationScore: 80,
    smeScore: 90,
    africaScore: 82,
    relatedServices: ["antivirus-endpoint-protection", "microsoft-365-setup", "asset-tagging"],
    faqs: [
      { question: "Can support be included after setup?", answer: "Yes. Remote support can be scoped as part of a device, lab or SME package." },
      { question: "Can support cover Africa deployments?", answer: "Yes. Remote support can be paired with local maintenance routes where available." }
    ]
  },
  {
    id: "it-training",
    slug: "it-training",
    title: "IT Training",
    category: "Training",
    shortDescription: "Practical IT training for learners, staff and community groups using deployed devices.",
    longDescription:
      "A skills enablement service for building confidence with devices, productivity tools, digital workflows, basic troubleshooting and responsible technology use.",
    icon: "graduation",
    bestFor: ["Learners", "Teachers", "Staff", "Community groups"],
    includedFeatures: ["Practical sessions", "Tool onboarding", "Confidence building", "Usage guidance"],
    deliveryModel: ["Define audience", "Choose pathway", "Deliver sessions", "Support next steps"],
    deploymentReadiness: "High",
    supportLevel: "Training pathway and learner support",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Medium",
    requestedScore: 82,
    deploymentScore: 78,
    educationScore: 94,
    smeScore: 76,
    africaScore: 82,
    relatedServices: ["digital-skills-bootcamps", "computer-lab-setup", "cybersecurity-awareness"],
    faqs: [
      { question: "Can training be paired with devices?", answer: "Yes. Training can be added to device access, lab and community hub projects." },
      { question: "Who can attend?", answer: "Training can be adapted for learners, staff, teachers and community groups." }
    ]
  },
  {
    id: "digital-skills-bootcamps",
    slug: "digital-skills-bootcamps",
    title: "Digital Skills Bootcamps",
    category: "Training",
    shortDescription: "Structured skills cohorts covering digital literacy, productivity, coding and cloud tools.",
    longDescription:
      "A cohort-based training service that helps learners and community groups build practical skills for study, work, digital confidence and future learning pathways.",
    icon: "book",
    bestFor: ["Learners", "Youth cohorts", "Women and youth programmes", "Community hubs"],
    includedFeatures: ["Cohort planning", "Skills pathway", "Practical projects", "Progress support"],
    deliveryModel: ["Set cohort goals", "Plan curriculum", "Deliver bootcamp", "Track outcomes"],
    deploymentReadiness: "High",
    supportLevel: "Cohort training and outcome support",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Medium",
    requestedScore: 86,
    deploymentScore: 78,
    educationScore: 98,
    smeScore: 64,
    africaScore: 86,
    relatedServices: ["it-training", "ai-literacy-workshops", "refurbished-device-procurement"],
    faqs: [
      { question: "Can bootcamps support sponsored cohorts?", answer: "Yes. Bootcamps can be built into donor and CSR-supported access programmes." },
      { question: "Can devices be included?", answer: "Yes. Bootcamps can be paired with learner devices or lab access." }
    ]
  },
  {
    id: "ai-literacy-workshops",
    slug: "ai-literacy-workshops",
    title: "AI Literacy Workshops",
    category: "Training",
    shortDescription: "Introduce learners, staff and organisations to practical, responsible AI use.",
    longDescription:
      "A practical AI literacy service for helping learners, teachers, SMEs and community teams understand everyday AI tools, safe use, productivity workflows and future skills.",
    icon: "sparkles",
    bestFor: ["Learners", "Teachers", "SMEs", "Youth cohorts"],
    includedFeatures: ["AI basics", "Productivity use cases", "Responsible use", "Practical exercises"],
    deliveryModel: ["Choose audience", "Set learning goals", "Run workshop", "Share next steps"],
    deploymentReadiness: "Standard",
    supportLevel: "Workshop delivery and practical guidance",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Low",
    requestedScore: 80,
    deploymentScore: 70,
    educationScore: 90,
    smeScore: 78,
    africaScore: 76,
    relatedServices: ["digital-skills-bootcamps", "it-training", "cybersecurity-awareness"],
    faqs: [
      { question: "Is AI literacy suitable for beginners?", answer: "Yes. Workshops can start with practical everyday use and responsible AI basics." },
      { question: "Can this support staff productivity?", answer: "Yes. AI literacy can be tailored for productivity and office workflows." }
    ]
  },
  {
    id: "cybersecurity-awareness",
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness",
    category: "Training",
    shortDescription: "Teach practical cyber safety for learners, staff, SMEs and shared device environments.",
    longDescription:
      "A security awareness service covering password hygiene, phishing basics, safe browsing, device care and practical digital safety for learners and teams.",
    icon: "shield",
    bestFor: ["Schools", "SMEs", "NGOs", "Learners", "Shared labs"],
    includedFeatures: ["Phishing basics", "Password guidance", "Device care", "Safe browsing"],
    deliveryModel: ["Assess audience", "Choose format", "Deliver session", "Share guidance"],
    deploymentReadiness: "High",
    supportLevel: "Awareness training and user guidance",
    africaReady: true,
    trainingLinked: true,
    deliveryComplexity: "Low",
    requestedScore: 84,
    deploymentScore: 82,
    educationScore: 86,
    smeScore: 86,
    africaScore: 78,
    relatedServices: ["antivirus-endpoint-protection", "it-training", "remote-support"],
    faqs: [
      { question: "Can this be delivered with new devices?", answer: "Yes. Cybersecurity awareness works well alongside device handover and onboarding." },
      { question: "Is this suitable for SMEs?", answer: "Yes. It can cover practical risks small teams face daily." }
    ]
  },
  {
    id: "device-donation-processing",
    slug: "device-donation-processing",
    title: "Device Donation Processing",
    category: "Support",
    shortDescription: "Turn used laptops, desktops and accessories into secure, documented reuse opportunities.",
    longDescription:
      "A donation processing service for handling used hardware, secure wipe routes, grading, refurbishment planning, asset documentation and deployment matching.",
    icon: "recycle",
    bestFor: ["Corporate donors", "CSR teams", "Individuals", "Device recycling partners"],
    includedFeatures: ["Donation intake", "Secure wipe route", "Condition grading", "Reuse matching"],
    deliveryModel: ["Confirm donation", "Plan collection", "Wipe and grade", "Prepare for deployment"],
    deploymentReadiness: "Advanced",
    supportLevel: "Donation processing and reuse workflow",
    africaReady: true,
    trainingLinked: false,
    deliveryComplexity: "Medium",
    requestedScore: 90,
    deploymentScore: 86,
    educationScore: 82,
    smeScore: 70,
    africaScore: 88,
    relatedServices: ["data-wiping", "device-testing-and-grading", "asset-tagging"],
    faqs: [
      { question: "Can companies donate devices in bulk?", answer: "Yes. Corporate recycling partnerships can be planned around device refresh cycles." },
      { question: "Can donations support Africa deployment?", answer: "Yes. Suitable refurbished devices can be matched to schools, NGOs and deployment partners." }
    ]
  }
];

export const serviceEcosystem = [
  { title: "Devices", description: "Procurement, grading, upgrades and donation processing.", icon: "laptop" },
  { title: "Setup", description: "Windows, imaging, accounts, asset tagging and security readiness.", icon: "settings" },
  { title: "Accounts", description: "Microsoft 365 and Google Workspace setup for teams and classrooms.", icon: "users" },
  { title: "Training", description: "IT training, digital skills, AI literacy and cybersecurity awareness.", icon: "book" },
  { title: "Deployment", description: "Labs, networks, Africa shipment readiness and handover planning.", icon: "truck" },
  { title: "Support", description: "Remote support, issue triage, maintenance and escalation routes.", icon: "headset" },
  { title: "Reporting", description: "Asset records, partner outputs and impact-ready documentation.", icon: "chart" }
] as const;

export const africaDeploymentServiceCards = [
  { title: "Offline-first setup", description: "Plan device and content access for low-bandwidth environments.", icon: "offline" },
  { title: "Solar/generator planning", description: "Scope low-power devices around practical infrastructure realities.", icon: "sun" },
  { title: "Shared classroom models", description: "Support labs and hubs used by many learners and community groups.", icon: "school" },
  { title: "Local technician enablement", description: "Build handover and maintenance knowledge into deployment routes.", icon: "wrench" },
  { title: "Logistics coordination", description: "Connect device preparation with shipment, receiving and rollout planning.", icon: "truck" },
  { title: "Asset documentation", description: "Keep device records visible for partners, donors and support teams.", icon: "badge" },
  { title: "Support escalation routes", description: "Plan remote and local support expectations before handover.", icon: "headset" },
  { title: "Low-power device strategy", description: "Use mini PCs and efficient hardware where power availability matters.", icon: "cpu" }
] as const;

export const trainingEnablementCards = [
  {
    title: "IT Training",
    format: "Practical sessions",
    cohort: "10-30 learners",
    audience: "Learners, staff and community groups",
    mode: "Remote, classroom or blended",
    outcome: "Confident device and productivity tool use",
    icon: "graduation"
  },
  {
    title: "Digital Skills Bootcamps",
    format: "Structured cohort pathway",
    cohort: "15-50 learners",
    audience: "Youth, women, community and training cohorts",
    mode: "Cohort-based delivery",
    outcome: "Digital literacy, productivity and career-ready skills",
    icon: "book"
  },
  {
    title: "AI Literacy Workshops",
    format: "Workshop format",
    cohort: "10-40 participants",
    audience: "Learners, teachers, SMEs and teams",
    mode: "Interactive workshop",
    outcome: "Responsible practical AI use",
    icon: "sparkles"
  },
  {
    title: "Cybersecurity Awareness",
    format: "Awareness session",
    cohort: "10-60 participants",
    audience: "Schools, SMEs, NGOs and lab users",
    mode: "Live or blended",
    outcome: "Safer device, account and browsing habits",
    icon: "shield"
  }
] as const;

export const serviceWorkflowSteps = [
  {
    title: "Needs assessment",
    description: "Clarify users, location, device count, support needs and deployment constraints.",
    insight: "Scope before recommending hardware or services.",
    icon: "search"
  },
  {
    title: "Device & setup planning",
    description: "Match services to device categories, cloud tools, lab needs and support expectations.",
    insight: "Keep procurement, setup and support connected.",
    icon: "laptop"
  },
  {
    title: "Configuration & preparation",
    description: "Wipe, test, install, image, tag and document devices before deployment.",
    insight: "Prepare devices for real use, not just delivery.",
    icon: "settings"
  },
  {
    title: "Deployment & onboarding",
    description: "Support lab setup, account readiness, user handover and deployment documentation.",
    insight: "Make the first day of use smoother.",
    icon: "truck"
  },
  {
    title: "Training & enablement",
    description: "Build learner, staff or community confidence through practical skills pathways.",
    insight: "Access improves when people know what to do next.",
    icon: "graduation"
  },
  {
    title: "Support & reporting",
    description: "Provide issue routes, maintenance planning, asset records and partner-ready reporting.",
    insight: "Sustainability needs support after handover.",
    icon: "chart"
  }
] as const;

export const serviceImpactMetrics = [
  { value: "500+", label: "devices configured", icon: "laptop" },
  { value: "30+", label: "labs supported", icon: "school" },
  { value: "2,000+", label: "training hours delivered", icon: "book" },
  { value: "1,000+", label: "learners supported", icon: "graduation" },
  { value: "250+", label: "support requests resolved", icon: "headset" },
  { value: "5+", label: "Africa deployments enabled", icon: "globe" }
] as const;

export const serviceTrustBadges = [
  "Secure wipe process",
  "Classroom-ready setup",
  "Deployment-aware planning",
  "Support-ready workflows"
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(service: ServiceItem) {
  return service.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is ServiceItem => Boolean(item));
}

export function sortServices(items: ServiceItem[], sort: ServiceSort) {
  const scoreMap: Record<ServiceSort, (service: ServiceItem) => number> = {
    "Most requested": (service) => service.requestedScore,
    "Deployment-ready": (service) => service.deploymentScore,
    "Education-focused": (service) => service.educationScore,
    "SME-focused": (service) => service.smeScore,
    "Africa-ready": (service) => service.africaScore
  };

  return [...items].sort((a, b) => scoreMap[sort](b) - scoreMap[sort](a));
}
