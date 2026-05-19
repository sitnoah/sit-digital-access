import type { DeviceFilterGroup, DeviceFilterState, DeviceProduct, DeviceSortOption } from "@/types/device";

export const emptyDeviceFilters: DeviceFilterState = {
  categories: [],
  useCases: [],
  processors: [],
  ram: [],
  storage: [],
  conditionGrades: [],
  priceRanges: [],
  deploymentTypes: [],
  supportIncluded: [],
  availability: []
};

export const deviceSortOptions: DeviceSortOption[] = [
  "Recommended",
  "Lowest price",
  "Highest specification",
  "Best for education",
  "Best for Africa deployment",
  "Low power first"
];

export const deviceFilterGroups: DeviceFilterGroup[] = [
  {
    id: "categories",
    label: "Category",
    options: [
      "Student laptops",
      "Business laptops",
      "Desktop PCs",
      "Mini PCs",
      "All-in-one PCs",
      "Computer lab bundles",
      "AI learning lab bundles",
      "Accessories"
    ]
  },
  {
    id: "useCases",
    label: "Use case",
    options: [
      "Education",
      "Business",
      "NGO",
      "Labs",
      "Africa deployment",
      "Low power",
      "Remote learning",
      "Digital skills training"
    ]
  },
  {
    id: "processors",
    label: "Processor",
    options: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"]
  },
  {
    id: "ram",
    label: "RAM",
    options: ["4GB", "8GB", "16GB", "32GB"]
  },
  {
    id: "storage",
    label: "Storage",
    options: ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD"]
  },
  {
    id: "conditionGrades",
    label: "Condition grade",
    options: ["Grade A", "Grade B", "Grade C", "Tested accessories"]
  },
  {
    id: "priceRanges",
    label: "Price range",
    options: ["Under £150", "£150-£250", "£250-£400", "£400+", "Custom quote"]
  },
  {
    id: "deploymentTypes",
    label: "Deployment type",
    options: [
      "Individual device",
      "Classroom bundle",
      "School lab",
      "NGO field kit",
      "Africa shipment",
      "Low-power lab"
    ]
  },
  {
    id: "supportIncluded",
    label: "Support included",
    options: [
      "Windows setup",
      "Microsoft 365 setup",
      "Google Workspace setup",
      "Antivirus",
      "Asset tagging",
      "Remote support",
      "On-site deployment",
      "Training included"
    ]
  },
  {
    id: "availability",
    label: "Availability",
    options: ["Available now", "Limited stock", "Quote required", "Bundle only", "Coming soon"]
  }
];

const commonFaqs = [
  {
    question: "Are devices tested before deployment?",
    answer: "Yes. Devices are inspected, wiped, configured, performance checked and documented before handover."
  },
  {
    question: "Can software setup be included?",
    answer: "Yes. Windows setup, Microsoft 365, Google Workspace, antivirus, asset tagging and user profiles can be included."
  },
  {
    question: "Can these devices support Africa deployment?",
    answer: "Yes. Suitable bundles can include low-power planning, packing, documentation and remote or local support models."
  }
];

