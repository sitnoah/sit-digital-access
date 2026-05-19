"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, type IconKey } from "@/components/icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import type { ApiRecord, ImpactStats } from "@/lib/api";
import type {
  AdminMetric,
  DeploymentReadinessItem,
  InventoryStatusSummary,
  PipelineStage,
  PriorityAction,
  SystemHealthStatus
} from "@/types/admin";
import { cn } from "@/lib/utils";

const defaultImpact: ImpactStats = {
  devicesDeployed: 0,
  learnersReached: 0,
  schoolsSupported: 0,
  businessesSupported: 0,
  countriesServed: 0,
  co2SavedKg: 0,
  trainingHoursDelivered: 0,
  costSavingsGenerated: 0
};

const statusStages = ["NEW", "REVIEWING", "CONTACTED", "QUALIFIED", "CLOSED"];

function normaliseStatus(value: unknown) {
  return String(value ?? "").toUpperCase();
}

function getOrganisation(item: ApiRecord) {
  return String(item.organisation ?? item.email ?? item.country ?? "Not provided");
}

function formatDate(value: unknown) {
  if (!value) return "Not dated";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not dated";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 34 - (value / max) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 40" className={cn("h-12 w-28", className)} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="adminSpark" x1="0" x2="1" y1="0" y2="0">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="url(#adminSpark)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-line/70", className)} />;
}

