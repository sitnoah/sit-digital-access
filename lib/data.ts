import type {
  AfricaCountryProfile,
  AfricaLifecycleStep,
  AfricaOperationalCard,
  AfricaStrategy,
  DeviceCategory,
  DonationOption,
  FAQItem,
  Feature,
  ImpactStory,
  LinkItem,
  MegaMenuColumn,
  Metric,
  ProcessStep,
  Programme
} from "@/types";

export type {
  AfricaCountryProfile,
  AfricaLifecycleStep,
  AfricaOperationalCard,
  AfricaStrategy,
  DeviceCategory,
  DonationOption,
  FAQItem,
  Feature,
  ImpactStory,
  LinkItem,
  MegaMenuColumn,
  Metric,
  ProcessStep,
  Programme
};

export const announcement = {
  message: "Affordable technology. Real impact. Lasting change.",
  impact: "UK Based · Africa Focused · Global Impact"
};

export const navItems: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Devices", href: "/devices", hasMenu: true },
  { label: "Repairs", href: "/repairs" },
  { label: "Programmes", href: "/programmes", hasMenu: true },
  { label: "Schools", href: "/schools" },
  { label: "Community", href: "/community-hubs", hasMenu: true },
  { label: "Businesses", href: "/businesses-ngos", hasMenu: true },
  { label: "Africa", href: "/africa-deployment", hasMenu: true },
  { label: "Sustainability", href: "/sustainability", hasMenu: true },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" }
];

export const megaMenuColumns: MegaMenuColumn[] = [
  {
    title: "Devices",
    cta: { label: "View all devices", href: "/devices#device-catalogue" },
    links: [
      {
        title: "Refurbished Laptops",
        description: "Student, business and premium",
        href: "/devices?categories=Student%20laptops,Business%20laptops#device-catalogue",
        icon: "laptop"
      },
      {
        title: "Desktop PCs",
        description: "Small form factor and tower",
        href: "/devices?categories=Desktop%20PCs#device-catalogue",
        icon: "monitor"
      },
      {
        title: "Mini PCs",
        description: "Compact, powerful, efficient",
        href: "/devices?categories=Mini%20PCs#device-catalogue",
        icon: "cpu"
      },
      {
        title: "All-in-One PCs",
        description: "Space-saving productivity",
        href: "/devices?categories=All-in-one%20PCs#device-catalogue",
        icon: "monitor"
      },
      {
        title: "Accessories",
        description: "Monitors, keyboards and more",
        href: "/devices?categories=Accessories#device-catalogue",
        icon: "package"
      },
      {
        title: "Repairs",
        description: "Book and track device repairs",
        href: "/repairs",
        icon: "wrench"
      }
    ]
  },
  {
    title: "Solutions",
    cta: { label: "View all solutions", href: "/services" },
    links: [
      {
        title: "Schools & Labs",
        description: "Timetable-ready classroom access",
        href: "/schools",
        icon: "school"
      },
      {
        title: "Community Hubs",
        description: "Shared digital inclusion spaces",
        href: "/community-hubs",
        icon: "building"
      },
      {
        title: "NGOs & Community",
        description: "Field kits and access models",
        href: "/businesses-ngos",
        icon: "users"
      },
      {
        title: "CSR Partnerships",
        description: "Sponsorship and reuse reporting",
        href: "/csr-partnerships",
        icon: "business"
      },
      {
        title: "Digital Skills",
        description: "AI, productivity and literacy cohorts",
        href: "/programmes",
        icon: "graduation"
      }
    ]
  },
  {
    title: "Deployment",
    cta: { label: "Explore deployment map", href: "/deployment-map" },
    links: [
      {
        title: "Africa Deployment",
        description: "Power-aware regional planning",
        href: "/africa-deployment",
        icon: "globe"
      },
      {
        title: "Deployment Map",
        description: "Readiness and country signals",
        href: "/deployment-map",
        icon: "map"
      },
      {
        title: "Lab Planning",
        description: "Bundles, setup and support",
        href: "/schools#school-solutions",
        icon: "network"
      },
      {
        title: "Low-Power Labs",
        description: "Mini PCs and offline-first support",
        href: "/devices?useCases=Low%20power,Africa%20deployment#device-catalogue",
        icon: "sun"
      },
      {
        title: "Deployment Enquiry",
        description: "Share country and site needs",
        href: "/africa-deployment#africa-enquiry",
        icon: "mail"
      }
    ]
  },
  {
    title: "Sustainability",
    cta: { label: "View sustainability", href: "/sustainability" },
    links: [
      {
        title: "Circular Technology",
        description: "Reuse-first impact model",
        href: "/sustainability",
        icon: "leaf"
      },
      {
        title: "Device Recycling",
        description: "Collect, wipe, refurbish, redeploy",
        href: "/device-recycling",
        icon: "recycle"
      },
      {
        title: "Device Lifecycle",
        description: "Repair, redeploy and retire",
        href: "/device-lifecycle",
        icon: "database"
      },
      {
        title: "Trade-In Valuation",
        description: "Repair, reuse or recycle decisioning",
        href: "/trade-in",
        icon: "cost"
      },
      {
        title: "CSR Partnerships",
        description: "ESG and sponsorship routes",
        href: "/csr-partnerships",
        icon: "handshake"
      },
      {
        title: "Success Stories",
        description: "Learners, schools and hubs",
        href: "/success-stories",
        icon: "sparkles"
      },
      {
        title: "Public Impact",
        description: "Live reuse and access metrics",
        href: "/impact",
        icon: "chart"
      }
    ]
  }
];

