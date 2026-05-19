import type {
  DonationImpactExample,
  DonationJourneyStep,
  DonationMetric,
  DonationPathway,
  DonationSelectOption,
  DonationTrustCard,
  DonationTypeValue,
  DonorTypeValue,
  SponsorshipPackage
} from "@/types/donation";

export const donationHeroStats = [
  { value: "1", label: "learner device", detail: "A configured laptop for individual study access." },
  { value: "10", label: "device classroom", detail: "A shared access bundle for guided learning." },
  { value: "30", label: "device lab", detail: "A complete lab pathway for schools and hubs." },
  { value: "CSR", label: "recycling route", detail: "Retired business hardware turned into measurable impact." }
];

export const donationHeroFlow = ["Donate", "Refurbish", "Configure", "Deploy", "Train"];

export const donationPathways: DonationPathway[] = [
  {
    title: "Donate Used Laptops",
    description:
      "Contribute working or repairable laptops for secure refurbishment and learner access.",
    bestFor: "Individuals, SMEs and corporate refreshes",
    impactBadge: "Learner access",
    includes: ["Secure data wipe guidance", "Device grading", "Refurbishment route"],
    ctaLabel: "Start laptop donation",
    ctaHref: "#donation-form",
    icon: "laptop"
  },
  {
    title: "Donate Desktops & Mini PCs",
    description:
      "Support classrooms, labs and community hubs with reliable desktop and mini PC equipment.",
    bestFor: "Schools, offices and IT refresh programmes",
    impactBadge: "Lab-ready reuse",
    includes: ["Lab-ready configuration", "Asset tagging", "Deployment planning"],
    ctaLabel: "Donate devices",
    ctaHref: "#donation-form",
    icon: "monitor"
  },
  {
    title: "Sponsor One Learner Device",
    description:
      "Fund one configured laptop for a learner who needs access to digital education.",
    bestFor: "Individual donors and sponsors",
    impactBadge: "One learner",
    includes: ["Device setup", "Learner-ready configuration", "Impact reporting update"],
    ctaLabel: "Sponsor a learner",
    ctaHref: "#sponsorship-packages",
    icon: "graduation"
  },
  {
    title: "Sponsor a Classroom Bundle",
    description:
      "Provide a shared device bundle for teaching, group learning and community access.",
    bestFor: "CSR teams, charities and education partners",
    impactBadge: "5-15 devices",
    includes: ["5-15 device bundle", "Setup support", "Training pathway"],
    ctaLabel: "Sponsor a classroom",
    ctaHref: "#sponsorship-packages",
    icon: "school"
  },
  {
    title: "Sponsor a Full Computer Lab",
    description:
      "Support a complete lab deployment with devices, setup, planning and support.",
    bestFor: "Foundations, ministries, NGOs and corporate sponsors",
    impactBadge: "20-30 devices",
    includes: ["20-30 devices", "Lab planning", "Deployment model"],
    ctaLabel: "Sponsor a lab",
    ctaHref: "#sponsorship-packages",
    icon: "network"
  },
  {
    title: "Corporate Device Recycling Partnership",
    description:
      "Turn retired business hardware into measurable social impact while supporting responsible reuse.",
    bestFor: "Companies and IT departments",
    impactBadge: "CSR / ESG",
    includes: ["Collection planning", "Secure wipe process", "Impact reporting"],
    ctaLabel: "Discuss recycling",
    ctaHref: "#corporate-recycling",
    icon: "recycle"
  },
  {
    title: "Monthly Donor Programme",
    description:
      "Provide predictable support for device access, maintenance and training delivery.",
    bestFor: "Recurring donors and long-term partners",
    impactBadge: "Ongoing support",
    includes: ["Ongoing support", "Skills access", "Maintenance fund"],
    ctaLabel: "Start monthly support",
    ctaHref: "#donation-form",
    icon: "heart"
  }
];

export const corporateReuseWorkflow: DonationJourneyStep[] = [
  { title: "Audit", description: "Confirm device types, condition, volumes and data handling needs.", icon: "search" },
  { title: "Collect", description: "Plan collection, drop-off or staged handover around your refresh cycle.", icon: "truck" },
  { title: "Wipe", description: "Follow a secure data wipe and preparation route before reuse.", icon: "shield" },
  { title: "Refurbish", description: "Grade, repair, upgrade and configure devices for practical deployment.", icon: "wrench" },
  { title: "Deploy", description: "Route prepared devices to learners, schools, NGOs and community hubs.", icon: "package" },
  { title: "Report", description: "Share impact outputs for CSR, ESG and partner accountability.", icon: "chart" }
];

