"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, type ApiRecord, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";

type Loader = (token: string) => Promise<ApiRecord[]>;
type Mutator = (token: string) => Promise<unknown>;

function stringValue(record: ApiRecord, key: string, fallback = "Not recorded") {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function numberValue(record: ApiRecord, key: string) {
  const value = record[key];
  return typeof value === "number" ? value : Number(value ?? 0) || 0;
}

function dateValue(value: unknown) {
  if (!value) return "Not dated";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? "Not dated"
    : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function useOperationalRecords(loader: Loader) {
  const { token } = useAdminAuth();
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const next = await loader(authToken);
        if (!cancelled) setRecords(next);
      } catch (loadError) {
        if (!cancelled) {
          setRecords([]);
          setError(loadError instanceof Error ? loadError.message : "Unable to load records.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [loader, reloadKey, token]);

  const run = useCallback(async (mutator: Mutator) => {
    if (!token) return;
    const authToken = token;
    await mutator(authToken);
    reload();
  }, [reload, token]);

  return { records, loading, error, reload, run };
}

function PageFrame({
  eyebrow,
  title,
  description,
  icon,
  children,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconKey;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_34%),linear-gradient(135deg,#080808,#171717_58%,#261204)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name={icon} className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </section>
      {children}
    </div>
  );
}

function ActionButton({ children, onClick, href, variant = "dark" }: { children: React.ReactNode; onClick?: () => void; href?: string; variant?: "dark" | "light" | "orange" }) {
  const className = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition",
    variant === "orange" && "bg-flame-500 text-white shadow-lg shadow-flame-500/20 hover:bg-flame-600",
    variant === "dark" && "bg-ink text-white hover:bg-flame-600",
    variant === "light" && "border border-line bg-white text-ink hover:border-flame-300"
  );

  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <button type="button" className={className} onClick={onClick}>{children}</button>;
}

function MetricGrid({ metrics }: { metrics: Array<{ label: string; value: number | string; detail: string; icon: IconKey }> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
              <Icon name={metric.icon} className="h-5 w-5" />
            </span>
            <strong className="text-2xl tracking-tight text-ink">{typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}</strong>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-ink">{metric.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{metric.detail}</p>
        </article>
      ))}
    </div>
  );
}