export const footerLinks: LinkItem[] = [
  { label: "Refurbished Devices", href: "/devices" },
  { label: "Repairs", href: "/repairs" },
  { label: "Book Repair", href: "/book-repair" },
  { label: "Repair Status", href: "/repair-status" },
  { label: "Digital Skills Training", href: "/programmes" },
  { label: "Computer Lab Packages", href: "/schools" },
  { label: "Community Hubs", href: "/community-hubs" },
  { label: "CSR Partnerships", href: "/csr-partnerships" },
  { label: "Device Recycling", href: "/device-recycling" },
  { label: "Trade-In", href: "/trade-in" },
  { label: "Device Lifecycle", href: "/device-lifecycle" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Sponsor Devices", href: "/donate" },
  { label: "Deployment Map", href: "/deployment-map" },
  { label: "Africa Deployment", href: "/africa-deployment" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Impact", href: "/impact" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export const homeHero = {
  eyebrow: "UK-Based · Africa-Focused · Impact-Driven",
  headline: "Affordable Technology Access for Learning, Work and",
  highlighted: "Digital Growth",
  subheadline:
    "Professionally refurbished devices, expert setup and practical training that unlock opportunities for learners, educators, businesses and communities across the UK and Africa.",
  ctas: [
    { label: "Request Devices", href: "/devices#device-request", variant: "primary" },
    { label: "Partner With Us", href: "/contact", variant: "secondary" },
    { label: "Sponsor a Learner", href: "/donate", variant: "ghost" }
  ]
};

export const homeMetrics: Metric[] = [
  { value: "100% Tested", label: "Quality assured", icon: "check" },
  { value: "Secure & Wiped", label: "Data protection first", icon: "shield" },
  { value: "Expertly Configured", label: "Ready to perform", icon: "settings" },
  { value: "Asset Tagged", label: "Tracked and documented", icon: "badge" },
  { value: "Support Included", label: "Remote and local", icon: "headset" }
];

export const heroCards: Feature[] = [
  {
    title: "Refurbished Devices",
    description: "High quality, tested and ready to go.",
    icon: "laptop"
  },
  {
    title: "Mini Computer Labs",
    description: "Complete lab bundles with setup and support.",
    icon: "network"
  },
  {
    title: "Digital Skills Training",
    description: "Practical training for work and life.",
    icon: "graduation"
  },
  {
    title: "Africa Deployment",
    description: "Logistics, training and local support.",
    icon: "globe"
  },
  {
    title: "Secure Preparation",
    description: "Wiped, tested and asset tagged.",
    icon: "shield"
  }
];

export const heroTrustBadges: Feature[] = [
  {
    title: "100% Tested",
    description: "Quality assured",
    icon: "check"
  },
  {
    title: "Secure & Wiped",
    description: "Data protection first",
    icon: "shield"
  },
  {
    title: "Expertly Configured",
    description: "Ready to perform",
    icon: "settings"
  },
  {
    title: "Asset Tagged",
    description: "Tracked and documented",
    icon: "badge"
  },
  {
    title: "Support Included",
    description: "Remote and local",
    icon: "headset"
  }
];

export const homeFeatures: Feature[] = [
  {
    title: "Refurbished Devices",
    description:
      "Professionally sourced, tested, cleaned, upgraded and configured laptops, desktops and mini PCs for education, business and community use.",
    icon: "laptop"
  },
  {
    title: "Computer Lab Packages",
    description:
      "Complete small computer lab bundles for schools and training centres, including devices, networking, software, classroom setup and support.",
    icon: "network"
  },
  {
    title: "Digital Skills Training",
    description:
      "Access to practical IT training, coding, office productivity, cloud tools, cybersecurity basics and AI literacy through SIT Learning.",
    icon: "book"
  },
  {
    title: "Africa Technology Access",
    description:
      "Support for shipping, setup, training, maintenance and local delivery models for schools and training centres in Africa.",
    icon: "globe"
  },
  {
    title: "Device Sponsorship & Donation",
    description:
      "Companies and individuals can donate used laptops or sponsor refurbished devices for learners, schools and communities.",
    icon: "heart"
  },
  {
    title: "IT Support & Managed Setup",
    description:
      "Device imaging, Windows setup, Microsoft 365, antivirus, user accounts, security configuration, asset tracking and remote support.",
    icon: "settings"
  }
];

export const deviceFilterChips = [
  "All",
  "Education",
  "Business",
  "Labs",
  "Africa Deployment",
  "Low Power"
];

export const deviceCategories: DeviceCategory[] = [
  {
    title: "Student Laptops",
    icon: "laptop",
    bestFor: "Learners, trainees and remote study",
    specification: "Core i5/Ryzen 5, 8GB RAM, 256GB SSD, webcam-ready",
    price: "Affordable learner pricing",
    warranty: "Warranty and remote setup options",
    conditionGrade: "A/B grade",
    supportIncluded: "Setup, security checks and remote support",
    tags: ["Education", "Africa Deployment"]
  },
  {
    title: "Business Laptops",
    icon: "business",
    bestFor: "SMEs, NGOs and field teams",
    specification: "Business-grade devices, 8-16GB RAM, SSD storage",
    price: "Quote based on grade and quantity",
    warranty: "Support and lifecycle planning available",
    conditionGrade: "A/B grade",
    supportIncluded: "Microsoft 365 or Google Workspace setup",
    tags: ["Business"]
  },
  {
    title: "Desktop PCs",
    icon: "monitor",
    bestFor: "Offices, labs and reception areas",
    specification: "Small form factor desktops with SSD upgrades",
    price: "Bundle pricing available",
    warranty: "Tested, documented and support-ready",
    conditionGrade: "A-C grade",
    supportIncluded: "Asset tagging and setup documentation",
    tags: ["Business", "Labs"]
  },
  {
    title: "Mini PCs",
    icon: "cpu",
    bestFor: "Low-space labs and training rooms",
    specification: "Compact Intel/AMD units, SSD, Wi-Fi or Ethernet",
    price: "Per-seat package pricing",
    warranty: "Deployment support available",
    conditionGrade: "A/B grade",
    supportIncluded: "Low-power lab planning",
    tags: ["Labs", "Low Power"]
  },
  {
    title: "All-in-One PCs",
    icon: "monitor",
    bestFor: "Libraries, classrooms and admin desks",
    specification: "Integrated display, keyboard, mouse and OS setup",
    price: "Subject to availability",
    warranty: "Warranty and replacement planning",
    conditionGrade: "A/B grade",
    supportIncluded: "Clean desk deployment support",
    tags: ["Education", "Business"]
  },
  {
    title: "Computer Lab Bundles",
    icon: "school",
    bestFor: "Schools and training centres",
    specification: "10-30 devices, networking, setup and support",
    price: "Custom bundle quotation",
    warranty: "Lab support and maintenance options",
    conditionGrade: "Mixed A/B grade",
    supportIncluded: "Classroom planning and support model",
    tags: ["Education", "Labs", "Africa Deployment"]
  },
  {
    title: "AI Learning Lab Bundles",
    icon: "sparkles",
    bestFor: "AI literacy and digital skills centres",
    specification: "Cloud-ready machines with browser and productivity setup",
    price: "Pilot lab quotations",
    warranty: "Training and support add-ons",
    conditionGrade: "A/B grade",
    supportIncluded: "AI literacy workshop pathway",
    tags: ["Education", "Labs"]
  },
  {
    title: "Accessories",
    icon: "package",
    bestFor: "Workstations and lab expansions",
    specification: "Displays, keyboards, mice, headsets, chargers and cables",
    price: "Added to device bundles",
    warranty: "Checked and packaged for deployment",
    conditionGrade: "Tested",
    supportIncluded: "Bundle matching and deployment checklist",
    tags: ["Business", "Labs", "Low Power"]
  },
  {
    title: "Monitors and Accessories",
    icon: "package",
    bestFor: "Workstations and lab expansions",
    specification: "Displays, keyboards, mice, headsets and cables",
    price: "Added to device bundles",
    warranty: "Checked and packaged for deployment",
    conditionGrade: "Tested",
    supportIncluded: "Bundle matching and deployment checklist",
    tags: ["Business", "Labs"]
  },
  {
    title: "Classroom Bundles",
    icon: "school",
    bestFor: "Schools and training centres",
    specification: "10-30 devices, networking, setup and support",
    price: "Custom bundle quotation",
    warranty: "Lab support and maintenance options",
    conditionGrade: "Mixed A/B grade",
    supportIncluded: "Classroom planning and support model",
    tags: ["Education", "Labs"]
  },
  {
    title: "Coding Lab Bundles",
    icon: "database",
    bestFor: "Coding bootcamps and ICT classes",
    specification: "Developer-ready laptops or desktops with tools",
    price: "Programme-based pricing",
    warranty: "Configured for teaching delivery",
    conditionGrade: "A/B grade",
    supportIncluded: "Coding tools and classroom profiles",
    tags: ["Education", "Labs"]
  },
  {
    title: "Office Productivity Bundles",
    icon: "business",
    bestFor: "Small business teams",
    specification: "Staff devices with Microsoft 365 or Google Workspace",
    price: "Per-user setup packages",
    warranty: "Remote support options",
    conditionGrade: "A/B grade",
    supportIncluded: "Cloud productivity setup",
    tags: ["Business"]
  }
];

export const deviceCataloguePreview = deviceCategories.slice(0, 8);

export const qualityProcess: ProcessStep[] = [
  {
    title: "Source responsibly",
    description: "Devices are sourced through vetted suppliers, corporate refreshes and donation partnerships.",
    icon: "recycle"
  },
  {
    title: "Inspect hardware",
    description: "Screens, batteries, storage, ports, keyboards, cameras and power supplies are checked.",
    icon: "badge"
  },
  {
    title: "Replace or upgrade parts",
    description: "SSD, RAM, batteries, chargers and accessories are upgraded where required.",
    icon: "hardDrive"
  },
  {
    title: "Install OS/software",
    description: "Windows, productivity tools, browsers and approved learning software are configured.",
    icon: "settings"
  },
  {
    title: "Security wipe",
    description: "Existing data is securely erased before devices enter the programme.",
    icon: "shield"
  },
  {
    title: "Test performance",
    description: "Devices are tested for speed, connectivity, stability and classroom readiness.",
    icon: "chart"
  },
  {
    title: "Asset tag",
    description: "Serials, grades, recipients and support notes can be documented for clear inventory control.",
    icon: "database"
  },
  {
    title: "Deploy and support",
    description: "Schools, businesses and partners receive setup, handover guidance and support options.",
    icon: "headset"
  }
];

export const qualityTrustBadges: Feature[] = [
  { title: "Secure data wipe", description: "Sanitised before reuse.", icon: "shield" },
  { title: "Hardware tested", description: "Ports, battery and storage checked.", icon: "badge" },
  { title: "Classroom ready", description: "Configured for shared learning.", icon: "school" },
  { title: "Support available", description: "Remote and deployment support.", icon: "headset" },
  { title: "Warranty-ready workflow", description: "Documented grades and handover.", icon: "check" }
];

export const programmes: Programme[] = [
  {
    title: "Learner Device Access Scheme",
    description: "Affordable laptops for students and trainees who need reliable access to learning.",
    icon: "graduation",
    outcomes: ["Study-ready laptops", "Software setup", "Remote support pathway"]
  },
  {
    title: "School Computer Lab Starter Kit",
    description: "A complete entry-level lab for schools ready to introduce or expand ICT access.",
    icon: "school",
    outcomes: ["10-30 device bundles", "Network planning", "Maintenance model"]
  },
  {
    title: "Community Digital Hub Kit",
    description: "Devices and setup for libraries, churches, NGOs and community centres.",
    icon: "users",
    outcomes: ["Shared access workstations", "Training materials", "Secure accounts"]
  },
  {
    title: "SME Digital Upgrade Package",
    description: "Affordable devices and IT setup for small businesses modernising operations.",
    icon: "business",
    outcomes: ["Staff devices", "Microsoft 365 or Google Workspace", "Asset register"]
  },
  {
    title: "Women & Youth Digital Access Programme",
    description: "Targeted access for underserved learners who need devices, training and support.",
    icon: "heart",
    outcomes: ["Sponsor-ready cohorts", "Digital skills pathway", "Progress reporting"]
  },
  {
    title: "Africa School Tech Enablement",
    description: "Technology deployment support for African schools and vocational centres.",
    icon: "truck",
    outcomes: ["Logistics support", "Local technician enablement", "Offline-first planning"]
  }
];

export const schoolCapabilities: Feature[] = [
  { title: "Computer labs", description: "Room-ready lab bundles sized around timetable demand and learner numbers.", icon: "monitor" },
  { title: "Instructor devices", description: "Reliable teacher machines configured for lesson delivery and demonstrations.", icon: "graduation" },
  { title: "Student devices", description: "Durable laptops and desktops prepared for supervised shared learning.", icon: "laptop" },
  { title: "Network setup", description: "Wi-Fi, switching and basic security planning for classrooms and labs.", icon: "network" },
  { title: "Timetable-ready lab planning", description: "Practical capacity planning for class rotations and course delivery.", icon: "chart" },
  { title: "Software installation", description: "Windows, productivity tools, browsers, coding tools and learning platforms.", icon: "settings" },
  { title: "Learning platform access", description: "Prepared access for LMS, cloud tools and SIT Learning content pathways.", icon: "book" },
  { title: "Maintenance planning", description: "Replacement cycles, support expectations and spare device planning.", icon: "wrench" },
  { title: "Inventory dashboard concept", description: "Asset records for serials, users, locations, condition and support history.", icon: "database" }
];

export const businessCapabilities: Feature[] = [
  { title: "Affordable staff devices", description: "Professional laptops, desktops and mini PCs for teams and field offices.", icon: "business" },
  { title: "Office setup", description: "Practical workstation, account and productivity configuration.", icon: "building" },
  { title: "Microsoft 365 / Google Workspace", description: "Mailbox, document, storage and user access setup.", icon: "settings" },
  { title: "Cybersecurity basics", description: "Endpoint protection, updates, password guidance and safe-use training.", icon: "shield" },
  { title: "Asset register", description: "Device inventory for ownership, assignment, support and replacement planning.", icon: "database" },
  { title: "Device lifecycle planning", description: "Procurement, refresh, repair and secure retirement guidance.", icon: "recycle" },
  { title: "Remote support", description: "Structured help for setup, troubleshooting and common software issues.", icon: "headset" },
  { title: "NGO field office kits", description: "Portable office bundles for teams working across multiple sites.", icon: "package" }
];

export const africaCountries = ["Liberia", "Ghana", "Sierra Leone", "Nigeria", "Wider Africa"];

export const africaFocus: Feature[] = [
  {
    title: "Affordable digital access",
    description:
      "Many schools and communities face device scarcity, high import costs, unreliable power and limited support capacity.",
    icon: "globe"
  },
  {
    title: "Refurbished technology bridge",
    description:
      "Well-prepared refurbished devices can unlock digital education without waiting for high-cost new equipment cycles.",
    icon: "recycle"
  },
  {
    title: "Shipping and logistics",
    description:
      "Deployment planning can include packing, customs coordination, shipment tracking and local handover workflows.",
    icon: "truck"
  },
  {
    title: "Local technician training",
    description:
      "SIT Digital Access supports models where local technicians can maintain labs and reduce downtime.",
    icon: "wrench"
  },
  {
    title: "School lab deployment",
    description:
      "Labs can be planned for classrooms, vocational centres, libraries and after-school learning hubs.",
    icon: "school"
  },
  {
    title: "Maintenance model",
    description:
      "Support planning includes spares, replacement cycles, documentation and escalation routes.",
    icon: "headset"
  },
  {
    title: "NGO/ministry partnerships",
    description:
      "We work with NGOs, ministries, schools, donors and community organisations on practical delivery.",
    icon: "users"
  },
  {
    title: "Solar/generator readiness",
    description:
      "Low-power device planning helps labs operate in environments with solar, generator or unstable grid power.",
    icon: "sun"
  },
  {
    title: "Offline-first learning support",
    description:
      "Deployment can include offline content, local file sharing and learning models that do not depend on constant broadband.",
    icon: "offline"
  }
];

export const services: Feature[] = [
  { title: "Refurbished device procurement", description: "Sourcing reliable, affordable laptops, desktops and mini PCs.", icon: "laptop" },
  { title: "Device testing and grading", description: "Condition checks, grading and readiness assessment.", icon: "badge" },
  { title: "Laptop/desktop upgrades", description: "Performance upgrades for learning and workplace needs.", icon: "wrench" },
  { title: "SSD/RAM upgrades", description: "Storage and memory improvements for faster everyday use.", icon: "hardDrive" },
  { title: "Windows installation", description: "Fresh OS setup with updates and sensible defaults.", icon: "settings" },
  { title: "Microsoft 365 setup", description: "Accounts, licensing guidance and productivity configuration.", icon: "building" },
  { title: "Google Workspace setup", description: "Email, Drive, Classroom and admin basics.", icon: "book" },
  { title: "Antivirus and endpoint protection", description: "Baseline security controls for devices and users.", icon: "shield" },
  { title: "Data wiping", description: "Secure removal of prior data before reuse or donation.", icon: "database" },
  { title: "Device imaging", description: "Repeatable setup for labs, cohorts and staff teams.", icon: "package" },
  { title: "Asset tagging", description: "Labels, serial tracking and inventory documentation.", icon: "badge" },
  { title: "Computer lab setup", description: "Device, desk, network and classroom readiness support.", icon: "network" },
  { title: "Network setup", description: "Basic classroom and office connectivity planning.", icon: "network" },
  { title: "Remote support", description: "Structured helpdesk support for common issues.", icon: "headset" },
  { title: "IT training", description: "Practical confidence-building support for users and admins.", icon: "graduation" },
  { title: "Digital skills bootcamps", description: "Cohort-based training through the SIT Learning ecosystem.", icon: "book" },
  { title: "AI literacy workshops", description: "Responsible, practical AI awareness for learners and teams.", icon: "sparkles" },
  { title: "Cybersecurity awareness", description: "Safe passwords, phishing awareness and everyday risk reduction.", icon: "shield" },
  { title: "Device donation processing", description: "Collection, wiping, refurbishment and social-impact deployment.", icon: "heart" }
];

export const impactStats: Metric[] = [
  { value: "500+", label: "Devices deployed", detail: "Target for refurbished devices" },
  { value: "1,500+", label: "Learners reached", detail: "Through access and training" },
  { value: "10+", label: "Schools supported", detail: "Labs and learner access" },
  { value: "50+", label: "Businesses supported", detail: "SMEs and NGO teams" },
  { value: "5+", label: "Countries served", detail: "UK and Africa partnerships" },
  { value: "25t", label: "CO2 saved through reuse", detail: "Estimated circular impact" },
  { value: "80%", label: "Cost savings generated", detail: "Compared with new equipment" },
  { value: "2,000+", label: "Training hours delivered", detail: "Digital skills pathways" }
];

export const impactStories: ImpactStory[] = [
  {
    title: "Student success story",
    quote:
      "A sponsored laptop gives a learner the private study time, confidence and access needed to complete digital coursework.",
    role: "Learner access pathway"
  },
  {
    title: "School lab transformation",
    quote:
      "A small lab package helps a school move from occasional shared access to timetable-ready digital learning.",
    role: "School deployment"
  },
  {
    title: "NGO digital upgrade",
    quote:
      "Field teams can standardise devices, accounts and security so programmes run with fewer technology interruptions.",
    role: "NGO operations"
  },
  {
    title: "Small business productivity improvement",
    quote:
      "A practical device refresh can help SMEs adopt cloud tools, manage documents and support hybrid working.",
    role: "SME support"
  }
];

export const donationOptions: DonationOption[] = [
  { title: "Donate used laptops", description: "Contribute working or repairable laptops for secure refurbishment.", icon: "laptop" },
  { title: "Donate desktops", description: "Support classrooms, labs and community hubs with desktop equipment.", icon: "monitor" },
  { title: "Sponsor one learner device", description: "Fund one configured laptop for a learner who needs access.", icon: "graduation" },
  { title: "Sponsor a classroom bundle", description: "Provide a set of devices for teaching and shared learning.", icon: "school" },
  { title: "Sponsor a full computer lab", description: "Support a complete lab deployment with devices, setup and planning.", icon: "network" },
  { title: "Corporate device recycling partnership", description: "Turn retired business hardware into measurable social impact.", icon: "recycle" },
  { title: "Monthly donor programme", description: "Provide predictable support for device access and training delivery.", icon: "heart" }
];

export const donationCtaOptions = [
  "Donate used laptops",
  "Sponsor one learner device",
  "Sponsor a classroom bundle",
  "Sponsor a full computer lab",
  "Corporate device recycling partnership"
];

export const faqs: FAQItem[] = [
  {
    question: "What types of devices do you provide?",
    answer:
      "We provide refurbished laptops, desktops, mini PCs, all-in-one PCs, monitors, accessories and complete computer lab bundles for learning, work and community access."
  },
  {
    question: "Are the devices tested?",
    answer:
      "Yes. Devices go through inspection, data wiping, hardware checks, cleaning, software setup and performance testing before deployment."
  },
  {
    question: "Can schools order complete computer labs?",
    answer:
      "Yes. We can plan small classroom and training-centre labs that include devices, networking, software setup, documentation and support options."
  },
  {
    question: "Do you support Africa deployment?",
    answer:
      "Yes. SIT Digital Access supports deployment planning for Liberia, Ghana, Sierra Leone, Nigeria and wider Africa, including logistics, local setup and maintenance models."
  },
  {
    question: "Can companies donate used laptops?",
    answer:
      "Yes. Companies can donate retired laptops or desktops through a recycling partnership. We can support wiping, refurbishment, asset tracking and impact reporting."
  },
  {
    question: "Do you provide software setup?",
    answer:
      "Yes. We support Windows installation, Microsoft 365, Google Workspace, antivirus, user accounts, device imaging and common learning or productivity tools."
  },
  {
    question: "Do you offer training with the devices?",
    answer:
      "Yes. Through SIT Learning, device access can be paired with digital skills, coding, productivity, cybersecurity awareness and AI literacy training."
  },
  {
    question: "Can SMEs request affordable IT packages?",
    answer:
      "Yes. SMEs can request staff devices, office setup, cloud productivity configuration, cybersecurity basics, lifecycle planning and remote support."
  }
];

export const africaHeroTrustIndicators: Feature[] = [
  { title: "Logistics-ready", description: "Packing, customs and route planning.", icon: "truck" },
  { title: "Offline-first capable", description: "Learning can continue without constant broadband.", icon: "offline" },
  { title: "Solar/generator aware", description: "Low-power planning for real infrastructure.", icon: "sun" },
  { title: "Local maintenance support", description: "Technician enablement and escalation paths.", icon: "wrench" },
  { title: "Secure device preparation", description: "Wiped, tested, configured and documented.", icon: "shield" }
];

export const africaHeroFloatingCards = [
  { value: "24", label: "Devices shipped", detail: "pilot lab bundle" },
  { value: "Lab", label: "Deployment ready", detail: "classroom workflow" },
  { value: "1", label: "Technician trained", detail: "local support path" },
  { value: "Offline", label: "Learning ready", detail: "content-first setup" }
];

export const africaCountryProfiles: AfricaCountryProfile[] = [
  {
    country: "Liberia",
    summary: "A strong fit for school labs, vocational learning rooms and NGO-supported digital access hubs.",
    marker: { x: 33, y: 57 },
    typicalDeploymentType: "School lab starter kits and vocational centre bundles",
    powerRealities: "Mixed grid access with frequent need for generator-aware classroom planning.",
    connectivityProfile: "Urban connectivity can support cloud tools, while rural sites benefit from offline content mirrors.",
    suggestedDeviceStrategy: "Durable student laptops plus low-power mini PCs for shared labs.",
    exampleLabConfiguration: "12-24 laptops, 1 instructor device, local storage, switch, router and spare accessories.",
    recommendedSupportModel: "Train one local technician, keep spare chargers, and review assets every term.",
    readiness: 82,
    logisticsComplexity: 68,
    offlineSupport: 88
  },
  {
    country: "Ghana",
    summary: "A practical deployment market for education partners, community hubs and SME workforce access.",
    marker: { x: 42, y: 55 },
    typicalDeploymentType: "Training-centre labs, community digital hubs and SME upgrade packages",
    powerRealities: "Better urban grid coverage with site-by-site planning for backup power.",
    connectivityProfile: "Good city coverage, with low-bandwidth plans useful for shared learning spaces.",
    suggestedDeviceStrategy: "Business-grade laptops for trainers and mini PCs for fixed classroom seats.",
    exampleLabConfiguration: "16 mini PCs, monitors, 2 instructor laptops, shared printer and managed user accounts.",
    recommendedSupportModel: "Remote support first, backed by local installation partners and asset reporting.",
    readiness: 86,
    logisticsComplexity: 58,
    offlineSupport: 78
  },
  {
    country: "Sierra Leone",
    summary: "Best suited to carefully scoped school pilots, NGO hubs and offline-first learning deployments.",
    marker: { x: 31, y: 53 },
    typicalDeploymentType: "Offline-ready school labs and donor-supported learner access",
    powerRealities: "Power planning is critical, with solar or generator support often needed.",
    connectivityProfile: "Connectivity varies heavily; offline-first learning should be considered from the start.",
    suggestedDeviceStrategy: "Low-power mini PCs, rugged laptops and local content storage.",
    exampleLabConfiguration: "10-20 low-power devices, offline content server, charging plan and asset tags.",
    recommendedSupportModel: "Local technician enablement with simple maintenance checklists and spare-parts planning.",
    readiness: 76,
    logisticsComplexity: 74,
    offlineSupport: 92
  },
  {
    country: "Nigeria",
    summary: "A scalable opportunity for school networks, workforce training, NGOs and regional deployment partners.",
    marker: { x: 54, y: 49 },
    typicalDeploymentType: "Multi-site computer labs, training centres and workforce digital enablement",
    powerRealities: "High variance by region; backup power and energy-efficient devices improve uptime.",
    connectivityProfile: "Strong urban connectivity with low-bandwidth and offline patterns needed for wider reach.",
    suggestedDeviceStrategy: "Blend business laptops, desktops and mini PCs according to site maturity.",
    exampleLabConfiguration: "24-40 devices, imaging workflow, network setup, inventory dashboard and support rota.",
    recommendedSupportModel: "Regional partner support model with reporting, escalation and scheduled maintenance.",
    readiness: 84,
    logisticsComplexity: 72,
    offlineSupport: 82
  },
  {
    country: "Wider Africa",
    summary: "A flexible deployment model for partners building repeatable digital inclusion infrastructure.",
    marker: { x: 63, y: 38 },
    typicalDeploymentType: "Partner-led labs, community hubs and donor-backed school deployments",
    powerRealities: "Infrastructure must be assessed locally before bundle design is finalised.",
    connectivityProfile: "Assume variable bandwidth and design for offline resilience unless proven otherwise.",
    suggestedDeviceStrategy: "Modular bundles that can scale from 10-device pilots to full lab rollouts.",
    exampleLabConfiguration: "Starter lab, expansion pack, local technician kit and deployment documentation.",
    recommendedSupportModel: "Country partner onboarding with shared reporting templates and remote support.",
    readiness: 78,
    logisticsComplexity: 80,
    offlineSupport: 86
  }
];

export const africaDeploymentStrategies: AfricaStrategy[] = [
  {
    title: "Affordable digital access",
    description: "Deployment models are designed for schools and communities that need practical access without high-cost equipment cycles.",
    insight: "Prioritise device-to-learner ratio, uptime and total cost of ownership.",
    icon: "globe"
  },
  {
    title: "Refurbished technology bridge",
    description: "Professionally prepared refurbished devices create a realistic bridge between scarcity and digital education.",
    insight: "Reuse reduces cost while keeping quality, configuration and security visible.",
    icon: "recycle"
  },
  {
    title: "Shipping and logistics",
    description: "Planning covers packing, documentation, shipment tracking, customs coordination and local handover workflows.",
    insight: "Bundle design starts before shipping so devices arrive deployment-ready.",
    icon: "truck"
  },
  {
    title: "Local technician training",
    description: "Local capability reduces downtime through first-line support, maintenance routines and escalation paths.",
    insight: "Every lab should have an accountable support owner.",
    icon: "wrench"
  },
  {
    title: "School lab deployment",
    description: "Labs can be planned for schools, vocational centres, libraries and after-school community hubs.",
    insight: "Timetable-ready layouts support shared use across multiple cohorts.",
    icon: "school"
  },
  {
    title: "Maintenance model",
    description: "Support planning includes spares, replacement cycles, documentation and remote assistance routes.",
    insight: "The handover is only useful if devices continue working after launch.",
    icon: "headset"
  },
  {
    title: "NGO/ministry partnerships",
    description: "The model supports NGOs, ministries, schools, donors and community organisations with clear reporting expectations.",
    insight: "Governance and accountability are built into the deployment workflow.",
    icon: "users"
  },
  {
    title: "Solar/generator readiness",
    description: "Low-power planning helps labs operate where power is unstable or supported by backup systems.",
    insight: "Mini PCs and charging rotation can reduce operational load.",
    icon: "sun"
  },
  {
    title: "Offline-first learning support",
    description: "Deployment can include offline content, local file sharing and learning models that do not depend on constant broadband.",
    insight: "Offline readiness protects learning continuity.",
    icon: "offline"
  }
];

export const africaOperationalReadiness = [
  "Power-aware",
  "Offline capable",
  "Local support",
  "Deployment scalable",
  "Asset documented"
];

export const africaLifecycleSteps: AfricaLifecycleStep[] = [
  {
    title: "Needs & environment assessment",
    description: "Review learner numbers, rooms, power, connectivity, security and local ownership before specifying devices.",
    metadata: "Discovery and readiness scan",
    insight: "Solar-aware deployment planning",
    icon: "chart"
  },
  {
    title: "Device grading & bundle planning",
    description: "Select laptops, desktops, mini PCs, accessories and spares around the environment and learning goals.",
    metadata: "Inventory and bundle design",
    insight: "Low-power device strategy",
    icon: "package"
  },
  {
    title: "Shipping & customs coordination",
    description: "Prepare documentation, packing lists, asset records and partner handover expectations.",
    metadata: "Logistics workflow",
    insight: "Shipment-ready documentation",
    icon: "truck"
  },
  {
    title: "Local technician enablement",
    description: "Equip local support owners with setup guides, maintenance routines and escalation pathways.",
    metadata: "Support readiness",
    insight: "Remote maintenance model",
    icon: "wrench"
  },
  {
    title: "School lab installation",
    description: "Install devices, accounts, software, network access and classroom operating routines.",
    metadata: "Deployment day",
    insight: "Offline-first learning setup",
    icon: "school"
  },
  {
    title: "Maintenance & reporting model",
    description: "Track assets, usage, incidents, spares and impact so partners can keep the lab sustainable.",
    metadata: "Post-handover operations",
    insight: "Inventory & asset tagging",
    icon: "database"
  }
];

export const africaPowerReadinessCards: AfricaOperationalCard[] = [
  {
    title: "Solar-powered environments",
    description: "Plan around low-power devices, charging windows and battery-aware learning schedules.",
    insight: "Mini PCs and efficient laptops reduce energy demand.",
    icon: "sun"
  },
  {
    title: "Generator-supported schools",
    description: "Use deployment schedules and shared lab rotation to make the most of limited runtime.",
    insight: "Class rotation models keep access practical.",
    icon: "settings"
  },
  {
    title: "Low-bandwidth regions",
    description: "Prepare learning workflows that do not assume constant cloud access.",
    insight: "Offline content servers and cached tools protect continuity.",
    icon: "offline"
  },
  {
    title: "Offline-first learning",
    description: "Package local content, productivity tools and coding resources for constrained connectivity.",
    insight: "Learning can continue even when broadband drops.",
    icon: "book"
  },
  {
    title: "Shared lab usage",
    description: "Design labs around supervised access, timetables and multi-cohort usage.",
    insight: "Device rotation models improve reach.",
    icon: "users"
  },
  {
    title: "Community learning hubs",
    description: "Support libraries, NGOs, churches and community spaces with manageable technology bundles.",
    insight: "Local ownership improves sustainability.",
    icon: "building"
  }
];

export const africaPartnerCards: AfricaOperationalCard[] = [
  {
    title: "NGO deployment partnerships",
    description: "Support programme teams with device bundles, reporting templates and field-office readiness.",
    insight: "Designed for accountable delivery.",
    icon: "heart"
  },
  {
    title: "Ministry collaboration",
    description: "Plan repeatable labs and learner access models around policy, curriculum and school priorities.",
    insight: "Works for pilots and scale-up pathways.",
    icon: "building"
  },
  {
    title: "Corporate sponsorship",
    description: "Turn retired devices or sponsorship budgets into measurable education infrastructure.",
    insight: "Circular impact with practical outcomes.",
    icon: "business"
  },
  {
    title: "Donor-supported labs",
    description: "Package funding, devices, setup and impact reporting into clear deployment proposals.",
    insight: "Budget clarity before shipment.",
    icon: "cost"
  },
  {
    title: "Community learning hubs",
    description: "Help community organisations offer shared access to digital learning and productivity tools.",
    insight: "Local access points extend reach.",
    icon: "users"
  },
  {
    title: "Workforce digital enablement",
    description: "Support vocational centres and SMEs with devices, accounts, training and maintenance pathways.",
    insight: "Skills and access move together.",
    icon: "graduation"
  }
];

export const africaPartnershipWorkflow = [
  "Discovery and partner fit",
  "Governance and reporting model",
  "Deployment plan and sponsorship route",
  "Device preparation and logistics",
  "Installation, enablement and impact tracking"
];

export const africaDeploymentMetrics: Metric[] = [
  { value: "500+", label: "Devices target", detail: "Refurbished device access", icon: "laptop" },
  { value: "1,500+", label: "Learners reached", detail: "Access and skills pathways", icon: "graduation" },
  { value: "10+", label: "Schools supported", detail: "Labs and learner access", icon: "school" },
  { value: "5+", label: "Countries engaged", detail: "UK and Africa partnerships", icon: "globe" },
  { value: "25t", label: "CO2 reuse impact", detail: "Estimated circular saving", icon: "leaf" },
  { value: "20+", label: "Technicians trained", detail: "Local support target", icon: "wrench" }
];

export const africaMapOverlayMetrics = [
  { label: "Devices deployed", value: "500+" },
  { label: "Labs planned", value: "10+" },
  { label: "Partners onboarded", value: "8+" },
  { label: "Technician enablement", value: "20+" },
  { label: "Community hubs", value: "6+" }
];