function AdminEmptyState({
  icon,
  title,
  description,
  href,
  cta
}: {
  icon: IconKey;
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-flame-600 shadow-sm">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {href && cta ? (
        <Link href={href} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

function SystemHealthBanner({
  health,
  onRetry
}: {
  health: SystemHealthStatus;
  onRetry: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasIssues = health.failingEndpoints.length > 0;

  if (!hasIssues) {
    return (
      <section className="rounded-[1.5rem] border border-green-200 bg-green-50 p-4 text-green-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <Icon name="check" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">All admin systems are responding</p>
              <p className="mt-1 text-sm text-green-800/75">API, Firebase token and dashboard endpoints are available.</p>
            </div>
          </div>
          <button className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold" onClick={onRetry}>
            Refresh
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.5rem] border border-flame-200 bg-flame-50 p-5 text-flame-950">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-flame-600 shadow-sm">
            <Icon name="shield" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight">Some admin data could not be loaded</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-flame-900/75">
              The dashboard is showing empty-state values while the API connection is checked. This usually happens when Firestore is not enabled yet, the default database has not been created, or the API is temporarily unavailable.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={onRetry}>
                Retry
              </button>
              <button className="rounded-full border border-flame-200 bg-white px-4 py-2 text-sm font-semibold" onClick={() => setOpen((value) => !value)}>
                {open ? "Hide diagnostics" : "View diagnostics"}
              </button>
              <a className="rounded-full border border-flame-200 bg-white px-4 py-2 text-sm font-semibold" href={health.apiBaseUrl} target="_blank" rel="noreferrer">
                Open API health
              </a>
            </div>
          </div>
        </div>
        <div className="grid min-w-64 gap-2 rounded-2xl bg-white p-3 text-sm shadow-sm">
          <div className="flex justify-between gap-4"><span className="text-muted">API</span><strong className="capitalize">{health.api}</strong></div>
          <div className="flex justify-between gap-4"><span className="text-muted">Firestore</span><strong className="capitalize">{health.firestore}</strong></div>
          <div className="flex justify-between gap-4"><span className="text-muted">Token</span><strong>{health.authTokenPresent ? "Present" : "Missing"}</strong></div>
        </div>
      </div>

      {open ? (
        <div className="mt-5 rounded-2xl border border-flame-200 bg-white p-4">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div><span className="block text-muted">API base URL</span><strong className="break-all">{health.apiBaseUrl}</strong></div>
            <div><span className="block text-muted">Firebase project configured</span><strong>{health.firebaseProjectConfigured ? "Yes" : "No"}</strong></div>
            <div><span className="block text-muted">Auth token present</span><strong>{health.authTokenPresent ? "Yes" : "No"}</strong></div>
          </div>
          <div className="mt-4 divide-y divide-line">
            {health.failingEndpoints.map((error) => (
              <div key={error.key} className="grid gap-2 py-3 text-sm lg:grid-cols-[160px_100px_1fr_1fr]">
                <strong>{error.label}</strong>
                <span>{error.status ?? "Network"}</span>
                <span className="text-muted">{error.message}</span>
                <span className="text-flame-700">{error.suggestedFix}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function MetricCard({ metric, loading }: { metric: AdminMetric; loading: boolean }) {
  const accentClasses: Record<AdminMetric["accent"], string> = {
    orange: "bg-flame-500 text-white shadow-flame-500/20",
    black: "bg-ink text-white shadow-black/10",
    green: "bg-green-500 text-white shadow-green-500/15",
    blue: "bg-sky-500 text-white shadow-sky-500/15",
    purple: "bg-violet-500 text-white shadow-violet-500/15"
  };

  if (loading) {
    return (
      <article className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
        <AdminSkeleton className="h-11 w-11" />
        <AdminSkeleton className="mt-6 h-8 w-24" />
        <AdminSkeleton className="mt-3 h-4 w-32" />
      </article>
    );
  }

  return (
    <Link href={metric.href} className="group rounded-[1.5rem] border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg", accentClasses[metric.accent])}>
          <Icon name={metric.icon} className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{metric.status}</span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold tracking-tight">{metric.value}</p>
          <p className="mt-2 text-sm font-medium text-muted">{metric.label}</p>
        </div>
        <Sparkline values={metric.series} className="opacity-80 transition group-hover:opacity-100" />
      </div>
      <p className="mt-4 text-xs font-semibold text-flame-600">{metric.trend}</p>
    </Link>
  );
}

function AdminCommandHero({
  health,
  lastSyncedAt,
  role,
  onRetry,
  onExport
}: {
  health: SystemHealthStatus;
  lastSyncedAt: Date | null;
  role: string;
  onRetry: () => void;
  onExport: () => void;
}) {
  const chips = [
    { label: `Firestore ${health.firestore}`, tone: health.firestore === "connected" ? "green" : "orange" },
    { label: `API ${health.api}`, tone: health.api === "online" ? "green" : "orange" },
    { label: `Admin role: ${role}`, tone: "dark" },
    { label: lastSyncedAt ? `Synced ${formatDate(lastSyncedAt.toISOString())}` : "Waiting for sync", tone: "light" }
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] bg-orange-mesh p-6 text-white shadow-2xl shadow-black/10 lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[1fr_360px] xl:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-100">Command centre</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Operational Command Centre
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            Live visibility across enquiries, device requests, donations, inventory, impact and deployment operations.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1",
                  chip.tone === "green" && "bg-green-400/15 text-green-100 ring-green-300/20",
                  chip.tone === "orange" && "bg-flame-500/15 text-flame-100 ring-flame-300/20",
                  chip.tone === "dark" && "bg-white/10 text-white ring-white/15",
                  chip.tone === "light" && "bg-white text-ink ring-white"
                )}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
          <Link href="/admin/enquiries" className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-flame-50">New enquiry</Link>
          <Link href="/admin/inventory" className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Add inventory device</Link>
          <button className="rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10" onClick={onExport}>Export CSV</button>
          <button className="rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10" onClick={onRetry}>Refresh dashboard</button>
        </div>
      </div>
    </section>
  );
}

function PriorityWorkQueue({ actions, loading }: { actions: PriorityAction[]; loading: boolean }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Priority work queue</h3>
          <p className="mt-1 text-sm text-muted">Urgent records that need operational follow-up.</p>
        </div>
        <Link href="/admin/enquiries" className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-flame-300">View records</Link>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="grid gap-3">
            <AdminSkeleton className="h-16" />
            <AdminSkeleton className="h-16" />
            <AdminSkeleton className="h-16" />
          </div>
        ) : actions.length === 0 ? (
          <AdminEmptyState icon="check" title="No urgent work right now" description="New high-priority enquiries, pending device requests and donation offers will appear here." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="hidden grid-cols-[120px_1fr_110px_120px_130px_120px] gap-4 bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted lg:grid">
              <span>Type</span><span>Organisation</span><span>Priority</span><span>Status</span><span>Created</span><span>Owner</span>
            </div>
            <div className="divide-y divide-line">
              {actions.map((action) => (
                <Link key={action.id} href={action.href} className="grid gap-3 px-4 py-4 transition hover:bg-flame-50/60 lg:grid-cols-[120px_1fr_110px_120px_130px_120px] lg:items-center">
                  <span className="text-sm font-semibold">{action.type}</span>
                  <span className="text-sm text-muted">{action.organisation}</span>
                  <StatusBadge value={action.priority} />
                  <StatusBadge value={action.status} />
                  <span className="text-sm text-muted">{formatDate(action.createdAt)}</span>
                  <span className="text-sm font-medium">{action.assignedOwner}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PipelineOverview({ stages, loading }: { stages: PipelineStage[]; loading: boolean }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold tracking-tight">Pipeline overview</h3>
      <p className="mt-1 text-sm text-muted">Progress across enquiries, requests and donations.</p>
      <div className="mt-5 grid gap-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => <AdminSkeleton key={index} className="h-40" />)
          : stages.map((stage) => (
              <article key={stage.label} className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-sm font-semibold">{stage.label}</p>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted">Enquiries</span><strong>{stage.enquiries}</strong></div>
                  <div className="flex justify-between"><span className="text-muted">Device requests</span><strong>{stage.deviceRequests}</strong></div>
                  <div className="flex justify-between"><span className="text-muted">Donations</span><strong>{stage.donations}</strong></div>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}

function InventoryHealthPanel({ summaries, loading }: { summaries: InventoryStatusSummary[]; loading: boolean }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold tracking-tight">Inventory health</h3>
      <p className="mt-1 text-sm text-muted">Current stock posture and lifecycle signals.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => <AdminSkeleton key={index} className="h-24" />)
          : summaries.map((summary) => (
              <article key={summary.status} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-flame-600 shadow-sm">
                    <Icon name={summary.icon} className="h-5 w-5" />
                  </span>
                  <strong className="text-2xl">{summary.count}</strong>
                </div>
                <p className="mt-3 text-sm font-semibold">{summary.status}</p>
              </article>
            ))}
      </div>
    </section>
  );
}

function ImpactSnapshot({ impact, loading }: { impact: ImpactStats | null; loading: boolean }) {
  const stats = impact ?? defaultImpact;
  const cards = [
    ["Devices deployed", stats.devicesDeployed, "package" as IconKey],
    ["Learners reached", stats.learnersReached, "graduation" as IconKey],
    ["Schools supported", stats.schoolsSupported, "school" as IconKey],
    ["CO2 saved kg", stats.co2SavedKg, "leaf" as IconKey],
    ["Training hours", stats.trainingHoursDelivered, "book" as IconKey],
    ["Countries served", stats.countriesServed, "globe" as IconKey]
  ];

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold tracking-tight">Impact snapshot</h3>
      <p className="mt-1 text-sm text-muted">Progress signals for executive reporting.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <AdminSkeleton key={index} className="h-24" />)
          : cards.map(([label, value, icon]) => (
              <article key={String(label)} className="rounded-2xl border border-line bg-paper p-4">
                <Icon name={icon as IconKey} className="h-4 w-4 text-flame-600" />
                <p className="mt-4 text-2xl font-semibold">{Number(value).toLocaleString()}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </article>
            ))}
      </div>
    </section>
  );
}

function RecentActivityTimeline({ auditLogs, loading }: { auditLogs: ApiRecord[]; loading: boolean }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold tracking-tight">Recent activity</h3>
      <p className="mt-1 text-sm text-muted">Audit-ready administrative actions.</p>
      <div className="mt-5">
        {loading ? (
          <div className="grid gap-3"><AdminSkeleton className="h-16" /><AdminSkeleton className="h-16" /><AdminSkeleton className="h-16" /></div>
        ) : auditLogs.length === 0 ? (
          <AdminEmptyState icon="badge" title="No audit activity yet" description="Admin changes will be written to the audit trail once Firestore is available." />
        ) : (
          <div className="space-y-4">
            {auditLogs.slice(0, 6).map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-flame-500 shadow-[0_0_0_4px_rgba(249,115,22,0.12)]" />
                <div>
                  <p className="text-sm font-semibold">{String(item.action ?? "Admin action")}</p>
                  <p className="mt-1 text-sm text-muted">{String(item.resourceType ?? "Resource")} · {String(item.actorEmail ?? "System")} · {formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WorkforceStatusPanel() {
  const items: Array<{ label: string; value: string; description: string; href: string; icon: IconKey }> = [
    { label: "Users & employees", value: "Role-ready", description: "Manage admins, staff, country coordinators and support agents.", href: "/admin/users", icon: "users" },
    { label: "Deployment teams", value: "5 regions", description: "Track workforce coverage for UK and Africa deployment work.", href: "/admin/deployments", icon: "globe" },
    { label: "Pending approvals", value: "Claims", description: "Review custom-claim roles and permission scope.", href: "/admin/roles", icon: "shield" },
    { label: "Activity feed", value: "Audit logs", description: "Monitor role changes, settings updates and operational actions.", href: "/admin/activity-logs", icon: "list" }
  ];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Workforce command layer</p>
          <h3 className="mt-2 text-xl font-semibold">Team readiness and access control</h3>
          <p className="mt-1 text-sm text-muted">New workforce modules connect people, roles, teams and deployment assignments into the admin platform.</p>
        </div>
        <Link href="/admin/users" className="inline-flex min-h-10 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600">
          Manage users
        </Link>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Link key={item.label} href={item.href} className="rounded-3xl border border-line bg-paper p-4 transition hover:-translate-y-1 hover:border-flame-200 hover:bg-white hover:shadow-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-lg font-semibold">{item.value}</p>
            <p className="mt-2 text-xs leading-5 text-muted">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DeploymentReadinessPanel({ items, loading }: { items: DeploymentReadinessItem[]; loading: boolean }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold tracking-tight">Deployment readiness</h3>
      <p className="mt-1 text-sm text-muted">Africa deployment, lab and logistics demand signals.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <AdminSkeleton key={index} className="h-28" />)
          : items.map((item) => (
              <article key={item.label} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-flame-600 shadow-sm">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <strong className="text-2xl">{item.value}</strong>
                </div>
                <p className="mt-3 text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
              </article>
            ))}
      </div>
    </section>
  );
}

function AdminChartCard({
  title,
  description,
  values,
  loading
}: {
  title: string;
  description: string;
  values: number[];
  loading: boolean;
}) {
  const hasData = values.some((value) => value > 0);

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{hasData ? "Live" : "Waiting"}</span>
      </div>
      {loading ? (
        <AdminSkeleton className="mt-6 h-56" />
      ) : hasData ? (
        <div className="mt-6 rounded-2xl bg-paper p-4">
          <Sparkline values={values} className="h-48 w-full" />
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper p-8 text-center">
          <p className="text-sm font-semibold">Waiting for live data</p>
          <p className="mt-2 text-sm text-muted">Charts will populate as records are created in Firestore.</p>
        </div>
      )}
    </section>
  );
}

function buildMetrics(data: ReturnType<typeof useAdminDashboard>["data"], highPriorityCount: number): AdminMetric[] {
  const impact = data.impact ?? defaultImpact;

  return [
    { id: "enquiries", label: "New enquiries", value: data.enquiries.filter((item) => item.status === "NEW").length, icon: "mail", href: "/admin/enquiries", accent: "orange", trend: "Review queue", status: "Live", series: [1, 2, 2, 3, 5, data.enquiries.length] },
    { id: "requests", label: "Pending device requests", value: data.deviceRequests.filter((item) => ["NEW", "REVIEWING"].includes(normaliseStatus(item.status))).length, icon: "laptop", href: "/admin/device-requests", accent: "black", trend: "Fulfilment pipeline", status: "Ops", series: [1, 1, 2, 3, 3, data.deviceRequests.length] },
    { id: "donations", label: "Donation offers", value: data.donations.filter((item) => normaliseStatus(item.status) !== "CLOSED").length, icon: "heart", href: "/admin/donations", accent: "purple", trend: "CSR and recycling", status: "Partner", series: [1, 2, 1, 4, 3, data.donations.length] },
    { id: "inventory", label: "Available devices", value: data.inventory.filter((item) => item.status === "AVAILABLE").length, icon: "database", href: "/admin/inventory", accent: "blue", trend: "Stock ready", status: "Stock", series: [0, 1, 3, 5, 8, data.inventory.length] },
    { id: "repairs", label: "Active repairs", value: data.repairs.filter((item) => !["COMPLETED", "UNREPAIRABLE"].includes(normaliseStatus(item.status))).length, icon: "wrench", href: "/admin/repairs", accent: "blue", trend: "Lifecycle repair", status: "Ops", series: [0, 1, 2, 3, 5, data.repairs.length] },
    { id: "deployed", label: "Devices deployed", value: impact.devicesDeployed, icon: "package", href: "/admin/impact", accent: "green", trend: "Impact reporting", status: "Impact", series: [0, 2, 4, 8, 12, impact.devicesDeployed] },
    { id: "learners", label: "Learners reached", value: impact.learnersReached, icon: "graduation", href: "/admin/impact", accent: "orange", trend: "Learning access", status: "Impact", series: [0, 3, 6, 9, 15, impact.learnersReached] },
    { id: "countries", label: "Countries served", value: impact.countriesServed, icon: "globe", href: "/admin/impact", accent: "black", trend: "Deployment footprint", status: "Africa", series: [0, 1, 1, 2, 3, impact.countriesServed] },
    { id: "priority", label: "High priority actions", value: highPriorityCount, icon: "badge", href: "/admin/enquiries", accent: "purple", trend: "Needs attention", status: "Urgent", series: [0, 1, 1, 2, 2, highPriorityCount] }
  ];
}

export function AdminDashboard() {
  const { roles } = useAdminAuth();
  const { data, loading, health, errors, lastSyncedAt, retry } = useAdminDashboard();
  const primaryRole = roles[0] ?? "admin";

  const priorityActions = useMemo<PriorityAction[]>(() => {
    const enquiryActions = data.enquiries
      .filter((item) => item.priority === "HIGH" || ["NEW", "REVIEWING"].includes(normaliseStatus(item.status)))
      .map((item) => ({
        id: item.id,
        type: "Enquiry",
        organisation: getOrganisation(item),
        priority: String(item.priority ?? "MEDIUM"),
        status: String(item.status ?? "NEW"),
        createdAt: item.createdAt ?? undefined,
        assignedOwner: "Support",
        href: "/admin/enquiries"
      }));
    const requestActions = data.deviceRequests
      .filter((item) => ["NEW", "REVIEWING"].includes(normaliseStatus(item.status)))
      .map((item) => ({
        id: item.id,
        type: "Device request",
        organisation: getOrganisation(item),
        priority: "MEDIUM",
        status: String(item.status ?? "NEW"),
        createdAt: item.createdAt ?? undefined,
        assignedOwner: "Devices",
        href: "/admin/device-requests"
      }));
    const donationActions = data.donations
      .filter((item) => ["NEW", "REVIEWING"].includes(normaliseStatus(item.status)))
      .map((item) => ({
        id: item.id,
        type: "Donation",
        organisation: getOrganisation(item),
        priority: "MEDIUM",
        status: String(item.status ?? "NEW"),
        createdAt: item.createdAt ?? undefined,
        assignedOwner: "Partnerships",
        href: "/admin/donations"
      }));

    return [...enquiryActions, ...requestActions, ...donationActions].slice(0, 8);
  }, [data]);

  const metrics = useMemo(() => buildMetrics(data, priorityActions.length), [data, priorityActions.length]);

  const pipelineStages = useMemo<PipelineStage[]>(
    () =>
      statusStages.map((stage) => ({
        label: stage.replaceAll("_", " "),
        enquiries: data.enquiries.filter((item) => normaliseStatus(item.status) === stage).length,
        deviceRequests: data.deviceRequests.filter((item) => {
          const status = normaliseStatus(item.status);
          if (stage === "CONTACTED") return status === "QUOTED";
          if (stage === "QUALIFIED") return status === "RESERVED";
          if (stage === "CLOSED") return status === "CLOSED" || status === "FULFILLED";
          return status === stage;
        }).length,
        donations: data.donations.filter((item) => {
          const status = normaliseStatus(item.status);
          if (stage === "QUALIFIED") return status === "COLLECTION_NEEDED" || status === "COLLECTION_ARRANGED" || status === "PROCESSING" || status === "RECEIVED";
          if (stage === "CLOSED") return status === "CLOSED" || status === "COMPLETED";
          return status === stage;
        }).length
      })),
    [data]
  );

  const inventorySummary = useMemo<InventoryStatusSummary[]>(
    () => {
      const inventoryStatuses: Array<{ label: string; status: string; icon: IconKey }> = [
        { label: "Available", status: "AVAILABLE", icon: "check" },
        { label: "Reserved", status: "RESERVED", icon: "badge" },
        { label: "Deployed", status: "DEPLOYED", icon: "truck" },
        { label: "Repair", status: "REPAIR", icon: "wrench" },
        { label: "Retired", status: "RETIRED", icon: "recycle" }
      ];

      return inventoryStatuses.map(({ label, status, icon }) => ({
        status: label,
        count: data.inventory.filter((item) => normaliseStatus(item.status) === status).length,
        icon
      }));
    },
    [data.inventory]
  );

  const deploymentReadiness = useMemo<DeploymentReadinessItem[]>(
    () => [
      {
        label: "Africa enquiries",
        value: data.enquiries.filter((item) => item.enquiryType === "AFRICA_DEPLOYMENT").length,
        description: "Deployment conversations requiring regional planning.",
        icon: "globe"
      },
      {
        label: "Lab bundle requests",
        value: data.deviceRequests.filter((item) => String(item.deviceCategory ?? "").includes("LAB")).length,
        description: "Computer lab and classroom bundle demand.",
        icon: "school"
      },
      {
        label: "Pending logistics",
        value: data.enquiries.filter((item) => Boolean(item.deploymentLocation) && normaliseStatus(item.status) !== "CLOSED").length,
        description: "Records with deployment locations still in progress.",
        icon: "truck"
      },
      {
        label: "Countries with interest",
        value: new Set(data.enquiries.map((item) => String(item.country ?? "")).filter(Boolean)).size,
        description: "Unique countries represented in current enquiries.",
        icon: "map"
      }
    ],
    [data.enquiries, data.deviceRequests]
  );

  const exportDashboardCsv = () => {
    const rows = [
      ["Section", "Count"],
      ["Enquiries", data.enquiries.length],
      ["Device requests", data.deviceRequests.length],
      ["Donations", data.donations.length],
      ["Inventory", data.inventory.length],
      ["Repairs", data.repairs.length],
      ["Repair parts", data.repairParts.length],
      ["Technicians", data.repairTechnicians.length],
      ["Recycling", data.recycling.length],
      ["Audit logs", data.auditLogs.length],
      ["Devices deployed", data.impact?.devicesDeployed ?? 0],
      ["Learners reached", data.impact?.learnersReached ?? 0],
      ["CO2 saved kg", data.impact?.co2SavedKg ?? 0]
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sit-admin-dashboard.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <AdminCommandHero health={health} lastSyncedAt={lastSyncedAt} role={primaryRole} onRetry={retry} onExport={exportDashboardCsv} />
      <SystemHealthBanner health={health} onRetry={retry} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} loading={loading} />
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <PriorityWorkQueue actions={priorityActions} loading={loading} />
        <DeploymentReadinessPanel items={deploymentReadiness} loading={loading} />
      </div>

      <PipelineOverview stages={pipelineStages} loading={loading} />

      <WorkforceStatusPanel />

      <div className="grid gap-6 xl:grid-cols-2">
        <InventoryHealthPanel summaries={inventorySummary} loading={loading} />
        <ImpactSnapshot impact={data.impact} loading={loading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminChartCard title="Enquiries by week" description="Operational demand trend." values={metrics.slice(0, 6).map((metric) => Number(metric.value) || 0)} loading={loading} />
        <AdminChartCard title="Inventory by status" description="Stock lifecycle distribution." values={inventorySummary.map((item) => item.count)} loading={loading} />
      </div>

      <RecentActivityTimeline auditLogs={data.auditLogs} loading={loading} />

      {errors.length > 0 ? (
        <p className="text-xs leading-5 text-muted">
          Dashboard rendered with {errors.length} degraded endpoint{errors.length === 1 ? "" : "s"}. Use diagnostics above while Firebase services finish setup.
        </p>
      ) : null}
    </div>
  );
}
