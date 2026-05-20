"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL, type ApiRecord, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  TrainingCohort,
  TrainingCohortListResponse,
  TrainingCohortStatus,
  TrainingCohortSummary,
  TrainingDeliveryMode,
  TrainingExportResponse,
  TrainingLearner,
  TrainingProgrammeType
} from "@/types/training";

const emptySummary: TrainingCohortSummary = {
  totalCohorts: 0,
  totalLearners: 0,
  activeCohorts: 0,
  certificationReady: 0,
  sponsorFunded: 0,
  schoolsLinked: 0,
  completionRate: 0,
  attendanceRisk: 0
};

const tabs = [
  "All cohorts",
  "Draft",
  "Recruiting",
  "Active",
  "Certification-ready",
  "Completed",
  "Sponsor-funded",
  "School linked",
  "At risk"
] as const;

type CohortTab = (typeof tabs)[number];

const programmeTypes: Array<{ value: TrainingProgrammeType; label: string }> = [
  { value: "DIGITAL_LITERACY", label: "Digital literacy" },
  { value: "AI_LITERACY", label: "AI literacy" },
  { value: "CYBERSECURITY_AWARENESS", label: "Cybersecurity awareness" },
  { value: "TEACHER_ENABLEMENT", label: "Teacher enablement" },
  { value: "DEVICE_READINESS", label: "Device readiness" },
  { value: "EMPLOYABILITY_SKILLS", label: "Employability skills" },
  { value: "REPAIR_TECHNICIAN_TRAINING", label: "Repair technician training" },
  { value: "COMMUNITY_HUB_TRAINING", label: "Community hub training" }
];

const audiences = [
  "Students",
  "Teachers",
  "Youth",
  "Women entrepreneurs",
  "NGO staff",
  "School administrators",
  "Repair technicians",
  "Community members"
];

const deliveryModes: Array<{ value: TrainingDeliveryMode; label: string }> = [
  { value: "IN_PERSON", label: "In-person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" }
];

const statuses: Array<{ value: TrainingCohortStatus; label: string }> = [
  { value: "DRAFT", label: "Draft" },
  { value: "RECRUITING", label: "Recruiting" },
  { value: "ACTIVE", label: "Active" },
  { value: "CERTIFICATION_READY", label: "Certification-ready" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "AT_RISK", label: "At risk" }
];

type ConnectedRecords = {
  deployments: ApiRecord[];
  inventory: ApiRecord[];
};

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function cohortName(cohort: TrainingCohort) {
  return cohort.name ?? cohort.title ?? cohort.cohortName ?? "Training cohort";
}

function cohortStatus(value: unknown): TrainingCohortStatus {
  const status = String(value ?? "DRAFT").toUpperCase().replace(/[\s-]+/g, "_");
  if (status === "PLANNING" || status === "PLANNED") return "DRAFT";
  if (status === "RUNNING" || status === "LIVE") return "ACTIVE";
  if (status === "READY_FOR_CERTIFICATION") return "CERTIFICATION_READY";
  if (status === "DRAFT" || status === "RECRUITING" || status === "ACTIVE" || status === "CERTIFICATION_READY" || status === "COMPLETED" || status === "ARCHIVED" || status === "AT_RISK") return status;
  return "DRAFT";
}

function programmeLabel(value: unknown) {
  const type = String(value ?? "DIGITAL_LITERACY").toUpperCase().replace(/[\s-/]+/g, "_");
  return programmeTypes.find((item) => item.value === type)?.label ?? "Digital literacy";
}

function deliveryLabel(value: unknown) {
  const mode = String(value ?? "IN_PERSON").toUpperCase().replace(/[\s-]+/g, "_");
  return deliveryModes.find((item) => item.value === mode)?.label ?? "In-person";
}

