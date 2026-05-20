"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { AdminRepairTechnician, AdminRepairTicket } from "@/types/repair";

type TechnicianStatus = "AVAILABLE" | "BUSY" | "OFFLINE" | "ON_LEAVE";
type TechnicianView = "registry" | "workload" | "skills" | "sla" | "profiles";

type Technician = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: TechnicianStatus;
  skills: string[];
  certifications: string[];
  activeJobs: number;
  completedJobs: number;
  slaRisk: number;
  location: string;
  rating: number;
  availability: string;
  source?: AdminRepairTechnician;
};

const demoTechnicians: Technician[] = [
  {
    id: "tech-001",
    name: "Unassigned Technician",
    email: "technician@sitdigitalaccess.org",
    role: "Repair Technician",
    status: "AVAILABLE",
    skills: ["Laptop repair", "Diagnostics", "Secure wipe"],
    certifications: ["Internal repair ops"],
    activeJobs: 0,
    completedJobs: 0,
    slaRisk: 0,
    location: "UK Intake Desk",
    rating: 4.8,
    availability: "Ready for assignment"
  }
];

const statusStyles: Record<TechnicianStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BUSY: "bg-orange-50 text-orange-700 border-orange-200",
  OFFLINE: "bg-slate-100 text-slate-600 border-slate-200",
  ON_LEAVE: "bg-purple-50 text-purple-700 border-purple-200"
};

const views: Array<{ id: TechnicianView; label: string; icon: IconKey }> = [
  { id: "registry", label: "Registry", icon: "users" },
  { id: "workload", label: "Workload", icon: "chart" },
  { id: "skills", label: "Skill Match", icon: "badge" },
  { id: "sla", label: "SLA Risk", icon: "shield" },
  { id: "profiles", label: "Profiles", icon: "list" }
];

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(String).map((item) => item.trim()).filter(Boolean)
    : [];
}

function normaliseStatus(value: unknown): TechnicianStatus {
  const status = String(value ?? "AVAILABLE").toUpperCase().replace(/[\s-]+/g, "_");
  if (status === "ASSIGNED" || status === "IN_REPAIR") return "BUSY";
  if (status === "LEAVE") return "ON_LEAVE";
  return ["AVAILABLE", "BUSY", "OFFLINE", "ON_LEAVE"].includes(status) ? status as TechnicianStatus : "AVAILABLE";
}

function repairIsActive(ticket: AdminRepairTicket) {
  return !["COMPLETED", "CANCELLED", "UNREPAIRABLE"].includes(String(ticket.status ?? "").toUpperCase());
}

function repairAtSlaRisk(ticket: AdminRepairTicket) {
  const createdAt = ticket.createdAt ? new Date(ticket.createdAt) : null;
  const hours = asNumber(ticket.slaTargetHours);
  if (!createdAt || Number.isNaN(createdAt.getTime()) || !hours || !repairIsActive(ticket)) return false;
  return createdAt.getTime() + hours * 60 * 60 * 1000 <= Date.now() + 24 * 60 * 60 * 1000;
}

function technicianFromRecord(record: AdminRepairTechnician, tickets: AdminRepairTicket[]): Technician {
  const assigned = tickets.filter((ticket) => ticket.assignedTechnicianId === record.id);
  const activeJobs = assigned.filter(repairIsActive).length || asNumber(record.activeJobs ?? record.workload);
  const completedJobs = assigned.filter((ticket) => String(ticket.status ?? "").toUpperCase() === "COMPLETED").length || asNumber(record.completedJobs);
  const slaRisk = assigned.filter(repairAtSlaRisk).length || asNumber(record.slaRisk);
  return {
    id: record.id,
    name: asString(record.name, "Unnamed technician"),
    email: asString(record.email, "technician@sitdigitalaccess.org"),
    role: asString(record.role, "Repair Technician"),
    status: normaliseStatus(record.status),
    skills: asStringArray(record.skills).length ? asStringArray(record.skills) : ["Diagnostics"],
    certifications: asStringArray(record.certifications),
    activeJobs,
    completedJobs,
    slaRisk,
    location: asString(record.location, asString(record.availability, "UK Intake Desk")),
    rating: asNumber(record.rating, record.completionRate ? Math.min(5, asNumber(record.completionRate) / 20) : 4.5),
    availability: asString(record.availability, activeJobs > 0 ? "Assigned to repair queue" : "Ready for assignment"),
    source: record
  };
}

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

