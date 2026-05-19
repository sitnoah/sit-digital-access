import type { IconKey } from "@/components/icons";

export type DeliveryServiceCategory =
  | "All"
  | "Devices"
  | "Labs"
  | "Training"
  | "Africa"
  | "Support"
  | "Sponsorship";

export type DeliveryService = {
  title: string;
  category: Exclude<DeliveryServiceCategory, "All">;
  description: string;
  bestFor: string;
  includes: string[];
  ctaLabel: string;
  ctaHref: string;
  icon: IconKey;
};

export type DeliveryProcessStep = {
  label: string;
  icon: IconKey;
};

export type DeliveryModelStat = {
  value: string;
  label: string;
  detail: string;
};

export const deliveryServiceTabs: DeliveryServiceCategory[] = [
  "All",
  "Devices",
  "Labs",
  "Training",
  "Africa",
  "Support",
  "Sponsorship"
];

export const deliveryServices: DeliveryService[] = [
  {
    title: "Refurbished Devices",
    category: "Devices",
    description:
      "Professionally sourced, tested, cleaned, upgraded and configured laptops, desktops and mini PCs for education, business and community use.",
    bestFor: "Learners, staff, SMEs and NGOs",
    includes: ["Secure data wipe", "OS and software setup", "Asset tagging"],
    ctaLabel: "Explore devices",
    ctaHref: "/#device-catalogue",
    icon: "laptop"
  },
  {
    title: "Computer Lab Packages",
    category: "Labs",
    description:
      "Complete computer lab bundles for schools and training centres, including devices, networking, software, classroom setup and support.",
    bestFor: "Schools, academies and training centres",
    includes: ["10-30 device bundles", "Network and workstation planning", "Setup and handover support"],
    ctaLabel: "View lab bundles",
    ctaHref: "/devices/computer-lab-bundles",
    icon: "network"
  },
  {
    title: "Digital Skills Training",
    category: "Training",
    description:
      "Practical IT training, coding, office productivity, cloud tools, cybersecurity basics and AI literacy through SIT Learning.",
    bestFor: "Learners, staff and community groups",
    includes: ["Digital literacy pathways", "AI and productivity workshops", "Career-focused learning"],
    ctaLabel: "Explore training",
    ctaHref: "/programmes",
    icon: "book"
  },
  {
    title: "Africa Technology Access",
    category: "Africa",
    description:
      "Shipping, setup, training, maintenance and local delivery models for schools and training centres across Africa.",
    bestFor: "Liberia, Ghana, Sierra Leone, Nigeria and wider Africa",
    includes: ["Logistics planning", "Local technician enablement", "Offline-first support"],
    ctaLabel: "Plan deployment",
    ctaHref: "/africa-deployment",
    icon: "globe"
  },
  {
    title: "Device Sponsorship & Donation",
    category: "Sponsorship",
    description:
      "Companies and individuals can donate used laptops or sponsor refurbished devices for learners, schools and communities.",
    bestFor: "Donors, CSR teams and partners",
    includes: ["Device donation processing", "Learner sponsorship", "Lab sponsorship packages"],
    ctaLabel: "Sponsor devices",
    ctaHref: "/donate",
    icon: "heart"
  },
  {
    title: "IT Support & Managed Setup",
    category: "Support",
    description:
      "Device imaging, Windows setup, Microsoft 365, antivirus, user accounts, security configuration, asset tracking and remote support.",
    bestFor: "Schools, SMEs and NGO teams",
    includes: ["Microsoft 365 / Google Workspace setup", "Antivirus and endpoint readiness", "Remote support options"],
    ctaLabel: "Request support",
    ctaHref: "/contact",
    icon: "settings"
  }
];

export const deliveryProcessSteps: DeliveryProcessStep[] = [
  { label: "Source", icon: "recycle" },
  { label: "Prepare", icon: "wrench" },
  { label: "Configure", icon: "settings" },
  { label: "Deploy", icon: "truck" },
  { label: "Train", icon: "graduation" },
  { label: "Support", icon: "headset" }
];

export const deliveryTrustIndicators: DeliveryProcessStep[] = [
  { label: "100% tested devices", icon: "check" },
  { label: "Securely wiped", icon: "shield" },
  { label: "Classroom-ready setup", icon: "school" },
  { label: "Africa deployment support", icon: "globe" },
  { label: "Skills training included", icon: "book" }
];

export const deliveryModelStats: DeliveryModelStat[] = [
  { value: "6", label: "delivery tracks", detail: "devices, labs, training, support, Africa and sponsorship" },
  { value: "1", label: "joined-up workflow", detail: "from sourcing through handover and support" },
  { value: "100%", label: "readiness focus", detail: "tested, wiped, configured and documented" }
];