export const corporateReuseCapabilities: DonationTrustCard[] = [
  {
    title: "Secure wipe and data protection process",
    description: "Clear data handling guidance before any device moves into refurbishment.",
    icon: "shield"
  },
  {
    title: "Device collection or drop-off planning",
    description: "A practical route for office refreshes, bulk handovers and staged collections.",
    icon: "truck"
  },
  {
    title: "Hardware grading and repair route",
    description: "Devices are triaged for reuse, upgrade, parts recovery or responsible recycling.",
    icon: "settings"
  },
  {
    title: "CSR and ESG impact reporting",
    description: "A simple reporting model for devices prepared, learners supported and reuse value.",
    icon: "chart"
  }
];

export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    title: "Learner Access Sponsor",
    audience: "Ideal for individual sponsors",
    description: "Sponsor 1 configured learner laptop for practical digital education access.",
    features: ["Learner-ready laptop", "Basic setup and configuration", "Impact update"],
    ctaLabel: "Sponsor a Learner",
    ctaHref: "#donation-form",
    quoteLabel: "Quote-based",
    icon: "graduation"
  },
  {
    title: "Classroom Bundle Sponsor",
    audience: "Ideal for SMEs, churches, community groups and charities",
    description: "Sponsor 5-15 devices for shared learning, community access or class delivery.",
    features: ["Shared device bundle", "Deployment checklist", "Setup support route"],
    ctaLabel: "Sponsor a Classroom",
    ctaHref: "#donation-form",
    quoteLabel: "Quote-based",
    icon: "school"
  },
  {
    title: "Computer Lab Sponsor",
    audience: "Ideal for companies, foundations and NGOs",
    description: "Sponsor 20-30 devices plus lab planning, setup and a support model.",
    features: ["20-30 device lab plan", "Setup and handover model", "Support and maintenance planning"],
    ctaLabel: "Sponsor a Lab",
    ctaHref: "#donation-form",
    quoteLabel: "Recommended",
    recommended: true,
    icon: "network"
  },
  {
    title: "Corporate Impact Partner",
    audience: "Ideal for companies with regular IT refresh cycles",
    description: "Create an ongoing recycling and sponsorship programme with measurable impact.",
    features: ["Collection planning", "Device reuse pathway", "Impact reporting structure"],
    ctaLabel: "Become a Partner",
    ctaHref: "/contact",
    quoteLabel: "Partner route",
    icon: "business"
  }
];

export const donationImpactMetrics: DonationMetric[] = [
  { value: "500+", label: "devices prepared target", detail: "Refurbished for education, work and community access.", icon: "laptop" },
  { value: "1,000+", label: "learners supported target", detail: "Learners can access study, productivity and skills tools.", icon: "graduation" },
  { value: "50+", label: "classrooms enabled target", detail: "Shared access for teaching, clubs and community learning.", icon: "school" },
  { value: "20+", label: "labs sponsored target", detail: "Structured lab deployments for schools and hubs.", icon: "network" },
  { value: "Reuse", label: "CO2 saved through reuse", detail: "Extending useful device life before recycling.", icon: "leaf" },
  { value: "Skills", label: "training hours enabled", detail: "Device access connected to practical digital learning.", icon: "book" }
];

export const donationImpactExamples: DonationImpactExample[] = [
  {
    title: "1 laptop",
    description: "Private study access for a learner who needs reliable digital tools.",
    icon: "laptop"
  },
  {
    title: "10 devices",
    description: "Small classroom digital access for guided learning and group work.",
    icon: "school"
  },
  {
    title: "30 devices",
    description: "A full lab deployment route for schools, training centres and hubs.",
    icon: "network"
  },
  {
    title: "Corporate refresh",
    description: "Circular technology impact from retired business hardware.",
    icon: "recycle"
  }
];

export const donationTrustCards: DonationTrustCard[] = [
  {
    title: "Secure data wipe guidance",
    description: "Clear preparation steps for donors before hardware is refurbished.",
    icon: "shield"
  },
  {
    title: "Device condition grading",
    description: "Hardware is assessed for reuse, upgrade, repair or responsible recycling.",
    icon: "badge"
  },
  {
    title: "Tested and configured hardware",
    description: "Devices are prepared for learning, work and managed support.",
    icon: "check"
  },
  {
    title: "Asset tagging and documentation",
    description: "Device identity and deployment records can support tracking and reporting.",
    icon: "database"
  },
  {
    title: "Responsible reuse",
    description: "Useful devices are kept in circulation for practical social impact.",
    icon: "leaf"
  },
  {
    title: "Africa deployment readiness",
    description: "Devices can be planned around power, logistics and local support needs.",
    icon: "globe"
  },
  {
    title: "Support and maintenance planning",
    description: "Deployment pathways include support, replacement and maintenance thinking.",
    icon: "headset"
  },
  {
    title: "Impact reporting",
    description: "Sponsors can see how donations translate into access and opportunity.",
    icon: "chart"
  }
];