function statusClass(status: TrainingCohortStatus) {
  if (status === "ACTIVE") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "CERTIFICATION_READY") return "border-flame-200 bg-flame-50 text-flame-700";
  if (status === "AT_RISK") return "border-red-200 bg-red-50 text-red-700";
  if (status === "COMPLETED") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "ARCHIVED") return "border-slate-200 bg-slate-100 text-slate-600";
  if (status === "RECRUITING") return "border-purple-200 bg-purple-50 text-purple-700";
  return "border-line bg-paper text-muted";
}

function formatDate(value: unknown) {
  if (!value) return "Not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function splitList(value: string) {
  return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
}

function recordLabel(record: ApiRecord) {
  return String(record.title ?? record.name ?? record.assetTag ?? record.organisation ?? record.id);
}

function learners(cohort: TrainingCohort): TrainingLearner[] {
  return Array.isArray(cohort.learnerRegister) ? cohort.learnerRegister : [];
}

function readinessItems(cohort: TrainingCohort) {
  const existing = Array.isArray(cohort.certificationChecklist) ? cohort.certificationChecklist : [];
  if (existing.length) {
    return existing.map((item, index) => {
      const object = typeof item === "object" && item ? item as Record<string, unknown> : {};
      return {
        id: String(object.id ?? index),
        label: String(object.label ?? "Certification step"),
        completed: object.completed === true
      };
    });
  }
  return [
    { id: "learner-register", label: "Learner register complete", completed: learners(cohort).length > 0 },
    { id: "attendance", label: "Minimum attendance reached", completed: numberValue(cohort.attendanceRate) >= 75 },
    { id: "assessment", label: "Assessment completed", completed: numberValue(cohort.completionRate) >= 80 },
    { id: "trainer-approval", label: "Trainer approval complete", completed: Boolean(cohort.trainerNotes) },
    { id: "sponsor-report", label: "Sponsor report ready", completed: !cohort.sponsor },
    { id: "template", label: "Certificate template selected", completed: cohort.certificationEnabled === true },
    { id: "generated", label: "Certificates generated", completed: Boolean(cohort.certificateArtifacts?.pdf) }
  ];
}

