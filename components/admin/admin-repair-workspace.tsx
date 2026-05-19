"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL } from "@/lib/api";
import { repairCategories } from "@/lib/repair-content";
import { repairRoutes } from "@/lib/repair-routes";
import { cn } from "@/lib/utils";
import type {
  AdminRepairPart,
  AdminRepairSummary,
  AdminRepairTechnician,
  AdminRepairTicket,
  RepairAiTriage,
  RepairAttachment,
  RepairTicketStatus,
  RepairTimelineEntry
} from "@/types/repair";
import { repairStatuses } from "@/types/repair";

type RepairView = "queue" | "diagnostics" | "sla" | "assignments" | "parts" | "technicians";
type QueueFilter = "all" | "unassigned" | "sla" | "parts" | "approval" | "drop-off" | "pickup" | "mail-in";
type QueueMode = "kanban" | "table";
type EndpointKey = "repairs" | "parts" | "technicians";

type EndpointError = {
  key: EndpointKey;
  label: string;
  path: string;
  message: string;
  suggestedFix: string;
};

type RepairMetric = {
  label: string;
  value: number | string;
  detail: string;
  icon: IconKey;
  tone?: "orange" | "green" | "blue" | "dark";
};

const closedStatuses = new Set(["COMPLETED", "CANCELLED", "UNREPAIRABLE"]);
const emptySummary: AdminRepairSummary = {
  active: 0,
  awaitingApproval: 0,
  slaRisk: 0,
  techniciansAvailable: 0,
  overdue: 0,
  dueWithin24Hours: 0,
  blockedByParts: 0,
  unassigned: 0
};

const pipelineColumns: Array<{ id: RepairTicketStatus; label: string; statuses: RepairTicketStatus[] }> = [
  { id: "NEW", label: "New", statuses: ["NEW", "TRIAGE"] },
  { id: "DIAGNOSTICS", label: "Diagnosing", statuses: ["DIAGNOSTICS"] },
  { id: "AWAITING_APPROVAL", label: "Awaiting Approval", statuses: ["AWAITING_APPROVAL", "ESTIMATE_SENT"] },
  { id: "WAITING_FOR_PARTS", label: "Waiting Parts", statuses: ["WAITING_FOR_PARTS"] },
  { id: "REPAIR_IN_PROGRESS", label: "In Repair", statuses: ["REPAIR_IN_PROGRESS"] },
  { id: "QUALITY_CHECK", label: "QA Check", statuses: ["QUALITY_CHECK"] },
  { id: "READY_FOR_PICKUP", label: "Ready", statuses: ["READY_FOR_PICKUP", "READY_FOR_RETURN"] },
  { id: "COMPLETED", label: "Completed", statuses: ["COMPLETED"] }
];

const queueFilters: Array<{ id: QueueFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "unassigned", label: "Unassigned" },
  { id: "sla", label: "SLA risk" },
  { id: "parts", label: "Waiting parts" },
  { id: "approval", label: "Awaiting approval" },
  { id: "drop-off", label: "Drop-off" },
  { id: "pickup", label: "Pickup" },
  { id: "mail-in", label: "Mail-in" }
];

const diagnosticChecklist = [
  "Confirm charger and power-on state",
  "Inspect display, keyboard, ports and enclosure",
  "Run storage, memory and thermal checks",
  "Confirm warranty, asset tag and reuse decision",
  "Prepare estimate or parts reservation"
];

function formatLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "Not dated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not dated";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function asStatus(value?: string | null): RepairTicketStatus {
  const normalised = String(value ?? "NEW").toUpperCase().replaceAll(" ", "_");
  const mapped: Record<string, RepairTicketStatus> = {
    DIAGNOSING: "DIAGNOSTICS",
    IN_REPAIR: "REPAIR_IN_PROGRESS",
    QA_CHECK: "QUALITY_CHECK",
    READY_FOR_COLLECTION: "READY_FOR_PICKUP",
    READY_FOR_DISPATCH: "READY_FOR_RETURN"
  };
  const candidate = mapped[normalised] ?? normalised;
  return repairStatuses.includes(candidate as RepairTicketStatus) ? candidate as RepairTicketStatus : "NEW";
}

function displayStatus(status?: string | null) {
  const normalised = asStatus(status);
  if (normalised === "DIAGNOSTICS") return "Diagnosing";
  if (normalised === "REPAIR_IN_PROGRESS") return "In Repair";
  if (normalised === "QUALITY_CHECK") return "QA Check";
  if (normalised === "READY_FOR_PICKUP" || normalised === "READY_FOR_RETURN") return "Ready";
  return formatLabel(normalised);
}

function displayTicketTitle(ticket: AdminRepairTicket) {
  return ticket.repairReference
    ?? ticket.title
    ?? ticket.summary
    ?? `${ticket.customerName ?? "Repair"} ${ticket.deviceType ?? "device"}`.trim();
}

function activeTicket(ticket: AdminRepairTicket) {
  return !closedStatuses.has(asStatus(ticket.status));
}

function dueAt(ticket: AdminRepairTicket) {
  if (!ticket.createdAt || !ticket.slaTargetHours) return null;
  const created = new Date(ticket.createdAt);
  if (Number.isNaN(created.getTime())) return null;
  return new Date(created.getTime() + ticket.slaTargetHours * 60 * 60 * 1000);
}

function slaState(ticket: AdminRepairTicket) {
  const due = dueAt(ticket);
  if (!activeTicket(ticket) || !due) return { label: "No SLA", tone: "muted" as const };
  const diff = due.getTime() - Date.now();
  if (diff < 0) return { label: "Overdue", tone: "red" as const };
  if (diff <= 24 * 60 * 60 * 1000) return { label: "Due <24h", tone: "orange" as const };
  const hours = Math.ceil(diff / (60 * 60 * 1000));
  return { label: `${hours}h left`, tone: "green" as const };
}

function isSlaRisk(ticket: AdminRepairTicket) {
  const state = slaState(ticket);
  return state.tone === "red" || state.tone === "orange";
}

function routeText(ticket: AdminRepairTicket) {
  return `${ticket.repairRouteSlug ?? ""} ${ticket.repairRoute ?? ""}`.toLowerCase();
}

function matchesRoute(ticket: AdminRepairTicket, route: "drop-off" | "pickup" | "mail-in") {
  const text = routeText(ticket);
  if (route === "drop-off") return /drop|handover|drop_off/.test(text);
  if (route === "pickup") return /pickup/.test(text);
  return /mail/.test(text);
}