function RecordsPanel({
  title,
  records,
  loading,
  error,
  empty,
  columns,
  actions
}: {
  title: string;
  records: ApiRecord[];
  loading: boolean;
  error: string | null;
  empty: string;
  columns: Array<[string, (record: ApiRecord) => string]>;
  actions?: (record: ApiRecord) => React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{records.length} records</span>
      </div>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {loading ? (
        <div className="mt-5 grid gap-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-2xl bg-paper" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-paper p-8 text-center text-sm text-muted">{empty}</div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {columns.map(([label]) => <th key={label} className="px-3 py-3">{label}</th>)}
                {actions ? <th className="px-3 py-3">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.map((record) => (
                <tr key={record.id}>
                  {columns.map(([label, getter]) => <td key={label} className="px-3 py-3 text-muted">{getter(record)}</td>)}
                  {actions ? <td className="px-3 py-3">{actions(record)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function promptPayload(defaultTitle: string, status?: string): EcosystemRecordPayload | null {
  const title = window.prompt("Title", defaultTitle);
  if (!title) return null;
  const summary = window.prompt("Summary or notes", "");
  return { title, summary: summary ?? "", status };
}

export function AdminDeploymentsOperationalPage() {
  const loader = useCallback((token: string) => adminApi.listDeployments(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);
  const metrics = [
    { label: "Deployment records", value: records.length, detail: "Africa, lab and community deployment projects.", icon: "truck" as IconKey },
    { label: "Planning", value: records.filter((item) => stringValue(item, "status", "") === "PLANNING").length, detail: "Projects still being scoped.", icon: "map" as IconKey },
    { label: "Average readiness", value: `${Math.round(records.reduce((sum, item) => sum + numberValue(item, "readinessScore"), 0) / Math.max(1, records.length))}%`, detail: "Readiness score across active records.", icon: "chart" as IconKey },
    { label: "Countries", value: new Set(records.map((item) => stringValue(item, "country", "")).filter(Boolean)).size, detail: "Countries represented in deployment records.", icon: "globe" as IconKey }
  ];

  return (
    <PageFrame
      eyebrow="Deployments"
      title="Africa, school lab and community deployment operations."
      description="Real Firestore-backed deployment records with readiness, logistics, partner and fulfilment state."
      icon="truck"
      actions={<ActionButton variant="orange" onClick={() => {
        const payload = promptPayload("New deployment project", "PLANNING");
        if (payload) void run((token) => adminApi.createDeployment(token, payload));
      }}>Create deployment</ActionButton>}
    >
      <MetricGrid metrics={metrics} />
      <RecordsPanel
        title="Deployment pipeline"
        records={records}
        loading={loading}
        error={error}
        empty="Deployment records will appear when a device request is converted or an admin creates a deployment."
        columns={[
          ["Title", (record) => stringValue(record, "title", stringValue(record, "summary"))],
          ["Country", (record) => stringValue(record, "country")],
          ["Location", (record) => stringValue(record, "location")],
          ["Readiness", (record) => `${numberValue(record, "readinessScore")}%`],
          ["Status", (record) => stringValue(record, "status")],
          ["Owner", (record) => stringValue(record, "assignedOwner")]
        ]}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateDeployment(token, record.id, { status: "ACTIVE" }))}>
            Mark active
          </button>
        )}
      />
    </PageFrame>
  );
}

export function AdminRecyclingOperationalPage() {
  const loader = useCallback((token: string) => adminApi.listRecycling(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);
  const devices = records.reduce((sum, item) => sum + numberValue(item, "devicesDiverted"), 0);
  const co2 = records.reduce((sum, item) => sum + numberValue(item, "estimatedCo2SavedKg"), 0);

  return (
    <PageFrame eyebrow="Recycling" title="Corporate recycling and circular technology operations." description="Track collection, secure wipe, refurbish-vs-recycle decisions, ESG evidence and reuse impact." icon="recycle" actions={<ActionButton variant="orange" onClick={() => {
      const payload = promptPayload("Corporate recycling intake", "INTAKE");
      if (payload) void run((token) => adminApi.createRecycling(token, payload));
    }}>Create intake</ActionButton>}>
      <MetricGrid metrics={[
        { label: "Recycling records", value: records.length, detail: "Collection and processing workflows.", icon: "recycle" },
        { label: "Devices diverted", value: devices, detail: "Devices captured for reuse or responsible recycling.", icon: "package" },
        { label: "Estimated CO2 avoided", value: `${co2.toLocaleString()}kg`, detail: "Estimated circular technology savings.", icon: "leaf" },
        { label: "Processing", value: records.filter((item) => /PROCESS|WIPE|REFURB/i.test(stringValue(item, "status", ""))).length, detail: "Records in active processing.", icon: "wrench" }
      ]} />
      <RecordsPanel
        title="Recycling pipeline"
        records={records}
        loading={loading}
        error={error}
        empty="Recycling records will appear when corporate donations are scheduled or created here."
        columns={[
          ["Title", (record) => stringValue(record, "title", stringValue(record, "summary"))],
          ["Pickup", (record) => stringValue(record, "pickupLocation")],
          ["Devices", (record) => String(numberValue(record, "devicesDiverted") || numberValue(record, "deviceCount"))],
          ["Stage", (record) => stringValue(record, "processingStage")],
          ["Status", (record) => stringValue(record, "status")]
        ]}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateRecycling(token, record.id, { status: "PROCESSING", processingStage: "Secure wipe and triage" }))}>
            Process
          </button>
        )}
      />
    </PageFrame>
  );
}

export function AdminSupportOperationalPage() {
  const loader = useCallback((token: string) => adminApi.listSupportTickets(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);

  return (
    <PageFrame eyebrow="Support" title="Customer, fulfilment and device support command centre." description="Track support tickets, fulfilment assistance, escalation state and inventory-linked support history." icon="headset" actions={<ActionButton variant="orange" onClick={() => {
      const payload = promptPayload("New support ticket", "OPEN");
      if (payload) void run((token) => adminApi.createSupportTicket(token, payload));
    }}>Create ticket</ActionButton>}>
      <MetricGrid metrics={[
        { label: "Open tickets", value: records.filter((item) => stringValue(item, "status", "") !== "CLOSED").length, detail: "Active support records.", icon: "headset" },
        { label: "High priority", value: records.filter((item) => stringValue(item, "priority", "") === "HIGH").length, detail: "Needs fast follow-up.", icon: "badge" },
        { label: "Inventory linked", value: records.filter((item) => Boolean(item.inventoryId)).length, detail: "Tickets tied to device lifecycle.", icon: "database" },
        { label: "Closed", value: records.filter((item) => stringValue(item, "status", "") === "CLOSED").length, detail: "Resolved support tickets.", icon: "check" }
      ]} />
      <RecordsPanel
        title="Support tickets"
        records={records}
        loading={loading}
        error={error}
        empty="Support tickets will appear when created from inventory or admin workflows."
        columns={[
          ["Title", (record) => stringValue(record, "title", stringValue(record, "summary"))],
          ["Category", (record) => stringValue(record, "category")],
          ["Priority", (record) => stringValue(record, "priority")],
          ["Status", (record) => stringValue(record, "status")],
          ["Owner", (record) => stringValue(record, "assignedOwner")]
        ]}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateSupportTicket(token, record.id, { status: "CLOSED" }))}>
            Close
          </button>
        )}
      />
    </PageFrame>
  );
}

