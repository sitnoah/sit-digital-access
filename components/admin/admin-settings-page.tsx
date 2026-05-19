"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { API_BASE_URL } from "@/lib/api";
import { firebaseConfigStatus, firebaseEnvKeys } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type {
  AdminRoleDefinition,
  ApiHealthStatus,
  AuditLogSummary,
  ConfigHealthItem,
  DeploymentChecklistItem,
  FirebaseConfigStatus,
  FirestoreCollectionStatus,
  IntegrationStatus,
  SecurityChecklistItem,
  SettingsDiagnostic,
  SettingsStatus,
  SettingsTab
} from "@/types/settings";

const settingsTabs: Array<{ id: SettingsTab; label: string; icon: IconKey }> = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "firebase", label: "Firebase", icon: "shield" },
  { id: "api", label: "API", icon: "cloud" },
  { id: "roles", label: "Admin Roles", icon: "users" },
  { id: "firestore", label: "Firestore", icon: "database" },
  { id: "security", label: "Security", icon: "badge" },
  { id: "deployment", label: "Deployment", icon: "truck" },
  { id: "integrations", label: "Integrations", icon: "network" },
  { id: "audit", label: "Audit Logs", icon: "list" },
  { id: "danger", label: "Danger Zone", icon: "wrench" }
];

const firebaseValues: Record<(typeof firebaseEnvKeys)[number], string | undefined> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const roleDefinitions: AdminRoleDefinition[] = [
  {
    role: "superAdmin",
    description: "Full platform administrator for initial setup, role assignment and sensitive configuration.",
    permissions: ["Full access", "Manage roles", "Delete records", "Configure settings"],
    accessAreas: ["All admin modules", "Settings", "Claims", "Danger Zone"],
    riskLevel: "Critical"
  },
  {
    role: "admin",
    description: "General administrator for day-to-day SIT Digital Access operations.",
    permissions: ["Manage enquiries", "Manage requests", "Manage donations", "Manage inventory", "Manage impact"],
    accessAreas: ["Dashboard", "Enquiries", "Device Requests", "Donations", "Inventory", "Impact"],
    riskLevel: "High"
  },
  {
    role: "operationsManager",
    description: "Operations lead for enquiries, device requests and deployment workflows.",
    permissions: ["Review enquiries", "Update request workflows", "Manage impact stats"],
    accessAreas: ["Dashboard", "Enquiries", "Device Requests", "Impact"],
    riskLevel: "Medium"
  },
  {
    role: "deviceManager",
    description: "Inventory and fulfilment manager for refurbished devices and lab bundles.",
    permissions: ["Manage inventory", "Reserve devices", "Update fulfilment status"],
    accessAreas: ["Device Requests", "Inventory"],
    riskLevel: "Medium"
  },
  {
    role: "donationsManager",
    description: "Donation, sponsorship and corporate recycling operations manager.",
    permissions: ["Manage donation records", "Update sponsorship pipeline", "Track collection planning"],
    accessAreas: ["Donations", "Dashboard"],
    riskLevel: "Medium"
  },
  {
    role: "deploymentCoordinator",
    description: "Coordinates country deployments, school lab handover and field readiness.",
    permissions: ["Manage deployment workflows", "Assign country coverage", "Review logistics readiness"],
    accessAreas: ["Deployments", "Device Requests", "Enquiries"],
    riskLevel: "Medium"
  },
  {
    role: "countryManager",
    description: "Owns country-level partner follow-up, logistics and local support visibility.",
    permissions: ["Manage country assignments", "Review regional enquiries", "Export deployment reports"],
    accessAreas: ["Deployments", "Enquiries", "Activity Logs"],
    riskLevel: "Medium"
  },
  {
    role: "inventoryManager",
    description: "Maintains stock quality, asset tagging, lifecycle and bundle readiness.",
    permissions: ["Manage inventory", "Build bundles", "Update lifecycle records"],
    accessAreas: ["Inventory", "Device Requests"],
    riskLevel: "Medium"
  },
  {
    role: "analyticsManager",
    description: "Maintains impact reporting, dashboards and accountability exports.",
    permissions: ["Manage impact", "Export reports", "Review audit trends"],
    accessAreas: ["Impact", "Dashboard", "Activity Logs"],
    riskLevel: "Medium"
  },
  {
    role: "supportAgent",
    description: "Support role for assigned enquiries and operational follow-up.",
    permissions: ["View records", "Update assigned support items", "Add notes"],
    accessAreas: ["Enquiries", "Device Requests", "Audit visibility"],
    riskLevel: "Low"
  }
];

