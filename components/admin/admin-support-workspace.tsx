"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL, type ApiRecord, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  SupportInternalNote,
  SupportListResponse,
  SupportSummary,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus
} from "@/types/support";

const emptySummary: SupportSummary = {
  openTickets: 0,
  highPriority: 0,
  inventoryLinked: 0,
  closedTickets: 0,
  slaRisk: 0,
  awaitingCustomer: 0,
  escalated: 0,
  repairLinked: 0
};

const tabs = [
  "All tickets",
  "New",
  "Awaiting customer",
  "Fulfilment support",
  "Inventory linked",
  "Repair linked",
  "Deployment support",
  "Escalations",
  "Closed"
] as const;

type SupportTab = (typeof tabs)[number];

const categories: Array<{ value: SupportTicketCategory; label: string }> = [
  { value: "GENERAL_ENQUIRY", label: "General enquiry" },
  { value: "DEVICE_REQUEST", label: "Device request support" },
  { value: "DONATION_SUPPORT", label: "Donation support" },
  { value: "INVENTORY_ISSUE", label: "Inventory issue" },
  { value: "REPAIR_SUPPORT", label: "Repair support" },
  { value: "RECYCLING_SUPPORT", label: "Recycling support" },
  { value: "DEPLOYMENT_SUPPORT", label: "Deployment support" },
  { value: "TRAINING_SUPPORT", label: "Training support" },
  { value: "ACCOUNT_ACCESS", label: "Account/access support" }
];

const priorities: Array<{ value: SupportTicketPriority; label: string }> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" }
];

