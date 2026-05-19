import type {
  ContactEnquiryRoute,
  ContactInfoItem,
  ContactProcessStep,
  ContactQuickAction,
  ContactSelectOption,
  ContactTrustCard
} from "@/types/contact";
import type { EnquiryType } from "@/lib/api";

export const contactHeroPipeline = ["New", "Reviewed", "Matched", "Follow-up"];

export const contactHeroCards = [
  { title: "New enquiry", detail: "General, support or service question", icon: "mail" },
  { title: "Device request", detail: "Quantity, users and specification needs", icon: "laptop" },
  { title: "Africa deployment", detail: "Logistics, lab and local support planning", icon: "globe" },
  { title: "Partnership lead", detail: "CSR, donor and ecosystem collaboration", icon: "business" }
] as const;

export const enquiryRoutes: ContactEnquiryRoute[] = [
  {
    title: "General Enquiry",
    description: "Ask about SIT Digital Access, services, partnerships or how the initiative works.",
    bestFor: "First conversations and general questions",
    tag: "General",
    ctaLabel: "Start general enquiry",
    ctaHref: "#contact-form",
    icon: "mail",
    enquiryType: "CONTACT"
  },
  {
    title: "Request Devices",
    description:
      "Tell us the number of devices, user groups, preferred specifications and support needs.",
    bestFor: "Schools, SMEs, NGOs and training centres",
    tag: "Devices",
    ctaLabel: "Request devices",
    ctaHref: "#contact-form",
    icon: "laptop",
    enquiryType: "REQUEST_DEVICES"
  },
  {
    title: "Partnership Enquiry",
    description:
      "Explore delivery partnerships, sponsorship models, CSR programmes and ecosystem collaboration.",
    bestFor: "Companies, NGOs, donors and institutions",
    tag: "Partnership",
    ctaLabel: "Discuss partnership",
    ctaHref: "#contact-form",
    icon: "business",
    enquiryType: "PARTNERSHIP"
  },
  {
    title: "Device Donation Enquiry",
    description:
      "Discuss used laptops, desktops, mini PCs, accessories or corporate device recycling.",
    bestFor: "Individuals, businesses and IT refresh programmes",
    tag: "Donation",
    ctaLabel: "Donate devices",
    ctaHref: "/donate",
    icon: "recycle",
    enquiryType: "DEVICE_DONATION"
  },
  {
    title: "Africa Deployment Enquiry",
    description:
      "Plan logistics, school labs, local support, offline-first learning and low-power deployment models.",
    bestFor: "Africa schools, NGOs, ministries and partners",
    tag: "Africa",
    ctaLabel: "Plan deployment",
    ctaHref: "/africa-deployment",
    icon: "globe",
    enquiryType: "AFRICA_DEPLOYMENT"
  },
  {
    title: "IT Support & Setup",
    description:
      "Ask about device preparation, Microsoft 365, Google Workspace, security, imaging and asset tagging.",
    bestFor: "Schools, SMEs and NGO teams",
    tag: "Support",
    ctaLabel: "Request setup support",
    ctaHref: "#contact-form",
    icon: "settings",
    enquiryType: "IT_SUPPORT"
  }
];

export const contactInfoItems: ContactInfoItem[] = [
  { label: "Email", value: "hello@sitdigitalaccess.example", icon: "mail" },
  { label: "Base", value: "UK-based with Africa deployment partnerships", icon: "map" },
  { label: "Phone", value: "Phone contact line available at launch", icon: "phone" },
  { label: "Deployment focus", value: "Liberia, Ghana, Sierra Leone, Nigeria, Wider Africa", icon: "globe" }
];

export const contactSupportCategories = [
  "Devices",
  "Donations",
  "Partnerships",
  "Africa deployment",
  "Training",
  "IT setup"
];

export const contactTrustCards: ContactTrustCard[] = [
  {
    title: "Secure device preparation",
    description: "Requests are handled with device wipe, setup and readiness in mind.",
    icon: "shield"
  },
  {
    title: "Deployment-aware planning",
    description: "We think through users, locations, power, support and handover.",
    icon: "globe"
  },
  {
    title: "Partner-friendly process",
    description: "Clear routes for schools, donors, NGOs, CSR teams and public partners.",
    icon: "handshake"
  },
  {
    title: "Practical follow-up",
    description: "The response focuses on next steps, not generic information.",
    icon: "check"
  }
];

