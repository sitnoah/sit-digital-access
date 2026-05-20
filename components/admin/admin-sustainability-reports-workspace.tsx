"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  SustainabilityReport,
  SustainabilityReportListResponse,
  SustainabilityReportSummary,
  SustainabilityReportType
} from "@/types/sustainability-report";

const emptySummary: SustainabilityReportSummary = {
  totalReports: 0,
  co2EstimatedKg: 0,
  devicesDiverted: 0,
  latestReport: null,
  reuseRate: 0,
  recyclingRate: 0,
  devicesReused: 0,
  devicesRecycled: 0,
  evidenceReadiness: 0
};

const reportTypes: Array<{ value: SustainabilityReportType; label: string }> = [
  { value: "MONTHLY_ESG", label: "Monthly ESG summary" },
  { value: "DONOR_IMPACT", label: "Donor impact report" },
  { value: "CORPORATE_RECYCLING", label: "Corporate recycling report" },
  { value: "AFRICA_DEPLOYMENT", label: "Africa deployment impact report" },
  { value: "BOARD_SUMMARY", label: "Board report" }
];

const dataSources = ["Inventory", "Donations", "Repairs", "Recycling", "Deployments", "Success stories"];
const outputFormats = ["PDF", "CSV", "Board summary"];

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function reportName(report: SustainabilityReport) {
  return report.name ?? report.title ?? "Sustainability report";
}

function reportTypeLabel(value: unknown) {
  const type = String(value ?? "MONTHLY_ESG").toUpperCase();
  return reportTypes.find((item) => item.value === type)?.label ?? type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function reportStatus(value: unknown) {
  const status = String(value ?? "READY").toUpperCase().replace(/[\s-]+/g, "_");
  return status === "GENERATED" ? "READY" : status;
}

function statusClass(status: string) {
  if (status === "READY") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "FAILED") return "border-red-200 bg-red-50 text-red-700";
  if (status === "GENERATING") return "border-orange-200 bg-orange-50 text-orange-700";
  if (status === "ARCHIVED") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-purple-200 bg-purple-50 text-purple-700";
}