const statuses: Array<{ value: SupportTicketStatus; label: string }> = [
  { value: "NEW", label: "New" },
  { value: "OPEN", label: "Open" },
  { value: "AWAITING_CUSTOMER", label: "Awaiting customer" },
  { value: "AWAITING_INTERNAL", label: "Awaiting internal" },
  { value: "ESCALATED", label: "Escalated" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" }
];

const channels = ["Admin", "Email", "Phone", "Website", "WhatsApp", "Partner"];

type ConnectedRecords = {
  inventory: ApiRecord[];
  repairs: ApiRecord[];
  donations: ApiRecord[];
  deployments: ApiRecord[];
};

type ActionDrawerState =
  | { type: "assign"; ticket: SupportTicket }
  | { type: "link"; ticket: SupportTicket; recordType: "inventory" | "repair" }
  | { type: "note"; ticket: SupportTicket };

function ticketReference(ticket: SupportTicket) {
  return ticket.reference ?? ticket.supportReference ?? ticket.id;
}

function ticketSubject(ticket: SupportTicket) {
  return ticket.subject ?? ticket.title ?? "Support ticket";
}

function ticketRequester(ticket: SupportTicket) {
  return ticket.requesterName ?? ticket.customerName ?? ticket.requesterEmail ?? ticket.email ?? "Unknown requester";
}

function ticketOwner(ticket: SupportTicket) {
  return ticket.assignedTo ?? ticket.assignedOwner ?? ticket.owner ?? "Unassigned";
}

function ticketStatus(value: unknown): SupportTicketStatus {
  const status = String(value ?? "NEW").toUpperCase().replace(/[\s-]+/g, "_");
  if (status === "AWAITING_CUSTOMER" || status === "AWAITING_INTERNAL" || status === "ESCALATED" || status === "RESOLVED" || status === "CLOSED" || status === "OPEN") return status;
  return "NEW";
}

function ticketPriority(value: unknown): SupportTicketPriority {
  const priority = String(value ?? "MEDIUM").toUpperCase().replace(/[\s-]+/g, "_");
  if (priority === "LOW" || priority === "HIGH" || priority === "URGENT") return priority;
  return "MEDIUM";
}

function categoryLabel(value: unknown) {
  const category = String(value ?? "GENERAL_ENQUIRY").toUpperCase().replace(/[\s-/]+/g, "_");
  return categories.find((item) => item.value === category)?.label ?? "General enquiry";
}

function statusClass(status: SupportTicketStatus) {
  if (status === "ESCALATED") return "border-red-200 bg-red-50 text-red-700";
  if (status === "AWAITING_CUSTOMER") return "border-orange-200 bg-orange-50 text-orange-700";
  if (status === "CLOSED" || status === "RESOLVED") return "border-slate-200 bg-slate-100 text-slate-600";
  if (status === "OPEN") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-purple-200 bg-purple-50 text-purple-700";
}

function priorityClass(priority: SupportTicketPriority) {
  if (priority === "URGENT") return "bg-red-600 text-white";
  if (priority === "HIGH") return "bg-orange-100 text-orange-800";
  if (priority === "LOW") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-700";
}

function formatDate(value: unknown) {
  if (!value) return "Not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function timeUntil(value: unknown) {
  if (!value) return "No SLA";
  const due = new Date(String(value));
  if (Number.isNaN(due.getTime())) return "No SLA";
  const diffHours = Math.round((due.getTime() - Date.now()) / (60 * 60 * 1000));
  if (diffHours < 0) return `${Math.abs(diffHours)}h overdue`;
  if (diffHours < 24) return `${diffHours}h left`;
  return `${Math.ceil(diffHours / 24)}d left`;
}

function isSlaRisk(ticket: SupportTicket) {
  const due = ticket.slaDueAt ? new Date(ticket.slaDueAt) : null;
  if (!due || Number.isNaN(due.getTime())) return false;
  return due.getTime() <= Date.now() + 24 * 60 * 60 * 1000 && !["CLOSED", "RESOLVED"].includes(ticketStatus(ticket.status));
}

function recordLabel(record: ApiRecord | SupportTicket) {
  return String(record.title ?? record.subject ?? record.name ?? record.assetTag ?? record.organisation ?? record.requesterName ?? record.id);
}

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function supportNotes(ticket: SupportTicket): SupportInternalNote[] {
  if (Array.isArray(ticket.internalNoteLog)) return ticket.internalNoteLog;
  if (Array.isArray(ticket.internalNotes)) return ticket.internalNotes;
  if (typeof ticket.internalNotes === "string" && ticket.internalNotes.trim()) {
    return [{ note: ticket.internalNotes, createdAt: ticket.createdAt, author: ticket.assignedTo ?? null }];
  }
  return [];
}

function linkedAsset(ticket: SupportTicket) {
  if (ticket.linkedInventoryId ?? ticket.inventoryId) return `Inventory ${ticket.linkedInventoryId ?? ticket.inventoryId}`;
  if (ticket.linkedRepairTicketId ?? ticket.repairTicketId) return `Repair ${ticket.linkedRepairTicketId ?? ticket.repairTicketId}`;
  if (ticket.linkedDonationId ?? ticket.donationId) return `Donation ${ticket.linkedDonationId ?? ticket.donationId}`;
  if (ticket.linkedDeploymentId ?? ticket.deploymentId) return `Deployment ${ticket.linkedDeploymentId ?? ticket.deploymentId}`;
  return "Not linked";
}

export function AdminSupportWorkspace() {
  const { token } = useAdminAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [summary, setSummary] = useState<SupportSummary>(emptySummary);
  const [connected, setConnected] = useState<ConnectedRecords>({ inventory: [], repairs: [], donations: [], deployments: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SupportTab>("All tickets");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [actionDrawer, setActionDrawer] = useState<ActionDrawerState | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const settled = await Promise.allSettled([
      adminApi.getSupportOperations(token),
      adminApi.listInventory(token),
      adminApi.listRepairTickets(token),
      adminApi.listDonations(token),
      adminApi.listDeployments(token)
    ]);

    if (settled[0].status === "fulfilled") {
      const payload: SupportListResponse = settled[0].value;
      setTickets(payload.tickets ?? []);
      setSummary({ ...emptySummary, ...(payload.summary ?? {}) });
    } else {
      setTickets([]);
      setSummary(emptySummary);
      setError(settled[0].reason instanceof Error ? settled[0].reason.message : "Failed to fetch support tickets.");
    }

    setConnected({
      inventory: settled[1].status === "fulfilled" ? settled[1].value : [],
      repairs: settled[2].status === "fulfilled" ? settled[2].value.map((record) => ({ ...record })) as ApiRecord[] : [],
      donations: settled[3].status === "fulfilled" ? settled[3].value : [],
      deployments: settled[4].status === "fulfilled" ? settled[4].value : []
    });
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const status = ticketStatus(ticket.status);
      const category = String(ticket.category ?? "").toUpperCase();
      const matchesTab =
        activeTab === "All tickets" ||
        (activeTab === "New" && status === "NEW") ||
        (activeTab === "Awaiting customer" && status === "AWAITING_CUSTOMER") ||
        (activeTab === "Fulfilment support" && ["DEVICE_REQUEST", "DONATION_SUPPORT"].includes(category)) ||
        (activeTab === "Inventory linked" && Boolean(ticket.linkedInventoryId ?? ticket.inventoryId)) ||
        (activeTab === "Repair linked" && Boolean(ticket.linkedRepairTicketId ?? ticket.repairTicketId)) ||
        (activeTab === "Deployment support" && (category === "DEPLOYMENT_SUPPORT" || Boolean(ticket.linkedDeploymentId ?? ticket.deploymentId))) ||
        (activeTab === "Escalations" && status === "ESCALATED") ||
        (activeTab === "Closed" && ["CLOSED", "RESOLVED"].includes(status));
      if (!matchesTab) return false;
      if (!search) return true;
      return [
        ticketReference(ticket),
        ticketSubject(ticket),
        ticketRequester(ticket),
        ticket.requesterEmail,
        ticket.organisation,
        categoryLabel(ticket.category),
        ticket.description,
        linkedAsset(ticket),
        ticketOwner(ticket)
      ].join(" ").toLowerCase().includes(search);
    });
  }, [activeTab, query, tickets]);

  const upsertTicket = useCallback((ticket: SupportTicket) => {
    setTickets((current) => [ticket, ...current.filter((item) => item.id !== ticket.id)]);
    setSelected((current) => current?.id === ticket.id ? ticket : current);
    void load();
  }, [load]);

  const createTicket = useCallback(async (payload: EcosystemRecordPayload) => {
    if (!token) return;
    const created = await adminApi.createSupportTicket(token, payload);
    upsertTicket(created);
    setCreateOpen(false);
    setSelected(created);
  }, [token, upsertTicket]);

  const updateTicket = useCallback(async (ticket: SupportTicket, payload: EcosystemRecordPayload) => {
    if (!token) return;
    const updated = await adminApi.updateSupportTicket(token, ticket.id, payload);
    upsertTicket(updated);
  }, [token, upsertTicket]);

  const escalateTicket = useCallback(async (ticket: SupportTicket) => {
    if (!token) return;
    setBusyAction(`escalate-${ticket.id}`);
    try {
      upsertTicket(await adminApi.escalateSupportTicket(token, ticket.id));
    } finally {
      setBusyAction(null);
    }
  }, [token, upsertTicket]);

  const closeTicket = useCallback(async (ticket: SupportTicket) => {
    if (!token) return;
    setBusyAction(`close-${ticket.id}`);
    try {
      upsertTicket(await adminApi.closeSupportTicket(token, ticket.id));
    } finally {
      setBusyAction(null);
    }
  }, [token, upsertTicket]);

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_35%),linear-gradient(135deg,#080808,#171717_58%,#271303)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name="headset" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Support operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Customer, fulfilment and device support command centre</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">
              Track support tickets, fulfilment issues, device lifecycle queries, repair escalations, deployment assistance and donor/customer communication from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white hover:bg-flame-600" onClick={() => setCreateOpen(true)}>
              <Icon name="headset" className="h-4 w-4" />
              Create ticket
            </button>
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" href="/admin/enquiries">
              <Icon name="mail" className="h-4 w-4" />
              Import from enquiry
            </Link>
            <Link className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" href="/admin/inventory">
              <Icon name="laptop" className="h-4 w-4" />
              Link inventory item
            </Link>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => setActiveTab("Escalations")}>
              <Icon name="bell" className="h-4 w-4" />
              View escalations
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Open tickets" value={summary.openTickets} icon="headset" />
        <Kpi title="High priority" value={summary.highPriority} icon="bell" />
        <Kpi title="SLA risk" value={summary.slaRisk} icon="shield" />
        <Kpi title="Escalated" value={summary.escalated} icon="sliders" />
        <Kpi title="Awaiting customer" value={summary.awaitingCustomer} icon="mail" />
        <Kpi title="Inventory linked" value={summary.inventoryLinked} icon="laptop" />
        <Kpi title="Repair linked" value={summary.repairLinked ?? 0} icon="wrench" />
        <Kpi title="Closed tickets" value={summary.closedTickets} icon="check" />
      </section>

      {error ? (
        <section className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold">Support data could not be loaded.</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
            </div>
            <button className="rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white" onClick={() => void load()}>Retry</button>
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Support queue</h2>
            <p className="text-sm text-muted">Filter fulfilment, device lifecycle, repair and deployment support by status, owner and risk.</p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reference, requester, linked asset..."
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
      {!loading && filtered.length === 0 ? <EmptyState onCreate={() => setCreateOpen(true)} /> : null}
      {!loading && filtered.length > 0 ? (
        <SupportTable
          tickets={filtered}
          busyAction={busyAction}
          onView={setSelected}
          onAssign={(ticket) => setActionDrawer({ type: "assign", ticket })}
          onEscalate={escalateTicket}
          onLinkDevice={(ticket) => setActionDrawer({ type: "link", ticket, recordType: "inventory" })}
          onLinkRepair={(ticket) => setActionDrawer({ type: "link", ticket, recordType: "repair" })}
          onClose={closeTicket}
          onNote={(ticket) => setActionDrawer({ type: "note", ticket })}
        />
      ) : null}

      {createOpen ? <CreateTicketDrawer connected={connected} onClose={() => setCreateOpen(false)} onSubmit={createTicket} /> : null}
      {selected ? <TicketDetailDrawer ticket={selected} onClose={() => setSelected(null)} onEdit={(payload) => updateTicket(selected, payload)} /> : null}
      {actionDrawer ? (
        <SupportActionDrawer
          state={actionDrawer}
          connected={connected}
          onClose={() => setActionDrawer(null)}
          onSaved={(ticket) => {
            upsertTicket(ticket);
            setActionDrawer(null);
          }}
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

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name="headset" className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">No support tickets yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Support tickets will appear when created from enquiries, inventory records, repair workflows, deployments or admin actions.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onCreate}>Create ticket</button>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/enquiries">Import enquiry</Link>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/inventory">Review inventory</Link>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/repair-queue">View repair queue</Link>
      </div>
    </section>
  );
}

function SupportTable({
  tickets,
  busyAction,
  onView,
  onAssign,
  onEscalate,
  onLinkDevice,
  onLinkRepair,
  onClose,
  onNote
}: {
  tickets: SupportTicket[];
  busyAction: string | null;
  onView: (ticket: SupportTicket) => void;
  onAssign: (ticket: SupportTicket) => void;
  onEscalate: (ticket: SupportTicket) => Promise<void>;
  onLinkDevice: (ticket: SupportTicket) => void;
  onLinkRepair: (ticket: SupportTicket) => void;
  onClose: (ticket: SupportTicket) => Promise<void>;
  onNote: (ticket: SupportTicket) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1360px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Ticket reference", "Subject", "Requester", "Category", "Priority", "Status", "Linked asset", "Owner", "SLA due", "Last activity", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tickets.map((ticket) => {
              const status = ticketStatus(ticket.status);
              const priority = ticketPriority(ticket.priority);
              return (
                <tr key={ticket.id} className="hover:bg-flame-50/35">
                  <td className="px-4 py-4 font-semibold text-ink">{ticketReference(ticket)}</td>
                  <td className="px-4 py-4">
                    <button className="max-w-xs text-left font-semibold text-ink hover:text-flame-700" onClick={() => onView(ticket)}>{ticketSubject(ticket)}</button>
                    <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-muted">{ticket.description ?? ticket.summary}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">{ticketRequester(ticket)}</td>
                  <td className="px-4 py-4 text-muted">{categoryLabel(ticket.category)}</td>
                  <td className="px-4 py-4"><span className={cn("rounded-full px-3 py-1 text-xs font-bold", priorityClass(priority))}>{priority}</span></td>
                  <td className="px-4 py-4"><span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(status))}>{status.replaceAll("_", " ")}</span></td>
                  <td className="px-4 py-4 text-muted">{linkedAsset(ticket)}</td>
                  <td className="px-4 py-4 text-muted">{ticketOwner(ticket)}</td>
                  <td className="px-4 py-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-bold", isSlaRisk(ticket) ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600")}>{timeUntil(ticket.slaDueAt)}</span>
                  </td>
                  <td className="px-4 py-4 text-muted">{formatDate(ticket.lastActivityAt ?? ticket.updatedAt ?? ticket.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onView(ticket)}>View</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onAssign(ticket)}>Assign</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `escalate-${ticket.id}`} onClick={() => void onEscalate(ticket)}>Escalate</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onLinkDevice(ticket)}>Link device</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onLinkRepair(ticket)}>Link repair</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `close-${ticket.id}` || ["CLOSED", "RESOLVED"].includes(status)} onClick={() => void onClose(ticket)}>Close</button>
                      <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white" onClick={() => onNote(ticket)}>Add internal note</button>
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