function downloadExport(payload: TrainingExportResponse) {
  const url = URL.createObjectURL(new Blob([payload.content], { type: payload.contentType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = payload.filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminTrainingCohortsWorkspace() {
  const { token } = useAdminAuth();
  const [cohorts, setCohorts] = useState<TrainingCohort[]>([]);
  const [summary, setSummary] = useState<TrainingCohortSummary>(emptySummary);
  const [connected, setConnected] = useState<ConnectedRecords>({ deployments: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CohortTab>("All cohorts");
  const [drawer, setDrawer] = useState<{ mode: "create" | "edit"; cohort?: TrainingCohort } | null>(null);
  const [selected, setSelected] = useState<TrainingCohort | null>(null);
  const [importCohort, setImportCohort] = useState<TrainingCohort | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const settled = await Promise.allSettled([
      adminApi.getTrainingCohortOperations(token),
      adminApi.listDeployments(token),
      adminApi.listInventory(token)
    ]);
    if (settled[0].status === "fulfilled") {
      const payload: TrainingCohortListResponse = settled[0].value;
      setCohorts(payload.cohorts ?? []);
      setSummary({ ...emptySummary, ...(payload.summary ?? {}) });
    } else {
      setCohorts([]);
      setSummary(emptySummary);
      setError("Training cohort data could not be loaded. You can retry or create a cohort when the API is available.");
    }
    setConnected({
      deployments: settled[1].status === "fulfilled" ? settled[1].value : [],
      inventory: settled[2].status === "fulfilled" ? settled[2].value : []
    });
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return cohorts.filter((cohort) => {
      const status = cohortStatus(cohort.status);
      const readiness = numberValue(cohort.certificationReadiness);
      const matchesTab =
        activeTab === "All cohorts" ||
        (activeTab === "Draft" && status === "DRAFT") ||
        (activeTab === "Recruiting" && status === "RECRUITING") ||
        (activeTab === "Active" && status === "ACTIVE") ||
        (activeTab === "Certification-ready" && (status === "CERTIFICATION_READY" || readiness >= 80)) ||
        (activeTab === "Completed" && status === "COMPLETED") ||
        (activeTab === "Sponsor-funded" && Boolean(cohort.sponsor)) ||
        (activeTab === "School linked" && Boolean(cohort.hubOrSchool ?? cohort.organisation)) ||
        (activeTab === "At risk" && (status === "AT_RISK" || numberValue(cohort.attendanceRate) < 70));
      if (!matchesTab) return false;
      if (!search) return true;
      return [
        cohortName(cohort),
        programmeLabel(cohort.programmeType ?? cohort.trainingPathway),
        cohort.audience,
        cohort.country,
        cohort.hubOrSchool,
        cohort.organisation,
        cohort.sponsor,
        cohort.trainer,
        cohort.owner,
        cohort.assignedOwner
      ].join(" ").toLowerCase().includes(search);
    });
  }, [activeTab, cohorts, query]);

  const upsert = useCallback((cohort: TrainingCohort) => {
    setCohorts((current) => [cohort, ...current.filter((item) => item.id !== cohort.id)]);
    setSelected((current) => current?.id === cohort.id ? cohort : current);
    void load();
  }, [load]);

  const saveCohort = useCallback(async (payload: EcosystemRecordPayload, cohort?: TrainingCohort) => {
    if (!token) return;
    const saved = cohort
      ? await adminApi.updateTrainingCohort(token, cohort.id, payload)
      : await adminApi.createTrainingCohort(token, payload);
    upsert(saved);
    setDrawer(null);
  }, [token, upsert]);

  const runAction = useCallback(async (key: string, action: () => Promise<TrainingCohort>) => {
    setBusyAction(key);
    setActionError(null);
    try {
      upsert(await action());
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Training cohort action failed.");
    } finally {
      setBusyAction(null);
    }
  }, [upsert]);

  const duplicateCohort = useCallback(async (cohort: TrainingCohort) => {
    if (!token) return;
    await runAction(`duplicate-${cohort.id}`, async () => adminApi.createTrainingCohort(token, {
      name: `${cohortName(cohort)} copy`,
      programmeType: cohort.programmeType ?? "DIGITAL_LITERACY",
      trainingPathway: cohort.trainingPathway,
      audience: cohort.audience,
      country: cohort.country,
      hubOrSchool: cohort.hubOrSchool,
      organisation: cohort.organisation,
      deliveryMode: cohort.deliveryMode ?? "IN_PERSON",
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      targetLearners: cohort.targetLearners ?? cohort.learnerCount ?? 0,
      trainer: cohort.trainer,
      sponsor: cohort.sponsor,
      linkedDeploymentId: cohort.linkedDeploymentId,
      linkedDeviceBatchId: cohort.linkedDeviceBatchId,
      certificationEnabled: cohort.certificationEnabled === true,
      attendanceTrackingEnabled: cohort.attendanceTrackingEnabled === true,
      notes: cohort.notes,
      status: "DRAFT"
    }));
  }, [runAction, token]);

  const exportRegister = useCallback(async (cohort: TrainingCohort) => {
    if (!token) return;
    setBusyAction(`export-${cohort.id}`);
    setActionError(null);
    try {
      downloadExport(await adminApi.exportTrainingRegister(token, cohort.id));
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Register export failed.");
    } finally {
      setBusyAction(null);
    }
  }, [token]);

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_35%),linear-gradient(135deg,#080808,#171717_58%,#271303)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name="graduation" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Training operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Digital skills cohorts and certification readiness</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">
              Plan, monitor and certify training cohorts for schools, community hubs, NGOs, sponsors and Africa deployment programmes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white hover:bg-flame-600" onClick={() => setDrawer({ mode: "create" })}>
              <Icon name="graduation" className="h-4 w-4" />
              Create cohort
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => cohorts[0] ? setImportCohort(cohorts[0]) : setDrawer({ mode: "create" })}>
              <Icon name="users" className="h-4 w-4" />
              Import learners
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => setDrawer({ mode: "create" })}>
              <Icon name="handshake" className="h-4 w-4" />
              Sponsor a cohort
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => cohorts[0] && token ? void runAction(`certificates-${cohorts[0].id}`, () => adminApi.generateTrainingCertificates(token, cohorts[0].id)) : setDrawer({ mode: "create" })}>
              <Icon name="badge" className="h-4 w-4" />
              Generate certificates
            </button>
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" href="/admin/impact">
              <Icon name="chart" className="h-4 w-4" />
              View learning impact
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Total cohorts" value={summary.totalCohorts} icon="graduation" />
        <Kpi title="Learners" value={summary.totalLearners} icon="users" />
        <Kpi title="Active cohorts" value={summary.activeCohorts} icon="check" />
        <Kpi title="Certification-ready" value={summary.certificationReady} icon="badge" />
        <Kpi title="Sponsor-funded" value={summary.sponsorFunded} icon="handshake" />
        <Kpi title="Schools linked" value={summary.schoolsLinked} icon="school" />
        <Kpi title="Completion rate" value={`${summary.completionRate}%`} icon="chart" />
        <Kpi title="Attendance risk" value={summary.attendanceRisk} icon="bell" />
      </section>

      {error ? <StatusBanner title="Training data could not be loaded." message={error} onRetry={() => void load()} /> : null}
      {actionError ? <StatusBanner title="Training action needs attention." message={actionError} onRetry={() => setActionError(null)} retryLabel="Dismiss" /> : null}

      <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Cohort lifecycle pipeline</h2>
            <p className="text-sm text-muted">Track recruitment, delivery, certification readiness, sponsor reporting and attendance risk.</p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cohorts, schools, sponsors..."
              className="min-h-11 w-full rounded-full border border-line px-4 text-sm outline-none focus:border-flame-400 lg:w-80"
            />
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", activeTab === tab ? "border-flame-500 bg-flame-50 text-flame-700" : "border-line text-muted hover:border-flame-300")}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? <LoadingGrid /> : null}
      {!loading && filtered.length === 0 ? <EmptyState onCreate={() => setDrawer({ mode: "create" })} /> : null}
      {!loading && filtered.length > 0 ? (
        <CohortTable
          cohorts={filtered}
          busyAction={busyAction}
          onView={setSelected}
          onEdit={(cohort) => setDrawer({ mode: "edit", cohort })}
          onDuplicate={duplicateCohort}
          onImport={setImportCohort}
          onMarkActive={(cohort) => token ? runAction(`active-${cohort.id}`, () => adminApi.markTrainingCohortActive(token, cohort.id)) : Promise.resolve()}
          onGenerate={(cohort) => token ? runAction(`certificates-${cohort.id}`, () => adminApi.generateTrainingCertificates(token, cohort.id)) : Promise.resolve()}
          onExport={exportRegister}
          onArchive={(cohort) => token ? runAction(`archive-${cohort.id}`, () => adminApi.updateTrainingCohort(token, cohort.id, { status: "ARCHIVED" })) : Promise.resolve()}
        />
      ) : null}

      {drawer ? <CohortDrawer mode={drawer.mode} cohort={drawer.cohort} connected={connected} onClose={() => setDrawer(null)} onSubmit={saveCohort} /> : null}
      {importCohort ? (
        <ImportLearnersDrawer
          cohort={importCohort}
          onClose={() => setImportCohort(null)}
          onImported={(cohort) => {
            upsert(cohort);
            setImportCohort(null);
          }}
        />
      ) : null}
      {selected ? (
        <CohortDetailDrawer
          cohort={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setDrawer({ mode: "edit", cohort: selected });
            setSelected(null);
          }}
          onComplete={(cohort) => token ? runAction(`complete-${cohort.id}`, () => adminApi.completeTrainingCohort(token, cohort.id)) : Promise.resolve()}
          onGenerate={(cohort) => token ? runAction(`certificates-${cohort.id}`, () => adminApi.generateTrainingCertificates(token, cohort.id)) : Promise.resolve()}
          onExport={exportRegister}
        />
      ) : null}
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

function StatusBanner({ title, message, onRetry, retryLabel = "Retry" }: { title: string; message: string; onRetry: () => void; retryLabel?: string }) {
  return (
    <section className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1">{message}</p>
          <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
        </div>
        <button className="rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white" onClick={onRetry}>{retryLabel}</button>
      </div>
    </section>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name="graduation" className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">No training cohorts yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Create your first training cohort for schools, sponsors, community hubs or deployment programmes.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onCreate}>Create cohort</button>
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={onCreate}>Import learners</button>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/deployments">Link deployment</Link>
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={onCreate}>Sponsor a cohort</button>
      </div>
    </section>
  );
}

function CohortTable({
  cohorts,
  busyAction,
  onView,
  onEdit,
  onDuplicate,
  onImport,
  onMarkActive,
  onGenerate,
  onExport,
  onArchive
}: {
  cohorts: TrainingCohort[];
  busyAction: string | null;
  onView: (cohort: TrainingCohort) => void;
  onEdit: (cohort: TrainingCohort) => void;
  onDuplicate: (cohort: TrainingCohort) => Promise<void>;
  onImport: (cohort: TrainingCohort) => void;
  onMarkActive: (cohort: TrainingCohort) => Promise<void>;
  onGenerate: (cohort: TrainingCohort) => Promise<void>;
  onExport: (cohort: TrainingCohort) => Promise<void>;
  onArchive: (cohort: TrainingCohort) => Promise<void>;
}) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1420px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Cohort name", "Programme", "Audience", "Country / hub", "Learners", "Start date", "End date", "Status", "Sponsor", "Certification readiness", "Owner", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {cohorts.map((cohort) => {
              const status = cohortStatus(cohort.status);
              return (
                <tr key={cohort.id} className="hover:bg-flame-50/35">
                  <td className="px-4 py-4">
                    <button className="max-w-xs text-left font-semibold text-ink hover:text-flame-700" onClick={() => onView(cohort)}>{cohortName(cohort)}</button>
                    <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-muted">{cohort.notes ?? cohort.summary}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">{programmeLabel(cohort.programmeType ?? cohort.trainingPathway)}</td>
                  <td className="px-4 py-4 text-muted">{cohort.audience ?? "Not set"}</td>
                  <td className="px-4 py-4 text-muted">{cohort.country ?? "Not set"} · {cohort.hubOrSchool ?? cohort.organisation ?? "No hub"}</td>
                  <td className="px-4 py-4 font-semibold text-ink">{numberValue(cohort.enrolledLearners ?? cohort.learnerCount)} / {numberValue(cohort.targetLearners ?? cohort.learnerCount)}</td>
                  <td className="px-4 py-4 text-muted">{formatDate(cohort.startDate)}</td>
                  <td className="px-4 py-4 text-muted">{formatDate(cohort.endDate)}</td>
                  <td className="px-4 py-4"><span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(status))}>{status.replaceAll("_", " ")}</span></td>
                  <td className="px-4 py-4 text-muted">{cohort.sponsor ?? "None"}</td>
                  <td className="px-4 py-4"><Readiness value={numberValue(cohort.certificationReadiness)} /></td>
                  <td className="px-4 py-4 text-muted">{cohort.owner ?? cohort.assignedOwner ?? cohort.trainer ?? "Unassigned"}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onView(cohort)}>View</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onEdit(cohort)}>Edit</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `duplicate-${cohort.id}`} onClick={() => void onDuplicate(cohort)}>Duplicate</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onImport(cohort)}>Import learners</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `active-${cohort.id}`} onClick={() => void onMarkActive(cohort)}>Mark active</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `certificates-${cohort.id}`} onClick={() => void onGenerate(cohort)}>Generate certificates</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `export-${cohort.id}`} onClick={() => void onExport(cohort)}>Export register</button>
                      <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50" disabled={busyAction === `archive-${cohort.id}`} onClick={() => void onArchive(cohort)}>Archive</button>
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