function priorityTone(priority?: string | null) {
  const value = String(priority ?? "MEDIUM").toUpperCase();
  if (value === "HIGH" || value === "URGENT") return "bg-red-50 text-red-700";
  if (value === "LOW") return "bg-green-50 text-green-700";
  return "bg-flame-50 text-flame-700";
}

function asMoney(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Not set";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}

function profitEstimate(ticket: AdminRepairTicket) {
  const value = typeof ticket.estimatedValue === "number" ? ticket.estimatedValue : 0;
  const cost = typeof ticket.estimatedCost === "number" ? ticket.estimatedCost : 0;
  if (!value && !cost) return "Unknown";
  return asMoney(value - cost);
}

function numberFrom(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function generateRepairReference() {
  return `SIT-REP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
}

function endpointError(key: EndpointKey, label: string, path: string, error: unknown): EndpointError {
  const message = error instanceof Error ? error.message : "Unable to load repair operations data.";
  const suggestedFix = /failed to fetch|network|cors/i.test(message)
    ? "Check the API is running, NEXT_PUBLIC_API_BASE_URL is correct, and CORS allows this admin origin."
    : /401|403|claim|token/i.test(message)
      ? "Refresh the admin token or sign in with an account that has admin claims."
      : "Retry the request and inspect API logs if this continues.";
  return { key, label, path, message, suggestedFix };
}

function StatusPill({ status }: { status?: string | null }) {
  const normalised = asStatus(status);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        normalised === "COMPLETED" && "bg-green-50 text-green-700",
        normalised === "CANCELLED" && "bg-zinc-100 text-zinc-600",
        normalised === "UNREPAIRABLE" && "bg-red-50 text-red-700",
        (normalised === "AWAITING_APPROVAL" || normalised === "ESTIMATE_SENT") && "bg-blue-50 text-blue-700",
        normalised === "WAITING_FOR_PARTS" && "bg-amber-50 text-amber-700",
        (normalised === "READY_FOR_PICKUP" || normalised === "READY_FOR_RETURN") && "bg-green-50 text-green-700",
        normalised !== "COMPLETED" && normalised !== "CANCELLED" && normalised !== "UNREPAIRABLE" && normalised !== "AWAITING_APPROVAL" && normalised !== "ESTIMATE_SENT" && normalised !== "WAITING_FOR_PARTS" && normalised !== "READY_FOR_PICKUP" && normalised !== "READY_FOR_RETURN" && "bg-flame-50 text-flame-700"
      )}
    >
      {displayStatus(normalised)}
    </span>
  );
}

function PriorityPill({ priority }: { priority?: string | null }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", priorityTone(priority))}>
      {formatLabel(String(priority ?? "MEDIUM"))}
    </span>
  );
}

function SlaPill({ ticket }: { ticket: AdminRepairTicket }) {
  const state = slaState(ticket);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        state.tone === "red" && "bg-red-50 text-red-700",
        state.tone === "orange" && "bg-amber-50 text-amber-700",
        state.tone === "green" && "bg-green-50 text-green-700",
        state.tone === "muted" && "bg-paper text-muted"
      )}
    >
      {state.label}
    </span>
  );
}

function MetricGrid({ metrics }: { metrics: RepairMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const tone = metric.tone ?? "orange";
        return (
          <article key={metric.label} className="rounded-lg border border-line bg-white p-5 shadow-card">
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
          </article>
        );
      })}
    </div>
  );
}

function EmptyState({
  title,
  text,
  onCreate,
  onImport,
  onParts,
  onTechnicians
}: {
  title: string;
  text: string;
  onCreate?: () => void;
  onImport?: () => void;
  onParts?: () => void;
  onTechnicians?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
        <Icon name="wrench" className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">{text}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {onCreate ? <button className="rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white hover:bg-flame-600" onClick={onCreate}>Create ticket</button> : null}
        {onImport ? <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-flame-300" onClick={onImport}>Import booking</button> : null}
        {onParts ? <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-flame-300" onClick={onParts}>View repair parts</button> : null}
        {onTechnicians ? <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-flame-300" onClick={onTechnicians}>Add technician</button> : null}
      </div>
    </div>
  );
}

export function AdminRepairWorkspace({ initialView = "queue" }: { initialView?: RepairView }) {
  const { token } = useAdminAuth();
  const [view, setView] = useState<RepairView>(initialView);
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [queueMode, setQueueMode] = useState<QueueMode>("kanban");
  const [tickets, setTickets] = useState<AdminRepairTicket[]>([]);
  const [summary, setSummary] = useState<AdminRepairSummary>(emptySummary);
  const [parts, setParts] = useState<AdminRepairPart[]>([]);
  const [technicians, setTechnicians] = useState<AdminRepairTechnician[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<EndpointError[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draftReference, setDraftReference] = useState(generateRepairReference);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrors([]);
    const [repairResult, partsResult, techniciansResult] = await Promise.allSettled([
      adminApi.getRepairOperations(token),
      adminApi.listRepairParts(token),
      adminApi.listRepairTechnicians(token)
    ]);

    const nextErrors: EndpointError[] = [];
    if (repairResult.status === "fulfilled") {
      setTickets(repairResult.value.tickets ?? []);
      setSummary({ ...emptySummary, ...repairResult.value.summary });
    } else {
      setTickets([]);
      setSummary(emptySummary);
      nextErrors.push(endpointError("repairs", "Repairs", "/admin/repairs", repairResult.reason));
    }

    if (partsResult.status === "fulfilled") {
      setParts(partsResult.value ?? []);
    } else {
      setParts([]);
      nextErrors.push(endpointError("parts", "Repair parts", "/admin/repair-parts", partsResult.reason));
    }

    if (techniciansResult.status === "fulfilled") {
      setTechnicians(techniciansResult.value ?? []);
    } else {
      setTechnicians([]);
      nextErrors.push(endpointError("technicians", "Technicians", "/admin/repair-technicians", techniciansResult.reason));
    }

    setErrors(nextErrors);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId, tickets]
  );
  const activeTickets = useMemo(() => tickets.filter(activeTicket), [tickets]);
  const completed = useMemo(() => tickets.filter((ticket) => asStatus(ticket.status) === "COMPLETED"), [tickets]);
  const availableTechnicians = useMemo(
    () => technicians.filter((technician) => String(technician.status ?? "AVAILABLE").toUpperCase() === "AVAILABLE"),
    [technicians]
  );
  const awaitingApproval = useMemo(
    () => tickets.filter((ticket) => ["AWAITING_APPROVAL", "ESTIMATE_SENT"].includes(asStatus(ticket.status))),
    [tickets]
  );
  const slaRisk = useMemo(() => tickets.filter(isSlaRisk), [tickets]);
  const blockedByParts = useMemo(
    () => activeTickets.filter((ticket) => asStatus(ticket.status) === "WAITING_FOR_PARTS" || (ticket.partsRequired?.length ?? 0) > 0 || (ticket.requiredPartIds?.length ?? 0) > 0),
    [activeTickets]
  );
  const unassignedTickets = useMemo(() => activeTickets.filter((ticket) => !ticket.assignedTechnicianId), [activeTickets]);

  const filteredTickets = useMemo(() => {
    if (queueFilter === "unassigned") return tickets.filter((ticket) => activeTicket(ticket) && !ticket.assignedTechnicianId);
    if (queueFilter === "sla") return tickets.filter(isSlaRisk);
    if (queueFilter === "parts") return tickets.filter((ticket) => asStatus(ticket.status) === "WAITING_FOR_PARTS");
    if (queueFilter === "approval") return tickets.filter((ticket) => ["AWAITING_APPROVAL", "ESTIMATE_SENT"].includes(asStatus(ticket.status)));
    if (queueFilter === "drop-off" || queueFilter === "pickup" || queueFilter === "mail-in") return tickets.filter((ticket) => matchesRoute(ticket, queueFilter));
    return tickets;
  }, [queueFilter, tickets]);

  const metrics: RepairMetric[] = [
    { label: "Active repair tickets", value: summary.active || activeTickets.length, detail: "Open tickets across diagnostics, parts, repair and quality check.", icon: "wrench" },
    { label: "Awaiting approval", value: summary.awaitingApproval || awaitingApproval.length, detail: "Repairs waiting for estimate, warranty or approval decisions.", icon: "package", tone: "blue" },
    { label: "SLA risk", value: summary.slaRisk || slaRisk.length, detail: `${summary.overdue || 0} overdue, ${summary.dueWithin24Hours || 0} due within 24 hours.`, icon: "bell", tone: "orange" },
    { label: "Technicians available", value: summary.techniciansAvailable || availableTechnicians.length, detail: `${completed.length} completed repair ticket${completed.length === 1 ? "" : "s"} recorded.`, icon: "users", tone: "green" }
  ];

  async function updateTicket(id: string, body: Partial<AdminRepairTicket>) {
    if (!token) return;
    setMessage(null);
    try {
      const updated = await adminApi.updateRepairTicket(token, id, body);
      setTickets((current) => current.map((ticket) => ticket.id === id ? updated : ticket));
      setMessage("Repair ticket updated.");
    } catch (error) {
      setErrors((current) => [...current, endpointError("repairs", "Repairs", `/admin/repairs/${id}`, error)]);
    }
  }

  async function triageTicket(id: string) {
    if (!token) return;
    setMessage(null);
    try {
      const updated = await adminApi.triageRepairTicket(token, id);
      setTickets((current) => current.map((ticket) => ticket.id === id ? updated : ticket));
      setMessage("Repair triage recommendation generated.");
    } catch (error) {
      setErrors((current) => [...current, endpointError("repairs", "AI triage", `/admin/repairs/${id}/triage`, error)]);
    }
  }

  async function uploadAttachments(ticketId: string, files: File[]) {
    if (!token || !files.length) return null;
    let updated: AdminRepairTicket | null = null;
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      updated = await adminApi.uploadRepairAttachment(token, ticketId, data);
    }
    return updated;
  }

  async function createTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll("attachments").filter((value): value is File => value instanceof File && value.size > 0);
    const issueDescription = String(formData.get("issueDescription") ?? "").trim();

    try {
      let ticket = await adminApi.createRepairTicket(token, {
        repairReference: String(formData.get("repairReference") ?? draftReference),
        title: `${String(formData.get("deviceType") ?? "Device")} repair - ${String(formData.get("customerName") ?? "Customer")}`,
        customerName: String(formData.get("customerName") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim() || undefined,
        organisation: String(formData.get("organisation") ?? "").trim() || undefined,
        deviceType: String(formData.get("deviceType") ?? "").trim(),
        serialNumber: String(formData.get("serialNumber") ?? "").trim() || undefined,
        assetTag: String(formData.get("assetTag") ?? "").trim() || undefined,
        warrantyReference: String(formData.get("warrantyReference") ?? "").trim() || undefined,
        repairRoute: String(formData.get("repairRoute") ?? "DROP_OFF"),
        urgency: String(formData.get("urgency") ?? "STANDARD"),
        priority: String(formData.get("urgency") ?? "STANDARD") === "URGENT" ? "HIGH" : "MEDIUM",
        repairCategory: String(formData.get("repairCategory") ?? "").trim(),
        category: String(formData.get("repairCategory") ?? "").trim(),
        issueDescription,
        summary: issueDescription,
        estimatedValue: numberFrom(formData.get("estimatedValue")),
        estimatedCost: numberFrom(formData.get("estimatedCost")),
        faultCategory: String(formData.get("faultCategory") ?? "").trim() || undefined,
        warrantyDecision: String(formData.get("warrantyDecision") ?? "").trim() || undefined,
        reuseDecision: String(formData.get("reuseDecision") ?? "").trim() || undefined,
        dataHandlingConsent: formData.get("consentCaptured") === "on",
        consentCaptured: formData.get("consentCaptured") === "on",
        status: "NEW",
        diagnostics: {
          submittedSymptoms: issueDescription,
          checklist: diagnosticChecklist.map((label) => ({ label, done: false }))
        }
      });

      const uploaded = await uploadAttachments(ticket.id, files);
      if (uploaded) ticket = uploaded;
      setTickets((current) => [ticket, ...current]);
      setMessage("Repair ticket created.");
      setCreateOpen(false);
      setDraftReference(generateRepairReference());
      form.reset();
    } catch (error) {
      setErrors((current) => [...current, endpointError("repairs", "Create repair ticket", "/admin/repairs", error)]);
    }
  }

  async function createPart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const formData = new FormData(event.currentTarget);
    try {
      const part = await adminApi.createRepairPart(token, {
        name: String(formData.get("name") ?? "").trim(),
        title: String(formData.get("name") ?? "").trim(),
        sku: String(formData.get("sku") ?? "").trim() || undefined,
        category: String(formData.get("category") ?? "").trim() || undefined,
        quantityAvailable: numberFrom(formData.get("quantityAvailable")),
        reorderLevel: numberFrom(formData.get("reorderLevel")),
        supplier: String(formData.get("supplier") ?? "").trim() || undefined,
        status: "AVAILABLE"
      });
      setParts((current) => [part, ...current]);
      setMessage("Repair part created.");
      event.currentTarget.reset();
    } catch (error) {
      setErrors((current) => [...current, endpointError("parts", "Repair parts", "/admin/repair-parts", error)]);
    }
  }

  async function createTechnician(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const formData = new FormData(event.currentTarget);
    try {
      const technician = await adminApi.createRepairTechnician(token, {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim() || undefined,
        skills: splitList(formData.get("skills")),
        certifications: splitList(formData.get("certifications")),
        availability: String(formData.get("availability") ?? "").trim() || undefined,
        workload: numberFrom(formData.get("workload")),
        completionRate: numberFrom(formData.get("completionRate")),
        status: "AVAILABLE"
      });
      setTechnicians((current) => [technician, ...current]);
      setMessage("Repair technician created.");
      event.currentTarget.reset();
    } catch (error) {
      setErrors((current) => [...current, endpointError("technicians", "Technicians", "/admin/repair-technicians", error)]);
    }
  }

  const tabs: Array<{ id: RepairView; label: string; icon: IconKey }> = [
    { id: "queue", label: "Repair Queue", icon: "wrench" },
    { id: "diagnostics", label: "Diagnostics", icon: "search" },
    { id: "sla", label: "SLA Risk", icon: "bell" },
    { id: "assignments", label: "Assignments", icon: "users" },
    { id: "parts", label: "Parts", icon: "package" },
    { id: "technicians", label: "Technicians", icon: "headset" }
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg bg-ink p-6 text-white shadow-soft md:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">Repair operations command centre</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Repair queue, diagnostics, SLA, parts and technician control.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
              Coordinate public bookings, drop-off handovers, pickup requests, parts reservations, internal notes, attachment evidence and AI-assisted triage in one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCreateOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white hover:bg-flame-600">
              <Icon name="wrench" className="h-4 w-4" />
              Create ticket
            </button>
            <button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink">
              <Icon name="sparkles" className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <MetricGrid metrics={metrics} />
      {errors.length ? <DegradedBanner errors={errors} onRetry={() => void load()} /> : null}
      {message ? <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</p> : null}

      <div className="flex gap-2 overflow-x-auto rounded-lg border border-line bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
              view === tab.id ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink"
            )}
          >
            <Icon name={tab.icon} className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <EmptyState title="Loading repair operations" text="Fetching repair tickets, parts and technician data." /> : null}

      {!loading && view === "queue" ? (
        <RepairQueueView
          tickets={filteredTickets}
          allTickets={tickets}
          technicians={technicians}
          queueFilter={queueFilter}
          queueMode={queueMode}
          onFilter={setQueueFilter}
          onMode={setQueueMode}
          onSelect={setSelectedTicketId}
          onUpdate={updateTicket}
          onCreate={() => setCreateOpen(true)}
          onImport={() => setView("diagnostics")}
          onParts={() => setView("parts")}
          onTechnicians={() => setView("technicians")}
        />
      ) : null}

      {!loading && view === "diagnostics" ? (
        <DiagnosticsView tickets={tickets} onSelect={setSelectedTicketId} onTriage={triageTicket} />
      ) : null}

      {!loading && view === "sla" ? (
        <SlaView overdue={slaRisk.filter((ticket) => slaState(ticket).tone === "red")} dueSoon={slaRisk.filter((ticket) => slaState(ticket).tone === "orange")} blockedByParts={blockedByParts} unassigned={unassignedTickets} onSelect={setSelectedTicketId} />
      ) : null}

      {!loading && view === "assignments" ? (
        <AssignmentsView tickets={activeTickets} technicians={technicians} onUpdate={updateTicket} />
      ) : null}

      {!loading && view === "parts" ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <PartsView parts={parts} tickets={blockedByParts} onPartUpdate={async (id, body) => {
            if (!token) return;
            const updated = await adminApi.updateRepairPart(token, id, body);
            setParts((current) => current.map((part) => part.id === id ? updated : part));
          }} />
          <RepairPartForm onSubmit={createPart} />
        </div>
      ) : null}

      {!loading && view === "technicians" ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <TechniciansView technicians={technicians} tickets={activeTickets} />
          <TechnicianForm onSubmit={createTechnician} />
        </div>
      ) : null}

      {createOpen ? (
        <CreateTicketDrawer
          repairReference={draftReference}
          onReference={() => setDraftReference(generateRepairReference())}
          onClose={() => setCreateOpen(false)}
          onSubmit={createTicket}
        />
      ) : null}

      {selectedTicket ? (
        <TicketDetailDrawer
          ticket={selectedTicket}
          parts={parts}
          technicians={technicians}
          onClose={() => setSelectedTicketId(null)}
          onUpdate={updateTicket}
          onTriage={triageTicket}
        />
      ) : null}
    </div>
  );
}

function DegradedBanner({ errors, onRetry }: { errors: EndpointError[]; onRetry: () => void }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-semibold">Repair data is partially degraded</p>
          <p className="mt-2 text-sm leading-6 text-amber-900/80">
            The workspace stays usable with empty fallbacks while affected endpoints recover.
          </p>
          <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
        </div>
        <button className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white" onClick={onRetry}>Retry data load</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {errors.map((error, index) => (
          <div key={`${error.key}-${index}`} className="rounded-lg bg-white p-4 text-sm shadow-sm">
            <p className="font-semibold text-ink">{error.label}</p>
            <p className="mt-1 break-all text-xs text-muted">{error.path}</p>
            <p className="mt-2 text-amber-900">{error.message}</p>
            <p className="mt-2 text-xs font-semibold text-amber-800">{error.suggestedFix}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RepairQueueView({
  tickets,
  allTickets,
  technicians,
  queueFilter,
  queueMode,
  onFilter,
  onMode,
  onSelect,
  onUpdate,
  onCreate,
  onImport,
  onParts,
  onTechnicians
}: {
  tickets: AdminRepairTicket[];
  allTickets: AdminRepairTicket[];
  technicians: AdminRepairTechnician[];
  queueFilter: QueueFilter;
  queueMode: QueueMode;
  onFilter: (filter: QueueFilter) => void;
  onMode: (mode: QueueMode) => void;
  onSelect: (id: string) => void;
  onUpdate: (id: string, body: Partial<AdminRepairTicket>) => Promise<void>;
  onCreate: () => void;
  onImport: () => void;
  onParts: () => void;
  onTechnicians: () => void;
}) {
  if (!allTickets.length) {
    return (
      <EmptyState
        title="No repair tickets yet"
        text="Repair tickets will appear here when public repair bookings, pickup requests, drop-off handovers, or admin-created tickets are submitted."
        onCreate={onCreate}
        onImport={onImport}
        onParts={onParts}
        onTechnicians={onTechnicians}
      />
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">Repair queue</h3>
            <p className="mt-1 text-sm text-muted">Quick filters, kanban lifecycle and table controls for repair operations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={cn("rounded-full px-4 py-2 text-sm font-semibold", queueMode === "kanban" ? "bg-ink text-white" : "bg-paper text-muted")} onClick={() => onMode("kanban")}>Kanban</button>
            <button className={cn("rounded-full px-4 py-2 text-sm font-semibold", queueMode === "table" ? "bg-ink text-white" : "bg-paper text-muted")} onClick={() => onMode("table")}>Table</button>
            <button className="rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white hover:bg-flame-600" onClick={onCreate}>Create ticket</button>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {queueFilters.map((filter) => (
            <button
              key={filter.id}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                queueFilter === filter.id ? "border-ink bg-ink text-white" : "border-line text-muted hover:border-flame-300"
              )}
              onClick={() => onFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {queueMode === "kanban" ? (
        <RepairKanban tickets={tickets} technicians={technicians} onSelect={onSelect} onUpdate={onUpdate} />
      ) : (
        <RepairTicketTable tickets={tickets} technicians={technicians} onSelect={onSelect} onUpdate={onUpdate} />
      )}
    </section>
  );
}

function RepairKanban({
  tickets,
  technicians,
  onSelect,
  onUpdate
}: {
  tickets: AdminRepairTicket[];
  technicians: AdminRepairTechnician[];
  onSelect: (id: string) => void;
  onUpdate: (id: string, body: Partial<AdminRepairTicket>) => Promise<void>;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-8">
      {pipelineColumns.map((column) => {
        const columnTickets = tickets.filter((ticket) => column.statuses.includes(asStatus(ticket.status)));
        return (
          <section key={column.id} className="min-h-56 rounded-lg border border-line bg-paper p-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-ink">{column.label}</h4>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-muted">{columnTickets.length}</span>
            </div>
            <div className="mt-3 space-y-3">
              {columnTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} technicians={technicians} onSelect={onSelect} onMove={(status) => onUpdate(ticket.id, { status })} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TicketCard({
  ticket,
  technicians,
  onSelect,
  onMove
}: {
  ticket: AdminRepairTicket;
  technicians: AdminRepairTechnician[];
  onSelect: (id: string) => void;
  onMove: (status: RepairTicketStatus) => Promise<void>;
}) {
  const technician = technicians.find((item) => item.id === ticket.assignedTechnicianId);
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <button className="block w-full text-left" onClick={() => onSelect(ticket.id)}>
        <div className="flex items-start justify-between gap-3">
          <h5 className="text-sm font-semibold text-ink">{displayTicketTitle(ticket)}</h5>
          <SlaPill ticket={ticket} />
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">{ticket.customerName ?? ticket.email ?? "Customer not recorded"}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{ticket.deviceType ?? "Device"} · {ticket.repairCategory ?? ticket.category ?? "Diagnostics"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <PriorityPill priority={ticket.priority} />
          <StatusPill status={ticket.status} />
        </div>
        <p className="mt-3 text-xs text-muted">Tech: <span className="font-semibold text-ink">{technician?.name ?? ticket.assignedOwner ?? "Unassigned"}</span></p>
        <p className="mt-1 text-xs text-muted">Profit estimate: <span className="font-semibold text-ink">{profitEstimate(ticket)}</span></p>
      </button>
      <select
        className="mt-3 w-full rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300"
        value={asStatus(ticket.status)}
        onChange={(event) => void onMove(event.target.value as RepairTicketStatus)}
      >
        {pipelineColumns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
      </select>
    </article>
  );
}

function RepairTicketTable({
  tickets,
  technicians,
  onSelect,
  onUpdate
}: {
  tickets: AdminRepairTicket[];
  technicians: AdminRepairTechnician[];
  onSelect: (id: string) => void;
  onUpdate: (id: string, body: Partial<AdminRepairTicket>) => Promise<void>;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-paper text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Customer / device</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3">Estimate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-4 py-4">
                  <button className="font-semibold text-ink hover:text-flame-700" onClick={() => onSelect(ticket.id)}>
                    {displayTicketTitle(ticket)}
                  </button>
                  <p className="mt-1 text-xs text-muted">{ticket.id}</p>
                </td>
                <td className="px-4 py-4 text-muted">
                  <p>{ticket.customerName ?? "Not recorded"}</p>
                  <p className="text-xs">{ticket.deviceType ?? "Device"} · {ticket.serialNumber ?? ticket.assetTag ?? "No serial/asset tag"}</p>
                </td>
                <td className="px-4 py-4 text-muted">{formatLabel(String(ticket.repairRoute ?? ticket.repairRouteSlug ?? "DROP_OFF"))}</td>
                <td className="px-4 py-4"><PriorityPill priority={ticket.priority} /></td>
                <td className="px-4 py-4">
                  <select
                    value={asStatus(ticket.status)}
                    onChange={(event) => void onUpdate(ticket.id, { status: event.target.value })}
                    className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300"
                    aria-label="Update repair status"
                  >
                    {repairStatuses.map((status) => <option key={status} value={status}>{displayStatus(status)}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={ticket.assignedTechnicianId ?? ""}
                    onChange={(event) => {
                      const technician = technicians.find((item) => item.id === event.target.value);
                      void onUpdate(ticket.id, {
                        assignedTechnicianId: event.target.value || null,
                        assignedOwner: technician?.email ?? technician?.name ?? null
                      });
                    }}
                    className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300"
                    aria-label="Assign technician"
                  >
                    <option value="">Unassigned</option>
                    {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name ?? technician.email ?? technician.id}</option>)}
                  </select>
                </td>
                <td className="px-4 py-4"><SlaPill ticket={ticket} /></td>
                <td className="px-4 py-4 text-muted">{profitEstimate(ticket)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DiagnosticsView({ tickets, onSelect, onTriage }: { tickets: AdminRepairTicket[]; onSelect: (id: string) => void; onTriage: (id: string) => Promise<void> }) {
  const diagnosticTickets = tickets.filter((ticket) => asStatus(ticket.status) === "DIAGNOSTICS" || ticket.diagnostics || ticket.aiTriage);
  if (!diagnosticTickets.length) return <EmptyState title="No diagnostics in progress" text="Diagnostics tickets will appear here once bookings enter the diagnosing stage." />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {diagnosticTickets.map((ticket) => (
        <article key={ticket.id} className="rounded-lg border border-line bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-ink">{displayTicketTitle(ticket)}</h3>
              <p className="mt-1 text-sm text-muted">{ticket.repairCategory ?? ticket.category ?? "Diagnostics"} · {ticket.deviceType ?? "Device"}</p>
            </div>
            <StatusPill status={ticket.status} />
          </div>
          <Checklist items={ticket.diagnosticChecklist} />
          <TriageSummary triage={ticket.aiTriage} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => onSelect(ticket.id)}>Open detail</button>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-flame-300" onClick={() => void onTriage(ticket.id)}>Run AI triage</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function SlaView({ overdue, dueSoon, blockedByParts, unassigned, onSelect }: { overdue: AdminRepairTicket[]; dueSoon: AdminRepairTicket[]; blockedByParts: AdminRepairTicket[]; unassigned: AdminRepairTicket[]; onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <RiskPanel title="Overdue repairs" tickets={overdue} tone="red" onSelect={onSelect} />
      <RiskPanel title="Due within 24 hours" tickets={dueSoon} tone="orange" onSelect={onSelect} />
      <RiskPanel title="Blocked by missing parts" tickets={blockedByParts} tone="amber" onSelect={onSelect} />
      <RiskPanel title="Unassigned tickets" tickets={unassigned} tone="blue" onSelect={onSelect} />
    </div>
  );
}

function RiskPanel({ title, tickets, tone, onSelect }: { title: string; tickets: AdminRepairTicket[]; tone: "red" | "orange" | "amber" | "blue"; onSelect: (id: string) => void }) {
  return (
    <section className={cn("rounded-lg border bg-white p-5 shadow-card", tone === "red" && "border-red-200", tone === "orange" && "border-flame-200", tone === "amber" && "border-amber-200", tone === "blue" && "border-blue-200")}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-ink">{title}</h3>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{tickets.length}</span>
      </div>
      <div className="mt-4 space-y-2">
        {!tickets.length ? <p className="text-sm text-muted">Nothing needs attention here right now.</p> : null}
        {tickets.map((ticket) => (
          <button key={ticket.id} className="block w-full rounded-lg bg-paper p-3 text-left text-sm hover:bg-flame-50" onClick={() => onSelect(ticket.id)}>
            <span className="font-semibold text-ink">{displayTicketTitle(ticket)}</span>
            <span className="mt-1 block text-xs text-muted">{ticket.customerName ?? "Customer not recorded"} · {formatDate(dueAt(ticket)?.toISOString())}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AssignmentsView({ tickets, technicians, onUpdate }: { tickets: AdminRepairTicket[]; technicians: AdminRepairTechnician[]; onUpdate: (id: string, body: Partial<AdminRepairTicket>) => Promise<void> }) {
  if (!technicians.length) return <EmptyState title="No technicians yet" text="Add technicians to unlock assignment, skill match and workload views." />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {technicians.map((technician) => {
        const assigned = tickets.filter((ticket) => ticket.assignedTechnicianId === technician.id);
        const skills = Array.isArray(technician.skills) ? technician.skills.map(String) : [];
        return (
          <article key={technician.id} className="rounded-lg border border-line bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-ink">{technician.name ?? technician.email ?? technician.id}</h3>
                <p className="mt-1 text-sm text-muted">{technician.availability ?? technician.status ?? "Availability not set"}</p>
              </div>
              <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{assigned.length} active</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.length ? skills.map((skill) => <span key={skill} className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">{skill}</span>) : <span className="text-sm text-muted">No skill tags</span>}
            </div>
            <div className="mt-4 space-y-2">
              {assigned.length ? assigned.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between gap-3 rounded-lg bg-paper p-3 text-sm">
                  <span className="font-semibold text-ink">{displayTicketTitle(ticket)}</span>
                  <StatusPill status={ticket.status} />
                </div>
              )) : <p className="text-sm text-muted">No active assignments.</p>}
            </div>
            <select
              className="mt-4 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300"
              defaultValue=""
              onChange={(event) => {
                if (!event.target.value) return;
                void onUpdate(event.target.value, {
                  assignedTechnicianId: technician.id,
                  assignedOwner: technician.email ?? technician.name ?? null
                });
                event.currentTarget.value = "";
              }}
              aria-label={`Assign ticket to ${technician.name ?? technician.id}`}
            >
              <option value="">Assign open ticket</option>
              {tickets.filter((ticket) => ticket.assignedTechnicianId !== technician.id).map((ticket) => <option key={ticket.id} value={ticket.id}>{displayTicketTitle(ticket)}</option>)}
            </select>
          </article>
        );
      })}
    </div>
  );
}

function PartsView({ parts, tickets, onPartUpdate }: { parts: AdminRepairPart[]; tickets: AdminRepairTicket[]; onPartUpdate: (id: string, body: Partial<AdminRepairPart>) => Promise<void> }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Parts inventory and reservations</h3>
          <p className="mt-1 text-sm text-muted">{tickets.length} ticket{tickets.length === 1 ? "" : "s"} waiting for parts.</p>
        </div>
        <Link href="/admin/repair-parts" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-flame-300">Open parts inventory</Link>
      </div>
      <div className="mt-5 space-y-3">
        {!parts.length ? <EmptyState title="No parts yet" text="Required parts, stock availability and purchase requests appear here once parts records are created." /> : null}
        {parts.map((part) => (
          <article key={part.id} className="rounded-lg border border-line bg-paper p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="font-semibold text-ink">{part.name ?? part.title ?? part.id}</h4>
                <p className="mt-1 text-sm text-muted">{part.category ?? "General"} · {part.supplier ?? "No supplier"}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink ring-1 ring-line">{part.quantityAvailable ?? 0} available</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onPartUpdate(part.id, { status: "RESERVED" })}>Reserve part</button>
              <button className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => void onPartUpdate(part.id, { status: "PURCHASE_REQUESTED" })}>Request purchase</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TechniciansView({ technicians, tickets }: { technicians: AdminRepairTechnician[]; tickets: AdminRepairTicket[] }) {
  if (!technicians.length) return <EmptyState title="No technicians yet" text="Technician records will appear here once added." />;

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold text-ink">Technician performance and workload</h3>
      <div className="mt-5 space-y-3">
        {technicians.map((technician) => {
          const active = tickets.filter((ticket) => ticket.assignedTechnicianId === technician.id).length;
          return (
            <article key={technician.id} className="rounded-lg border border-line bg-paper p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="font-semibold text-ink">{technician.name ?? technician.email ?? technician.id}</h4>
                  <p className="mt-1 text-sm text-muted">{technician.email ?? "No email"} · {technician.availability ?? technician.status ?? "Availability not set"}</p>
                  <p className="mt-2 text-xs text-muted">Skills: {Array.isArray(technician.skills) && technician.skills.length ? technician.skills.join(", ") : "Not recorded"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink ring-1 ring-line">{active} active</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink ring-1 ring-line">{technician.completionRate ?? 0}% completion</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RepairPartForm({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  return (
    <form className="rounded-lg border border-line bg-white p-5 shadow-card" onSubmit={onSubmit}>
      <h3 className="text-lg font-semibold text-ink">Add repair part</h3>
      <div className="mt-5 grid gap-3">
        <input name="name" required placeholder="Part name" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="sku" placeholder="SKU" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
          <input name="category" placeholder="Category" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="quantityAvailable" type="number" min="0" placeholder="Quantity available" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
          <input name="reorderLevel" type="number" min="0" placeholder="Reorder level" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        </div>
        <input name="supplier" placeholder="Supplier" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
      </div>
      <button className="mt-4 rounded-full bg-flame-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame-600">Add part</button>
    </form>
  );
}

function TechnicianForm({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  return (
    <form className="rounded-lg border border-line bg-white p-5 shadow-card" onSubmit={onSubmit}>
      <h3 className="text-lg font-semibold text-ink">Add technician</h3>
      <div className="mt-5 grid gap-3">
        <input name="name" required placeholder="Technician name" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        <input name="email" type="email" placeholder="Email" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        <input name="skills" placeholder="Skills, comma separated" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        <input name="certifications" placeholder="Certifications, comma separated" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="availability" placeholder="Availability" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
          <input name="workload" type="number" min="0" placeholder="Workload" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
        </div>
        <input name="completionRate" type="number" min="0" max="100" placeholder="Completion rate %" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
      </div>
      <button className="mt-4 rounded-full bg-flame-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame-600">Add technician</button>
    </form>
  );
}

function CreateTicketDrawer({ repairReference, onReference, onClose, onSubmit }: { repairReference: string; onReference: () => void; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/45 p-4 backdrop-blur-sm">
      <div className="ml-auto flex h-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">Create ticket</p>
            <h3 className="mt-1 text-xl font-semibold text-ink">Admin repair intake</h3>
          </div>
          <button className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold" onClick={onClose}>Close</button>
        </div>
        <form className="flex-1 overflow-y-auto p-5" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-ink">Repair reference<input name="repairReference" value={repairReference} readOnly className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" /></label>
            <button type="button" className="mt-7 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-flame-300" onClick={onReference}>Regenerate reference</button>
            <TextInput name="customerName" label="Customer name" required />
            <TextInput name="email" label="Customer email" type="email" required />
            <TextInput name="phone" label="Customer phone" />
            <TextInput name="organisation" label="Organisation / school" />
            <TextInput name="deviceType" label="Device type" required />
            <TextInput name="serialNumber" label="Device serial number" />
            <TextInput name="assetTag" label="Asset tag" />
            <TextInput name="warrantyReference" label="Warranty reference" />
            <SelectInput name="repairRoute" label="Route" defaultValue="DROP_OFF">
              {repairRoutes.map((route) => <option key={route.slug} value={route.value}>{route.label}</option>)}
            </SelectInput>
            <SelectInput name="urgency" label="Urgency" defaultValue="STANDARD">
              <option value="STANDARD">Standard</option>
              <option value="URGENT">Urgent</option>
              <option value="SCHOOL_LAB_CRITICAL">School/lab critical</option>
            </SelectInput>
            <SelectInput name="repairCategory" label="Issue category" defaultValue="" required>
              <option value="" disabled>Select category</option>
              {repairCategories.map((category) => <option key={category}>{category}</option>)}
            </SelectInput>
            <TextInput name="faultCategory" label="Fault category" />
            <TextInput name="estimatedValue" label="Estimated value" type="number" min="0" />
            <TextInput name="estimatedCost" label="Estimated cost" type="number" min="0" />
            <TextInput name="warrantyDecision" label="Warranty decision" />
            <TextInput name="reuseDecision" label="Reuse / recycling decision" />
            <label className="text-sm font-medium text-ink sm:col-span-2">Photos / attachments<input name="attachments" type="file" multiple className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm" /></label>
            <label className="text-sm font-medium text-ink sm:col-span-2">Issue description<textarea name="issueDescription" required rows={5} className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" /></label>
            <label className="flex items-start gap-3 rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-muted sm:col-span-2">
              <input name="consentCaptured" type="checkbox" required className="mt-1 h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200" />
              <span>Customer consent captured for repair diagnostics and data-aware handling.</span>
            </label>
          </div>
          <button className="mt-5 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white hover:bg-flame-600">Create repair ticket</button>
        </form>
      </div>
    </div>
  );
}

function TicketDetailDrawer({ ticket, parts, technicians, onClose, onUpdate, onTriage }: { ticket: AdminRepairTicket; parts: AdminRepairPart[]; technicians: AdminRepairTechnician[]; onClose: () => void; onUpdate: (id: string, body: Partial<AdminRepairTicket>) => Promise<void>; onTriage: (id: string) => Promise<void> }) {
  const attachments = Array.isArray(ticket.attachments) ? ticket.attachments : [];
  const timeline = Array.isArray(ticket.timeline) ? ticket.timeline : [];
  const assigned = technicians.find((technician) => technician.id === ticket.assignedTechnicianId);

  return (
    <div className="fixed inset-0 z-50 bg-ink/45 p-4 backdrop-blur-sm">
      <div className="ml-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">Repair detail</p>
            <h3 className="mt-1 text-xl font-semibold text-ink">{displayTicketTitle(ticket)}</h3>
            <p className="mt-1 text-sm text-muted">{ticket.customerName ?? "Customer not recorded"} · {ticket.deviceType ?? "Device"}</p>
          </div>
          <button className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold" onClick={onClose}>Close</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <SummaryBox label="Status" value={displayStatus(ticket.status)} />
            <SummaryBox label="Technician" value={assigned?.name ?? ticket.assignedOwner ?? "Unassigned"} />
            <SummaryBox label="SLA" value={slaState(ticket).label} />
            <SummaryBox label="Route" value={formatLabel(String(ticket.repairRoute ?? "DROP_OFF"))} />
            <SummaryBox label="Estimated value" value={asMoney(ticket.estimatedValue)} />
            <SummaryBox label="Profit estimate" value={profitEstimate(ticket)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => void onTriage(ticket.id)}>Run AI triage</button>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={() => void onUpdate(ticket.id, { status: "WAITING_FOR_PARTS" })}>Mark waiting parts</button>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={() => void onUpdate(ticket.id, { status: "READY_FOR_PICKUP" })}>Mark ready</button>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={() => void onUpdate(ticket.id, { reuseDecision: "Recycle review", status: "UNREPAIRABLE" })}>Convert to recycling decision</button>
            <Link href="/repair-status" className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300">Open public status</Link>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Section title="Diagnostics checklist"><Checklist items={ticket.diagnosticChecklist} /></Section>
            <Section title="AI triage recommendation"><TriageSummary triage={ticket.aiTriage} /></Section>
            <Section title="Warranty / reuse decision">
              <p className="text-sm text-muted">Warranty: <span className="font-semibold text-ink">{ticket.warrantyDecision ?? "Not recorded"}</span></p>
              <p className="mt-2 text-sm text-muted">Reuse: <span className="font-semibold text-ink">{ticket.reuseDecision ?? "Not recorded"}</span></p>
              <p className="mt-2 text-sm text-muted">Fault: <span className="font-semibold text-ink">{ticket.faultCategory ?? ticket.repairCategory ?? "Diagnostics"}</span></p>
            </Section>
            <Section title="Required parts">
              <div className="space-y-2">
                {!parts.length ? <p className="text-sm text-muted">No parts inventory records yet.</p> : null}
                {parts.slice(0, 6).map((part) => (
                  <div key={part.id} className="flex justify-between gap-3 rounded-lg bg-paper p-3 text-sm">
                    <span className="font-semibold text-ink">{part.name ?? part.title ?? part.id}</span>
                    <span className="text-muted">{part.quantityAvailable ?? 0} available</span>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Attachments"><AttachmentList attachments={attachments} /></Section>
            <Section title="Internal notes and communication">
              <p className="text-sm leading-6 text-muted">{ticket.internalNotes ?? ticket.notes ?? "No internal notes recorded."}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Customer log</p>
              <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-paper p-3 text-xs text-muted">{JSON.stringify(ticket.customerCommunication ?? [], null, 2)}</pre>
            </Section>
          </div>

          <Section title="Timeline" className="mt-5">
            <Timeline entries={timeline} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function TextInput({ name, label, type = "text", required = false, min }: { name: string; label: string; type?: string; required?: boolean; min?: string }) {
  return (
    <label className="text-sm font-medium text-ink">
      {label}
      <input name={name} type={type} min={min} required={required} className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300" />
    </label>
  );
}

function SelectInput({ name, label, defaultValue, required = false, children }: { name: string; label: string; defaultValue: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-ink">
      {label}
      <select name={name} required={required} defaultValue={defaultValue} className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-flame-300">
        {children}
      </select>
    </label>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-line bg-white p-5 shadow-sm", className)}>
      <h4 className="font-semibold text-ink">{title}</h4>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Checklist({ items }: { items?: Array<{ label: string; done?: boolean }> }) {
  const list = items?.length ? items : diagnosticChecklist.map((label) => ({ label, done: false }));
  return (
    <div className="mt-4 space-y-2">
      {list.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm text-muted">
          <Icon name={item.done ? "check" : "badge"} className={cn("h-4 w-4", item.done ? "text-green-600" : "text-flame-500")} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function TriageSummary({ triage }: { triage?: RepairAiTriage | Record<string, unknown> | null }) {
  if (!triage) return <p className="text-sm text-muted">No AI-assisted repair recommendation has been generated yet.</p>;
  return (
    <div className="rounded-lg bg-paper p-4 text-sm leading-6 text-muted">
      <p className="font-semibold text-ink">{String(triage.summary ?? "Repair triage generated.")}</p>
      <p className="mt-2">Likely fault: <span className="font-semibold text-ink">{String(triage.likelyFault ?? "Not specified")}</span></p>
      <p>Recommended action: <span className="font-semibold text-ink">{String(triage.recommendedAction ?? "Continue diagnostics")}</span></p>
      <p>Parts: <span className="font-semibold text-ink">{String(triage.partsSuggestion ?? "No suggestion")}</span></p>
      <p>Confidence: <span className="font-semibold text-ink">{typeof triage.confidence === "number" ? `${Math.round(triage.confidence * 100)}%` : "Unknown"}</span></p>
    </div>
  );
}

function AttachmentList({ attachments }: { attachments: RepairAttachment[] }) {
  if (!attachments.length) return <p className="text-sm text-muted">No photos or files attached yet.</p>;
  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <a key={attachment.id} href={attachment.downloadUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-lg bg-paper p-3 text-sm hover:bg-flame-50">
          <span className="font-semibold text-ink">{attachment.originalFilename ?? attachment.filename}</span>
          <span className="text-xs text-muted">{attachment.size ? `${Math.ceil(attachment.size / 1024)} KB` : "File"}</span>
        </a>
      ))}
    </div>
  );
}

function Timeline({ entries }: { entries: RepairTimelineEntry[] }) {
  if (!entries.length) return <p className="text-sm text-muted">Timeline activity will appear when status, assignment, notes, parts or attachments change.</p>;
  return (
    <div className="space-y-3">
      {entries.slice().reverse().map((entry) => (
        <div key={entry.id} className="rounded-lg bg-paper p-4 text-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-semibold text-ink">{entry.title}</p>
            <span className="text-xs text-muted">{formatDate(entry.createdAt)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">{entry.actorEmail ?? "System"} · {entry.type}</p>
        </div>
      ))}
    </div>
  );
}