function formatDate(value: unknown) {
  if (!value) return "Not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function percent(value: unknown) {
  return `${Math.round(numberValue(value))}%`;
}

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function reportCsv(reports: SustainabilityReport[]) {
  const columns: Array<[string, (report: SustainabilityReport) => unknown]> = [
    ["Report name", reportName],
    ["Period", (report) => `${formatDate(report.periodStart)}-${formatDate(report.periodEnd)}`],
    ["Type", (report) => reportTypeLabel(report.reportType ?? report.type)],
    ["Devices included", (report) => report.devicesIncluded ?? report.devicesDiverted ?? 0],
    ["CO2 avoided", (report) => report.co2AvoidedKg ?? report.co2EstimatedKg ?? report.estimatedCo2SavedKg ?? 0],
    ["Reuse rate", (report) => report.reuseRate ?? 0],
    ["Status", (report) => reportStatus(report.status)],
    ["Created by", (report) => report.createdBy ?? report.createdByEmail ?? "System"],
    ["Created date", (report) => report.createdAt ?? ""]
  ];
  const escape = (value: unknown) => {
    const raw = String(value ?? "").replace(/"/g, "\"\"");
    return /[",\n]/.test(raw) ? `"${raw}"` : raw;
  };
  const csv = [
    columns.map(([label]) => escape(label)).join(","),
    ...reports.map((report) => columns.map(([, getter]) => escape(getter(report))).join(","))
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sit-digital-access-esg-reports.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminSustainabilityReportsWorkspace() {
  const { token } = useAdminAuth();
  const [reports, setReports] = useState<SustainabilityReport[]>([]);
  const [summary, setSummary] = useState<SustainabilityReportSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [selected, setSelected] = useState<SustainabilityReport | null>(null);
  const [filter, setFilter] = useState("ALL");

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: SustainabilityReportListResponse = await adminApi.getSustainabilityReportOperations(token);
      setReports(payload.reports ?? []);
      setSummary({ ...emptySummary, ...(payload.summary ?? {}) });
    } catch (loadError) {
      setReports([]);
      setSummary(emptySummary);
      setError(loadError instanceof Error ? loadError.message : "Failed to fetch sustainability reports.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => reports.filter((report) => filter === "ALL" || reportStatus(report.status) === filter || String(report.reportType ?? report.type).toUpperCase() === filter), [filter, reports]);

  const generateReport = useCallback(async (payload: EcosystemRecordPayload) => {
    if (!token) return;
    const report = await adminApi.generateSustainabilityReport(token, payload);
    setReports((current) => [report, ...current.filter((item) => item.id !== report.id)]);
    setSelected(report);
    setGeneratorOpen(false);
    void load();
  }, [load, token]);

  const regenerate = useCallback(async (report: SustainabilityReport) => {
    await generateReport({
      title: `${reportName(report)} regenerated`,
      reportType: report.reportType ?? report.type ?? "MONTHLY_ESG",
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      dataSources: report.dataSources ?? dataSources,
      outputFormats: report.outputFormats ?? outputFormats,
      generateEstimatedCo2Impact: true,
      generateReuseEvidence: true,
      generateDonorReadySummary: true
    });
  }, [generateReport]);

  const shareReport = useCallback(async (report: SustainabilityReport) => {
    const url = `${window.location.origin}/admin/sustainability-reports?report=${encodeURIComponent(report.id)}`;
    await navigator.clipboard?.writeText(url);
  }, []);

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.24),transparent_34%),linear-gradient(135deg,#080808,#171717_58%,#261204)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name="leaf" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Sustainability reporting</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Sustainability analytics and reuse reporting</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">Generate audit-ready reuse, repair, recycling and Africa deployment impact reports.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white hover:bg-flame-600" onClick={() => setGeneratorOpen(true)}>
              <Icon name="sparkles" className="h-4 w-4" />
              Generate report
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => reportCsv(filtered)}>
              <Icon name="list" className="h-4 w-4" />
              Export ESG pack
            </button>
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" href="/admin/recycling">View recycling data</Link>
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" href="/admin/impact">View impact dashboard</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Reports generated" value={summary.totalReports} icon="leaf" />
        <Kpi title="CO2 avoided" value={`${summary.co2EstimatedKg.toLocaleString()}kg`} icon="chart" />
        <Kpi title="Devices diverted" value={summary.devicesDiverted} icon="recycle" />
        <Kpi title="Devices reused" value={summary.devicesReused} icon="package" />
        <Kpi title="Devices recycled" value={summary.devicesRecycled} icon="database" />
        <Kpi title="Reuse rate" value={`${summary.reuseRate}%`} icon="badge" />
        <Kpi title="Latest report" value={summary.latestReport ? formatDate(summary.latestReport.createdAt) : "None" } icon="list" />
        <Kpi title="ESG evidence readiness" value={`${summary.evidenceReadiness ?? 0}%`} icon="shield" />
      </section>

      {error ? (
        <section className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold">Sustainability report data could not be loaded.</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
            </div>
            <button className="rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white" onClick={() => void load()}>Retry</button>
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Report command queue</h2>
            <p className="text-sm text-muted">Filter audit-ready reports by readiness, type and board/donor output.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", "READY", "DRAFT", "FAILED", "MONTHLY_ESG", "DONOR_IMPACT", "CORPORATE_RECYCLING", "AFRICA_DEPLOYMENT", "BOARD_SUMMARY"].map((item) => (
              <button key={item} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", filter === item ? "border-flame-500 bg-flame-50 text-flame-700" : "border-line text-muted hover:border-flame-300")} onClick={() => setFilter(item)}>
                {item.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? <LoadingGrid /> : null}
      {!loading && filtered.length === 0 ? <EmptyState onGenerate={() => setGeneratorOpen(true)} /> : null}
      {!loading && filtered.length > 0 ? <ReportsTable reports={filtered} onView={setSelected} onRegenerate={regenerate} onShare={shareReport} /> : null}

      <EvidenceReadinessSection summary={summary} />

      {generatorOpen ? <GenerateReportDrawer onClose={() => setGeneratorOpen(false)} onSubmit={generateReport} /> : null}
      {selected ? <ReportDetailDrawer report={selected} onClose={() => setSelected(null)} onRegenerate={regenerate} onShare={shareReport} /> : null}
    </main>
  );
}

function Kpi({ title, value, icon }: { title: string; value: number | string; icon: IconKey }) {
  return (
    <article className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <strong className="text-2xl tracking-tight text-ink">{typeof value === "number" ? value.toLocaleString() : value}</strong>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
    </article>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name="leaf" className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">No sustainability reports yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">Generate your first sustainability report using current inventory, repair, recycling, donation and deployment records.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onGenerate}>Generate report</button>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/recycling">Review recycling records</Link>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/inventory">Review inventory</Link>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/success-stories">Add success story</Link>
      </div>
    </section>
  );
}

function ReportsTable({ reports, onView, onRegenerate, onShare }: { reports: SustainabilityReport[]; onView: (report: SustainabilityReport) => void; onRegenerate: (report: SustainabilityReport) => Promise<void>; onShare: (report: SustainabilityReport) => Promise<void> }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Report name", "Period", "Type", "Devices included", "CO2 avoided", "Reuse rate", "Status", "Created by", "Created date", "Actions"].map((header) => <th key={header} className="px-4 py-3">{header}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {reports.map((report) => {
              const pdfUrl = report.artifacts?.pdf?.downloadUrl;
              const csvUrl = report.artifacts?.csv?.downloadUrl;
              return (
                <tr key={report.id} className="hover:bg-flame-50/35">
                  <td className="px-4 py-4 font-semibold text-ink">{reportName(report)}</td>
                  <td className="px-4 py-4 text-muted">{formatDate(report.periodStart)} - {formatDate(report.periodEnd)}</td>
                  <td className="px-4 py-4 text-muted">{reportTypeLabel(report.reportType ?? report.type)}</td>
                  <td className="px-4 py-4 text-muted">{numberValue(report.devicesIncluded ?? report.devicesDiverted).toLocaleString()}</td>
                  <td className="px-4 py-4 text-muted">{numberValue(report.co2AvoidedKg ?? report.co2EstimatedKg ?? report.estimatedCo2SavedKg).toLocaleString()}kg</td>
                  <td className="px-4 py-4 text-muted">{percent(report.reuseRate)}</td>
                  <td className="px-4 py-4"><span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(reportStatus(report.status)))}>{reportStatus(report.status)}</span></td>
                  <td className="px-4 py-4 text-muted">{report.createdBy ?? report.createdByEmail ?? "System"}</td>
                  <td className="px-4 py-4 text-muted">{formatDate(report.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onView(report)}>View</button>
                      {pdfUrl ? <a className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" href={pdfUrl} target="_blank" rel="noreferrer">Download PDF</a> : <span className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted opacity-60">Download PDF</span>}
                      {csvUrl ? <a className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" href={csvUrl} target="_blank" rel="noreferrer">Export CSV</a> : <span className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted opacity-60">Export CSV</span>}
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onRegenerate(report)}>Regenerate</button>
                      <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white" onClick={() => void onShare(report)}>Share</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EvidenceReadinessSection({ summary }: { summary: SustainabilityReportSummary }) {
  const readiness = summary.evidenceReadiness ?? 0;
  const cards = [
    ["Chain of custody", readiness >= 60, "Custody events from recycling and deployment operations.", "shield" as IconKey],
    ["Secure wipe certificates", readiness >= 50, "Data destruction evidence attached to recycling workflows.", "badge" as IconKey],
    ["Recycling partner evidence", readiness >= 40, "Partner collection and compliance evidence.", "handshake" as IconKey],
    ["Refurbishment evidence", summary.devicesReused > 0, "Repair and reuse records included in ESG packs.", "wrench" as IconKey],
    ["Deployment evidence", summary.devicesReused > 0, "Africa deployment readiness and fulfilment signals.", "truck" as IconKey],
    ["Donor acknowledgement", summary.totalReports > 0, "Donor-ready summary output generated.", "heart" as IconKey]
  ];
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">ESG evidence readiness</h2>
          <p className="text-sm text-muted">Audit signals used by donor, corporate recycling and board reports.</p>
        </div>
        <span className="rounded-full bg-flame-50 px-4 py-2 text-sm font-semibold text-flame-700">{readiness}% ready</span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, ready, detail, icon]) => (
          <article key={String(title)} className="rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-paper text-flame-600"><Icon name={icon as IconKey} className="h-5 w-5" /></span>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold", ready ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>{ready ? "Ready" : "Needs data"}</span>
            </div>
            <h3 className="mt-4 font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GenerateReportDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: (payload: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <Drawer title="Generate Sustainability Report" onClose={onClose}>
      <form className="space-y-5" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void onSubmit({
          title: formText(form, "title"),
          periodStart: formText(form, "periodStart"),
          periodEnd: formText(form, "periodEnd"),
          reportType: formText(form, "reportType"),
          dataSources: form.getAll("dataSources").map(String),
          outputFormats: form.getAll("outputFormats").map(String),
          generateEstimatedCo2Impact: form.get("generateEstimatedCo2Impact") === "on",
          generateReuseEvidence: form.get("generateReuseEvidence") === "on",
          generateDonorReadySummary: form.get("generateDonorReadySummary") === "on"
        });
      }}>
        <Field name="title" label="Report name" placeholder="May ESG donor and board pack" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="periodStart" label="Reporting period start" type="date" required />
          <Field name="periodEnd" label="Reporting period end" type="date" required />
        </div>
        <label className="block text-sm font-semibold text-ink">
          Report type
          <select name="reportType" className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
            {reportTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </label>
        <CheckboxGroup title="Include data sources" name="dataSources" items={dataSources} />
        <CheckboxGroup title="Output format" name="outputFormats" items={outputFormats} />
        <div className="grid gap-3 rounded-xl bg-paper p-4 text-sm">
          <Toggle name="generateEstimatedCo2Impact" label="Generate estimated CO2 impact" defaultChecked />
          <Toggle name="generateReuseEvidence" label="Generate reuse evidence" defaultChecked />
          <Toggle name="generateDonorReadySummary" label="Generate donor-ready summary" defaultChecked />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Generate report</button>
        </div>
      </form>
    </Drawer>
  );
}