export function AdminRepairsOperationalPage({ mode = "tickets" }: { mode?: "tickets" | "queue" | "parts" | "technicians" }) {
  const loader = useCallback((token: string) => {
    if (mode === "parts") return adminApi.listRepairParts(token);
    if (mode === "technicians") return adminApi.listRepairTechnicians(token);
    return adminApi.listRepairTickets(token);
  }, [mode]);
  const { records, loading, error, run } = useOperationalRecords(loader);
  const queueRecords = mode === "queue" ? records.filter((item) => !["COMPLETED", "UNREPAIRABLE"].includes(stringValue(item, "status", ""))) : records;
  const title = mode === "parts" ? "Repair parts inventory" : mode === "technicians" ? "Repair technician operations" : mode === "queue" ? "Repair queue" : "Repair operations platform";
  const icon: IconKey = mode === "parts" ? "hardDrive" : mode === "technicians" ? "users" : "wrench";

  const create = () => {
    const payload = promptPayload(mode === "parts" ? "Replacement SSD / RAM / screen" : mode === "technicians" ? "Technician name" : "Laptop repair ticket", mode === "parts" ? "AVAILABLE" : mode === "technicians" ? "AVAILABLE" : "NEW");
    if (!payload) return;
    const action = mode === "parts"
      ? (token: string) => adminApi.createRepairPart(token, payload)
      : mode === "technicians"
        ? (token: string) => adminApi.createRepairTechnician(token, payload)
        : (token: string) => adminApi.createRepairTicket(token, payload);
    void run(action);
  };

  return (
    <PageFrame eyebrow="Repairs" title={title} description="Diagnostics, technician assignment, parts availability, SLA tracking, quality check and before/after repair reporting." icon={icon} actions={<ActionButton variant="orange" onClick={create}>Create record</ActionButton>}>
      <MetricGrid metrics={[
        { label: "Records", value: queueRecords.length, detail: "Current records in this repair workspace.", icon },
        { label: "Active", value: queueRecords.filter((item) => !["COMPLETED", "UNREPAIRABLE", "DEPLETED"].includes(stringValue(item, "status", ""))).length, detail: "Still requires action.", icon: "badge" },
        { label: "High priority", value: queueRecords.filter((item) => stringValue(item, "priority", "") === "HIGH").length, detail: "Priority repair workload.", icon: "shield" },
        { label: "SLA avg", value: `${Math.round(queueRecords.reduce((sum, item) => sum + numberValue(item, "slaTargetHours"), 0) / Math.max(1, queueRecords.length))}h`, detail: "Average target resolution time.", icon: "chart" }
      ]} />
      <RecordsPanel
        title={mode === "queue" ? "Active repair queue" : title}
        records={queueRecords}
        loading={loading}
        error={error}
        empty="Repair records will appear when public repair bookings or admin repair tickets are created."
        columns={mode === "parts" ? [
          ["Part", (record) => stringValue(record, "title", stringValue(record, "name"))],
          ["Category", (record) => stringValue(record, "category")],
          ["Status", (record) => stringValue(record, "status")],
          ["Stock", (record) => String(numberValue(record, "deviceCount"))],
          ["Updated", (record) => dateValue(record.updatedAt)]
        ] : mode === "technicians" ? [
          ["Technician", (record) => stringValue(record, "title", stringValue(record, "name"))],
          ["Skills", (record) => Array.isArray(record.tags) ? record.tags.join(", ") : stringValue(record, "category")],
          ["Availability", (record) => stringValue(record, "status")],
          ["Workload", (record) => `${numberValue(record, "readinessScore") || 0}%`],
          ["Updated", (record) => dateValue(record.updatedAt)]
        ] : [
          ["Ticket", (record) => stringValue(record, "title", stringValue(record, "summary"))],
          ["Category", (record) => stringValue(record, "category", stringValue(record, "repairCategory"))],
          ["Priority", (record) => stringValue(record, "priority")],
          ["SLA", (record) => `${numberValue(record, "slaTargetHours")}h`],
          ["Status", (record) => stringValue(record, "status")],
          ["Owner", (record) => stringValue(record, "assignedOwner")]
        ]}
        actions={(record) => {
          if (mode === "parts") {
            return <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateRepairPart(token, record.id, { status: "RESERVED" }))}>Reserve</button>;
          }
          if (mode === "technicians") {
            return <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateRepairTechnician(token, record.id, { status: "ASSIGNED" }))}>Assign</button>;
          }
          return (
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateRepairTicket(token, record.id, { status: "REPAIR_IN_PROGRESS" }))}>Start</button>
              <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateRepairTicket(token, record.id, { status: "QUALITY_CHECK" }))}>QC</button>
              <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateRepairTicket(token, record.id, { status: "COMPLETED" }))}>Complete</button>
            </div>
          );
        }}
      />
    </PageFrame>
  );
}

