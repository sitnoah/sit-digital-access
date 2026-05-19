import type {
  WorkforceNotification,
  WorkforcePermission,
  WorkforceRoleDefinition,
  WorkforceTeam
} from "@/types/workforce";

export const workforcePermissions: WorkforcePermission[] = [
  { id: "read-enquiries", label: "Read enquiries", description: "View public contact and deployment enquiries.", pages: ["/admin/enquiries"] },
  { id: "manage-enquiries", label: "Manage enquiries", description: "Update statuses, notes, owners and priority.", pages: ["/admin/enquiries"] },
  { id: "manage-inventory", label: "Manage inventory", description: "Create, update and retire refurbished device records.", pages: ["/admin/inventory"] },
  { id: "manage-donations", label: "Manage donations", description: "Process donation, sponsorship and recycling records.", pages: ["/admin/donations"] },
  { id: "manage-deployments", label: "Manage deployments", description: "Coordinate Africa deployment staffing and delivery workflows.", pages: ["/admin/deployments", "/admin/device-requests"] },
  { id: "manage-impact", label: "Manage impact", description: "Update public impact metrics and reporting snapshots.", pages: ["/admin/impact"] },
  { id: "manage-settings", label: "Manage settings", description: "Run diagnostics and configure operational settings.", pages: ["/admin/settings"] },
  { id: "manage-users", label: "Manage users", description: "Invite users, change roles and manage workforce profiles.", pages: ["/admin/users", "/admin/roles"] },
  { id: "export-data", label: "Export data", description: "Export CSV reports for operations and accountability.", pages: ["All admin workspaces"] }
];

export const workforceRoles: WorkforceRoleDefinition[] = [
  {
    id: "superAdmin",
    claim: "superAdmin",
    label: "Super Admin",
    description: "Full platform owner with role, settings and destructive-operation access.",
    permissions: workforcePermissions.map((permission) => permission.id),
    accessAreas: ["All admin modules", "Settings", "Roles", "Danger Zone"],
    riskLevel: "Critical"
  },
  {
    id: "admin",
    claim: "admin",
    label: "Admin",
    description: "General administrator for day-to-day SIT Digital Access operations.",
    permissions: ["read-enquiries", "manage-enquiries", "manage-inventory", "manage-donations", "manage-impact", "export-data"],
    accessAreas: ["Dashboard", "Enquiries", "Requests", "Donations", "Inventory", "Impact"],
    riskLevel: "High"
  },
  {
    id: "operationsManager",
    claim: "operationsManager",
    label: "Operations Manager",
    description: "Coordinates requests, deployment planning and operational follow-up.",
    permissions: ["read-enquiries", "manage-enquiries", "manage-deployments", "export-data"],
    accessAreas: ["Dashboard", "Enquiries", "Device Requests", "Deployments"],
    riskLevel: "High"
  },
  {
    id: "deviceManager",
    claim: "deviceManager",
    label: "Device Manager",
    description: "Owns device request fulfilment and refurbished inventory workflows.",
    permissions: ["manage-inventory", "manage-deployments", "export-data"],
    accessAreas: ["Device Requests", "Inventory", "Deployments"],
    riskLevel: "Medium"
  },
  {
    id: "inventoryManager",
    claim: "inventoryManager",
    label: "Inventory Manager",
    description: "Maintains stock quality, asset tagging, lifecycle and bundle readiness.",
    permissions: ["manage-inventory", "export-data"],
    accessAreas: ["Inventory", "Device Requests"],
    riskLevel: "Medium"
  },
  {
    id: "donationsManager",
    claim: "donationsManager",
    label: "Donations Manager",
    description: "Manages sponsorship, donation and corporate recycling operations.",
    permissions: ["manage-donations", "read-enquiries", "export-data"],
    accessAreas: ["Donations", "Enquiries"],
    riskLevel: "Medium"
  },
  {
    id: "deploymentCoordinator",
    claim: "deploymentCoordinator",
    label: "Deployment Coordinator",
    description: "Coordinates country deployments, school lab handovers and field readiness.",
    permissions: ["manage-deployments", "read-enquiries"],
    accessAreas: ["Deployments", "Device Requests", "Enquiries"],
    riskLevel: "Medium"
  },
  {
    id: "countryManager",
    claim: "countryManager",
    label: "Country Manager",
    description: "Owns country-level partner follow-up, logistics and local support visibility.",
    permissions: ["manage-deployments", "read-enquiries", "export-data"],
    accessAreas: ["Deployments", "Enquiries", "Activity Logs"],
    riskLevel: "Medium"
  },
  {
    id: "analyticsManager",
    claim: "analyticsManager",
    label: "Analytics Manager",
    description: "Maintains impact reporting, dashboards and accountability exports.",
    permissions: ["manage-impact", "export-data"],
    accessAreas: ["Impact", "Dashboard", "Activity Logs"],
    riskLevel: "Medium"
  },
  {
    id: "supportAgent",
    claim: "supportAgent",
    label: "Support Agent",
    description: "Views and updates assigned enquiries and support records.",
    permissions: ["read-enquiries", "manage-enquiries"],
    accessAreas: ["Enquiries", "Device Requests"],
    riskLevel: "Low"
  }
];