function ReportDetailDrawer({ report, onClose, onRegenerate, onShare }: { report: SustainabilityReport; onClose: () => void; onRegenerate: (report: SustainabilityReport) => Promise<void>; onShare: (report: SustainabilityReport) => Promise<void> }) {
  const artifacts = report.artifacts ?? {};
  const sourceCounts = report.reportData?.sourceCounts as Record<string, unknown> | undefined;
  return (
    <Drawer title={reportName(report)} onClose={onClose}>
      <div className="space-y-5">
        <section className="rounded-xl bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{reportTypeLabel(report.reportType ?? report.type)}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{reportStatus(report.status)}</h3>
          <p className="mt-2 text-sm text-muted">{formatDate(report.periodStart)} - {formatDate(report.periodEnd)} · {report.createdBy ?? report.createdByEmail ?? "System"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {artifacts.pdf?.downloadUrl ? <a className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold" href={artifacts.pdf.downloadUrl} target="_blank" rel="noreferrer">Download PDF</a> : null}
            {artifacts.csv?.downloadUrl ? <a className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold" href={artifacts.csv.downloadUrl} target="_blank" rel="noreferrer">Export CSV</a> : null}
            <button className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold" onClick={() => void onRegenerate(report)}>Regenerate</button>
            <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white" onClick={() => void onShare(report)}>Share</button>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="Devices included" value={numberValue(report.devicesIncluded ?? report.devicesDiverted)} />
          <MiniStat label="CO2 avoided" value={`${numberValue(report.co2AvoidedKg ?? report.co2EstimatedKg ?? report.estimatedCo2SavedKg).toLocaleString()}kg`} />
          <MiniStat label="Reuse rate" value={percent(report.reuseRate)} />
          <MiniStat label="Evidence readiness" value={percent(report.evidenceReadiness)} />
        </div>
        <section>
          <h4 className="font-semibold text-ink">Source breakdown</h4>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {Object.entries(sourceCounts ?? {}).map(([key, value]) => <MiniStat key={key} label={key} value={numberValue(value)} />)}
            {!sourceCounts ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No source breakdown stored.</p> : null}
          </div>
        </section>
        <section>
          <h4 className="font-semibold text-ink">Audit trail</h4>
          <div className="mt-3 space-y-2">
            {(report.timeline ?? []).map((entry, index) => {
              const item = typeof entry === "object" && entry ? entry as Record<string, unknown> : {};
              return <div key={String(item.id ?? index)} className="rounded-lg border border-line p-3 text-sm"><p className="font-semibold text-ink">{String(item.title ?? "Report activity")}</p><p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)}</p></div>;
            })}
            {!report.timeline?.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No timeline activity recorded.</p> : null}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

function LoadingGrid() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-40 animate-pulse rounded-[1.25rem] bg-paper" />)}</div>;
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-lg bg-paper p-3"><p className="text-xs capitalize text-muted">{label}</p><p className="mt-1 font-semibold text-ink">{typeof value === "number" ? value.toLocaleString() : value}</p></div>;
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
  return <label className="block text-sm font-semibold text-ink">{label}<input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} type={type} placeholder={placeholder} required={required} /></label>;
}

function CheckboxGroup({ title, name, items }: { title: string; name: string; items: string[] }) {
  return (
    <fieldset className="rounded-xl border border-line p-4">
      <legend className="px-2 text-sm font-semibold text-ink">{title}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((item) => <Toggle key={item} name={name} label={item} value={item} defaultChecked />)}
      </div>
    </fieldset>
  );
}

function Toggle({ name, label, value = "on", defaultChecked = false }: { name: string; label: string; value?: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-3 text-sm font-semibold text-ink"><input className="h-4 w-4 rounded border-line" name={name} value={value} type="checkbox" defaultChecked={defaultChecked} />{label}</label>;
}