const firestoreCollections: FirestoreCollectionStatus[] = [
  { name: "enquiries", purpose: "Contact, partnership, school, SME/NGO and Africa deployment enquiries.", access: "Public write, admin read/write", apiModule: "EnquiriesModule", documentCount: "Live count pending", lastUpdated: "API driven", status: "Unknown" },
  { name: "deviceRequests", purpose: "Structured laptop, desktop, mini PC, accessory and lab bundle requests.", access: "Public write, admin read/write", apiModule: "DeviceRequestsModule", documentCount: "Live count pending", lastUpdated: "API driven", status: "Unknown" },
  { name: "donations", purpose: "Device donations, sponsorships and corporate recycling offers.", access: "Public write, admin read/write", apiModule: "DonationsModule", documentCount: "Live count pending", lastUpdated: "API driven", status: "Unknown" },
  { name: "inventory", purpose: "Refurbished device asset register and lifecycle data.", access: "Admin only", apiModule: "InventoryModule", documentCount: "Live count pending", lastUpdated: "API driven", status: "Unknown" },
  { name: "impactStats", purpose: "Public impact metrics, regions, stories and snapshots.", access: "Public read, admin write", apiModule: "ImpactModule", documentCount: "1 expected", lastUpdated: "impactStats/current", status: "Unknown" },
  { name: "users", purpose: "Admin user profile and role metadata mirror.", access: "Admin only", apiModule: "AdminUsersModule", documentCount: "Live count pending", lastUpdated: "Claim updates", status: "Unknown" },
  { name: "teams", purpose: "Operational team metadata, coverage and workload planning.", access: "Admin only", apiModule: "Workforce planning", documentCount: "Future live count", lastUpdated: "Admin setup", status: "Unknown" },
  { name: "roles", purpose: "Role definitions and Firebase custom claim mapping.", access: "Admin only", apiModule: "AdminUsersModule", documentCount: "Future live count", lastUpdated: "Settings", status: "Unknown" },
  { name: "permissions", purpose: "Permission scopes and page/module access mapping.", access: "Admin only", apiModule: "AdminUsersModule", documentCount: "Future live count", lastUpdated: "Settings", status: "Unknown" },
  { name: "notifications", purpose: "Admin alerts for new work, low stock, deployment and system health.", access: "Admin only", apiModule: "Notifications future module", documentCount: "Future live count", lastUpdated: "Event driven", status: "Unknown" },
  { name: "auditLogs", purpose: "Audit-ready admin actions and resource changes.", access: "Admin read, API write", apiModule: "AuditModule", documentCount: "Live count pending", lastUpdated: "Admin actions", status: "Unknown" }
];

const integrations: IntegrationStatus[] = [
  { name: "Firebase Auth", status: "Healthy", icon: "shield", description: "Primary sign-in and custom-claim authorization layer.", setupAction: "Enable Email/password and Google providers." },
  { name: "Firestore", status: "Warning", icon: "database", description: "Operational database for enquiries, inventory, impact and audit logs.", setupAction: "Enable Cloud Firestore and create default database." },
  { name: "Firebase Storage", status: "Unknown", icon: "cloud", description: "Future storage target for evidence files, images and documents.", setupAction: "Enable Storage rules before uploading files." },
  { name: "Google sign-in", status: "Healthy", icon: "users", description: "Implemented provider for admin login.", setupAction: "Enable Google in Firebase Auth providers." },
  { name: "Microsoft sign-in", status: "Warning", icon: "business", description: "Provider-ready admin login button.", setupAction: "Enable Microsoft provider in Firebase." },
  { name: "GitHub sign-in", status: "Warning", icon: "network", description: "Provider-ready admin login button.", setupAction: "Enable GitHub provider in Firebase." },
  { name: "Email notifications", status: "Missing", icon: "mail", description: "Future notification workflow for public forms and admin actions.", setupAction: "Add an email provider or Cloud Functions workflow." },
  { name: "CSV export", status: "Healthy", icon: "list", description: "Client-side exports exist across admin workspaces.", setupAction: "Replace with signed export endpoint for large datasets." },
  { name: "Google Sheets export", status: "Missing", icon: "grid", description: "Future reporting connector for operations teams.", setupAction: "Connect Google Sheets API later." },
  { name: "Cloud Run", status: "Warning", icon: "truck", description: "Target deployment option for NestJS API.", setupAction: "Configure service env and secrets." },
  { name: "Vercel", status: "Warning", icon: "cloud", description: "Target deployment option for Next.js frontend.", setupAction: "Configure project env variables." }
];

function maskValue(value?: string) {
  if (!value) return "Missing";
  if (value.length <= 8) return "Configured";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function statusTone(status: SettingsStatus) {
  if (status === "Healthy") return "bg-green-50 text-green-700 ring-green-200";
  if (status === "Warning") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "Missing") return "bg-zinc-100 text-zinc-700 ring-zinc-200";
  if (status === "Error") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-blue-50 text-blue-700 ring-blue-200";
}

function StatusPill({ status }: { status: SettingsStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusTone(status))}>
      {status}
    </span>
  );
}

