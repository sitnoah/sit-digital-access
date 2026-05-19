import type {
  EducationUseCase,
  LabPackage,
  SchoolFAQItem,
  SchoolJourneyStep,
  SchoolSolution,
  SponsorOption
} from "@/types/school";

export const schoolSolutions: SchoolSolution[] = [
  {
    title: "Computer Labs",
    category: "Labs",
    description:
      "Room-ready lab bundles sized around timetable demand, learner numbers and course delivery.",
    bestFor: "ICT lessons, coding cohorts and vocational training",
    includes: ["10-30 device bundles", "Classroom layout planning", "Shared usage model"],
    icon: "monitor",
    cta: "Plan a lab"
  },
  {
    title: "Instructor Devices",
    category: "Teaching",
    description:
      "Reliable teacher machines configured for lesson delivery, demonstrations and classroom management.",
    bestFor: "Teachers, trainers and lab instructors",
    includes: ["Productivity setup", "Presentation readiness", "Secure accounts"],
    icon: "graduation",
    cta: "Request instructor setup"
  },
  {
    title: "Student Devices",
    category: "Learners",
    description:
      "Durable laptops and desktops prepared for supervised shared learning and individual access.",
    bestFor: "Learners, trainees and shared classrooms",
    includes: ["Secure wipe", "Learning software", "Asset tagging"],
    icon: "laptop",
    cta: "Request learner devices"
  },
  {
    title: "Network Setup",
    category: "Infrastructure",
    description: "Wi-Fi, switching and basic security planning for classrooms and labs.",
    bestFor: "Computer labs, classrooms and training rooms",
    includes: ["Connectivity checklist", "Basic network design", "Classroom readiness"],
    icon: "network",
    cta: "Scope network needs"
  },
  {
    title: "Timetable-Ready Lab Planning",
    category: "Planning",
    description: "Capacity planning for class rotations, course delivery and learner access.",
    bestFor: "Schools with rotating groups and shared labs",
    includes: ["Room usage planning", "Device-to-learner ratios", "Session capacity modelling"],
    icon: "chart",
    cta: "Plan capacity"
  },
  {
    title: "Software Installation",
    category: "Setup",
    description: "Windows, productivity tools, browsers, coding tools and learning platforms.",
    bestFor: "ICT lessons, coding classes and vocational training",
    includes: ["OS setup", "Coding tools", "Approved apps"],
    icon: "settings",
    cta: "Request setup"
  },
  {
    title: "Learning Platform Access",
    category: "Learning",
    description: "Prepared access for LMS, cloud tools and SIT Learning content pathways.",
    bestFor: "Digital skills, blended learning and course delivery",
    includes: ["Learner accounts", "Course access", "Digital skills pathways"],
    icon: "book",
    cta: "Discuss learning access"
  },
  {
    title: "Maintenance Planning",
    category: "Support",
    description: "Replacement cycles, support expectations and spare device planning.",
    bestFor: "Schools that need devices to keep working after handover",
    includes: ["Spare pool planning", "Support workflow", "Refresh roadmap"],
    icon: "wrench",
    cta: "Plan support"
  },
  {
    title: "Inventory Dashboard Concept",
    category: "Visibility",
    description: "Asset records for serials, users, locations, condition and support history.",
    bestFor: "School leaders, IT coordinators and donors",
    includes: ["Device register", "Support history", "Lab visibility"],
    icon: "database",
    cta: "Explore dashboard"
  }
];

export const labPackages: LabPackage[] = [
  {
    title: "Starter ICT Lab",
    deviceCount: "10 devices",
    bestFor: "Small ICT rooms, pilot cohorts and first lab projects",
    roomSize: "10-15 learners per session",
    networkNeeds: "Basic Wi-Fi or small switch",
    supportLevel: "Setup checklist and remote support",
    icon: "school"
  },
  {
    title: "Growth Lab",
    deviceCount: "20 devices",
    bestFor: "Regular timetable use and coding cohorts",
    roomSize: "20-25 learners per session",
    networkNeeds: "Switching, Wi-Fi and account planning",
    supportLevel: "Lab handover and maintenance model",
    icon: "network"
  },
  {
    title: "Full Training Lab",
    deviceCount: "30 devices",
    bestFor: "Vocational centres, academies and full ICT classrooms",
    roomSize: "30 learners per session",
    networkNeeds: "Planned lab network and support route",
    supportLevel: "Deployment planning and support workflow",
    icon: "monitor"
  },
  {
    title: "Mobile Learning Cart",
    deviceCount: "Shared laptop trolley",
    bestFor: "Flexible classroom rotations and multi-room access",
    roomSize: "Shared across classes",
    networkNeeds: "Charging, storage and Wi-Fi readiness",
    supportLevel: "Rotation and device care guidance",
    icon: "package"
  },
  {
    title: "Instructor + Student Bundle",
    deviceCount: "Instructor plus learners",
    bestFor: "Teacher-led lessons and demonstration-based training",
    roomSize: "Instructor-led classrooms",
    networkNeeds: "Presentation and cloud access readiness",
    supportLevel: "Instructor onboarding and setup support",
    icon: "graduation"
  }
];

export const labAddOns = [
  "Monitors",
  "Keyboards/mice",
  "Headsets",
  "Projector/display",
  "Network switch",
  "UPS/power planning",
  "Microsoft 365 / Google Workspace",
  "Digital skills training"
];