export const donationJourneySteps: DonationJourneyStep[] = [
  {
    title: "Submit enquiry",
    description: "Tell us what you want to donate, sponsor or recycle.",
    icon: "mail"
  },
  {
    title: "Confirm route",
    description: "We confirm device details, sponsorship type, location and timing.",
    icon: "check"
  },
  {
    title: "Secure wipe and refurbish",
    description: "Devices move through wipe guidance, grading, repair and preparation.",
    icon: "shield"
  },
  {
    title: "Configure for use",
    description: "Hardware is configured for learning, work, labs or community access.",
    icon: "settings"
  },
  {
    title: "Deploy to partners",
    description: "Prepared devices reach learners, schools, NGOs or deployment partners.",
    icon: "truck"
  },
  {
    title: "Share impact update",
    description: "Sponsors and partners receive practical impact outputs.",
    icon: "chart"
  }
];

export const donationFaqs = [
  {
    question: "What devices can I donate?",
    answer:
      "You can donate laptops, desktops, mini PCs, monitors, keyboards, mice and accessories. Working or repairable laptops and mini PCs are especially useful for learner and lab deployments."
  },
  {
    question: "Do devices need to be working?",
    answer:
      "Working devices are preferred, but mixed-condition devices can still be reviewed. Some hardware can be repaired, upgraded or used for parts to support other refurbished devices."
  },
  {
    question: "What happens to my data?",
    answer:
      "We provide secure wipe guidance and can discuss the appropriate data handling route before any device is reused. Corporate donors should follow their internal data policies before release."
  },
  {
    question: "Can my company donate devices in bulk?",
    answer:
      "Yes. SIT Digital Access can discuss collection planning, device grading, refurbishment routing and impact reporting for corporate IT refresh cycles."
  },
  {
    question: "Can I sponsor devices instead of donating hardware?",
    answer:
      "Yes. Sponsors can support one learner device, a classroom bundle, a full computer lab or an ongoing access programme."
  },
  {
    question: "Can donations support Africa deployment?",
    answer:
      "Yes. Suitable devices and sponsorship can support deployment planning for schools, NGOs, vocational centres and community learning hubs across Africa."
  },
  {
    question: "Do sponsors receive impact reporting?",
    answer:
      "Impact reporting can be structured around the sponsorship route, including devices prepared, learners reached, labs supported and training enabled."
  },
  {
    question: "Can we create an ongoing corporate recycling partnership?",
    answer:
      "Yes. Companies with recurring device refresh cycles can discuss an ongoing partnership covering collection planning, refurbishment, deployment and reporting."
  }
];

export const donationFormSteps = [
  "Donor details",
  "Donation type",
  "Device or funding details",
  "Location and timing",
  "Message and submission"
];

export const donationNextSteps = [
  "We review your enquiry",
  "We confirm device or funding details",
  "We arrange collection or sponsorship route",
  "Devices are wiped, tested and configured",
  "Impact is tracked and reported"
];

export const donorTypeOptions: DonationSelectOption<DonorTypeValue>[] = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "COMPANY", label: "Company" },
  { value: "NGO", label: "NGO" },
  { value: "SCHOOL", label: "School" },
  { value: "FOUNDATION", label: "Foundation" },
  { value: "GOVERNMENT", label: "Government" }
];

export const donationTypeOptions: DonationSelectOption<DonationTypeValue>[] = [
  { value: "USED_LAPTOPS", label: "Used laptop donation" },
  { value: "DESKTOPS", label: "Desktop donation" },
  { value: "MINI_PCS", label: "Mini PC donation" },
  { value: "ACCESSORIES", label: "Accessories donation" },
  { value: "SPONSOR_LEARNER", label: "Sponsor one learner" },
  { value: "SPONSOR_CLASSROOM_BUNDLE", label: "Sponsor classroom bundle" },
  { value: "SPONSOR_FULL_LAB", label: "Sponsor full lab" },
  { value: "CORPORATE_RECYCLING", label: "Corporate recycling partnership" },
  { value: "MONTHLY_DONOR", label: "Monthly donor programme" }
];

export const deviceConditionOptions = [
  "Working",
  "Mixed condition",
  "Needs repair",
  "Unknown"
];