function formatDate(value?: string) {
  if (!value) return "Not checked";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not checked";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function SettingsHeader({
  activeRole,
  apiHealth,
  onRunDiagnostics,
  onExport,
  checking
}: {
  activeRole: string;
  apiHealth: ApiHealthStatus;
  onRunDiagnostics: () => void;
  onExport: () => void;
  checking: boolean;
}) {
  const firebaseStatus: SettingsStatus = firebaseConfigStatus.configured ? "Healthy" : "Missing";
  const apiStatus = apiHealth.healthStatus;
  const firestoreStatus = apiHealth.impactStatus === "Healthy" ? "Healthy" : apiHealth.impactStatus === "Warning" ? "Warning" : "Unknown";
  const environment = process.env.NODE_ENV === "production" ? "Production" : "Local";

  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-card lg:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Platform configuration</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Admin Settings</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Manage Firebase, API, security, roles, collections and deployment configuration for SIT Digital Access.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusChip label="Firebase" value={firebaseStatus === "Healthy" ? "configured" : "missing"} status={firebaseStatus} />
            <StatusChip label="API" value={apiStatus === "Healthy" ? "connected" : "offline"} status={apiStatus} />
            <StatusChip label="Firestore" value={firestoreStatus === "Healthy" ? "enabled" : "unavailable"} status={firestoreStatus} />
            <StatusChip label="Admin role" value={activeRole} status="Healthy" />
            <StatusChip label="Environment" value={environment} status={environment === "Production" ? "Healthy" : "Warning"} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRunDiagnostics}
            disabled={checking}
            className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-orange transition hover:bg-flame-600 disabled:opacity-60"
          >
            <Icon name="settings" className="h-4 w-4" />
            {checking ? "Checking..." : "Run diagnostics"}
          </button>
          <button type="button" onClick={onRunDiagnostics} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700">
            <Icon name="sparkles" className="h-4 w-4" />
            Refresh config
          </button>
          <button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700">
            <Icon name="cloud" className="h-4 w-4" />
            Export settings report
          </button>
          <a href="/README.md" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700">
            <Icon name="book" className="h-4 w-4" />
            Open setup guide
          </a>
        </div>
      </div>
    </section>
  );
}

function StatusChip({ label, value, status }: { label: string; value: string; status: SettingsStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1", statusTone(status))}>
      {label}: {value}
    </span>
  );
}