function CohortDrawer({ mode, cohort, connected, onClose, onSubmit }: { mode: "create" | "edit"; cohort?: TrainingCohort; connected: ConnectedRecords; onClose: () => void; onSubmit: (payload: EcosystemRecordPayload, cohort?: TrainingCohort) => Promise<void> }) {
  return (
    <Drawer title={mode === "edit" ? "Edit training cohort" : "Create training cohort"} onClose={onClose}>
      <form className="space-y-5" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void onSubmit({
          name: formText(form, "name"),
          title: formText(form, "name"),
          cohortName: formText(form, "name"),
          programmeType: formText(form, "programmeType"),
          trainingPathway: programmeLabel(formText(form, "programmeType")),
          audience: formText(form, "audience"),
          country: formText(form, "country"),
          hubOrSchool: formText(form, "hubOrSchool"),
          organisation: formText(form, "hubOrSchool"),
          deliveryMode: formText(form, "deliveryMode"),
          startDate: formText(form, "startDate"),
          endDate: formText(form, "endDate"),
          targetLearners: Number(formText(form, "targetLearners") || 0),
          trainer: formText(form, "trainer"),
          sponsor: formText(form, "sponsor"),
          linkedDeploymentId: formText(form, "linkedDeploymentId"),
          linkedDeviceBatchId: formText(form, "linkedDeviceBatchId"),
          certificationEnabled: form.get("certificationEnabled") === "on",
          attendanceTrackingEnabled: form.get("attendanceTrackingEnabled") === "on",
          notes: formText(form, "notes"),
          learningOutcomes: splitList(formText(form, "learningOutcomes")),
          owner: formText(form, "owner"),
          assignedOwner: formText(form, "owner"),
          status: formText(form, "status")
        }, cohort);
      }}>
        <Field name="name" label="Cohort name" defaultValue={cohortName(cohort ?? ({ id: "", name: "" } as TrainingCohort))} required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="programmeType" label="Programme type" options={programmeTypes} defaultValue={String(cohort?.programmeType ?? "DIGITAL_LITERACY")} />
          <Select name="audience" label="Audience" options={audiences.map((audience) => ({ value: audience, label: audience }))} defaultValue={String(cohort?.audience ?? "Students")} />
          <Field name="country" label="Country" defaultValue={String(cohort?.country ?? "")} />
          <Field name="hubOrSchool" label="Hub / school / organisation" defaultValue={String(cohort?.hubOrSchool ?? cohort?.organisation ?? "")} />
          <Select name="deliveryMode" label="Delivery mode" options={deliveryModes} defaultValue={String(cohort?.deliveryMode ?? "IN_PERSON")} />
          <Select name="status" label="Status" options={statuses} defaultValue={cohortStatus(cohort?.status)} />
          <Field name="startDate" label="Start date" type="date" defaultValue={String(cohort?.startDate ?? "")} />
          <Field name="endDate" label="End date" type="date" defaultValue={String(cohort?.endDate ?? "")} />
          <Field name="targetLearners" label="Target learners" type="number" defaultValue={String(cohort?.targetLearners ?? cohort?.learnerCount ?? 0)} />
          <Field name="trainer" label="Trainer / facilitator" defaultValue={String(cohort?.trainer ?? "")} />
          <Field name="sponsor" label="Sponsor" defaultValue={String(cohort?.sponsor ?? "")} />
          <Field name="owner" label="Owner" defaultValue={String(cohort?.owner ?? cohort?.assignedOwner ?? "")} />
        </div>
        <RecordSelect name="linkedDeploymentId" label="Linked deployment" records={connected.deployments} defaultValue={String(cohort?.linkedDeploymentId ?? "")} />
        <RecordSelect name="linkedDeviceBatchId" label="Linked device batch" records={connected.inventory} defaultValue={String(cohort?.linkedDeviceBatchId ?? "")} />
        <div className="grid gap-3 rounded-xl bg-paper p-4 text-sm">
          <Toggle name="certificationEnabled" label="Certification enabled" defaultChecked={cohort?.certificationEnabled === true} />
          <Toggle name="attendanceTrackingEnabled" label="Attendance tracking enabled" defaultChecked={cohort?.attendanceTrackingEnabled === true} />
        </div>
        <Textarea name="learningOutcomes" label="Learning outcomes" rows={3} defaultValue={Array.isArray(cohort?.learningOutcomes) ? cohort.learningOutcomes.map(String).join(", ") : ""} />
        <Textarea name="notes" label="Notes" rows={4} defaultValue={String(cohort?.notes ?? "")} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">{mode === "edit" ? "Save changes" : "Create cohort"}</button>
        </div>
      </form>
    </Drawer>
  );
}