export function AdminNotificationsOperationalPage() {
  const loader = useCallback((token: string) => adminApi.listNotifications(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);

  return (
    <PageFrame eyebrow="Notifications" title="In-app notification centre." description="Real notification records with read/unread state, linked resources, retryable delivery and audit-backed activity." icon="bell" actions={<ActionButton variant="orange" onClick={() => {
      const payload = promptPayload("Manual admin notification", "UNREAD");
      if (payload) void run((token) => adminApi.createNotification(token, { ...payload, read: false }));
    }}>Create notification</ActionButton>}>
      <MetricGrid metrics={[
        { label: "Unread", value: records.filter((item) => item.read !== true).length, detail: "Notifications needing attention.", icon: "badge" },
        { label: "High priority", value: records.filter((item) => stringValue(item, "priority", "") === "HIGH").length, detail: "Operational alerts.", icon: "shield" },
        { label: "Queued delivery", value: records.filter((item) => stringValue(item, "deliveryStatus", "") === "QUEUED").length, detail: "External provider events waiting.", icon: "cloud" },
        { label: "Read", value: records.filter((item) => item.read === true).length, detail: "Acknowledged notifications.", icon: "check" }
      ]} />
      <RecordsPanel
        title="Notifications"
        records={records}
        loading={loading}
        error={error}
        empty="Notifications are created automatically by admin workflows and can also be created manually."
        columns={[
          ["Title", (record) => stringValue(record, "title")],
          ["Category", (record) => stringValue(record, "category")],
          ["Priority", (record) => stringValue(record, "priority")],
          ["State", (record) => record.read === true ? "Read" : "Unread"],
          ["Delivery", (record) => stringValue(record, "deliveryStatus")]
        ]}
        actions={(record) => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => record.read === true ? adminApi.markNotificationUnread(token, record.id) : adminApi.markNotificationRead(token, record.id))}>
              {record.read === true ? "Unread" : "Read"}
            </button>
            <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.retryNotification(token, record.id))}>
              Retry
            </button>
          </div>
        )}
      />
    </PageFrame>
  );
}