export const deviceProducts: DeviceProduct[] = [
  {
    id: "student-laptops",
    slug: "student-laptops",
    name: "Student Laptops",
    category: "Student laptops",
    requestCategory: "STUDENT_LAPTOPS",
    shortDescription: "Affordable learner laptops configured for study, coursework and digital skills training.",
    longDescription:
      "Student laptop bundles are built for learners, training cohorts and schools that need dependable access without new-device pricing. Devices are selected for durability, webcam readiness, battery health and everyday learning performance.",
    image: "/devices/laptop-student.svg",
    gallery: ["/devices/laptop-student.svg", "/devices/laptop-business.svg", "/devices/computer-lab.svg"],
    bestFor: "Learners, trainees and remote study",
    tags: ["Education", "Remote learning", "Africa deployment"],
    useCases: ["Education", "Africa deployment", "Remote learning", "Digital skills training"],
    processorOptions: ["Intel Core i3", "Intel Core i5", "AMD Ryzen 5"],
    ramOptions: ["4GB", "8GB", "16GB"],
    storageOptions: ["128GB SSD", "256GB SSD", "512GB SSD"],
    conditionGrades: ["Grade A", "Grade B"],
    priceLabel: "From £145",
    fromPrice: 145,
    availability: "Available now",
    supportIncluded: ["Windows setup", "Antivirus", "Asset tagging", "Remote support"],
    deploymentTypes: ["Individual device", "Classroom bundle", "Africa shipment"],
    warranty: "Warranty-ready workflow with remote support options",
    idealFor: ["Schools", "Training centres", "Learner sponsorship", "Community access"],
    specifications: [
      { label: "Typical CPU", value: "Intel Core i3/i5 or AMD Ryzen 5" },
      { label: "Memory", value: "4GB-16GB RAM" },
      { label: "Storage", value: "128GB-512GB SSD" },
      { label: "Setup", value: "Windows, browser, productivity and security baseline" }
    ],
    includedServices: ["Secure data wipe", "OS setup", "Performance test", "Asset tag", "Learner-ready packaging"],
    bundleOptions: ["10-device learner cohort", "24-device classroom set", "Sponsored learner pack"],
    faqs: commonFaqs,
    featured: true,
    educationFit: 98,
    africaFit: 88,
    lowPowerScore: 72,
    performanceScore: 72
  },
  {
    id: "business-laptops",
    slug: "business-laptops",
    name: "Business Laptops",
    category: "Business laptops",
    requestCategory: "BUSINESS_LAPTOPS",
    shortDescription: "Professional-grade laptops for SMEs, NGOs, staff teams and field operations.",
    longDescription:
      "Business laptop packages are prepared for productive work, cloud tools and secure everyday operations. They are ideal for small teams, NGO field offices and organisations upgrading devices affordably.",
    image: "/devices/laptop-business.svg",
    gallery: ["/devices/laptop-business.svg", "/devices/laptop-student.svg", "/devices/accessories.svg"],
    bestFor: "SMEs, NGOs and field teams",
    tags: ["Business", "NGO", "Remote support"],
    useCases: ["Business", "NGO", "Remote learning"],
    processorOptions: ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"],
    ramOptions: ["8GB", "16GB", "32GB"],
    storageOptions: ["256GB SSD", "512GB SSD", "1TB SSD"],
    conditionGrades: ["Grade A", "Grade B"],
    priceLabel: "From £225",
    fromPrice: 225,
    availability: "Limited stock",
    supportIncluded: ["Windows setup", "Microsoft 365 setup", "Google Workspace setup", "Antivirus", "Remote support"],
    deploymentTypes: ["Individual device", "NGO field kit", "Africa shipment"],
    warranty: "Warranty and lifecycle support available",
    idealFor: ["Small businesses", "NGO teams", "Hybrid workers", "Donor-funded offices"],
    specifications: [
      { label: "Typical CPU", value: "Intel Core i5/i7 or AMD Ryzen 5/7" },
      { label: "Memory", value: "8GB-32GB RAM" },
      { label: "Storage", value: "256GB-1TB SSD" },
      { label: "Setup", value: "Productivity suite, endpoint protection and staff profiles" }
    ],
    includedServices: ["Secure data wipe", "Cloud productivity setup", "Endpoint protection", "Asset register"],
    bundleOptions: ["5-person SME pack", "NGO field office kit", "Department refresh bundle"],
    faqs: commonFaqs,
    educationFit: 74,
    africaFit: 80,
    lowPowerScore: 76,
    performanceScore: 88
  },
  {
    id: "desktop-pcs",
    slug: "desktop-pcs",
    name: "Desktop PCs",
    category: "Desktop PCs",
    requestCategory: "DESKTOP_PCS",
    shortDescription: "Reliable desktops for offices, ICT rooms, libraries and fixed workstations.",
    longDescription:
      "Desktop PCs are a cost-effective route for permanent workstations, computer rooms and administrative desks. Units can be upgraded with SSDs, RAM and a standard software image.",
    image: "/devices/desktop-pc.svg",
    gallery: ["/devices/desktop-pc.svg", "/devices/computer-lab.svg", "/devices/accessories.svg"],
    bestFor: "Offices, labs and reception areas",
    tags: ["Business", "Labs", "Value"],
    useCases: ["Business", "Labs", "Education"],
    processorOptions: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "AMD Ryzen 5"],
    ramOptions: ["4GB", "8GB", "16GB"],
    storageOptions: ["128GB SSD", "256GB SSD", "512GB SSD"],
    conditionGrades: ["Grade A", "Grade B", "Grade C"],
    priceLabel: "From £120",
    fromPrice: 120,
    availability: "Available now",
    supportIncluded: ["Windows setup", "Antivirus", "Asset tagging", "Remote support"],
    deploymentTypes: ["Individual device", "Classroom bundle", "School lab"],
    warranty: "Tested and documented with warranty-ready workflow",
    idealFor: ["Fixed labs", "Libraries", "Admin offices", "Reception desks"],
    specifications: [
      { label: "Form factor", value: "Small form factor or tower" },
      { label: "Memory", value: "4GB-16GB RAM" },
      { label: "Storage", value: "128GB-512GB SSD" },
      { label: "Accessories", value: "Monitor, keyboard and mouse options" }
    ],
    includedServices: ["SSD upgrade option", "OS image", "Peripheral matching", "Asset tag"],
    bundleOptions: ["Office workstation bundle", "ICT room desktop set", "Library access pack"],
    faqs: commonFaqs,
    educationFit: 82,
    africaFit: 68,
    lowPowerScore: 54,
    performanceScore: 76
  },
  {
    id: "mini-pcs",
    slug: "mini-pcs",
    name: "Mini PCs",
    category: "Mini PCs",
    requestCategory: "MINI_PCS",
    shortDescription: "Compact, low-power machines for labs, classrooms and constrained spaces.",
    longDescription:
      "Mini PCs are ideal for low-power labs, compact classrooms and clean desk environments. They offer strong value for training rooms where energy efficiency and easy deployment matter.",
    image: "/devices/mini-pc.svg",
    gallery: ["/devices/mini-pc.svg", "/devices/computer-lab.svg", "/devices/all-in-one.svg"],
    bestFor: "Low-space labs and training rooms",
    tags: ["Low power", "Labs", "Africa deployment"],
    useCases: ["Labs", "Africa deployment", "Low power", "Education"],
    processorOptions: ["Intel Core i3", "Intel Core i5", "AMD Ryzen 5"],
    ramOptions: ["8GB", "16GB"],
    storageOptions: ["128GB SSD", "256GB SSD", "512GB SSD"],
    conditionGrades: ["Grade A", "Grade B"],
    priceLabel: "From £165",
    fromPrice: 165,
    availability: "Quote required",
    supportIncluded: ["Windows setup", "Asset tagging", "Remote support", "On-site deployment"],
    deploymentTypes: ["Classroom bundle", "School lab", "Africa shipment", "Low-power lab"],
    warranty: "Deployment support and replacement planning available",
    idealFor: ["Solar/generator-aware labs", "Training centres", "Space-constrained rooms", "Africa deployments"],
    specifications: [
      { label: "Power profile", value: "Low-power compact unit" },
      { label: "Memory", value: "8GB-16GB RAM" },
      { label: "Storage", value: "128GB-512GB SSD" },
      { label: "Connectivity", value: "Ethernet or Wi-Fi depending on model" }
    ],
    includedServices: ["Low-power planning", "Lab image", "Asset tag", "Support checklist"],
    bundleOptions: ["12-seat mini lab", "24-seat low-power lab", "Offline-first classroom pack"],
    faqs: commonFaqs,
    featured: true,
    educationFit: 88,
    africaFit: 94,
    lowPowerScore: 98,
    performanceScore: 78
  },
  {
    id: "all-in-one-pcs",
    slug: "all-in-one-pcs",
    name: "All-in-One PCs",
    category: "All-in-one PCs",
    requestCategory: "DESKTOP_PCS",
    shortDescription: "Clean, integrated desktop setups for libraries, classrooms and front-office teams.",
    longDescription:
      "All-in-one PCs combine display and computer into one tidy workstation, reducing cable clutter and making them useful for public access points, admin desks and supervised learning rooms.",
    image: "/devices/all-in-one.svg",
    gallery: ["/devices/all-in-one.svg", "/devices/desktop-pc.svg", "/devices/accessories.svg"],
    bestFor: "Libraries, classrooms and admin desks",
    tags: ["Education", "Business", "Clean desk"],
    useCases: ["Education", "Business", "Labs"],
    processorOptions: ["Intel Core i3", "Intel Core i5", "AMD Ryzen 5"],
    ramOptions: ["8GB", "16GB"],
    storageOptions: ["256GB SSD", "512GB SSD"],
    conditionGrades: ["Grade A", "Grade B"],
    priceLabel: "From £210",
    fromPrice: 210,
    availability: "Limited stock",
    supportIncluded: ["Windows setup", "Antivirus", "Asset tagging", "Remote support"],
    deploymentTypes: ["Individual device", "Classroom bundle", "School lab"],
    warranty: "Warranty and replacement planning available",
    idealFor: ["Libraries", "Reception desks", "Training rooms", "Admin teams"],
    specifications: [
      { label: "Display", value: "Integrated display" },
      { label: "Memory", value: "8GB-16GB RAM" },
      { label: "Storage", value: "256GB-512GB SSD" },
      { label: "Included", value: "Keyboard and mouse options" }
    ],
    includedServices: ["OS setup", "Peripheral matching", "Security baseline", "Asset register"],
    bundleOptions: ["Library access pack", "Admin desk refresh", "Training room bundle"],
    faqs: commonFaqs,
    educationFit: 80,
    africaFit: 64,
    lowPowerScore: 62,
    performanceScore: 74
  },
  {
    id: "computer-lab-bundles",
    slug: "computer-lab-bundles",
    name: "Computer Lab Bundles",
    category: "Computer lab bundles",
    requestCategory: "COMPUTER_LAB_BUNDLES",
    shortDescription: "Complete lab packages with devices, networking, setup and support planning.",
    longDescription:
      "Computer lab bundles are designed for schools and training centres that need a complete, timetable-ready setup. Bundles can include devices, monitors, networking, software image, asset tags and deployment documentation.",
    image: "/devices/computer-lab.svg",
    gallery: ["/devices/computer-lab.svg", "/devices/mini-pc.svg", "/devices/laptop-student.svg"],
    bestFor: "Schools and training centres",
    tags: ["Education", "Labs", "Africa deployment"],
    useCases: ["Education", "Labs", "Africa deployment", "Digital skills training"],
    processorOptions: ["Intel Core i3", "Intel Core i5", "AMD Ryzen 5"],
    ramOptions: ["8GB", "16GB"],
    storageOptions: ["256GB SSD", "512GB SSD"],
    conditionGrades: ["Grade A", "Grade B"],
    priceLabel: "Custom quote",
    availability: "Bundle only",
    supportIncluded: ["Windows setup", "Asset tagging", "Remote support", "On-site deployment", "Training included"],
    deploymentTypes: ["Classroom bundle", "School lab", "Africa shipment", "Low-power lab"],
    warranty: "Lab support and maintenance model available",
    idealFor: ["Schools", "Training centres", "Community hubs", "Africa deployment partners"],
    specifications: [
      { label: "Bundle size", value: "10-40 devices" },
      { label: "Network", value: "Switching, router and Wi-Fi planning options" },
      { label: "Software", value: "Classroom-ready image and productivity tools" },
      { label: "Support", value: "Remote, local or partner deployment support" }
    ],
    includedServices: ["Lab planning", "Device imaging", "Network setup", "Asset register", "Support handover"],
    bundleOptions: ["10-seat starter lab", "24-seat classroom lab", "40-seat training centre lab"],
    faqs: commonFaqs,
    featured: true,
    educationFit: 100,
    africaFit: 92,
    lowPowerScore: 86,
    performanceScore: 82
  },
  {
    id: "ai-learning-lab-bundles",
    slug: "ai-learning-lab-bundles",
    name: "AI Learning Lab Bundles",
    category: "AI learning lab bundles",
    requestCategory: "AI_LEARNING_LAB_BUNDLES",
    shortDescription: "Device and software bundles for AI literacy, coding and future skills programmes.",
    longDescription:
      "AI learning lab bundles combine suitable refurbished devices with cloud-ready setup, browser tools, productivity software and training pathways for AI literacy, coding and practical digital skills.",
    image: "/devices/ai-learning-lab.svg",
    gallery: ["/devices/ai-learning-lab.svg", "/devices/laptop-business.svg", "/devices/computer-lab.svg"],
    bestFor: "AI literacy and digital skills centres",
    tags: ["Education", "Labs", "Digital skills training"],
    useCases: ["Education", "Labs", "Digital skills training", "Business"],
    processorOptions: ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"],
    ramOptions: ["8GB", "16GB", "32GB"],
    storageOptions: ["256GB SSD", "512GB SSD", "1TB SSD"],
    conditionGrades: ["Grade A", "Grade B"],
    priceLabel: "Pilot quote",
    availability: "Quote required",
    supportIncluded: ["Windows setup", "Microsoft 365 setup", "Google Workspace setup", "Remote support", "Training included"],
    deploymentTypes: ["Classroom bundle", "School lab", "Low-power lab"],
    warranty: "Training and support add-ons available",
    idealFor: ["AI literacy cohorts", "Coding bootcamps", "Training centres", "Workforce programmes"],
    specifications: [
      { label: "Performance", value: "Cloud-ready learning machines" },
      { label: "Memory", value: "8GB-32GB RAM" },
      { label: "Storage", value: "256GB-1TB SSD" },
      { label: "Training", value: "AI literacy and digital skills pathway options" }
    ],
    includedServices: ["AI learning setup", "Coding tools", "Cloud access guidance", "Training pathway"],
    bundleOptions: ["AI literacy pilot lab", "Coding cohort bundle", "Future skills classroom"],
    faqs: commonFaqs,
    educationFit: 94,
    africaFit: 76,
    lowPowerScore: 70,
    performanceScore: 94
  },
  {
    id: "accessories",
    slug: "accessories",
    name: "Accessories",
    category: "Accessories",
    requestCategory: "ACCESSORIES",
    shortDescription: "Monitors, keyboards, mice, headsets, chargers and cables matched to deployments.",
    longDescription:
      "Accessories complete the deployment: screens, keyboards, mice, headsets, chargers, cables and spares can be checked, packed and matched to device bundles.",
    image: "/devices/accessories.svg",
    gallery: ["/devices/accessories.svg", "/devices/desktop-pc.svg", "/devices/computer-lab.svg"],
    bestFor: "Workstations and lab expansions",
    tags: ["Business", "Labs", "Low power"],
    useCases: ["Business", "Labs", "Education", "Low power"],
    processorOptions: [],
    ramOptions: [],
    storageOptions: [],
    conditionGrades: ["Tested accessories"],
    priceLabel: "Added to bundle",
    availability: "Available now",
    supportIncluded: ["Asset tagging", "Remote support"],
    deploymentTypes: ["Classroom bundle", "School lab", "NGO field kit", "Africa shipment"],
    warranty: "Checked and packaged for deployment",
    idealFor: ["Lab expansions", "Monitor packs", "Spare chargers", "Headset bundles"],
    specifications: [
      { label: "Includes", value: "Displays, keyboards, mice, headsets, chargers and cables" },
      { label: "Condition", value: "Tested and matched to deployment" },
      { label: "Packaging", value: "Packed by bundle or site" },
      { label: "Tracking", value: "Can be included in asset records" }
    ],
    includedServices: ["Compatibility check", "Bundle matching", "Packing list", "Asset documentation"],
    bundleOptions: ["Monitor pack", "Keyboard and mouse set", "Charger and cable spare kit"],
    faqs: commonFaqs,
    educationFit: 70,
    africaFit: 82,
    lowPowerScore: 86,
    performanceScore: 40
  }
];

export function getDeviceProductBySlug(slug: string) {
  return deviceProducts.find((product) => product.slug === slug);
}

export function getRelatedDeviceProducts(product: DeviceProduct, limit = 3) {
  return deviceProducts
    .filter((candidate) => candidate.slug !== product.slug)
    .map((candidate) => ({
      product: candidate,
      score:
        candidate.useCases.filter((useCase) => product.useCases.includes(useCase)).length +
        candidate.deploymentTypes.filter((type) => product.deploymentTypes.includes(type)).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product: related }) => related);
}