function CreateTicketDrawer({ connected, onClose, onSubmit }: { connected: ConnectedRecords; onClose: () => void; onSubmit: (payload: EcosystemRecordPayload) => Promise<void> }) {
  return (
    <Drawer title="Create support ticket" onClose={onClose}>
      <form className="space-y-5" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void onSubmit({
          subject: formText(form, "subject"),
          title: formText(form, "subject"),
          requesterName: formText(form, "requesterName"),
          requesterEmail: formText(form, "requesterEmail"),
          requesterPhone: formText(form, "requesterPhone"),
          phone: formText(form, "requesterPhone"),
          organisation: formText(form, "organisation"),
          category: formText(form, "category"),
          priority: formText(form, "priority"),
          status: "NEW",
          channel: formText(form, "channel").toUpperCase().replace(/[^A-Z0-9]+/g, "_"),
          linkedInventoryId: formText(form, "linkedInventoryId"),
          linkedRepairTicketId: formText(form, "linkedRepairTicketId"),
          linkedDonationId: formText(form, "linkedDonationId"),
          linkedDeploymentId: formText(form, "linkedDeploymentId"),
          description: formText(form, "description"),
          message: formText(form, "description"),
          internalNote: formText(form, "internalNote"),
          assignedTo: formText(form, "assignedTo"),
          assignedOwner: formText(form, "assignedTo"),
          slaTarget: formText(form, "slaTarget"),
          slaTargetHours: Number(formText(form, "slaTarget") || 72)
        });
      }}>
        <Field name="subject" label="Subject" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="requesterName" label="Requester name" required />
          <Field name="requesterEmail" label="Requester email" type="email" />
          <Field name="requesterPhone" label="Phone" />
          <Field name="organisation" label="Organisation" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Select name="category" label="Category" options={categories} />
          <Select name="priority" label="Priority" options={priorities} defaultValue="MEDIUM" />
          <Select name="channel" label="Channel" options={channels.map((channel) => ({ value: channel, label: channel }))} />
        </div>
        <RecordSelect name="linkedInventoryId" label="Linked inventory item" records={connected.inventory} />
        <RecordSelect name="linkedRepairTicketId" label="Linked repair ticket" records={connected.repairs} />
        <RecordSelect name="linkedDonationId" label="Linked donation" records={connected.donations} />
        <RecordSelect name="linkedDeploymentId" label="Linked deployment" records={connected.deployments} />
        <Textarea name="description" label="Description" rows={5} required />
        <Textarea name="internalNote" label="Internal note" rows={3} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="assignedTo" label="Assign owner" placeholder="support@sitdigitalaccess.org" />
          <Field name="slaTarget" label="SLA target hours" type="number" defaultValue="72" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Create ticket</button>
        </div>
      </form>
    </Drawer>
  );
}