export function AdminStoriesOperationalPage() {
  const loader = useCallback((token: string) => adminApi.listSuccessStories(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);

  return (
    <PageFrame eyebrow="Story publishing" title="Success stories and impact storytelling." description="Publish learner, school, NGO, community, business and Africa deployment stories with metric tags and visuals." icon="sparkles" actions={<><ActionButton variant="light" onClick={() => void run((token) => adminApi.seedSuccessStories(token))}>Seed defaults</ActionButton><ActionButton variant="orange" onClick={() => {
      const payload = promptPayload("New success story", "DRAFT");
      if (payload) void run((token) => adminApi.createSuccessStory(token, { ...payload, category: "Community", region: "UK and Africa", metrics: ["Devices reused", "Learners supported"] }));
    }}>Create story</ActionButton></>}>
      <MetricGrid metrics={[
        { label: "Stories", value: records.length, detail: "Admin-managed story records.", icon: "sparkles" },
        { label: "Published", value: records.filter((item) => item.published === true || item.status === "PUBLISHED").length, detail: "Visible on public pages.", icon: "check" },
        { label: "Drafts", value: records.filter((item) => item.status !== "PUBLISHED").length, detail: "Waiting for review.", icon: "list" },
        { label: "Regions", value: new Set(records.map((item) => stringValue(item, "region", "")).filter(Boolean)).size, detail: "Regions represented.", icon: "map" }
      ]} />
      <RecordsPanel
        title="Stories"
        records={records}
        loading={loading}
        error={error}
        empty="Seed default stories or create the first real impact story."
        columns={[
          ["Title", (record) => stringValue(record, "title")],
          ["Category", (record) => stringValue(record, "category")],
          ["Region", (record) => stringValue(record, "region")],
          ["Status", (record) => stringValue(record, "status")],
          ["Published", (record) => record.published === true ? "Yes" : "No"]
        ]}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => record.published === true ? adminApi.unpublishSuccessStory(token, record.id) : adminApi.publishSuccessStory(token, record.id))}>
            {record.published === true ? "Unpublish" : "Publish"}
          </button>
        )}
      />
    </PageFrame>
  );
}

export function AdminTrainingOperationalPage() {
  const loader = useCallback((token: string) => adminApi.listTrainingCohorts(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);

  return (
    <PageFrame eyebrow="Training" title="Digital skills cohorts and certification readiness." description="Track digital literacy, AI literacy, cybersecurity, teacher enablement and sponsor-a-cohort workflows." icon="graduation" actions={<ActionButton variant="orange" onClick={() => {
      const payload = promptPayload("AI literacy cohort", "PLANNING");
      if (payload) void run((token) => adminApi.createTrainingCohort(token, { ...payload, trainingPathway: "AI literacy", learnerCount: 25 }));
    }}>Create cohort</ActionButton>}>
      <MetricGrid metrics={[
        { label: "Cohorts", value: records.length, detail: "Training cohort records.", icon: "graduation" },
        { label: "Learners", value: records.reduce((sum, item) => sum + numberValue(item, "learnerCount"), 0), detail: "Planned or active learners.", icon: "users" },
        { label: "Active", value: records.filter((item) => stringValue(item, "status", "") === "ACTIVE").length, detail: "Cohorts currently running.", icon: "check" },
        { label: "Certification", value: records.filter((item) => Boolean(item.certificationTarget)).length, detail: "Certification-ready cohorts.", icon: "badge" }
      ]} />
      <RecordsPanel
        title="Training cohorts"
        records={records}
        loading={loading}
        error={error}
        empty="Training cohorts will appear once created for sponsors, schools or community hubs."
        columns={[
          ["Cohort", (record) => stringValue(record, "title", stringValue(record, "cohortName"))],
          ["Pathway", (record) => stringValue(record, "trainingPathway")],
          ["Learners", (record) => String(numberValue(record, "learnerCount"))],
          ["Certification", (record) => stringValue(record, "certificationTarget")],
          ["Status", (record) => stringValue(record, "status")]
        ]}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void run((token) => adminApi.updateTrainingCohort(token, record.id, { status: "ACTIVE" }))}>
            Activate
          </button>
        )}
      />
    </PageFrame>
  );
}