export const contactProcessSteps: ContactProcessStep[] = [
  {
    title: "We review your enquiry",
    description: "We check the request type, location, timescale and support needs.",
    icon: "search"
  },
  {
    title: "We clarify needs",
    description: "We confirm device, support, donation, sponsorship or deployment requirements.",
    icon: "users"
  },
  {
    title: "We recommend a route",
    description: "We suggest the most practical device, lab, training or partnership pathway.",
    icon: "sparkles"
  },
  {
    title: "We prepare a plan",
    description: "We shape a device, lab, donation or partnership plan around the context.",
    icon: "package"
  },
  {
    title: "We agree next steps",
    description: "We confirm responsibilities, timeline and the next action needed.",
    icon: "check"
  }
];

export const contactQuickActions: ContactQuickAction[] = [
  { label: "Request Devices", href: "/devices#device-request", icon: "laptop" },
  { label: "Donate Devices", href: "/donate", icon: "recycle" },
  { label: "Plan Africa Deployment", href: "/africa-deployment", icon: "globe" },
  { label: "Become a Partner", href: "#contact-form", icon: "business" }
];

export const contactFaqs = [
  {
    question: "What should I include in my enquiry?",
    answer:
      "Include who the devices or support are for, approximate quantity, country or location, timeline, preferred device type and any support, training or deployment needs."
  },
  {
    question: "Can I request devices for a school or NGO?",
    answer:
      "Yes. Schools, training centres, NGOs and community organisations can request refurbished devices, computer lab bundles and setup support."
  },
  {
    question: "Can I discuss a corporate donation?",
    answer:
      "Yes. Use the device donation route if your organisation has used laptops, desktops, mini PCs or accessories from an IT refresh cycle."
  },
  {
    question: "Can I ask about Africa deployment?",
    answer:
      "Yes. SIT Digital Access can discuss deployment planning for Africa, including logistics, school labs, local support, low-power environments and offline-first learning."
  },
  {
    question: "Can SIT Digital Access help with software setup?",
    answer:
      "Yes. Enquiries can include Windows setup, Microsoft 365, Google Workspace, antivirus, imaging, accounts, security configuration and asset tagging."
  },
  {
    question: "Do you support SMEs?",
    answer:
      "Yes. SMEs can request affordable refurbished devices, office setup, cloud productivity configuration, cybersecurity basics and remote support options."
  },
  {
    question: "Can sponsors support one learner or a full lab?",
    answer:
      "Yes. Sponsorship conversations can cover one learner device, a classroom bundle, a full computer lab or a recurring partnership."
  },
  {
    question: "What happens after I submit the form?",
    answer:
      "The team reviews the enquiry, clarifies needs, recommends a practical route and follows up with next steps based on your timeline and location."
  }
];

export const contactEnquiryTypeOptions: ContactSelectOption<EnquiryType>[] = [
  { value: "CONTACT", label: "General enquiry" },
  { value: "REQUEST_DEVICES", label: "Request devices" },
  { value: "PARTNERSHIP", label: "Partnership enquiry" },
  { value: "DEVICE_DONATION", label: "Device donation enquiry" },
  { value: "AFRICA_DEPLOYMENT", label: "Africa deployment enquiry" },
  { value: "IT_SUPPORT", label: "IT support and setup" },
  { value: "SPONSORSHIP", label: "Sponsorship enquiry" }
];

export const contactOrganisationTypeOptions = [
  "Individual",
  "School",
  "Training centre",
  "SME",
  "NGO",
  "Company",
  "Donor / CSR team",
  "Government / ministry",
  "Community organisation"
];

export const preferredDeviceCategoryOptions = [
  "Student laptops",
  "Business laptops",
  "Desktop PCs",
  "Mini PCs",
  "Computer lab bundle",
  "AI learning lab bundle",
  "Accessories",
  "Not sure yet"
];

export const contactTimelineOptions = [
  "Urgent",
  "1-3 months",
  "3-6 months",
  "Planning stage"
];

export const deviceRelatedEnquiryTypes: EnquiryType[] = [
  "REQUEST_DEVICES",
  "SCHOOL_LAB",
  "SME_NGO",
  "AFRICA_DEPLOYMENT",
  "IT_SUPPORT"
];
