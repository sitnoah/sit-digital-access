export const FIREBASE_APP = Symbol("FIREBASE_APP");
export const FIRESTORE = Symbol("FIRESTORE");
export const FIREBASE_STORAGE = Symbol("FIREBASE_STORAGE");

export const COLLECTIONS = {
  enquiries: "enquiries",
  deviceRequests: "deviceRequests",
  donations: "donations",
  inventory: "inventory",
  impactStats: "impactStats",
  users: "users",
  teams: "teams",
  roles: "roles",
  permissions: "permissions",
  notifications: "notifications",
  auditLogs: "auditLogs",
  deployments: "deployments",
  recycling: "recycling",
  recyclingPartners: "recyclingPartners",
  supportTickets: "supportTickets",
  repairTickets: "repairTickets",
  repairParts: "repairParts",
  repairTechnicians: "repairTechnicians",
  savedViews: "savedViews",
  successStories: "successStories",
  trainingCohorts: "trainingCohorts",
  sustainabilityReports: "sustainabilityReports",
  outboxEvents: "outboxEvents",
  tradeIns: "tradeIns"
} as const;

export const IMPACT_STATS_DOCUMENT_ID = "current";