export function AdminSustainabilityReportsPage() {
  const loader = useCallback((token: string) => adminApi.listSustainabilityReports(token), []);
  const { records, loading, error, run } = useOperationalRecords(loader);

  return (
    <PageFrame eyebrow="Sustainability" title="Sustainability analytics and reuse reporting." description="Generate estimated reuse reports across inventory, recycling, repair and impact data." icon="leaf" actions={<ActionButton variant="orange" onClick={() => void run((token) => adminApi.generateSustainabilityReport(token, { reportType: "ESTIMATED_REUSE_IMPACT" }))}>Generate report</ActionButton>}>
      <MetricGrid metrics={[
        { label: "Reports", value: records.length, detail: "Generated sustainability reports.", icon: "leaf" },
        { label: "CO2 estimated", value: `${records.reduce((sum, item) => sum + numberValue(item, "estimatedCo2SavedKg"), 0).toLocaleString()}kg`, detail: "Reported estimated CO2 avoided.", icon: "chart" },
        { label: "Devices diverted", value: records.reduce((sum, item) => sum + numberValue(item, "devicesDiverted"), 0), detail: "Devices included in reports.", icon: "recycle" },
        { label: "Latest", value: records[0] ? dateValue(records[0].createdAt) : "None", detail: "Most recent generated report.", icon: "badge" }
      ]} />
      <RecordsPanel
        title="Reports"
        records={records}
        loading={loading}
        error={error}
        empty="Generate the first sustainability report from current reuse, repair, recycling and impact records."
        columns={[
          ["Title", (record) => stringValue(record, "title")],
          ["Type", (record) => stringValue(record, "reportType")],
          ["CO2", (record) => `${numberValue(record, "estimatedCo2SavedKg").toLocaleString()}kg`],
          ["Devices", (record) => String(numberValue(record, "devicesDiverted"))],
          ["Created", (record) => dateValue(record.createdAt)]
        ]}
      />
    </PageFrame>
  );
}

export function AdminSearchPage() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const loader = useCallback((token: string) => query ? adminApi.search(token, query) : Promise.resolve([]), [query]);
  const { records, loading, error } = useOperationalRecords(loader);

  return (
    <PageFrame eyebrow="Search" title="Global admin search." description="Search across enquiries, device requests, donations, inventory, deployments, repairs, recycling, support, stories, cohorts and notifications." icon="search">
      <RecordsPanel
        title={query ? `Results for "${query}"` : "Search results"}
        records={records}
        loading={loading}
        error={error}
        empty={query ? "No records matched this search." : "Type a query into the admin search bar to search platform records."}
        columns={[
          ["Type", (record) => stringValue(record, "type")],
          ["Title", (record) => stringValue(record, "title")],
          ["Summary", (record) => stringValue(record, "summary")],
          ["Status", (record) => stringValue(record, "status")],
          ["Created", (record) => dateValue(record.createdAt)]
        ]}
        actions={(record) => <Link className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" href={stringValue(record, "href", "/admin/dashboard")}>Open</Link>}
      />
    </PageFrame>
  );
}