function SupportActionDrawer({ state, connected, onClose, onSaved }: { state: ActionDrawerState; connected: ConnectedRecords; onClose: () => void; onSaved: (ticket: SupportTicket) => void }) {
  const { token } = useAdminAuth();
  const title = state.type === "assign" ? "Assign support ticket" : state.type === "note" ? "Add internal note" : `Link ${state.recordType === "inventory" ? "device" : "repair"} record`;

  return (
    <Drawer title={title} onClose={onClose}>
      <form className="space-y-5" onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;
        const form = new FormData(event.currentTarget);
        if (state.type === "assign") {
          onSaved(await adminApi.assignSupportTicket(token, state.ticket.id, {
            assignedTo: formText(form, "assignedTo"),
            assignedOwner: formText(form, "assignedTo"),
            internalNote: formText(form, "internalNote")
          }));
          return;
        }
        if (state.type === "note") {
          onSaved(await adminApi.updateSupportTicket(token, state.ticket.id, { internalNote: formText(form, "internalNote") }));
          return;
        }
        onSaved(await adminApi.linkSupportRecord(token, state.ticket.id, {
          linkRecordType: state.recordType,
          linkRecordId: formText(form, "recordId"),
          internalNote: formText(form, "internalNote")
        }));
      }}>
        {state.type === "assign" ? <Field name="assignedTo" label="Assign owner" defaultValue={ticketOwner(state.ticket) === "Unassigned" ? "" : ticketOwner(state.ticket)} required /> : null}
        {state.type === "link" ? <RecordSelect name="recordId" label={state.recordType === "inventory" ? "Inventory item" : "Repair ticket"} records={state.recordType === "inventory" ? connected.inventory : connected.repairs} required /> : null}
        <Textarea name="internalNote" label="Internal note" rows={4} required={state.type === "note"} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </form>
    </Drawer>
  );
}

