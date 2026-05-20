"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL, type ApiRecord, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  AdminRecyclingListResponse,
  AdminRecyclingPartner,
  AdminRecyclingRecord,
  AdminRecyclingSummary,
  RecyclingStatus
} from "@/types/recycling";

type RecyclingTab = "pipeline" | "collections" | "wipe" | "decision" | "evidence" | "partners";
type RecyclingFilter = "all" | "overdue" | "secure-wipe" | "esg" | "custody" | "reuse" | "recycle" | "africa" | "partner";

type EndpointError = {
  endpoint: string;
  path: string;
  message: string;
  suggestedFix: string;
};

const emptySummary: AdminRecyclingSummary = {
  totalRecords: 0,
  devicesDiverted: 0,
  estimatedCo2KgAvoided: 0,
  processing: 0,
  secureWipePending: 0,
  esgEvidenceReady: 0,
  overdueCollections: 0,
  partnersActive: 0
};

const pipeline: Array<{ status: RecyclingStatus; label: string; icon: IconKey }> = [
  { status: "INTAKE_CREATED", label: "Intake Created", icon: "recycle" },
  { status: "COLLECTION_SCHEDULED", label: "Collection Scheduled", icon: "truck" },
  { status: "COLLECTED", label: "Collected", icon: "package" },
  { status: "SECURE_WIPE_PENDING", label: "Secure Wipe Pending", icon: "shield" },
  { status: "SECURE_WIPE_COMPLETE", label: "Secure Wipe Complete", icon: "check" },
  { status: "ASSESSMENT", label: "Assessment", icon: "search" },
  { status: "REFURBISH_APPROVED", label: "Refurbish Approved", icon: "wrench" },
  { status: "RECYCLE_APPROVED", label: "Recycle Approved", icon: "leaf" },
  { status: "ESG_EVIDENCE_READY", label: "ESG Evidence Ready", icon: "badge" },
  { status: "COMPLETED", label: "Completed", icon: "check" }
];

const tabs: Array<{ id: RecyclingTab; label: string; icon: IconKey }> = [
  { id: "pipeline", label: "Pipeline", icon: "grid" },
  { id: "collections", label: "Collections", icon: "truck" },
  { id: "wipe", label: "Secure Wipe", icon: "shield" },
  { id: "decision", label: "Reuse vs Recycle", icon: "sparkles" },
  { id: "evidence", label: "ESG Evidence", icon: "leaf" },
  { id: "partners", label: "Partners", icon: "handshake" }
];

const filters: Array<{ id: RecyclingFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "overdue", label: "Overdue" },
  { id: "secure-wipe", label: "Secure wipe" },
  { id: "esg", label: "ESG required" },
  { id: "custody", label: "Chain of custody" },
  { id: "reuse", label: "Reuse ready" },
  { id: "recycle", label: "Recycle ready" },
  { id: "africa", label: "Africa suitable" },
  { id: "partner", label: "Partner collections" }
];

function normaliseStatus(value: unknown): RecyclingStatus {
  const normalised = String(value ?? "INTAKE_CREATED").toUpperCase().replace(/[\s-]+/g, "_");
  const mapped: Record<string, RecyclingStatus> = {
    INTAKE: "INTAKE_CREATED",
    NEW: "INTAKE_CREATED",
    COLLECTION_ARRANGED: "COLLECTION_SCHEDULED",
    COLLECTION_NEEDED: "COLLECTION_SCHEDULED",
    RECEIVED: "COLLECTED",
    PROCESSING: "SECURE_WIPE_PENDING",
    WIPE_PENDING: "SECURE_WIPE_PENDING",
    WIPE_COMPLETE: "SECURE_WIPE_COMPLETE",
    REFURBISH: "REFURBISH_APPROVED",
    REFURBISHMENT: "REFURBISH_APPROVED",
    RECYCLE: "RECYCLE_APPROVED",
    ESG_READY: "ESG_EVIDENCE_READY",
    CLOSED: "COMPLETED"
  };
  const candidate = mapped[normalised] ?? normalised;
  return pipeline.some((item) => item.status === candidate) ? candidate as RecyclingStatus : "INTAKE_CREATED";
}

function statusLabel(value: unknown) {
  const status = normaliseStatus(value);
  return pipeline.find((item) => item.status === status)?.label ?? "Intake Created";
}

