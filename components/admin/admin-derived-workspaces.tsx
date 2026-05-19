"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, type ApiRecord } from "@/lib/api";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { cn } from "@/lib/utils";

type DerivedMetric = {
  label: string;
  value: number | string;
  detail: string;
  icon: IconKey;
  href?: string;
  tone?: "orange" | "green" | "blue" | "dark";
};

type PipelineItem = {
  label: string;
  value: number;
  detail: string;
  icon: IconKey;
};

const closedStatuses = new Set(["CLOSED", "COMPLETED", "FULFILLED", "RETIRED", "UNREPAIRABLE"]);

function asString(record: ApiRecord, key: string, fallback = "") {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

function asNumber(record: ApiRecord, key: string) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asBoolean(record: ApiRecord, key: string) {
  return record[key] === true;
}

function asArray(record: ApiRecord, key: string) {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function isOpen(record: ApiRecord) {
  return !closedStatuses.has(asString(record, "status").toUpperCase());
}

function includesAny(value: string, terms: string[]) {
  const lower = value.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function recordHaystack(record: ApiRecord, keys: string[]) {
  return keys.map((key) => asString(record, key)).join(" ");
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function PageFrame({
  eyebrow,
  title,
  description,
  children,
  loading,
  errorCount
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  loading?: boolean;
  errorCount?: number;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg bg-ink p-6 text-white shadow-soft md:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {loading ? <span className="rounded-full bg-white/10 px-3 py-2">Loading live data</span> : null}
            {errorCount ? <span className="rounded-full bg-flame-500 px-3 py-2">{errorCount} degraded endpoint{errorCount === 1 ? "" : "s"}</span> : null}
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}

function MetricGrid({ metrics }: { metrics: DerivedMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const tone = metric.tone ?? "orange";
        return (
          <Link
            key={metric.label}
            href={metric.href ?? "#"}
            className={cn(
              "rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft",
              !metric.href && "pointer-events-none"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-lg text-white",
                  tone === "green" && "bg-green-600",
                  tone === "blue" && "bg-blue-600",
                  tone === "dark" && "bg-ink",
                  tone === "orange" && "bg-flame-500"
                )}
              >
                <Icon name={metric.icon} className="h-5 w-5" />
              </span>
              <p className="text-right text-3xl font-semibold text-ink">{metric.value}</p>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-ink">{metric.label}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{metric.detail}</p>
          </Link>
        );
      })}
    </div>
  );
}

function PipelineGrid({ items }: { items: PipelineItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item.label} className="rounded-lg border border-line bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame-50 text-flame-700">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{item.label}</h3>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </div>
            </div>
            <p className="text-2xl font-semibold text-ink">{item.value}</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-flame-500" style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

function RecordTable({
  title,
  records,
  columns,
  empty
}: {
  title: string;
  records: ApiRecord[];
  columns: Array<[string, (record: ApiRecord) => string]>;
  empty: string;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{records.length} records</span>
      </div>
      {records.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed border-line bg-paper p-6 text-sm text-muted">{empty}</div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {columns.map(([label]) => (
                  <th key={label} className="px-3 py-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.slice(0, 10).map((record) => (
                <tr key={record.id}>
                  {columns.map(([label, getter]) => (
                    <td key={label} className="px-3 py-3 text-muted">{getter(record)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function AdminAnalyticsWorkspace() {
  const { data, loading, errors } = useAdminDashboard();

  const metrics = useMemo<DerivedMetric[]>(() => {
    const openEnquiries = data.enquiries.filter(isOpen).length;
    const activeRequests = data.deviceRequests.filter(isOpen).length;
    const activeDonations = data.donations.filter(isOpen).length;
    const availableInventory = data.inventory.filter((item) => asString(item, "status") === "AVAILABLE").length;
    const deployedInventory = data.inventory.filter((item) => asString(item, "status") === "DEPLOYED").length;
    const activeRepairs = data.repairs.filter(isOpen).length;
    const awaitingApproval = data.repairs.filter((item) => {
      const status = asString(item, "status");
      return status === "AWAITING_APPROVAL" || status === "ESTIMATE_SENT" || status === "WAITING_FOR_PARTS";
    }).length;
    const co2 = data.impact?.co2SavedKg ?? 0;

    return [
      { label: "Open enquiries", value: openEnquiries, detail: "Contact, partnership, school, NGO and deployment enquiries still active.", icon: "mail", href: "/admin/enquiries" },
      { label: "Active device requests", value: activeRequests, detail: "Requests that still need quoting, reservation or fulfilment.", icon: "laptop", href: "/admin/device-requests", tone: "blue" },
      { label: "Donation pipeline", value: activeDonations, detail: "Device donations, sponsorships and recycling leads in progress.", icon: "heart", href: "/admin/donations", tone: "green" },
      { label: "Available stock", value: availableInventory, detail: `${deployedInventory} deployed assets currently recorded.`, icon: "database", href: "/admin/inventory", tone: "dark" },
      { label: "Active repairs", value: activeRepairs, detail: `${awaitingApproval} ticket${awaitingApproval === 1 ? "" : "s"} awaiting approval, estimate or parts decision.`, icon: "wrench", href: "/admin/repairs", tone: "blue" },
      { label: "CO2 saved", value: `${co2.toLocaleString()}kg`, detail: "Current impact value from the existing impact endpoint.", icon: "leaf", href: "/admin/impact", tone: "green" },
      { label: "Audit events", value: data.auditLogs.length, detail: "Recent admin activity from the audit log endpoint.", icon: "list", href: "/admin/audit-logs", tone: "dark" }
    ];
  }, [data]);

  const pipeline = useMemo<PipelineItem[]>(() => [
    { label: "New intake", value: data.enquiries.filter((item) => asString(item, "status") === "NEW").length + data.deviceRequests.filter((item) => asString(item, "status") === "NEW").length, detail: "Fresh enquiries and device requests.", icon: "mail" },
    { label: "Reviewing", value: [...data.enquiries, ...data.deviceRequests, ...data.donations].filter((item) => asString(item, "status") === "REVIEWING").length, detail: "Records being qualified by the team.", icon: "search" },
    { label: "Reserved or arranged", value: data.deviceRequests.filter((item) => asString(item, "status") === "RESERVED").length + data.donations.filter((item) => asString(item, "status") === "COLLECTION_ARRANGED").length, detail: "Work that has moved into fulfilment planning.", icon: "package" },
    { label: "Needs attention", value: data.inventory.filter((item) => asString(item, "status") === "REPAIR").length + data.repairs.filter(isOpen).length + errors.length, detail: "Repair queue plus degraded endpoint count.", icon: "wrench" }
  ], [data, errors.length]);

  return (
    <PageFrame
      eyebrow="Admin analytics"
      title="Operational visibility across access, reuse and deployment."
      description="A derived analytics layer using existing dashboard data, with no new collections or API routes."
      loading={loading}
      errorCount={errors.length}
    >
      <MetricGrid metrics={metrics} />
      <PipelineGrid items={pipeline} />
    </PageFrame>
  );
}

export function AdminDeploymentsWorkspace() {
  const { data, loading, errors } = useAdminDashboard();

  const africaRequests = data.deviceRequests.filter((record) =>
    includesAny(recordHaystack(record, ["country", "deploymentLocation", "deploymentType", "notes"]), ["africa", "ghana", "liberia", "sierra leone", "nigeria", "shipment"])
  );
  const labRequests = data.deviceRequests.filter((record) =>
    includesAny(recordHaystack(record, ["deviceCategory", "deploymentType", "intendedUse", "notes"]), ["lab", "classroom", "training"])
  );
  const communitySignals = data.enquiries.filter((record) =>
    includesAny(recordHaystack(record, ["organisationType", "message", "enquiryType"]), ["ngo", "community", "charity", "church", "library", "hub"])
  );
  const africaReadyStock = data.inventory.filter((record) => asBoolean(record, "africaReady"));
  const labReadyStock = data.inventory.filter((record) => asBoolean(record, "labBundleReady"));
  const lowPowerStock = data.inventory.filter((record) => asBoolean(record, "lowPowerSuitable"));

  const metrics: DerivedMetric[] = [
    { label: "Africa demand", value: africaRequests.length, detail: "Device requests with Africa deployment signals.", icon: "globe", href: "/admin/device-requests" },
    { label: "Lab demand", value: labRequests.length, detail: "Classroom, lab and training-centre request signals.", icon: "school", href: "/admin/device-requests", tone: "blue" },
    { label: "Community signals", value: communitySignals.length, detail: "NGO, charity, church, library and hub enquiries.", icon: "users", href: "/admin/enquiries", tone: "green" },
    { label: "Africa-ready stock", value: africaReadyStock.length, detail: `${lowPowerStock.length} low-power assets are also flagged.`, icon: "database", href: "/admin/inventory", tone: "dark" }
  ];

  const pipeline: PipelineItem[] = [
    { label: "Africa-ready assets", value: africaReadyStock.length, detail: "Inventory flagged for Africa deployment.", icon: "globe" },
    { label: "Lab bundle assets", value: labReadyStock.length, detail: "Inventory flagged for classroom bundles.", icon: "school" },
    { label: "Low-power assets", value: lowPowerStock.length, detail: "Stock suitable for power-aware labs.", icon: "sun" },
    { label: "Open deployment records", value: [...africaRequests, ...labRequests, ...communitySignals].filter(isOpen).length, detail: "Open demand signals across requests and enquiries.", icon: "truck" }
  ];

  return (
    <PageFrame
      eyebrow="Deployment operations"
      title="Readiness view for Africa, labs and community hubs."
      description="Derived from request, enquiry and inventory flags so teams can spot demand and stock readiness without new backend state."
      loading={loading}
      errorCount={errors.length}
    >
      <MetricGrid metrics={metrics} />
      <PipelineGrid items={pipeline} />
      <RecordTable
        title="Recent deployment demand"
        records={[...africaRequests, ...labRequests, ...communitySignals]}
        empty="Deployment demand will appear here when enquiries or device requests include Africa, lab or community hub signals."
        columns={[
          ["Organisation", (record) => asString(record, "organisation", asString(record, "fullName", "Not provided"))],
          ["Location", (record) => asString(record, "deploymentLocation", asString(record, "country", "Not provided"))],
          ["Status", (record) => asString(record, "status", "Unknown")],
          ["Created", (record) => formatDate(record.createdAt)]
        ]}
      />
    </PageFrame>
  );
}

export function AdminRecyclingWorkspace() {
  const { data, loading, errors } = useAdminDashboard();
  const recyclingLeads = data.donations.filter((record) => asString(record, "donationType") === "CORPORATE_RECYCLING");
  const recyclingRecords = data.recycling;
  const deviceDonations = data.donations.filter((record) =>
    ["USED_LAPTOPS", "DESKTOPS", "MINI_PCS", "ACCESSORIES", "CORPORATE_RECYCLING"].includes(asString(record, "donationType"))
  );
  const deviceCount = deviceDonations.reduce((total, record) => total + asNumber(record, "deviceCount"), 0);
  const devicesDiverted = recyclingRecords.reduce((total, record) => total + asNumber(record, "devicesDiverted"), 0);
  const estimatedCo2 = Math.max(deviceCount * 75, recyclingLeads.length * 250, recyclingRecords.reduce((total, record) => total + asNumber(record, "estimatedCo2SavedKg"), 0));

  const metrics: DerivedMetric[] = [
    { label: "Corporate recycling leads", value: recyclingLeads.length, detail: "Companies exploring retired-device reuse partnerships.", icon: "recycle", href: "/admin/donations", tone: "green" },
    { label: "Device donation records", value: deviceDonations.length, detail: "Reusable hardware offers currently captured in donations.", icon: "package", href: "/admin/donations" },
    { label: "Devices diverted", value: Math.max(deviceCount, devicesDiverted), detail: "Sum of donation and recycling diversion signals.", icon: "database", href: "/admin/recycling", tone: "blue" },
    { label: "Estimated reuse impact", value: `${estimatedCo2.toLocaleString()}kg`, detail: "Approximate CO2 avoided signal derived from donation volume.", icon: "leaf", href: "/admin/impact", tone: "green" }
  ];

  const pipeline: PipelineItem[] = [
    { label: "New", value: deviceDonations.filter((item) => asString(item, "status") === "NEW").length, detail: "Fresh donation or recycling leads.", icon: "mail" },
    { label: "Collection needed", value: deviceDonations.filter((item) => asString(item, "status") === "COLLECTION_NEEDED").length, detail: "Records waiting for collection planning.", icon: "truck" },
    { label: "Processing", value: deviceDonations.filter((item) => asString(item, "status") === "PROCESSING").length, detail: "Devices in wipe, triage or refurbishment stages.", icon: "wrench" },
    { label: "Completed", value: deviceDonations.filter((item) => asString(item, "status") === "COMPLETED").length, detail: "Donation records closed with completed state.", icon: "check" }
  ];

  return (
    <PageFrame
      eyebrow="Recycling operations"
      title="Corporate recycling and reuse pipeline."
      description="A derived view over donation records, focused on secure collection, processing and reuse impact signals."
      loading={loading}
      errorCount={errors.length}
    >
      <MetricGrid metrics={metrics} />
      <PipelineGrid items={pipeline} />
      <RecordTable
        title="Corporate recycling opportunities"
        records={recyclingLeads}
        empty="Corporate recycling leads will appear here when the donation form is submitted with that donation type."
        columns={[
          ["Donor", (record) => asString(record, "organisation", asString(record, "donorName", "Not provided"))],
          ["Devices", (record) => String(asNumber(record, "deviceCount"))],
          ["Pickup", (record) => asString(record, "pickupLocation", "Not provided")],
          ["Status", (record) => asString(record, "status", "Unknown")]
        ]}
      />
    </PageFrame>
  );
}

export function AdminSupportWorkspace() {
  const { data, loading, errors } = useAdminDashboard();
  const repairInventory = data.inventory.filter((record) => asString(record, "status") === "REPAIR");
  const activeRepairTickets = data.repairs.filter(isOpen);
  const withSupportHistory = data.inventory.filter((record) => asArray(record, "supportHistory").length > 0);
  const supportEnquiries = data.enquiries.filter((record) =>
    includesAny(recordHaystack(record, ["enquiryType", "message", "supportModelRequired"]), ["support", "repair", "maintenance", "service"])
  );
  const openRequests = data.deviceRequests.filter(isOpen);

  const metrics: DerivedMetric[] = [
    { label: "Repair queue", value: repairInventory.length + activeRepairTickets.length, detail: "Inventory assets and repair tickets currently active.", icon: "wrench", href: "/admin/repairs" },
    { label: "Support histories", value: withSupportHistory.length, detail: "Assets with recorded support notes.", icon: "list", href: "/admin/inventory", tone: "dark" },
    { label: "Support enquiries", value: supportEnquiries.length, detail: "Enquiries with support, maintenance or service signals.", icon: "headset", href: "/admin/enquiries", tone: "blue" },
    { label: "Open requests", value: openRequests.length, detail: "Device requests that may need fulfilment support.", icon: "package", href: "/admin/device-requests", tone: "green" }
  ];

  const pipeline: PipelineItem[] = [
    { label: "Repair", value: repairInventory.length, detail: "Assets needing repair or triage.", icon: "wrench" },
    { label: "Reserved", value: data.inventory.filter((record) => asString(record, "status") === "RESERVED").length, detail: "Assets committed but not deployed.", icon: "package" },
    { label: "Deployed", value: data.inventory.filter((record) => asString(record, "status") === "DEPLOYED").length, detail: "Assets in active use.", icon: "check" },
    { label: "Retired", value: data.inventory.filter((record) => asString(record, "status") === "RETIRED").length, detail: "Assets ready for retirement review.", icon: "recycle" }
  ];

  return (
    <PageFrame
      eyebrow="Support operations"
      title="Repair, support history and fulfilment support signals."
      description="A lightweight support command centre derived from inventory, enquiries and open requests."
      loading={loading}
      errorCount={errors.length}
    >
      <MetricGrid metrics={metrics} />
      <PipelineGrid items={pipeline} />
      <RecordTable
        title="Assets needing support"
        records={[...repairInventory, ...withSupportHistory].filter((record, index, array) => array.findIndex((item) => item.id === record.id) === index)}
        empty="Repair items and assets with support history will appear here once inventory records are updated."
        columns={[
          ["Asset", (record) => asString(record, "assetTag", record.id)],
          ["Device", (record) => `${asString(record, "brand")} ${asString(record, "model")}`.trim() || asString(record, "deviceType", "Not provided")],
          ["Status", (record) => asString(record, "status", "Unknown")],
          ["Updated", (record) => formatDate(record.updatedAt)]
        ]}
      />
    </PageFrame>
  );
}

export function AdminAuditLogsWorkspace() {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState<ApiRecord[]>([]);
  const [resourceType, setResourceType] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function loadLogs() {
      setLoading(true);
      setError(null);
      try {
        const next = await adminApi.listAuditLogs(authToken, resourceType.trim() || undefined, resourceId.trim() || undefined);
        if (!cancelled) setLogs(next);
      } catch (auditError) {
        if (!cancelled) {
          setLogs([]);
          setError(auditError instanceof Error ? auditError.message : "Unable to load audit logs.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLogs();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, resourceId, resourceType, token]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter((log) => JSON.stringify(log).toLowerCase().includes(query));
  }, [logs, search]);

  return (
    <PageFrame
      eyebrow="Audit logs"
      title="Searchable admin activity trail."
      description="Reads from the existing audit log endpoint and supports optional resource type/id filtering."
      loading={loading}
      errorCount={error ? 1 : 0}
    >
      <section className="rounded-lg border border-line bg-white p-5 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="text-sm font-semibold text-ink">
            Search
            <input className="mt-2 min-h-11 w-full rounded-full border border-line px-4 text-sm outline-none focus:border-flame-300" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Actor, action, resource..." />
          </label>
          <label className="text-sm font-semibold text-ink">
            Resource type
            <input className="mt-2 min-h-11 w-full rounded-full border border-line px-4 text-sm outline-none focus:border-flame-300" value={resourceType} onChange={(event) => setResourceType(event.target.value)} placeholder="inventory, donations..." />
          </label>
          <label className="text-sm font-semibold text-ink">
            Resource ID
            <input className="mt-2 min-h-11 w-full rounded-full border border-line px-4 text-sm outline-none focus:border-flame-300" value={resourceId} onChange={(event) => setResourceId(event.target.value)} placeholder="Optional record id" />
          </label>
          <button className="min-h-11 self-end rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => setReloadKey((value) => value + 1)}>
            Refresh
          </button>
        </div>
        {error ? <p className="mt-4 rounded-lg bg-flame-50 p-3 text-sm font-semibold text-flame-700">{error}</p> : null}
      </section>

      <RecordTable
        title="Activity"
        records={filtered}
        empty={loading ? "Loading audit activity..." : "No audit logs match the current filters."}
        columns={[
          ["Action", (record) => asString(record, "action", "Unknown")],
          ["Resource", (record) => `${asString(record, "resourceType", "Unknown")} / ${asString(record, "resourceId", record.id)}`],
          ["Actor", (record) => asString(record, "actorEmail", asString(record, "actorUid", "System"))],
          ["Created", (record) => formatDate(record.createdAt)]
        ]}
      />
    </PageFrame>
  );
}