export const workforceTeams: WorkforceTeam[] = [
  {
    id: "operations",
    name: "Operations",
    description: "Central coordination for enquiries, request triage and delivery planning.",
    lead: "Operations Manager",
    members: 4,
    activeProjects: 12,
    countriesCovered: ["UK", "Liberia", "Ghana"],
    workload: 72,
    kpis: ["Response time", "Qualified leads", "Deployment handovers"],
    icon: "settings"
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Refurbished device stock, quality workflow, asset tagging and fulfilment.",
    lead: "Device Manager",
    members: 3,
    activeProjects: 8,
    countriesCovered: ["UK"],
    workload: 64,
    kpis: ["Available devices", "Repair queue", "Lab-ready bundles"],
    icon: "database"
  },
  {
    id: "donations",
    name: "Donations",
    description: "Device donations, sponsorships and corporate recycling partnerships.",
    lead: "Donations Manager",
    members: 2,
    activeProjects: 7,
    countriesCovered: ["UK", "Wider Africa"],
    workload: 58,
    kpis: ["Sponsors", "Collection plans", "Donation offers"],
    icon: "heart"
  },
  {
    id: "africa-deployment",
    name: "Africa Deployment",
    description: "Country readiness, logistics, local technician enablement and lab rollout.",
    lead: "Deployment Coordinator",
    members: 5,
    activeProjects: 9,
    countriesCovered: ["Liberia", "Ghana", "Sierra Leone", "Nigeria"],
    workload: 78,
    kpis: ["Countries active", "Lab readiness", "Local support"],
    icon: "globe"
  },
  {
    id: "support",
    name: "Support",
    description: "Remote and local support for schools, SMEs, NGOs and deployment partners.",
    lead: "Support Lead",
    members: 4,
    activeProjects: 16,
    countriesCovered: ["UK", "Liberia", "Nigeria"],
    workload: 69,
    kpis: ["Open support items", "Resolution time", "Escalations"],
    icon: "headset"
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Impact dashboards, reports, public metrics and operational performance.",
    lead: "Analytics Manager",
    members: 2,
    activeProjects: 5,
    countriesCovered: ["Global"],
    workload: 46,
    kpis: ["Impact snapshots", "Reports", "Audit coverage"],
    icon: "chart"
  },
  {
    id: "partnerships",
    name: "Partnerships",
    description: "NGO, donor, ministry, CSR and delivery partner relationship management.",
    lead: "Partnerships Lead",
    members: 3,
    activeProjects: 10,
    countriesCovered: ["UK", "Wider Africa"],
    workload: 61,
    kpis: ["Partner leads", "MoUs", "Sponsor readiness"],
    icon: "handshake"
  },
  {
    id: "training",
    name: "Training & Enablement",
    description: "Digital skills, AI literacy, onboarding and local technician training.",
    lead: "Training Lead",
    members: 3,
    activeProjects: 11,
    countriesCovered: ["UK", "Ghana", "Sierra Leone"],
    workload: 66,
    kpis: ["Training hours", "Cohorts", "Technicians trained"],
    icon: "graduation"
  }
];

export const workforceNotifications: WorkforceNotification[] = [
  {
    id: "n-001",
    title: "New Africa deployment enquiry",
    message: "A school partner selected Liberia and requested a 20-device lab planning call.",
    category: "Deployment",
    priority: "High",
    read: false,
    createdAt: new Date().toISOString(),
    actionHref: "/admin/enquiries"
  },
  {
    id: "n-002",
    title: "Low mini PC stock",
    message: "Mini PC stock is below the lab bundle planning threshold.",
    category: "Inventory",
    priority: "Medium",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    actionHref: "/admin/inventory"
  },
  {
    id: "n-003",
    title: "Corporate recycling lead",
    message: "A company donation offer may be suitable for a recurring device recycling partnership.",
    category: "Donation",
    priority: "Medium",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    actionHref: "/admin/donations"
  },
  {
    id: "n-004",
    title: "API diagnostics warning",
    message: "Firestore-backed widgets may show degraded data until Firestore is enabled.",
    category: "System",
    priority: "High",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    actionHref: "/admin/settings"
  }
];