function ImportLearnersDrawer({ cohort, onClose, onImported }: { cohort: TrainingCohort; onClose: () => void; onImported: (cohort: TrainingCohort) => void }) {
  const { token } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  return (
    <Drawer title={`Import learners · ${cohortName(cohort)}`} onClose={onClose}>
      <form className="space-y-5" onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;
        const form = new FormData(event.currentTarget);
        setError(null);
        try {
          onImported(await adminApi.importTrainingLearners(token, cohort.id, form));
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Learner import failed.");
        }
      }}>
        <p className="rounded-xl bg-paper p-4 text-sm leading-6 text-muted">
          Upload a CSV with columns such as name, email, phone, attendanceRate, completionRate, assessmentStatus and certificateEligible.
        </p>
        <label className="block text-sm font-semibold text-ink">
          Learner CSV
          <input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name="file" type="file" accept=".csv,text/csv" required />
        </label>
        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Import learners</button>
        </div>
      </form>
    </Drawer>
  );
}

function CohortDetailDrawer({ cohort, onClose, onEdit, onComplete, onGenerate, onExport }: { cohort: TrainingCohort; onClose: () => void; onEdit: () => void; onComplete: (cohort: TrainingCohort) => Promise<void>; onGenerate: (cohort: TrainingCohort) => Promise<void>; onExport: (cohort: TrainingCohort) => Promise<void> }) {
  const items = readinessItems(cohort);
  return (
    <Drawer title={cohortName(cohort)} onClose={onClose}>
      <div className="space-y-5">
        <section className="rounded-xl bg-paper p-4">
          <div className="flex flex-wrap gap-2">
            <span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(cohortStatus(cohort.status)))}>{cohortStatus(cohort.status).replaceAll("_", " ")}</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">{programmeLabel(cohort.programmeType ?? cohort.trainingPathway)}</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">{deliveryLabel(cohort.deliveryMode)}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{cohort.notes ?? "No training notes stored yet."}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white" onClick={onEdit}>Edit cohort</button>
            <button className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink" onClick={() => void onGenerate(cohort)}>Generate certificates</button>
            <button className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink" onClick={() => void onExport(cohort)}>Export register</button>
            <button className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink" onClick={() => void onComplete(cohort)}>Complete</button>
          </div>
        </section>
        <div className="grid gap-3 sm:grid-cols-2">
          <MiniStat label="Learners" value={`${numberValue(cohort.enrolledLearners ?? cohort.learnerCount)} / ${numberValue(cohort.targetLearners ?? cohort.learnerCount)}`} />
          <MiniStat label="Attendance" value={`${numberValue(cohort.attendanceRate)}%`} />
          <MiniStat label="Completion" value={`${numberValue(cohort.completionRate)}%`} />
          <MiniStat label="Certification readiness" value={`${numberValue(cohort.certificationReadiness)}%`} />
        </div>
        <section>
          <h3 className="font-semibold text-ink">Certification readiness engine</h3>
          <div className="mt-3 grid gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-line p-3 text-sm">
                <span className="font-semibold text-ink">{item.label}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold", item.completed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600")}>{item.completed ? "Done" : "Pending"}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Learner register</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
                <tr><th className="px-3 py-2">Learner</th><th className="px-3 py-2">Attendance</th><th className="px-3 py-2">Completion</th><th className="px-3 py-2">Assessment</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {learners(cohort).map((learner, index) => (
                  <tr key={learner.id ?? index}>
                    <td className="px-3 py-3 font-semibold text-ink">{learner.name}<p className="text-xs font-normal text-muted">{learner.email ?? "No email"}</p></td>
                    <td className="px-3 py-3 text-muted">{learner.attendanceRate ?? 0}%</td>
                    <td className="px-3 py-3 text-muted">{learner.completionRate ?? 0}%</td>
                    <td className="px-3 py-3 text-muted">{learner.assessmentStatus ?? "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!learners(cohort).length ? <p className="p-4 text-sm text-muted">No learners imported yet.</p> : null}
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Linked records and sponsor reporting</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <MiniStat label="Linked deployment" value={cohort.linkedDeploymentId ?? "Not linked"} />
            <MiniStat label="Linked device batch" value={cohort.linkedDeviceBatchId ?? "Not linked"} />
            <MiniStat label="Sponsor" value={cohort.sponsor ?? "Not funded"} />
            <MiniStat label="Trainer" value={cohort.trainer ?? "Not assigned"} />
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Exportable reports and certificates</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <MiniStat label="Certificate artifact" value={cohort.certificateArtifacts?.pdf?.downloadUrl ? "Generated" : "Not generated"} />
            <MiniStat label="Generated for learners" value={cohort.certificateArtifacts?.learnerCount ?? 0} />
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Activity timeline</h3>
          <div className="mt-3 space-y-2">
            {(cohort.timeline ?? []).map((entry, index) => (
              <div key={entry.id ?? index} className="rounded-lg border border-line p-3 text-sm">
                <p className="font-semibold text-ink">{entry.title ?? "Cohort activity"}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(entry.createdAt)} · {entry.actorEmail ?? "System"}</p>
              </div>
            ))}
            {!cohort.timeline?.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No activity recorded yet.</p> : null}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

function Readiness({ value }: { value: number }) {
  return (
    <div className="w-40">
      <div className="flex items-center justify-between text-xs font-semibold text-muted"><span>{value}%</span><span>{value >= 80 ? "Ready" : "Building"}</span></div>
      <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-flame-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
    </div>
  );
}

function LoadingGrid() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-40 animate-pulse rounded-[1.25rem] bg-paper" />)}</div>;
}

function MiniStat({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 break-words font-semibold text-ink">{typeof value === "number" ? value.toLocaleString() : value ?? "Not set"}</p>
    </div>
  );
}

function Drawer({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-4">
      <aside className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-2xl">
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

function Field({ name, label, type = "text", defaultValue = "", required = false }: { name: string; label: string; type?: string; defaultValue?: string; required?: boolean }) {
  return <label className="block text-sm font-semibold text-ink">{label}<input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} type={type} defaultValue={defaultValue} required={required} /></label>;
}

function Textarea({ name, label, defaultValue = "", rows = 4 }: { name: string; label: string; defaultValue?: string; rows?: number }) {
  return <label className="block text-sm font-semibold text-ink">{label}<textarea className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} defaultValue={defaultValue} rows={rows} /></label>;
}

function Select({ name, label, options, defaultValue }: { name: string; label: string; options: Array<{ value: string; label: string }>; defaultValue?: string }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function RecordSelect({ name, label, records, defaultValue = "" }: { name: string; label: string; records: ApiRecord[]; defaultValue?: string }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
        <option value="">No linked record</option>
        {records.map((record) => <option key={record.id} value={record.id}>{recordLabel(record)}</option>)}
      </select>
    </label>
  );
}

function Toggle({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-3 text-sm font-semibold text-ink"><input className="h-4 w-4 rounded border-line" name={name} type="checkbox" defaultChecked={defaultChecked} />{label}</label>;
}