export function AdminRepairTechniciansPage() {
  const { token } = useAdminAuth();
  const [technicians, setTechnicians] = useState<AdminRepairTechnician[]>([]);
  const [tickets, setTickets] = useState<AdminRepairTicket[]>([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<TechnicianView>("registry");
  const [statusFilter, setStatusFilter] = useState<TechnicianStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Technician | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const [techniciansResult, ticketsResult] = await Promise.allSettled([
      adminApi.listRepairTechnicians(token),
      adminApi.listRepairTickets(token)
    ]);

    if (techniciansResult.status === "fulfilled") {
      setTechnicians(techniciansResult.value);
    } else {
      setTechnicians([]);
      setError(techniciansResult.reason instanceof Error ? techniciansResult.reason.message : "Failed to fetch repair technicians.");
    }

    if (ticketsResult.status === "fulfilled") {
      setTickets(ticketsResult.value);
    }

    setLoading(false);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const liveTechnicians = useMemo(() => technicians.map((technician) => technicianFromRecord(technician, tickets)), [technicians, tickets]);
  const usingDemo = !loading && liveTechnicians.length === 0;
  const displayTechnicians = liveTechnicians.length ? liveTechnicians : demoTechnicians;

  const filtered = useMemo(() => {
    return displayTechnicians.filter((technician) => {
      const matchesQuery = [technician.name, technician.email, technician.role, technician.location, technician.availability, ...technician.skills, ...technician.certifications]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || technician.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [displayTechnicians, query, statusFilter]);

  const available = displayTechnicians.filter((technician) => technician.status === "AVAILABLE").length;
  const activeJobs = displayTechnicians.reduce((sum, technician) => sum + technician.activeJobs, 0);
  const completed = displayTechnicians.reduce((sum, technician) => sum + technician.completedJobs, 0);
  const slaRisk = displayTechnicians.reduce((sum, technician) => sum + technician.slaRisk, 0);
  const averageRating = displayTechnicians.length
    ? displayTechnicians.reduce((sum, technician) => sum + technician.rating, 0) / displayTechnicians.length
    : 0;

  const createTechnician = useCallback(async (payload: EcosystemRecordPayload) => {
    if (!token) return;
    const created = await adminApi.createRepairTechnician(token, payload);
    setTechnicians((current) => [created, ...current]);
    setDrawerOpen(false);
  }, [token]);

  const updateTechnician = useCallback(async (technician: Technician, payload: EcosystemRecordPayload) => {
    if (!token || !technician.source) return;
    const updated = await adminApi.updateRepairTechnician(token, technician.source.id, payload);
    setTechnicians((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSelected(technicianFromRecord(updated, tickets));
  }, [tickets, token]);

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.24),transparent_34%),linear-gradient(135deg,#080808,#171717_58%,#261204)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name="users" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-flame-200">Repair Workforce</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Repair technicians command centre.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">
              Manage technician availability, workload, repair skills, SLA risk, assignment readiness and deployment repair capacity across SIT Digital Access operations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/repairs" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-bold text-white hover:border-flame-200">
              <Icon name="wrench" className="h-4 w-4" />
              Repair queue
            </Link>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-flame-500 px-5 text-sm font-bold text-white shadow-lg shadow-flame-500/20 hover:bg-flame-600" onClick={() => setDrawerOpen(true)}>
              <Icon name="users" className="h-4 w-4" />
              Add technician
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric title="Available technicians" value={available} icon="check" />
        <Metric title="Active repair jobs" value={activeJobs} icon="wrench" />
        <Metric title="Completed repairs" value={completed} icon="badge" />
        <Metric title="SLA risks" value={slaRisk} icon="shield" />
        <Metric title="Average rating" value={averageRating ? averageRating.toFixed(1) : "0.0"} icon="sparkles" />
      </section>

      {error ? (
        <section className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold">Repair technician data could not be loaded.</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
            </div>
            <button className="rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white" onClick={() => void load()}>Retry</button>
          </div>
        </section>
      ) : null}

      {usingDemo ? (
        <section className="rounded-[1.25rem] border border-line bg-white p-4 text-sm text-muted shadow-card">
          Starter technician profile is shown until real technicians are added.
        </section>
      ) : null}

      <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Technician registry</h2>
            <p className="text-sm text-muted">Assign repairs based on availability, skill fit, active workload and SLA pressure.</p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search technicians, skills, location..."
            className="w-full rounded-2xl border border-line px-4 py-3 text-sm outline-none transition focus:border-flame-400 lg:w-96"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {views.map((item) => (
            <button key={item.id} className={cn("inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition", view === item.id ? "bg-ink text-white" : "bg-paper text-muted hover:text-ink")} onClick={() => setView(item.id)}>
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["ALL", "AVAILABLE", "BUSY", "OFFLINE", "ON_LEAVE"] as const).map((status) => (
            <button key={status} className={cn("rounded-full border px-3 py-1.5 text-xs font-bold", statusFilter === status ? "border-flame-500 bg-flame-50 text-flame-700" : "border-line text-muted hover:border-flame-300")} onClick={() => setStatusFilter(status)}>
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      {loading ? <LoadingGrid /> : null}
      {!loading && view === "registry" ? <RegistryTable technicians={filtered} onSelect={setSelected} /> : null}
      {!loading && view === "workload" ? <WorkloadBoard technicians={filtered} /> : null}
      {!loading && view === "skills" ? <SkillsBoard technicians={filtered} /> : null}
      {!loading && view === "sla" ? <SlaBoard technicians={filtered} /> : null}
      {!loading && view === "profiles" ? <ProfileCards technicians={filtered} onSelect={setSelected} /> : null}

      {drawerOpen ? <CreateTechnicianDrawer onClose={() => setDrawerOpen(false)} onSubmit={createTechnician} /> : null}
      {selected ? <TechnicianDrawer technician={selected} onClose={() => setSelected(null)} onUpdate={updateTechnician} /> : null}
    </main>
  );
}

function Metric({ title, value, icon }: { title: string; value: number | string; icon: IconKey }) {
  return (
    <div className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-3xl font-bold text-ink">{typeof value === "number" ? value.toLocaleString() : value}</div>
          <div className="mt-2 text-sm font-semibold text-muted">{title}</div>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function RegistryTable({ technicians, onSelect }: { technicians: Technician[]; onSelect: (technician: Technician) => void }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Skills</th>
              <th className="px-4 py-3">Workload</th>
              <th className="px-4 py-3">SLA Risk</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {technicians.map((tech) => (
              <tr key={tech.id} className="hover:bg-flame-50/40">
                <td className="px-4 py-4">
                  <div className="font-semibold text-ink">{tech.name}</div>
                  <div className="text-xs text-muted">{tech.email} · {tech.location}</div>
                </td>
                <td className="px-4 py-4"><StatusBadge status={tech.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {tech.skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold">{tech.activeJobs} active</td>
                <td className="px-4 py-4">
                  <span className={tech.slaRisk > 0 ? "font-semibold text-red-600" : "font-semibold text-emerald-600"}>{tech.slaRisk}</span>
                </td>
                <td className="px-4 py-4">★ {tech.rating.toFixed(1)}</td>
                <td className="px-4 py-4 text-right">
                  <button className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800" onClick={() => onSelect(tech)}>
                    View profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {technicians.length === 0 ? (
        <div className="p-10 text-center">
          <h3 className="font-bold text-ink">No technicians found</h3>
          <p className="mt-2 text-sm text-muted">Add technicians or adjust your search filter.</p>
        </div>
      ) : null}
    </section>
  );
}

function WorkloadBoard({ technicians }: { technicians: Technician[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {technicians.map((tech) => {
        const load = Math.min(100, tech.activeJobs * 18 + tech.slaRisk * 12);
        return (
          <article key={tech.id} className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-ink">{tech.name}</h3>
                <p className="mt-1 text-sm text-muted">{tech.role}</p>
              </div>
              <StatusBadge status={tech.status} />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper">
              <div className={cn("h-full rounded-full", load > 72 ? "bg-red-500" : load > 45 ? "bg-flame-500" : "bg-emerald-500")} style={{ width: `${load}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <MiniStat label="Active" value={tech.activeJobs} />
              <MiniStat label="Done" value={tech.completedJobs} />
              <MiniStat label="Risk" value={tech.slaRisk} />
            </div>
          </article>
        );
      })}
    </section>
  );
}

function SkillsBoard({ technicians }: { technicians: Technician[] }) {
  const skills = Array.from(new Set(technicians.flatMap((tech) => tech.skills))).sort();
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-bold text-ink">Skill match matrix</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => {
          const matches = technicians.filter((tech) => tech.skills.includes(skill));
          return (
            <article key={skill} className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-ink">{skill}</h4>
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{matches.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {matches.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between rounded-lg bg-paper p-2 text-sm">
                    <span>{tech.name}</span>
                    <StatusBadge status={tech.status} />
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      {skills.length === 0 ? <p className="mt-4 rounded-xl bg-paper p-5 text-sm text-muted">No skills found for this filter.</p> : null}
    </section>
  );
}

function SlaBoard({ technicians }: { technicians: Technician[] }) {
  const risky = technicians.filter((tech) => tech.slaRisk > 0 || tech.activeJobs > 4);
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-bold text-ink">SLA risk and escalation</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(risky.length ? risky : technicians).map((tech) => (
          <article key={tech.id} className="rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-ink">{tech.name}</h4>
                <p className="mt-1 text-sm text-muted">{tech.location}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold", tech.slaRisk > 0 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700")}>
                {tech.slaRisk > 0 ? `${tech.slaRisk} at risk` : "No risk"}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">
              {tech.slaRisk > 0 ? "Escalate, rebalance workload or assign support technician." : "No current SLA escalation. Keep available for urgent diagnostics."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileCards({ technicians, onSelect }: { technicians: Technician[]; onSelect: (technician: Technician) => void }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {technicians.map((tech) => (
        <article key={tech.id} className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-ink">{tech.name}</h3>
              <p className="mt-1 text-sm text-muted">{tech.email}</p>
            </div>
            <StatusBadge status={tech.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{tech.skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}</div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            <MiniStat label="Active" value={tech.activeJobs} />
            <MiniStat label="Done" value={tech.completedJobs} />
            <MiniStat label="Rating" value={tech.rating.toFixed(1)} />
          </div>
          <button className="mt-5 w-full rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800" onClick={() => onSelect(tech)}>View profile</button>
        </article>
      ))}
    </section>
  );
}

function CreateTechnicianDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: (payload: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <Drawer title="Add technician" onClose={onClose}>
      <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void onSubmit({
          name: formText(form, "name"),
          email: formText(form, "email"),
          role: formText(form, "role") || "Repair Technician",
          status: formText(form, "status") || "AVAILABLE",
          skills: formText(form, "skills").split(",").map((item) => item.trim()).filter(Boolean),
          certifications: formText(form, "certifications").split(",").map((item) => item.trim()).filter(Boolean),
          location: formText(form, "location"),
          availability: formText(form, "availability"),
          activeJobs: 0,
          completedJobs: 0,
          slaRisk: 0,
          rating: asNumber(form.get("rating"), 4.8)
        });
      }}>
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="role" label="Role" placeholder="Repair Technician" />
          <Select name="status" label="Status" options={["AVAILABLE", "BUSY", "OFFLINE", "ON_LEAVE"]} />
          <Field name="location" label="Location" placeholder="UK Intake Desk" />
          <Field name="rating" label="Rating" type="number" placeholder="4.8" />
        </div>
        <Field name="skills" label="Skills" placeholder="Laptop repair, Diagnostics, Secure wipe" />
        <Field name="certifications" label="Certifications" placeholder="Data wipe, Chromebook repair" />
        <TextArea name="availability" label="Availability notes" />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Add technician</button>
        </div>
      </form>
    </Drawer>
  );
}

function TechnicianDrawer({ technician, onClose, onUpdate }: { technician: Technician; onClose: () => void; onUpdate: (technician: Technician, payload: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <Drawer title={technician.name} onClose={onClose}>
      <div className="space-y-5">
        <section className="rounded-xl bg-paper p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{technician.role}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{technician.email}</h3>
              <p className="mt-2 text-sm text-muted">{technician.location} · {technician.availability}</p>
            </div>
            <StatusBadge status={technician.status} />
          </div>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="Active jobs" value={technician.activeJobs} />
          <MiniStat label="Completed" value={technician.completedJobs} />
          <MiniStat label="SLA risk" value={technician.slaRisk} />
          <MiniStat label="Rating" value={technician.rating.toFixed(1)} />
        </div>
        <section>
          <h4 className="font-semibold text-ink">Skill tags</h4>
          <div className="mt-3 flex flex-wrap gap-2">{technician.skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}</div>
        </section>
        <section>
          <h4 className="font-semibold text-ink">Performance and assignment actions</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            <button disabled={!technician.source} className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-45" onClick={() => void onUpdate(technician, { status: "AVAILABLE" })}>Set available</button>
            <button disabled={!technician.source} className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-45" onClick={() => void onUpdate(technician, { status: "BUSY" })}>Set busy</button>
            <button disabled={!technician.source} className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-45" onClick={() => void onUpdate(technician, { status: "OFFLINE" })}>Set offline</button>
            <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" href="/admin/repairs">Open repair queue</Link>
          </div>
          {!technician.source ? <p className="mt-3 text-sm text-muted">Add a real technician before status updates are saved.</p> : null}
        </section>
      </div>
    </Drawer>
  );
}

function StatusBadge({ status }: { status: TechnicianStatus }) {
  return <span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusStyles[status])}>{status.replace("_", " ")}</span>;
}

function SkillBadge({ skill }: { skill: string }) {
  return <span className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">{skill}</span>;
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => <div key={item} className="h-40 animate-pulse rounded-[1.25rem] bg-paper" />)}
    </div>
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
        {options.map((option) => <option key={option} value={option}>{option.replace("_", " ")}</option>)}
      </select>
    </label>
  );
}