function TicketDetailDrawer({ ticket, onClose, onEdit }: { ticket: SupportTicket; onClose: () => void; onEdit: (payload: EcosystemRecordPayload) => Promise<void> }) {
  const status = ticketStatus(ticket.status);
  const priority = ticketPriority(ticket.priority);
  return (
    <Drawer title={ticketSubject(ticket)} onClose={onClose}>
      <div className="space-y-5">
        <section className="rounded-xl bg-paper p-4">
          <div className="flex flex-wrap gap-2">
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", priorityClass(priority))}>{priority}</span>
            <span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(status))}>{status.replaceAll("_", " ")}</span>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", isSlaRisk(ticket) ? "bg-red-50 text-red-700" : "bg-white text-ink")}>{timeUntil(ticket.slaDueAt)}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{ticket.description ?? ticket.summary ?? "No description stored."}</p>
        </section>
        <div className="grid gap-3 sm:grid-cols-2">
          <MiniStat label="Ticket reference" value={ticketReference(ticket)} />
          <MiniStat label="Requester" value={ticketRequester(ticket)} />
          <MiniStat label="Owner" value={ticketOwner(ticket)} />
          <MiniStat label="Category" value={categoryLabel(ticket.category)} />
        </div>
        <section>
          <h3 className="font-semibold text-ink">Linked device lifecycle</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <MiniStat label="Inventory item" value={ticket.linkedInventoryId ?? ticket.inventoryId ?? "Not linked"} />
            <MiniStat label="Repair history" value={ticket.linkedRepairTicketId ?? ticket.repairTicketId ?? "Not linked"} />
            <MiniStat label="Donation record" value={ticket.linkedDonationId ?? ticket.donationId ?? "Not linked"} />
            <MiniStat label="Deployment record" value={ticket.linkedDeploymentId ?? ticket.deploymentId ?? "Not linked"} />
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-ink">Status transitions</h3>
            <select
              className="rounded-full border border-line px-3 py-2 text-xs font-semibold"
              defaultValue={status}
              onChange={(event) => void onEdit({ status: event.target.value })}
            >
              {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Conversation timeline</h3>
          <Timeline entries={ticket.timeline ?? []} fallback="No conversation or status activity recorded yet." />
        </section>
        <section>
          <h3 className="font-semibold text-ink">Internal notes</h3>
          <div className="mt-3 space-y-2">
            {supportNotes(ticket).map((note, index) => (
              <div key={note.id ?? index} className="rounded-lg border border-line p-3 text-sm">
                <p className="font-semibold text-ink">{note.note}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(note.createdAt)} · {note.author ?? "Support"}</p>
              </div>
            ))}
            {!supportNotes(ticket).length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No internal notes yet.</p> : null}
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Attachments and activity log</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <MiniStat label="Attachments" value={Array.isArray(ticket.attachments) ? ticket.attachments.length : 0} />
            <MiniStat label="Last activity" value={formatDate(ticket.lastActivityAt ?? ticket.updatedAt ?? ticket.createdAt)} />
          </div>
        </section>
      </div>
    </Drawer>
  );
}