function SettingsNavigation({ active, onChange }: { active: SettingsTab; onChange: (tab: SettingsTab) => void }) {
  return (
    <nav className="rounded-[1.5rem] border border-line bg-white p-2 shadow-sm lg:sticky lg:top-24">
      <div className="flex gap-2 overflow-x-auto lg:grid">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
              active === tab.id ? "bg-ink text-white" : "text-muted hover:bg-zinc-50 hover:text-ink"
            )}
          >
            <Icon name={tab.icon} className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ConfigurationHealthDashboard({ items }: { items: ConfigHealthItem[] }) {
  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Configuration health</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">Operational readiness dashboard</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Review the configuration areas that need to be healthy for public forms, admin routes and deployment workflows.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-[1.5rem] border border-line bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 ring-1 ring-flame-100">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <StatusPill status={item.status} />
            </div>
            <h4 className="mt-5 font-semibold text-ink">{item.label}</h4>
            <p className="mt-2 text-sm leading-6 text-muted">{item.explanation}</p>
            <div className="mt-4 rounded-2xl bg-zinc-50 p-3 text-xs leading-5 text-muted">
              <strong className="text-ink">Fix:</strong> {item.fixAction}
            </div>
            <p className="mt-3 text-xs text-muted">{item.diagnostics}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FirebaseSettingsPanel({ configs }: { configs: FirebaseConfigStatus[] }) {
  return (
    <section className="space-y-6">
      <PanelIntro
        eyebrow="Firebase client"
        title="Firebase settings"
        text="Client configuration is checked by presence only. Values are masked and Firebase Admin credentials are never exposed to the browser."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {configs.map((config) => (
          <div key={config.key} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{config.key}</p>
                <p className="mt-1 text-sm text-muted">{config.description}</p>
              </div>
              <StatusPill status={config.configured ? "Healthy" : "Missing"} />
            </div>
            <code className="mt-4 block rounded-2xl bg-zinc-950 px-4 py-3 text-xs font-semibold text-zinc-100">{config.maskedValue}</code>
          </div>
        ))}
      </div>
      <SetupGuide
        title="Firebase setup guide"
        steps={[
          "Create Firebase project: SIT Digital Access.",
          "Add a web app and copy the web config.",
          "Enable Firebase Authentication.",
          "Enable Cloud Firestore.",
          "Add NEXT_PUBLIC_FIREBASE_* variables to .env.local.",
          "Restart the Next.js app."
        ]}
      />
    </section>
  );
}

function ApiSettingsPanel({ apiHealth, onRunDiagnostics }: { apiHealth: ApiHealthStatus; onRunDiagnostics: () => void }) {
  const backendKeys = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY", "ADMIN_WEB_ORIGINS", "PORT"];
  return (
    <section className="space-y-6">
      <PanelIntro
        eyebrow="API configuration"
        title="Frontend and backend API settings"
        text="Frontend settings can be read safely. Backend settings are shown as configured or missing only."
      />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
          <h4 className="font-semibold text-ink">Frontend API</h4>
          <p className="mt-2 text-sm text-muted">NEXT_PUBLIC_API_BASE_URL</p>
          <code className="mt-4 block rounded-2xl bg-zinc-950 px-4 py-3 text-xs font-semibold text-zinc-100">{API_BASE_URL}</code>
        </div>
        <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-ink">Backend environment</h4>
            <button type="button" onClick={onRunDiagnostics} className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white">Run health check</button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {backendKeys.map((key) => {
              const configured = apiHealth.backendConfig?.[key];
              return (
                <div key={key} className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-xs font-semibold text-muted">{key}</p>
                  <p className={cn("mt-1 text-sm font-semibold", configured ? "text-green-700" : "text-amber-700")}>
                    {configured === undefined ? "Unknown" : configured ? "Configured" : "Missing"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <HealthCheckCard label="GET /api/v1/health" status={apiHealth.healthStatus} detail={apiHealth.errorMessage ?? "Checks the API process and backend env presence."} />
        <HealthCheckCard label="GET /api/v1/impact" status={apiHealth.impactStatus} detail="Public impact endpoint should return defaults even when Firestore is degraded." />
        <HealthCheckCard label="GET /api/v1/admin/enquiries" status={apiHealth.adminStatus} detail="Requires Firebase admin bearer token." />
      </div>
      <p className="text-sm text-muted">Last checked: {formatDate(apiHealth.lastChecked)} {apiHealth.latencyMs ? `- ${apiHealth.latencyMs}ms` : ""}</p>
    </section>
  );
}

function AdminRolesPanel() {
  return (
    <section className="space-y-6">
      <PanelIntro
        eyebrow="Custom claims"
        title="Admin roles and permission matrix"
        text="Admin access is authorised by Firebase custom claims. Keep superAdmin tightly controlled."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {roleDefinitions.map((role) => (
          <div key={role.role} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-ink">{role.role}</h4>
                <p className="mt-2 text-sm leading-6 text-muted">{role.description}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", role.riskLevel === "Critical" ? "bg-red-50 text-red-700 ring-red-200" : role.riskLevel === "High" ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-zinc-100 text-zinc-700 ring-zinc-200")}>{role.riskLevel}</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <MiniList title="Permissions" items={role.permissions} />
              <MiniList title="Access areas" items={role.accessAreas} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-[1.5rem] border border-line bg-zinc-950 p-5 text-white shadow-sm">
        <h4 className="font-semibold">How to assign claims</h4>
        <p className="mt-2 text-sm text-white/65">Run from the API package after the Firebase user exists.</p>
        <code className="mt-4 block overflow-x-auto rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">npm run set-admin -- --email admin@example.com --role superAdmin</code>
      </div>
    </section>
  );
}

function FirestoreCollectionsPanel({ onInitialiseImpact }: { onInitialiseImpact: () => void }) {
  return (
    <section className="space-y-6">
      <PanelIntro
        eyebrow="Firestore"
        title="Firestore collections"
        text="Collections are created by API writes. Firestore must be enabled before admin data can persist."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {firestoreCollections.map((collection) => (
          <div key={collection.name} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-ink">{collection.name}</h4>
                <p className="mt-2 text-sm leading-6 text-muted">{collection.purpose}</p>
              </div>
              <StatusPill status={collection.status} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoTile label="Access" value={collection.access} />
              <InfoTile label="API module" value={collection.apiModule} />
              <InfoTile label="Document count" value={collection.documentCount} />
              <InfoTile label="Last updated" value={collection.lastUpdated} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-[1.5rem] border border-flame-200 bg-flame-50 p-5">
        <h4 className="font-semibold text-ink">Operational actions</h4>
        <p className="mt-2 text-sm leading-6 text-flame-900/70">Initialise public impact stats once Firestore is enabled, then use admin workspaces to create live records.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={onInitialiseImpact} className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white">Initialise impactStats/current</button>
          <button type="button" className="rounded-full border border-flame-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink">Create sample records</button>
          <button type="button" className="rounded-full border border-flame-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink">Firestore rules guidance</button>
        </div>
      </div>
    </section>
  );
}

function SecurityChecklistPanel({ items }: { items: SecurityChecklistItem[] }) {
  return (
    <section className="space-y-6">
      <PanelIntro
        eyebrow="Security"
        title="Security checklist"
        text="These checks keep Firebase credentials private, admin APIs protected and public form traffic controlled."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex gap-4 rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1", item.status === "Healthy" ? "bg-green-50 text-green-700 ring-green-200" : "bg-amber-50 text-amber-700 ring-amber-200")}>
              <Icon name={item.status === "Healthy" ? "check" : "shield"} className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-ink">{item.label}</h4>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeploymentSettingsPanel() {
  const checklist: DeploymentChecklistItem[] = [
    { label: "Configure frontend env", complete: firebaseConfigStatus.configured, description: "Set NEXT_PUBLIC Firebase and API variables in Vercel or Cloud Run." },
    { label: "Configure backend env", complete: false, description: "Set Firebase Admin credentials and ADMIN_WEB_ORIGINS as secrets." },
    { label: "Enable Firebase Auth", complete: true, description: "Email/password and Google providers should be active." },
    { label: "Enable Firestore", complete: false, description: "Cloud Firestore is currently the main blocker for persistence." },
    { label: "Set first superAdmin claim", complete: true, description: "Use the API seed script after creating the first user." },
    { label: "Test public forms", complete: false, description: "Submit contact, donation and device request forms against production API." },
    { label: "Test admin API", complete: false, description: "Verify admin endpoints reject unauthenticated requests and accept valid claims." },
    { label: "Test impact stats", complete: false, description: "Initialise and update impactStats/current." },
    { label: "Test audit logs", complete: false, description: "Confirm admin updates write audit events." }
  ];

  return (
    <section className="space-y-6">
      <PanelIntro eyebrow="Deployment" title="Deployment targets" text="Frontend and backend can deploy separately while sharing Firebase Auth and Firestore." />
      <div className="grid gap-4 md:grid-cols-2">
        <DeploymentCard title="Next.js frontend" icon="cloud" description="Deploy to Vercel or Cloud Run with NEXT_PUBLIC_* Firebase and API variables." />
        <DeploymentCard title="NestJS API" icon="database" description="Deploy to Cloud Run with Firebase Admin credentials stored as environment variables or secrets." />
      </div>
      <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
        <h4 className="font-semibold text-ink">Deployment checklist</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {checklist.map((item) => (
            <div key={item.label} className="rounded-2xl bg-zinc-50 p-4">
              <div className="flex items-center gap-3">
                <Icon name={item.complete ? "check" : "badge"} className={cn("h-5 w-5", item.complete ? "text-green-700" : "text-amber-700")} />
                <p className="font-semibold text-ink">{item.label}</p>
              </div>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationsPanel() {
  return (
    <section className="space-y-6">
      <PanelIntro eyebrow="Integrations" title="Integration readiness" text="Track live integrations and future connectors for admin operations and reporting." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 ring-1 ring-flame-100">
                <Icon name={integration.icon} className="h-5 w-5" />
              </span>
              <StatusPill status={integration.status} />
            </div>
            <h4 className="mt-5 font-semibold text-ink">{integration.name}</h4>
            <p className="mt-2 text-sm leading-6 text-muted">{integration.description}</p>
            <p className="mt-4 rounded-2xl bg-zinc-50 p-3 text-xs leading-5 text-muted">{integration.setupAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuditLogsPanel({ logs, loading }: { logs: AuditLogSummary[]; loading: boolean }) {
  return (
    <section className="space-y-6">
      <PanelIntro eyebrow="Audit" title="Recent admin activity" text="Audit logs are written by admin create, update and role-management actions." />
      <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted">Loading audit logs...</p>
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center">
            <Icon name="list" className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-4 font-semibold text-ink">Admin audit logs will appear here when admin actions are recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {logs.map((log) => (
              <div key={log.id} className="grid gap-3 py-4 md:grid-cols-[1fr_0.8fr_0.8fr_auto]">
                <p className="font-semibold text-ink">{log.actorEmail ?? "Unknown actor"}</p>
                <p className="text-sm text-muted">{log.action.replaceAll("_", " ")}</p>
                <p className="text-sm text-muted">{log.resourceType}{log.resourceId ? `/${log.resourceId}` : ""}</p>
                <p className="text-sm text-muted">{formatDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DangerZonePanel() {
  const [confirming, setConfirming] = useState<string | null>(null);
  const actions = [
    "Clear sample data",
    "Reinitialise impact stats",
    "Disable public form submissions",
    "Rotate API configuration checklist"
  ];

  return (
    <section className="space-y-6">
      <PanelIntro eyebrow="Danger Zone" title="Protected operational actions" text="These destructive actions are intentionally locked until safeguarded backend workflows are available." />
      <div className="rounded-[1.5rem] border border-red-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3">
          {actions.map((action) => (
            <div key={action} className="flex flex-col gap-3 rounded-2xl bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-800">{action}</p>
                <p className="mt-1 text-sm text-red-700/70">Requires confirmation and a production-safe backend implementation.</p>
              </div>
              <button type="button" onClick={() => setConfirming(action)} className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700">
                Prepare action
              </button>
            </div>
          ))}
        </div>
      </div>
      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold">Confirmation required</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              `{confirming}` is locked. A protected backend endpoint with audit logging and explicit confirmation is required before this action can run.
            </p>
            <button type="button" onClick={() => setConfirming(null)} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function SettingsDiagnosticsPanel({ diagnostics }: { diagnostics: SettingsDiagnostic[] }) {
  return (
    <section className="rounded-[2rem] bg-ink p-6 text-white shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-300">Diagnostics</p>
      <h3 className="mt-2 text-2xl font-semibold">Current configuration snapshot</h3>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {diagnostics.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45">{item.label}</p>
            <p className="mt-2 break-words font-semibold text-white">{item.value}</p>
            <span className={cn("mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusTone(item.status))}>{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PanelIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

function SetupGuide({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <h4 className="font-semibold text-ink">{title}</h4>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3 rounded-2xl bg-zinc-50 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">{index + 1}</span>
            <p className="text-sm text-muted">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function HealthCheckCard({ label, status, detail }: { label: string; status: SettingsStatus; detail: string }) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-ink">{label}</h4>
        <StatusPill status={status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

function DeploymentCard({ title, icon, description }: { title: string; icon: IconKey; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 ring-1 ring-flame-100">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h4 className="mt-5 font-semibold text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function buildFirebaseConfigs(): FirebaseConfigStatus[] {
  return firebaseEnvKeys.map((key) => ({
    key,
    configured: !firebaseConfigStatus.missingKeys.includes(key),
    maskedValue: maskValue(firebaseValues[key]),
    description: key === "NEXT_PUBLIC_FIREBASE_API_KEY"
      ? "Firebase web API key for client SDK."
      : key === "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        ? "Firebase Auth domain used for sign-in redirects."
        : key === "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
          ? "Firebase project identifier."
          : key === "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
            ? "Firebase Storage bucket for future uploads."
            : key === "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
              ? "Firebase messaging sender identifier."
              : "Firebase web app identifier."
  }));
}

function buildHealthItems(apiHealth: ApiHealthStatus, roles: string[]): ConfigHealthItem[] {
  const firebaseConfigured = firebaseConfigStatus.configured;
  const backend = apiHealth.backendConfig ?? {};
  const adminSdkHealthy = Boolean(backend.FIREBASE_PROJECT_ID && backend.FIREBASE_CLIENT_EMAIL && backend.FIREBASE_PRIVATE_KEY);

  return [
    { id: "firebase-client", label: "Firebase client config", status: firebaseConfigured ? "Healthy" : "Missing", icon: "shield", explanation: "NEXT_PUBLIC Firebase variables required for client Auth.", fixAction: "Add missing NEXT_PUBLIC_FIREBASE_* variables.", diagnostics: `${firebaseConfigStatus.missingKeys.length} missing key(s).` },
    { id: "firebase-admin", label: "Firebase Admin SDK", status: adminSdkHealthy ? "Healthy" : "Warning", icon: "database", explanation: "Server-side Admin SDK verifies ID tokens and writes Firestore data.", fixAction: "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.", diagnostics: "Reported by /api/v1/health." },
    { id: "api-base", label: "API base URL", status: API_BASE_URL ? "Healthy" : "Missing", icon: "cloud", explanation: "Frontend calls the NestJS API through NEXT_PUBLIC_API_BASE_URL.", fixAction: "Set NEXT_PUBLIC_API_BASE_URL for deployed environments.", diagnostics: API_BASE_URL },
    { id: "firestore", label: "Firestore access", status: apiHealth.impactStatus === "Healthy" ? "Healthy" : "Warning", icon: "database", explanation: "Firestore stores enquiries, requests, donations, inventory, impact and audit logs.", fixAction: "Enable Cloud Firestore for the Firebase project.", diagnostics: apiHealth.errorMessage ?? "Impact endpoint checked." },
    { id: "auth-providers", label: "Auth providers", status: firebaseConfigured ? "Healthy" : "Warning", icon: "users", explanation: "Email/password and Google login are implemented. Microsoft and GitHub are provider-ready.", fixAction: "Enable providers in Firebase Console.", diagnostics: "Client SDK configured status used." },
    { id: "custom-claims", label: "Admin custom claims", status: roles.length ? "Healthy" : "Warning", icon: "badge", explanation: "Admin pages require a recognised Firebase custom claim.", fixAction: "Run the set-admin script for the first administrator.", diagnostics: roles.length ? roles.join(", ") : "No roles detected." },
    { id: "cors", label: "CORS origins", status: backend.ADMIN_WEB_ORIGINS ? "Healthy" : "Warning", icon: "network", explanation: "API should only allow trusted admin/frontend origins.", fixAction: "Set ADMIN_WEB_ORIGINS on the API service.", diagnostics: "Presence checked only." },
    { id: "public-forms", label: "Public forms", status: apiHealth.healthStatus === "Healthy" ? "Healthy" : "Warning", icon: "mail", explanation: "Public forms depend on the API being reachable.", fixAction: "Confirm API is running and CORS allows the frontend.", diagnostics: "Health endpoint status." },
    { id: "admin-routes", label: "Admin routes", status: apiHealth.adminStatus === "Healthy" || apiHealth.adminStatus === "Warning" ? "Healthy" : "Warning", icon: "settings", explanation: "Admin routes must reject unauthenticated users and accept valid admin tokens.", fixAction: "Refresh token or sign in again if admin checks fail.", diagnostics: `Admin check: ${apiHealth.adminStatus}.` },
    { id: "audit", label: "Audit logging", status: apiHealth.adminStatus === "Healthy" ? "Healthy" : "Unknown", icon: "list", explanation: "Admin mutations write auditLogs records.", fixAction: "Enable Firestore and perform an admin update.", diagnostics: "Audit panel loads from admin audit endpoint." }
  ];
}

function buildSecurityItems(apiHealth: ApiHealthStatus, roles: string[]): SecurityChecklistItem[] {
  return [
    { label: "Firebase Auth enabled", status: firebaseConfigStatus.configured ? "Healthy" : "Warning", description: "Client Firebase configuration is present for Auth SDK initialisation." },
    { label: "Google provider enabled", status: firebaseConfigStatus.configured ? "Healthy" : "Unknown", description: "Google sign-in is implemented and should be enabled in Firebase Console." },
    { label: "Email/password enabled", status: firebaseConfigStatus.configured ? "Healthy" : "Unknown", description: "Email/password login is implemented and should be enabled in Firebase Console." },
    { label: "Admin custom claims required", status: roles.length ? "Healthy" : "Warning", description: "Frontend guards and backend guards require admin custom claims." },
    { label: "Backend verifies ID tokens", status: "Healthy", description: "NestJS admin routes use FirebaseAuthGuard and AdminRoleGuard." },
    { label: "Admin routes protected", status: "Healthy", description: "Admin shell redirects unauthenticated users to /admin/login." },
    { label: "CORS allowlist configured", status: apiHealth.backendConfig?.ADMIN_WEB_ORIGINS ? "Healthy" : "Warning", description: "ADMIN_WEB_ORIGINS should be set for deployed API environments." },
    { label: "Firebase Admin secrets not exposed", status: "Healthy", description: "The settings page only shows server-side env presence, never secret values." },
    { label: "Audit logging enabled", status: "Healthy", description: "Admin create/update actions use auditLogs where implemented." },
    { label: "Public form rate limiting enabled", status: "Healthy", description: "NestJS uses the throttler guard for public and admin API traffic." },
    { label: "Running in local mode", status: process.env.NODE_ENV === "production" ? "Healthy" : "Warning", description: "Local mode is expected during development and should not be used as production posture." }
  ];
}

async function safeJson(response: Response) {
  return response.json().catch(() => null) as Promise<{ data?: unknown; message?: string } | null>;
}

function statusFromResponse(response?: Response, degradedIsWarning = false): SettingsStatus {
  if (!response) return "Error";
  if (response.ok) return degradedIsWarning ? "Warning" : "Healthy";
  if (response.status === 401 || response.status === 403) return "Warning";
  return "Error";
}

function exportSettingsReport(apiHealth: ApiHealthStatus, roles: string[]) {
  const lines = [
    "SIT Digital Access Settings Report",
    `Generated,${new Date().toISOString()}`,
    `API Base URL,${API_BASE_URL}`,
    `Firebase Configured,${firebaseConfigStatus.configured}`,
    `Missing Firebase Keys,${firebaseConfigStatus.missingKeys.join(" ") || "None"}`,
    `Admin Roles,${roles.join(" ") || "None"}`,
    `API Health,${apiHealth.healthStatus}`,
    `Impact Health,${apiHealth.impactStatus}`,
    `Admin Health,${apiHealth.adminStatus}`,
    `Last Checked,${apiHealth.lastChecked ?? "Never"}`
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sit-digital-access-settings-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminSettingsPage() {
  const { token, roles, claims } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("overview");
  const [checking, setChecking] = useState(false);
  const [apiHealth, setApiHealth] = useState<ApiHealthStatus>({
    apiBaseUrl: API_BASE_URL,
    healthStatus: "Unknown",
    impactStatus: "Unknown",
    adminStatus: "Unknown"
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogSummary[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const activeRole = roles[0] ?? (claims?.superAdmin ? "superAdmin" : "admin");
  const firebaseConfigs = useMemo(() => buildFirebaseConfigs(), []);
  const healthItems = useMemo(() => buildHealthItems(apiHealth, roles), [apiHealth, roles]);
  const securityItems = useMemo(() => buildSecurityItems(apiHealth, roles), [apiHealth, roles]);
  const diagnostics: SettingsDiagnostic[] = useMemo(() => [
    { label: "API base URL", value: API_BASE_URL, status: apiHealth.healthStatus },
    { label: "Firebase project", value: firebaseValues.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "Missing", status: firebaseConfigStatus.configured ? "Healthy" : "Missing" },
    { label: "Missing Firebase keys", value: firebaseConfigStatus.missingKeys.join(", ") || "None", status: firebaseConfigStatus.missingKeys.length ? "Warning" : "Healthy" },
    { label: "Health endpoint", value: apiHealth.responseStatus ? String(apiHealth.responseStatus) : "Not checked", status: apiHealth.healthStatus },
    { label: "Impact endpoint", value: apiHealth.impactStatus, status: apiHealth.impactStatus },
    { label: "Admin endpoint", value: apiHealth.adminStatus, status: apiHealth.adminStatus },
    { label: "Last checked", value: formatDate(apiHealth.lastChecked), status: apiHealth.lastChecked ? "Healthy" : "Unknown" },
    { label: "Current roles", value: roles.join(", ") || "None", status: roles.length ? "Healthy" : "Warning" }
  ], [apiHealth, roles]);

  async function runDiagnostics() {
    setChecking(true);
    setMessage(null);
    const started = performance.now();
    let nextHealth: ApiHealthStatus = {
      apiBaseUrl: API_BASE_URL,
      healthStatus: "Unknown",
      impactStatus: "Unknown",
      adminStatus: "Unknown",
      lastChecked: new Date().toISOString()
    };

    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      const healthPayload = await safeJson(healthResponse);
      const backendConfig = typeof healthPayload?.data === "object" && healthPayload.data !== null && "backendConfig" in healthPayload.data
        ? (healthPayload.data as { backendConfig?: Record<string, boolean> }).backendConfig
        : undefined;

      const impactResponse = await fetch(`${API_BASE_URL}/impact`);
      const impactPayload = await safeJson(impactResponse);
      const impactDegraded = JSON.stringify(impactPayload ?? {}).includes("degraded");

      let adminStatus: SettingsStatus = token ? "Unknown" : "Warning";
      if (token) {
        const adminResponse = await fetch(`${API_BASE_URL}/admin/enquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        adminStatus = statusFromResponse(adminResponse);
      }

      nextHealth = {
        ...nextHealth,
        healthStatus: statusFromResponse(healthResponse),
        impactStatus: statusFromResponse(impactResponse, impactDegraded),
        adminStatus,
        responseStatus: healthResponse.status,
        latencyMs: Math.round(performance.now() - started),
        backendConfig,
        errorMessage: impactDegraded ? "Firestore is unavailable or disabled; impact endpoint is returning safe defaults." : undefined
      };
    } catch (error) {
      nextHealth = {
        ...nextHealth,
        healthStatus: "Error",
        impactStatus: "Error",
        adminStatus: "Error",
        latencyMs: Math.round(performance.now() - started),
        errorMessage: error instanceof Error ? error.message : "Unable to run diagnostics."
      };
    }

    setApiHealth(nextHealth);
    await loadAuditLogs();
    setChecking(false);
  }

  async function loadAuditLogs() {
    if (!token) return;
    setAuditLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload = await safeJson(response);
      if (!response.ok || !Array.isArray(payload?.data)) {
        setAuditLogs([]);
      } else {
        setAuditLogs((payload.data as Array<Record<string, unknown>>).map((item) => ({
          id: String(item.id ?? ""),
          actorEmail: item.actorEmail ? String(item.actorEmail) : undefined,
          action: String(item.action ?? "UNKNOWN_ACTION"),
          resourceType: String(item.resourceType ?? "unknown"),
          resourceId: item.resourceId ? String(item.resourceId) : undefined,
          createdAt: item.createdAt ? String(item.createdAt) : undefined
        })));
      }
    } catch {
      setAuditLogs([]);
    } finally {
      setAuditLoading(false);
    }
  }

  async function initialiseImpact() {
    if (!token) {
      setMessage("Sign in with an admin token before initialising impactStats/current.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/impact/initialise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const payload = await safeJson(response);
      if (!response.ok) {
        setMessage(payload?.message ?? "Unable to initialise impactStats/current.");
      } else {
        setMessage("impactStats/current initialisation request completed.");
        await runDiagnostics();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to initialise impactStats/current.");
    }
  }

  const tabContent = {
    overview: (
      <>
        <ConfigurationHealthDashboard items={healthItems} />
        <SettingsDiagnosticsPanel diagnostics={diagnostics} />
      </>
    ),
    firebase: <FirebaseSettingsPanel configs={firebaseConfigs} />,
    api: <ApiSettingsPanel apiHealth={apiHealth} onRunDiagnostics={runDiagnostics} />,
    roles: <AdminRolesPanel />,
    firestore: <FirestoreCollectionsPanel onInitialiseImpact={initialiseImpact} />,
    security: <SecurityChecklistPanel items={securityItems} />,
    deployment: <DeploymentSettingsPanel />,
    integrations: <IntegrationsPanel />,
    audit: <AuditLogsPanel logs={auditLogs} loading={auditLoading} />,
    danger: <DangerZonePanel />
  } satisfies Record<SettingsTab, React.ReactNode>;

  return (
    <div className="space-y-6">
      <SettingsHeader
        activeRole={activeRole}
        apiHealth={apiHealth}
        onRunDiagnostics={runDiagnostics}
        onExport={() => exportSettingsReport(apiHealth, roles)}
        checking={checking}
      />

      {message ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <SettingsNavigation active={activeTab} onChange={setActiveTab} />
        <div className="min-w-0 space-y-6">{tabContent[activeTab]}</div>
      </div>
    </div>
  );
}