function text(record: Record<string, unknown>, key: string, fallback = "Not recorded") {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function recordDevices(record: AdminRecyclingRecord) {
  return numberValue(record.devicesDiverted ?? record.deviceQuantity ?? record.deviceCount);
}

function recordCo2(record: AdminRecyclingRecord) {
  return numberValue(record.estimatedCo2KgAvoided ?? record.estimatedCo2SavedKg);
}

function formatDate(value: unknown) {
  if (!value) return "Not scheduled";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function isOverdue(record: AdminRecyclingRecord) {
  const date = record.collectionDate ? new Date(record.collectionDate) : null;
  if (!date || Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now() && !["COLLECTED", "SECURE_WIPE_PENDING", "SECURE_WIPE_COMPLETE", "ASSESSMENT", "REFURBISH_APPROVED", "RECYCLE_APPROVED", "ESG_EVIDENCE_READY", "COMPLETED"].includes(normaliseStatus(record.status));
}

function recordTitle(record: AdminRecyclingRecord) {
  return record.title ?? record.donorOrganisation ?? record.organisation ?? "Recycling intake";
}

function recyclingCsv(records: AdminRecyclingRecord[]) {
  const columns: Array<[string, (record: AdminRecyclingRecord) => unknown]> = [
    ["Reference", (record) => record.recyclingReference ?? record.id],
    ["Organisation", (record) => record.organisation ?? record.donorOrganisation],
    ["Contact", (record) => record.contactPerson ?? record.customerName],
    ["Status", (record) => statusLabel(record.status)],
    ["Devices", recordDevices],
    ["CO2 kg avoided", recordCo2],
    ["Collection date", (record) => record.collectionDate ?? ""],
    ["Secure wipe", (record) => record.secureWipeRequired ? "Yes" : "No"],
    ["Chain of custody", (record) => record.chainOfCustodyRequired ? "Yes" : "No"],
    ["Decision", (record) => record.reuseRecycleDecision ?? record.reuseDecision ?? ""]
  ];
  const escape = (value: unknown) => {
    const raw = String(value ?? "").replace(/"/g, "\"\"");
    return /[",\n]/.test(raw) ? `"${raw}"` : raw;
  };
  const csv = [
    columns.map(([label]) => escape(label)).join(","),
    ...records.map((record) => columns.map(([, getter]) => escape(getter(record))).join(","))
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sit-digital-access-recycling.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function useRecyclingData() {
  const { token } = useAdminAuth();
  const [records, setRecords] = useState<AdminRecyclingRecord[]>([]);
  const [summary, setSummary] = useState<AdminRecyclingSummary>(emptySummary);
  const [partners, setPartners] = useState<AdminRecyclingPartner[]>([]);
  const [donations, setDonations] = useState<ApiRecord[]>([]);
  const [inventory, setInventory] = useState<ApiRecord[]>([]);
  const [repairs, setRepairs] = useState<ApiRecord[]>([]);
  const [deployments, setDeployments] = useState<ApiRecord[]>([]);
  const [reports, setReports] = useState<ApiRecord[]>([]);
  const [errors, setErrors] = useState<EndpointError[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const calls = [
      { key: "recycling", path: "/admin/recycling", label: "Recycling operations", run: () => adminApi.getRecyclingOperations(token) },
      { key: "partners", path: "/admin/recycling-partners", label: "Recycling partners", run: () => adminApi.listRecyclingPartners(token) },
      { key: "donations", path: "/admin/donations", label: "Donation batches", run: () => adminApi.listDonations(token) },
      { key: "inventory", path: "/admin/inventory", label: "Inventory write-offs", run: () => adminApi.listInventory(token) },
      { key: "repairs", path: "/admin/repairs", label: "Repair write-offs", run: () => adminApi.listRepairTickets(token) },
      { key: "deployments", path: "/admin/deployments", label: "Deployments", run: () => adminApi.listDeployments(token) },
      { key: "reports", path: "/admin/sustainability-reports", label: "Sustainability reports", run: () => adminApi.listSustainabilityReports(token) }
    ] as const;

    const results = await Promise.allSettled(calls.map((call) => call.run()));
    const nextErrors: EndpointError[] = [];

    results.forEach((result, index) => {
      const call = calls[index];
      if (result.status === "rejected") {
        nextErrors.push({
          endpoint: call.label,
          path: call.path,
          message: result.reason instanceof Error ? result.reason.message : "Failed to fetch",
          suggestedFix: "Check the API is running, the admin token is valid, CORS allows this origin, and the endpoint returns the expected /api/v1 wrapper."
        });
        return;
      }

      if (call.key === "recycling") {
        const payload = result.value as AdminRecyclingListResponse;
        setRecords(payload.records ?? []);
        setSummary({ ...emptySummary, ...(payload.summary ?? {}) });
      }
      if (call.key === "partners") setPartners(result.value as AdminRecyclingPartner[]);
      if (call.key === "donations") setDonations(result.value as ApiRecord[]);
      if (call.key === "inventory") setInventory(result.value as ApiRecord[]);
      if (call.key === "repairs") setRepairs(result.value as ApiRecord[]);
      if (call.key === "deployments") setDeployments(result.value as ApiRecord[]);
      if (call.key === "reports") setReports(result.value as ApiRecord[]);
    });

    setErrors(nextErrors);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    token,
    records,
    setRecords,
    summary,
    partners,
    setPartners,
    donations,
    inventory,
    repairs,
    deployments,
    reports,
    errors,
    loading,
    reload: load
  };
}

export function AdminRecyclingWorkspace() {
  const {
    token,
    records,
    setRecords,
    summary,
    partners,
    setPartners,
    donations,
    inventory,
    repairs,
    deployments,
    reports,
    errors,
    loading,
    reload
  } = useRecyclingData();
  const [tab, setTab] = useState<RecyclingTab>("pipeline");
  const [filter, setFilter] = useState<RecyclingFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [selected, setSelected] = useState<AdminRecyclingRecord | null>(null);

  const filtered = useMemo(() => records.filter((record) => {
    if (filter === "all") return true;
    if (filter === "overdue") return isOverdue(record);
    if (filter === "secure-wipe") return record.secureWipeRequired === true || /WIPE/.test(normaliseStatus(record.status));
    if (filter === "esg") return record.esgReportRequired === true || normaliseStatus(record.status) === "ESG_EVIDENCE_READY";
    if (filter === "custody") return record.chainOfCustodyRequired === true;
    if (filter === "reuse") return normaliseStatus(record.status) === "REFURBISH_APPROVED" || /refurbish|reuse/i.test(record.aiRecommendation?.recommendation ?? "");
    if (filter === "recycle") return normaliseStatus(record.status) === "RECYCLE_APPROVED" || /recycle/i.test(record.aiRecommendation?.recommendation ?? "");
    if (filter === "africa") return /suitable|potential/i.test(String(record.africaDeploymentSuitability ?? record.aiRecommendation?.africaDeploymentSuitability ?? ""));
    if (filter === "partner") return Boolean(record.recyclingPartnerId || record.partnerName);
    return true;
  }), [filter, records]);

  const mutateRecord = useCallback(async (id: string, body: EcosystemRecordPayload) => {
    if (!token) return;
    const updated = await adminApi.updateRecycling(token, id, body);
    setRecords((current) => current.map((record) => record.id === updated.id ? updated : record));
    setSelected((current) => current?.id === updated.id ? updated : current);
  }, [setRecords, token]);

  const createRecord = useCallback(async (payload: EcosystemRecordPayload, files: File[]) => {
    if (!token) return;
    const created = await adminApi.createRecycling(token, payload);
    let latest = created;
    for (const file of files) {
      const body = new FormData();
      body.append("file", file);
      body.append("evidenceType", "INTAKE_EVIDENCE");
      latest = await adminApi.uploadRecyclingAttachment(token, created.id, body);
    }
    setRecords((current) => [latest, ...current]);
    setSelected(latest);
    setCreateOpen(false);
  }, [setRecords, token]);

  const createPartner = useCallback(async (payload: EcosystemRecordPayload) => {
    if (!token) return;
    const created = await adminApi.createRecyclingPartner(token, payload);
    setPartners((current) => [created, ...current]);
    setPartnerOpen(false);
  }, [setPartners, token]);

  const runRecommendation = useCallback(async (record: AdminRecyclingRecord) => {
    if (!token) return;
    const updated = await adminApi.recommendRecyclingRoute(token, record.id);
    setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelected(updated);
  }, [setRecords, token]);

  const generateReportPack = useCallback(async (record: AdminRecyclingRecord) => {
    if (!token) return;
    const updated = await adminApi.generateRecyclingReportPack(token, record.id, {
      title: `${record.recyclingReference ?? record.id} donor ESG report pack`
    });
    setRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelected(updated);
  }, [setRecords, token]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_34%),linear-gradient(135deg,#070807,#152019_58%,#2d1606)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name="recycle" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Recycling command centre</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Recycling & Circular Technology Command Centre</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">
              Coordinate corporate recycling, secure data destruction, reuse decisions, ESG evidence, partner performance and Africa deployment readiness.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white hover:bg-flame-600" onClick={() => setCreateOpen(true)}>
              <Icon name="recycle" className="h-4 w-4" />
              Create intake
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => recyclingCsv(filtered)}>
              <Icon name="list" className="h-4 w-4" />
              Export visible
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Records" value={summary.totalRecords} detail="Corporate recycling and circular technology workflows." icon="recycle" />
        <Metric label="Devices diverted" value={summary.devicesDiverted} detail="Devices captured for reuse, parts recovery or compliant recycling." icon="package" />
        <Metric label="CO2 avoided" value={`${summary.estimatedCo2KgAvoided.toLocaleString()}kg`} detail="Estimated circular technology impact." icon="leaf" />
        <Metric label="Processing" value={summary.processing} detail={`${summary.secureWipePending} secure wipe, ${summary.esgEvidenceReady} evidence ready.`} icon="shield" />
      </div>

      {errors.length ? <DegradedBanner errors={errors} onRetry={() => void reload()} /> : null}

      <div className="flex flex-wrap gap-2 rounded-[1.25rem] border border-line bg-white p-2 shadow-card">
        {tabs.map((item) => (
          <button key={item.id} className={cn("inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition", tab === item.id ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink")} onClick={() => setTab(item.id)}>
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button key={item.id} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition", filter === item.id ? "border-flame-500 bg-flame-50 text-flame-700" : "border-line bg-white text-muted hover:border-flame-300")} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === "pipeline" ? <PipelineTab records={filtered} loading={loading} onCreate={() => setCreateOpen(true)} onPartner={() => setPartnerOpen(true)} onSelect={setSelected} onUpdate={mutateRecord} /> : null}
      {tab === "collections" ? <CollectionsTab records={filtered} donations={donations} onSelect={setSelected} onUpdate={mutateRecord} /> : null}
      {tab === "wipe" ? <SecureWipeTab records={filtered} onSelect={setSelected} onUpdate={mutateRecord} /> : null}
      {tab === "decision" ? <DecisionTab records={filtered} repairs={repairs} inventory={inventory} deployments={deployments} onSelect={setSelected} onRecommend={runRecommendation} onUpdate={mutateRecord} /> : null}
      {tab === "evidence" ? <EvidenceTab records={filtered} reports={reports} onSelect={setSelected} onReport={generateReportPack} onExport={() => recyclingCsv(filtered)} /> : null}
      {tab === "partners" ? <PartnersTab records={records} partners={partners} onAdd={() => setPartnerOpen(true)} /> : null}

      {createOpen ? <CreateIntakeDrawer onClose={() => setCreateOpen(false)} onSubmit={createRecord} /> : null}
      {partnerOpen ? <PartnerDrawer onClose={() => setPartnerOpen(false)} onSubmit={createPartner} /> : null}
      {selected ? (
        <DetailDrawer
          record={selected}
          partners={partners}
          onClose={() => setSelected(null)}
          onUpdate={mutateRecord}
          onRecommend={runRecommendation}
          onReport={generateReportPack}
        />
      ) : null}
    </div>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: number | string; detail: string; icon: IconKey }) {
  return (
    <article className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <strong className="text-2xl tracking-tight text-ink">{typeof value === "number" ? value.toLocaleString() : value}</strong>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </article>
  );
}

function DegradedBanner({ errors, onRetry }: { errors: EndpointError[]; onRetry: () => void }) {
  return (
    <section className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold">Recycling data is partially degraded</p>
          <p className="mt-1">The page will keep working with the data that did load.</p>
          <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
        </div>
        <button className="rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white" onClick={onRetry}>Retry</button>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {errors.map((error) => (
          <div key={`${error.endpoint}-${error.path}`} className="rounded-lg bg-white/70 p-3">
            <p className="font-semibold">{error.endpoint}</p>
            <p className="break-all text-xs">{error.path}</p>
            <p className="mt-1 text-xs">{error.message}</p>
            <p className="mt-1 text-xs">{error.suggestedFix}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ onCreate, onPartner }: { onCreate: () => void; onPartner: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name="recycle" className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">No recycling records yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Create an intake from a corporate donation, inventory batch, repair write-off, or recycling partner collection.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onCreate}>Create intake</button>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/donations">Import donation batch</Link>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/inventory">View inventory write-offs</Link>
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={onPartner}>Add recycling partner</button>
      </div>
    </section>
  );
}

function PipelineTab({ records, loading, onCreate, onPartner, onSelect, onUpdate }: { records: AdminRecyclingRecord[]; loading: boolean; onCreate: () => void; onPartner: () => void; onSelect: (record: AdminRecyclingRecord) => void; onUpdate: (id: string, body: EcosystemRecordPayload) => Promise<void> }) {
  if (loading) return <LoadingGrid />;
  if (!records.length) return <EmptyState onCreate={onCreate} onPartner={onPartner} />;

  return (
    <section className="overflow-x-auto rounded-[1.25rem] border border-line bg-white p-4 shadow-card">
      <div className="grid min-w-[1180px] grid-cols-10 gap-3">
        {pipeline.map((column) => {
          const columnRecords = records.filter((record) => normaliseStatus(record.status) === column.status);
          return (
            <div key={column.status} className="rounded-xl bg-paper p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-ink">{column.label}</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-muted">{columnRecords.length}</span>
              </div>
              <div className="mt-3 space-y-3">
                {columnRecords.map((record) => (
                  <button key={record.id} className="w-full rounded-xl border border-line bg-white p-3 text-left shadow-sm transition hover:border-flame-300" onClick={() => onSelect(record)}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{recordTitle(record)}</p>
                      <PriorityBadge priority={record.priority} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{record.recyclingReference ?? record.id}</p>
                    <p className="mt-3 text-xs text-muted">{recordDevices(record)} devices · {formatDate(record.collectionDate)}</p>
                    <p className={cn("mt-2 text-xs font-semibold", isOverdue(record) ? "text-red-600" : "text-muted")}>
                      {isOverdue(record) ? "Collection overdue" : record.secureWipeRequired ? "Secure wipe required" : "On track"}
                    </p>
                  </button>
                ))}
                {column.status !== "COMPLETED" ? (
                  <button className="w-full rounded-xl border border-dashed border-line bg-white/60 px-3 py-2 text-xs font-semibold text-muted hover:border-flame-300" onClick={() => {
                    const first = records[0];
                    if (first) void onUpdate(first.id, { status: column.status });
                  }}>
                    Move selected here
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CollectionsTab({ records, donations, onSelect, onUpdate }: { records: AdminRecyclingRecord[]; donations: ApiRecord[]; onSelect: (record: AdminRecyclingRecord) => void; onUpdate: (id: string, body: EcosystemRecordPayload) => Promise<void> }) {
  const corporateLeads = donations.filter((item) => /CORPORATE_RECYCLING|COMPANY/i.test(`${item.donationType ?? ""} ${item.donorType ?? ""}`));
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <RecordsTable
        title="Collections"
        records={records}
        columns={[
          ["Organisation", (record) => record.organisation ?? record.donorOrganisation ?? "Not recorded"],
          ["Pickup address", (record) => record.pickupAddress ?? record.pickupLocation ?? "Not recorded"],
          ["Contact", (record) => record.contactPerson ?? record.customerName ?? "Not recorded"],
          ["Collection date", (record) => formatDate(record.collectionDate)],
          ["Driver/logistics", (record) => record.driverStatus ?? record.logisticsStatus ?? "Not assigned"]
        ]}
        onSelect={onSelect}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onUpdate(record.id, { status: "COLLECTION_SCHEDULED", logisticsStatus: "Scheduled" })}>
            Schedule
          </button>
        )}
      />
      <section className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-ink">Corporate donor import</h3>
        <p className="mt-2 text-sm text-muted">{corporateLeads.length} corporate recycling leads can be converted from donations.</p>
        <div className="mt-4 space-y-3">
          {corporateLeads.slice(0, 5).map((donation) => (
            <Link key={donation.id} href="/admin/donations" className="block rounded-xl bg-paper p-3 text-sm hover:bg-flame-50">
              <span className="font-semibold text-ink">{text(donation, "organisation", text(donation, "donorName", "Donation lead"))}</span>
              <span className="mt-1 block text-xs text-muted">{text(donation, "status", "New")}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SecureWipeTab({ records, onSelect, onUpdate }: { records: AdminRecyclingRecord[]; onSelect: (record: AdminRecyclingRecord) => void; onUpdate: (id: string, body: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <RecordsTable
      title="Secure wipe"
      records={records}
      columns={[
        ["Reference", (record) => record.recyclingReference ?? record.id],
        ["Wipe status", (record) => record.secureWipeStatus ?? (record.secureWipeRequired ? "Required" : "Not required")],
        ["Data-bearing assets", (record) => String(record.dataBearingDevicesCount ?? record.dataBearingDeviceCount ?? 0)],
        ["Certificate", (record) => record.wipeCertificateStatus ?? "Not generated"],
        ["Technician", (record) => record.assignedTechnician ?? record.assignedTechnicianId ?? "Unassigned"],
        ["Audit trail", (record) => `${(record.timeline ?? []).length} events`]
      ]}
      onSelect={onSelect}
      actions={(record) => (
        <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onUpdate(record.id, { status: "SECURE_WIPE_COMPLETE", secureWipeStatus: "Complete", wipeCertificateStatus: "Generated" })}>
          Mark wiped
        </button>
      )}
    />
  );
}

function DecisionTab({ records, repairs, inventory, deployments, onSelect, onRecommend, onUpdate }: { records: AdminRecyclingRecord[]; repairs: ApiRecord[]; inventory: ApiRecord[]; deployments: ApiRecord[]; onSelect: (record: AdminRecyclingRecord) => void; onRecommend: (record: AdminRecyclingRecord) => Promise<void>; onUpdate: (id: string, body: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <RecordsTable
        title="Reuse vs recycle decision engine"
        records={records}
        columns={[
          ["Reference", (record) => record.recyclingReference ?? record.id],
          ["AI recommendation", (record) => record.aiRecommendation?.recommendation ?? "Not generated"],
          ["Refurb cost", (record) => `£${numberValue(record.refurbishmentCostEstimate ?? record.aiRecommendation?.refurbishmentCostEstimate).toLocaleString()}`],
          ["Condition", (record) => record.deviceCondition ?? "Assessment pending"],
          ["Parts value", (record) => `£${numberValue(record.partsValueEstimate ?? record.aiRecommendation?.partsValueEstimate).toLocaleString()}`],
          ["Africa readiness", (record) => record.africaDeploymentSuitability ?? record.aiRecommendation?.africaDeploymentSuitability ?? "Pending"]
        ]}
        onSelect={onSelect}
        actions={(record) => (
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onRecommend(record)}>Recommend</button>
            <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onUpdate(record.id, { status: "REFURBISH_APPROVED", reuseRecycleDecision: "Refurbish for reuse" })}>Reuse</button>
            <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onUpdate(record.id, { status: "RECYCLE_APPROVED", reuseRecycleDecision: "Recycle responsibly" })}>Recycle</button>
          </div>
        )}
      />
      <section className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-ink">Connected ecosystem</h3>
        <div className="mt-4 grid gap-3">
          <MiniStat label="Repair write-offs" value={repairs.filter((item) => /UNREPAIRABLE|RECYCLE/i.test(String(item.status ?? item.reuseDecision ?? ""))).length} />
          <MiniStat label="Inventory retired" value={inventory.filter((item) => String(item.status ?? "") === "RETIRED").length} />
          <MiniStat label="Deployment links" value={deployments.length} />
        </div>
      </section>
    </div>
  );
}

function EvidenceTab({ records, reports, onSelect, onReport, onExport }: { records: AdminRecyclingRecord[]; reports: ApiRecord[]; onSelect: (record: AdminRecyclingRecord) => void; onReport: (record: AdminRecyclingRecord) => Promise<void>; onExport: () => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <RecordsTable
        title="ESG evidence"
        records={records}
        columns={[
          ["Reference", (record) => record.recyclingReference ?? record.id],
          ["CO2 avoided", (record) => `${recordCo2(record).toLocaleString()}kg`],
          ["Waste diverted", (record) => `${numberValue(record.estimatedWeightKg).toLocaleString()}kg`],
          ["Certificates", (record) => `${(record.reportPacks ?? []).length} packs`],
          ["Photos/docs", (record) => `${(record.attachments ?? []).length} files`],
          ["Donor pack", (record) => record.sustainabilityReportId ? "Generated" : "Pending"]
        ]}
        onSelect={onSelect}
        actions={(record) => (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onReport(record)}>
            Generate pack
          </button>
        )}
      />
      <section className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-ink">Reporting exports</h3>
        <p className="mt-2 text-sm text-muted">{reports.length} sustainability report records exist.</p>
        <button className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onExport}>Export visible CSV</button>
      </section>
    </div>
  );
}

function PartnersTab({ records, partners, onAdd }: { records: AdminRecyclingRecord[]; partners: AdminRecyclingPartner[]; onAdd: () => void }) {
  return (
    <section className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">Recycling partners</h3>
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onAdd}>Add recycling partner</button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {partners.map((partner) => {
          const partnerRecords = records.filter((record) => record.recyclingPartnerId === partner.id || record.partnerName === partner.name);
          return (
            <article key={partner.id} className="rounded-xl border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-ink">{partner.name ?? partner.organisation ?? "Recycling partner"}</h4>
                  <p className="mt-1 text-sm text-muted">{partner.region ?? "Region not set"}</p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{partner.status ?? "ACTIVE"}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <MiniStat label="Collections" value={partnerRecords.length} />
                <MiniStat label="Performance" value={`${numberValue(partner.pickupPerformance).toLocaleString()}%`} />
              </div>
              <p className="mt-4 text-sm text-muted">{partner.notes ?? "Compliance documents and pickup performance will appear here."}</p>
            </article>
          );
        })}
        {!partners.length ? <p className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">No recycling partners yet.</p> : null}
      </div>
    </section>
  );
}

function RecordsTable({ title, records, columns, actions, onSelect }: { title: string; records: AdminRecyclingRecord[]; columns: Array<[string, (record: AdminRecyclingRecord) => React.ReactNode]>; actions?: (record: AdminRecyclingRecord) => React.ReactNode; onSelect: (record: AdminRecyclingRecord) => void }) {
  return (
    <section className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{records.length} records</span>
      </div>
      {!records.length ? (
        <div className="mt-5 rounded-xl border border-dashed border-line bg-paper p-8 text-center text-sm text-muted">No matching recycling records.</div>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {columns.map(([label]) => <th key={label} className="px-3 py-3">{label}</th>)}
                {actions ? <th className="px-3 py-3">Actions</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-paper/70">
                  {columns.map(([label, getter], index) => (
                    <td key={label} className={cn("px-3 py-3 text-muted", index === 0 && "font-semibold text-ink")}>
                      <button className="text-left hover:text-flame-600" onClick={() => onSelect(record)}>{getter(record)}</button>
                    </td>
                  ))}
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

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => <div key={item} className="h-40 animate-pulse rounded-[1.25rem] bg-paper" />)}
    </div>
  );
}

function PriorityBadge({ priority }: { priority?: string | null }) {
  const value = String(priority ?? "MEDIUM").toUpperCase();
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", value === "HIGH" ? "bg-red-50 text-red-700" : value === "LOW" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>{value}</span>;
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}

function CreateIntakeDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: (payload: EcosystemRecordPayload, files: File[]) => Promise<void> }) {
  return (
    <Drawer title="Create recycling intake" onClose={onClose}>
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const files = form.getAll("attachments").filter((file): file is File => file instanceof File && file.size > 0);
        const payload: EcosystemRecordPayload = {
          donorOrganisation: formText(form, "donorOrganisation"),
          organisation: formText(form, "donorOrganisation"),
          contactPerson: formText(form, "contactPerson"),
          email: formText(form, "email"),
          phone: formText(form, "phone"),
          collectionRoute: formText(form, "collectionRoute"),
          pickupAddress: formText(form, "pickupAddress"),
          pickupLocation: formText(form, "pickupAddress"),
          deviceQuantity: numberValue(form.get("deviceQuantity")),
          deviceCount: numberValue(form.get("deviceQuantity")),
          devicesDiverted: numberValue(form.get("deviceQuantity")),
          assetTypes: formText(form, "assetTypes").split(",").map((item) => item.trim()).filter(Boolean),
          dataBearingDeviceCount: numberValue(form.get("dataBearingDeviceCount")),
          estimatedWeightKg: numberValue(form.get("estimatedWeightKg")),
          priority: formText(form, "priority"),
          chainOfCustodyRequired: form.get("chainOfCustodyRequired") === "on",
          secureWipeRequired: form.get("secureWipeRequired") === "on",
          esgReportRequired: form.get("esgReportRequired") === "on",
          notes: formText(form, "notes"),
          status: "INTAKE_CREATED"
        };
        void onSubmit(payload, files);
      }}>
        <Field name="donorOrganisation" label="Donor / organisation" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="contactPerson" label="Contact person" />
          <Field name="email" label="Email" type="email" />
          <Field name="phone" label="Phone" />
          <Select name="collectionRoute" label="Collection route" options={["Corporate pickup", "Partner collection", "Drop-off", "Courier"]} />
        </div>
        <Field name="pickupAddress" label="Pickup address" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="deviceQuantity" label="Device quantity" type="number" />
          <Field name="assetTypes" label="Asset types" placeholder="Laptops, desktops, tablets" />
          <Field name="dataBearingDeviceCount" label="Data-bearing devices count" type="number" />
          <Field name="estimatedWeightKg" label="Estimated weight kg" type="number" />
          <Select name="priority" label="Priority" options={["LOW", "MEDIUM", "HIGH"]} />
        </div>
        <div className="grid gap-3 rounded-xl bg-paper p-4 text-sm">
          <Checkbox name="chainOfCustodyRequired" label="Chain-of-custody required" />
          <Checkbox name="secureWipeRequired" label="Secure wipe required" />
          <Checkbox name="esgReportRequired" label="ESG report required" />
        </div>
        <TextArea name="notes" label="Notes" />
        <label className="block text-sm font-semibold text-ink">
          Photos / documents
          <input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name="attachments" type="file" multiple />
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Create intake</button>
        </div>
      </form>
    </Drawer>
  );
}

function PartnerDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: (payload: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <Drawer title="Add recycling partner" onClose={onClose}>
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void onSubmit({
          name: formText(form, "name"),
          organisation: formText(form, "name"),
          contactPerson: formText(form, "contactPerson"),
          email: formText(form, "email"),
          phone: formText(form, "phone"),
          region: formText(form, "region"),
          pickupPerformance: numberValue(form.get("pickupPerformance")),
          status: "ACTIVE",
          notes: formText(form, "notes")
        });
      }}>
        <Field name="name" label="Recycling partner" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="contactPerson" label="Contact person" />
          <Field name="email" label="Email" type="email" />
          <Field name="phone" label="Phone" />
          <Field name="region" label="Region" />
          <Field name="pickupPerformance" label="Pickup performance %" type="number" />
        </div>
        <TextArea name="notes" label="Compliance notes" />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Add partner</button>
        </div>
      </form>
    </Drawer>
  );
}

function DetailDrawer({ record, partners, onClose, onUpdate, onRecommend, onReport }: { record: AdminRecyclingRecord; partners: AdminRecyclingPartner[]; onClose: () => void; onUpdate: (id: string, body: EcosystemRecordPayload) => Promise<void>; onRecommend: (record: AdminRecyclingRecord) => Promise<void>; onReport: (record: AdminRecyclingRecord) => Promise<void> }) {
  return (
    <Drawer title={recordTitle(record)} onClose={onClose}>
      <div className="space-y-5">
        <div className="rounded-xl bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{record.recyclingReference ?? record.id}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{statusLabel(record.status)}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{record.summary ?? record.notes ?? "No summary recorded."}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onRecommend(record)}>Run recommendation</button>
            <button className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onReport(record)}>Generate report pack</button>
            <button className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onUpdate(record.id, { status: "COMPLETED" })}>Mark completed</button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MiniStat label="Devices diverted" value={recordDevices(record)} />
          <MiniStat label="CO2 avoided" value={`${recordCo2(record).toLocaleString()}kg`} />
          <MiniStat label="Collection" value={formatDate(record.collectionDate)} />
          <MiniStat label="Partner" value={partners.find((partner) => partner.id === record.recyclingPartnerId)?.name ?? record.partnerName ?? "Unassigned"} />
        </div>

        <section>
          <h4 className="font-semibold text-ink">Secure wipe checklist</h4>
          <div className="mt-3 space-y-2">
            {(record.secureWipeChecklist ?? []).map((item, index) => (
              <div key={item.id ?? index} className="flex items-center gap-3 rounded-lg bg-paper p-3 text-sm">
                <span className={cn("flex h-5 w-5 items-center justify-center rounded-full", item.completed ? "bg-green-500 text-white" : "bg-white text-muted")}>
                  {item.completed ? <Icon name="check" className="h-3 w-3" /> : null}
                </span>
                {item.label ?? "Checklist item"}
              </div>
            ))}
            {!record.secureWipeChecklist?.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No checklist recorded.</p> : null}
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-ink">AI recommendation</h4>
          <div className="mt-3 rounded-lg bg-paper p-4 text-sm text-muted">
            <p className="font-semibold text-ink">{record.aiRecommendation?.recommendation ?? record.reuseRecycleDecision ?? "Not generated"}</p>
            <p className="mt-2">{record.aiRecommendation?.summary ?? record.aiRecommendation?.reason ?? "Run the recommendation engine to score reuse, parts recovery, recycling and Africa deployment suitability."}</p>
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-ink">Evidence and report packs</h4>
          <div className="mt-3 space-y-2">
            {(record.attachments ?? []).map((attachment) => (
              <a key={attachment.id} className="flex items-center justify-between gap-3 rounded-lg bg-paper p-3 text-sm hover:bg-flame-50" href={attachment.downloadUrl} target="_blank" rel="noreferrer">
                <span>{attachment.filename}</span>
                <span className="text-xs text-muted">{attachment.evidenceType ?? "Evidence"}</span>
              </a>
            ))}
            {(record.reportPacks ?? []).map((pack) => (
              <div key={pack.id} className="rounded-lg bg-paper p-3 text-sm">
                <p className="font-semibold text-ink">{pack.title ?? "Donor report pack"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pack.pdf?.downloadUrl ? <a className="rounded-full bg-white px-3 py-1 text-xs font-semibold" href={pack.pdf.downloadUrl} target="_blank" rel="noreferrer">PDF</a> : null}
                  {pack.csv?.downloadUrl ? <a className="rounded-full bg-white px-3 py-1 text-xs font-semibold" href={pack.csv.downloadUrl} target="_blank" rel="noreferrer">CSV</a> : null}
                </div>
              </div>
            ))}
            {!record.attachments?.length && !record.reportPacks?.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No evidence files or report packs yet.</p> : null}
          </div>
        </section>

        <section>
          <h4 className="font-semibold text-ink">Timeline</h4>
          <div className="mt-3 space-y-3">
            {(record.timeline ?? []).map((entry) => (
              <div key={entry.id} className="rounded-lg border border-line p-3 text-sm">
                <p className="font-semibold text-ink">{entry.title}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(entry.createdAt)} · {entry.actorEmail ?? "System"}</p>
              </div>
            ))}
            {!record.timeline?.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No timeline activity yet.</p> : null}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

function Drawer({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-4">
      <aside className="flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-line p-5">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button className="rounded-full border border-line p-2 hover:border-flame-300" onClick={onClose} aria-label="Close">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}

function Field({ name, label, type = "text", placeholder, required = false }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} type={type} placeholder={placeholder} required={required} />
    </label>
  );
}

function TextArea({ name, label }: { name: string; label: string }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <textarea className="mt-2 min-h-28 w-full rounded-lg border border-line p-3 text-sm" name={name} />
    </label>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-3">
      <input name={name} type="checkbox" className="h-4 w-4 rounded border-line" />
      <span className="font-semibold text-ink">{label}</span>
    </label>
  );
}