function Timeline({ entries, fallback }: { entries: unknown[]; fallback: string }) {
  return (
    <div className="mt-3 space-y-2">
      {entries.map((entry, index) => {
        const item = typeof entry === "object" && entry ? entry as Record<string, unknown> : {};
        return (
          <div key={String(item.id ?? index)} className="rounded-lg border border-line p-3 text-sm">
            <p className="font-semibold text-ink">{String(item.title ?? "Support activity")}</p>
            <p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)} · {String(item.actorEmail ?? "System")}</p>
          </div>
        );
      })}
      {!entries.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">{fallback}</p> : null}
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

function Field({ name, label, type = "text", placeholder, defaultValue = "", required = false }: { name: string; label: string; type?: string; placeholder?: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} />
    </label>
  );
}

function Textarea({ name, label, placeholder, defaultValue = "", rows = 4, required = false }: { name: string; label: string; placeholder?: string; defaultValue?: string; rows?: number; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <textarea className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} placeholder={placeholder} defaultValue={defaultValue} rows={rows} required={required} />
    </label>
  );
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

function RecordSelect({ name, label, records, required = false }: { name: string; label: string; records: Array<ApiRecord | SupportTicket>; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select name={name} className="mt-2 w-full rounded-lg border border-line p-3 text-sm" required={required}>
        <option value="">No linked record</option>
        {records.map((record) => <option key={record.id} value={record.id}>{recordLabel(record)}</option>)}
      </select>
    </label>
  );
}