export const educationUseCases: EducationUseCase[] = [
  {
    title: "ICT lessons",
    recommendedDevice: "Student laptops or desktop lab",
    supportRequirement: "Software image and lab handover",
    trainingPathway: "Digital literacy and productivity",
    icon: "monitor"
  },
  {
    title: "Coding bootcamps",
    recommendedDevice: "Laptops or mini PC lab",
    supportRequirement: "Coding tools and account setup",
    trainingPathway: "Coding basics and project work",
    icon: "cpu"
  },
  {
    title: "Vocational IT training",
    recommendedDevice: "Desktop PCs or all-in-one stations",
    supportRequirement: "Course software and maintenance plan",
    trainingPathway: "Productivity, cloud and employability",
    icon: "building"
  },
  {
    title: "AI literacy classes",
    recommendedDevice: "Business laptops or AI learning lab",
    supportRequirement: "Browser, cloud tools and safe-use guidance",
    trainingPathway: "AI literacy and productivity",
    icon: "sparkles"
  },
  {
    title: "Community evening classes",
    recommendedDevice: "Shared laptops or community hub devices",
    supportRequirement: "Shared usage model and support route",
    trainingPathway: "Digital inclusion and online services",
    icon: "users"
  },
  {
    title: "Exam preparation",
    recommendedDevice: "Student laptops or supervised lab",
    supportRequirement: "Reliable access and browser readiness",
    trainingPathway: "Study skills and productivity",
    icon: "book"
  },
  {
    title: "Teacher digital skills",
    recommendedDevice: "Instructor devices",
    supportRequirement: "Presentation and cloud account setup",
    trainingPathway: "Teaching with digital tools",
    icon: "graduation"
  },
  {
    title: "NGO learning hubs",
    recommendedDevice: "Mini PCs, desktops or shared laptops",
    supportRequirement: "Asset tracking and maintenance model",
    trainingPathway: "Community digital skills",
    icon: "heart"
  }
];

export const schoolJourneySteps: SchoolJourneyStep[] = [
  {
    title: "School needs assessment",
    description: "Clarify learners, rooms, timetable demand, courses, power and connectivity.",
    insight: "Start with real teaching demand, not just a device count.",
    icon: "search"
  },
  {
    title: "Lab/package recommendation",
    description: "Match device quantities, lab format, add-ons and support to the school context.",
    insight: "Pick a package that can grow responsibly.",
    icon: "package"
  },
  {
    title: "Device preparation",
    description: "Source, test, wipe, upgrade, configure and document devices before handover.",
    insight: "Prepared devices reduce first-week friction.",
    icon: "settings"
  },
  {
    title: "Software and account setup",
    description: "Install operating systems, learning tools, cloud accounts and approved apps.",
    insight: "Students and teachers need a usable environment from day one.",
    icon: "cloud"
  },
  {
    title: "Lab installation and handover",
    description: "Support classroom layout, shared use, inventory records and practical handover.",
    insight: "A lab is an operating model, not only a room of devices.",
    icon: "school"
  },
  {
    title: "Training and support",
    description: "Connect devices with teacher onboarding, learner pathways and support routes.",
    insight: "Skills and support keep access useful.",
    icon: "graduation"
  },
  {
    title: "Maintenance and refresh planning",
    description: "Plan spares, issue handling, replacement cycles and longer-term sustainability.",
    insight: "Sustainable access needs a refresh plan.",
    icon: "wrench"
  }
];

export const sponsorOptions: SponsorOption[] = [
  {
    title: "Sponsor 5 learner devices",
    description: "Support a small group of learners with configured access.",
    icon: "laptop"
  },
  {
    title: "Sponsor 10-device starter lab",
    description: "Help a school launch a practical shared learning room.",
    icon: "school"
  },
  {
    title: "Sponsor full 30-device lab",
    description: "Fund a complete ICT or vocational training lab pathway.",
    icon: "monitor"
  },
  {
    title: "Sponsor instructor devices",
    description: "Equip teachers and trainers for lesson delivery.",
    icon: "graduation"
  },
  {
    title: "Sponsor training and support",
    description: "Fund the skills and maintenance route around a lab.",
    icon: "handshake"
  }
];

export const schoolFAQs: SchoolFAQItem[] = [
  {
    question: "Can a school start with only 10 devices?",
    answer:
      "Yes. A starter lab can be scoped around 10 devices and expanded later as timetable demand and funding grow."
  },
  {
    question: "Can you provide full computer labs?",
    answer:
      "Yes. Lab packages can include devices, setup, software, network planning, asset tagging and handover support."
  },
  {
    question: "Do you install software before delivery?",
    answer:
      "Yes. Devices can be prepared with Windows, productivity tools, browsers, coding tools and approved learning apps."
  },
  {
    question: "Can devices be shared between classes?",
    answer:
      "Yes. Shared lab usage, class rotations and booking models can be planned around real teaching demand."
  },
  {
    question: "Can you support coding or AI literacy training?",
    answer:
      "Yes. Digital skills, coding, cybersecurity basics and AI literacy pathways can be linked through SIT Learning."
  },
  {
    question: "Do you help with network setup?",
    answer:
      "Yes. Basic classroom connectivity, switches, Wi-Fi readiness and lab network planning can be scoped."
  },
  {
    question: "Can schools in Africa request deployment support?",
    answer:
      "Yes. SIT Digital Access can support Africa-focused deployment planning, including logistics, power-aware setup and local support models."
  },
  {
    question: "Can donors sponsor a school lab?",
    answer:
      "Yes. Donors and partners can sponsor learner devices, starter labs, full labs, instructor devices, training and support."
  }
];

export const schoolInventoryGroups = [
  { name: "ICT Lab A", assets: "30 assets", status: "Ready" },
  { name: "Coding Cohort", assets: "18 assets", status: "Configured" },
  { name: "Instructor Devices", assets: "6 assets", status: "Assigned" },
  { name: "Spare Pool", assets: "8 assets", status: "Available" },
  { name: "Repairs Queue", assets: "4 assets", status: "Review" }
];
