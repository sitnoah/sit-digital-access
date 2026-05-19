"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconKey } from "@/components/icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminEnquiries } from "@/hooks/useAdminEnquiries";
import { cn } from "@/lib/utils";
import type { EnquiryPriority, EnquiryStatus, EnquiryType } from "@/lib/api";
import type {
  AdminEnquiry,
  AdminEnquiryCreate,
  AdminEnquiryUpdate,
  EnquiryFilters,
  EnquirySortKey,
  EnquiryTableView,
  EnquiryViewKey
} from "@/types/enquiry";
import type { SystemHealthStatus } from "@/types/admin";

const statusOptions: EnquiryStatus[] = ["NEW", "REVIEWING", "CONTACTED", "QUALIFIED", "CLOSED"];
const priorityOptions: EnquiryPriority[] = ["LOW", "MEDIUM", "HIGH"];
const enquiryTypeOptions: EnquiryType[] = [
  "CONTACT",
  "REQUEST_DEVICES",
  "PARTNERSHIP",
  "DEVICE_DONATION",
  "AFRICA_DEPLOYMENT",
  "IT_SUPPORT",
  "SPONSORSHIP",
  "SCHOOL_ENQUIRY",
  "SME_NGO",
  "PROGRAMME_ENQUIRY",
  "SERVICE_ENQUIRY"
];

const organisationTypes = [
  "Individual",
  "School",
  "Training centre",
  "SME",
  "NGO",
  "Company",
  "Donor / CSR team",
  "Government / ministry",
  "Community organisation"
];

const savedViews: Array<{ id: EnquiryViewKey; label: string; icon: IconKey }> = [
  { id: "all", label: "All enquiries", icon: "mail" },
  { id: "newToday", label: "New today", icon: "sparkles" },
  { id: "africa", label: "Africa deployment", icon: "globe" },
  { id: "deviceRequests", label: "Device requests", icon: "laptop" },
  { id: "partnership", label: "Partnership leads", icon: "handshake" },
  { id: "highPriority", label: "High priority", icon: "badge" },
  { id: "unassigned", label: "Unassigned", icon: "users" }
];

const initialFilters: EnquiryFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
  enquiryType: "ALL",
  organisationType: "",
  country: "",
  dateRange: "ALL",
  assignedOwner: "",
  hasNotes: false,
  highPriorityOnly: false
};

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string) {
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

function isToday(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function isWithinDays(value: string | undefined, days: number) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= days * 24 * 60 * 60 * 1000;
}

function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value).replaceAll("\n", " ");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportEnquiriesCsv(enquiries: AdminEnquiry[], filename = "sit-digital-access-enquiries.csv") {
  const columns: Array<[string, keyof AdminEnquiry]> = [
    ["Name", "fullName"],
    ["Organisation", "organisation"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Country", "country"],
    ["Type", "enquiryType"],
    ["Organisation type", "organisationType"],
    ["Status", "status"],
    ["Priority", "priority"],
    ["Owner", "assignedOwner"],
    ["Created", "createdAt"],
    ["Updated", "updatedAt"],
    ["Message", "message"]
  ];
  const csv = [
    columns.map(([label]) => csvEscape(label)).join(","),
    ...enquiries.map((item) => columns.map(([, key]) => csvEscape(item[key])).join(","))
  ].join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SystemChip({ label, value, tone = "light" }: { label: string; value: string; tone?: "light" | "green" | "orange" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
        tone === "light" && "bg-white text-ink ring-line",
        tone === "green" && "bg-green-50 text-green-700 ring-green-200",
        tone === "orange" && "bg-flame-50 text-flame-700 ring-flame-200",
        tone === "dark" && "bg-ink text-white ring-ink"
      )}
    >
      {label}: {value}
    </span>
  );
}

function EnquiriesHeader({
  health,
  role,
  lastSyncedAt,
  onRefresh,
  onExport,
  onDiagnostics,
  onCreate
}: {
  health: SystemHealthStatus;
  role: string;
  lastSyncedAt: Date | null;
  onRefresh: () => void;
  onExport: () => void;
  onDiagnostics: () => void;
  onCreate: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-card lg:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Admin workspace</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Enquiries Inbox</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Manage contact, partnership, school lab, SME/NGO, donation and Africa deployment enquiries from one workspace.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SystemChip label="Firestore" value={health.firestore} tone={health.firestore === "connected" ? "green" : "orange"} />
            <SystemChip label="API" value={health.api} tone={health.api === "online" ? "green" : "orange"} />
            <SystemChip label="Admin role" value={role} tone="dark" />
            <SystemChip label="Last synced" value={lastSyncedAt ? formatDate(lastSyncedAt.toISOString()) : "Waiting"} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:flex">
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-flame-300" onClick={onExport}>
            Export CSV
          </button>
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-flame-300" onClick={onCreate}>
            Create enquiry
          </button>
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-flame-300" onClick={onRefresh}>
            Refresh
          </button>
          <button className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-flame-600" onClick={onDiagnostics}>
            View diagnostics
          </button>
        </div>
      </div>
    </section>
  );
}

function EnquiryMetricCards({
  enquiries,
  loading,
  onFilter
}: {
  enquiries: AdminEnquiry[];
  loading: boolean;
  onFilter: (patch: Partial<EnquiryFilters>, view?: EnquiryViewKey) => void;
}) {
  const cards = [
    { label: "New enquiries", value: enquiries.filter((item) => item.status === "NEW").length, icon: "mail" as IconKey, patch: { status: "NEW" as const } },
    { label: "Reviewing", value: enquiries.filter((item) => item.status === "REVIEWING").length, icon: "search" as IconKey, patch: { status: "REVIEWING" as const } },
    { label: "Contacted", value: enquiries.filter((item) => item.status === "CONTACTED").length, icon: "phone" as IconKey, patch: { status: "CONTACTED" as const } },
    { label: "Qualified", value: enquiries.filter((item) => item.status === "QUALIFIED").length, icon: "check" as IconKey, patch: { status: "QUALIFIED" as const } },
    { label: "Closed", value: enquiries.filter((item) => item.status === "CLOSED").length, icon: "badge" as IconKey, patch: { status: "CLOSED" as const } },
    { label: "High priority", value: enquiries.filter((item) => item.priority === "HIGH").length, icon: "shield" as IconKey, patch: { priority: "HIGH" as const, highPriorityOnly: true }, view: "highPriority" as const },
    { label: "Africa deployment", value: enquiries.filter((item) => item.enquiryType === "AFRICA_DEPLOYMENT").length, icon: "globe" as IconKey, patch: { enquiryType: "AFRICA_DEPLOYMENT" as const }, view: "africa" as const },
    { label: "Partnership leads", value: enquiries.filter((item) => item.enquiryType === "PARTNERSHIP").length, icon: "handshake" as IconKey, patch: { enquiryType: "PARTNERSHIP" as const }, view: "partnership" as const }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.label}
          className="group rounded-[1.5rem] border border-line bg-white p-5 text-left shadow-card transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft"
          onClick={() => onFilter(card.patch, card.view)}
        >
          {loading ? (
            <div className="space-y-4">
              <div className="h-11 w-11 animate-pulse rounded-2xl bg-line" />
              <div className="h-7 w-20 animate-pulse rounded bg-line" />
              <div className="h-4 w-28 animate-pulse rounded bg-line" />
            </div>
          ) : (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/20">
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              <p className="mt-5 text-3xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-2 text-sm font-semibold text-muted">{card.label}</p>
              <p className="mt-4 text-xs font-semibold text-flame-600">Click to filter</p>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

function EnquiryFilterBar({
  filters,
  setFilters,
  countries,
  owners,
  activeView,
  setActiveView,
  view,
  setView,
  selectedCount,
  onClear,
  onExportSelected,
  onBulkReviewing,
  onQuickAction
}: {
  filters: EnquiryFilters;
  setFilters: (filters: EnquiryFilters) => void;
  countries: string[];
  owners: string[];
  activeView: EnquiryViewKey;
  setActiveView: (view: EnquiryViewKey) => void;
  view: EnquiryTableView;
  setView: (view: EnquiryTableView) => void;
  selectedCount: number;
  onClear: () => void;
  onExportSelected: () => void;
  onBulkReviewing: () => void;
  onQuickAction: (label: string) => void;
}) {
  function applyView(nextView: EnquiryViewKey) {
    setActiveView(nextView);
    const base = { ...initialFilters };
    if (nextView === "newToday") setFilters({ ...base, status: "NEW", dateRange: "TODAY" });
    else if (nextView === "africa") setFilters({ ...base, enquiryType: "AFRICA_DEPLOYMENT" });
    else if (nextView === "deviceRequests") setFilters({ ...base, enquiryType: "REQUEST_DEVICES" });
    else if (nextView === "partnership") setFilters({ ...base, enquiryType: "PARTNERSHIP" });
    else if (nextView === "highPriority") setFilters({ ...base, priority: "HIGH", highPriorityOnly: true });
    else if (nextView === "unassigned") setFilters({ ...base, assignedOwner: "__UNASSIGNED__" });
    else setFilters(base);
  }

  const activeChips = [
    filters.search && `Search: ${filters.search}`,
    filters.status !== "ALL" && `Status: ${formatLabel(filters.status)}`,
    filters.priority !== "ALL" && `Priority: ${formatLabel(filters.priority)}`,
    filters.enquiryType !== "ALL" && `Type: ${formatLabel(filters.enquiryType)}`,
    filters.organisationType && `Org: ${filters.organisationType}`,
    filters.country && `Country: ${filters.country}`,
    filters.dateRange !== "ALL" && `Date: ${formatLabel(filters.dateRange)}`,
    filters.assignedOwner && `Owner: ${filters.assignedOwner === "__UNASSIGNED__" ? "Unassigned" : filters.assignedOwner}`,
    filters.hasNotes && "Has notes",
    filters.highPriorityOnly && "High priority only"
  ].filter(Boolean);

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {savedViews.map((savedView) => (
            <button
              key={savedView.id}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
                activeView === savedView.id
                  ? "bg-ink text-white ring-ink"
                  : "bg-paper text-ink ring-line hover:bg-flame-50 hover:text-flame-700"
              )}
              onClick={() => applyView(savedView.id)}
            >
              <Icon name={savedView.icon} className="h-4 w-4" />
              {savedView.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", view === "table" ? "bg-flame-500 text-white ring-flame-500" : "bg-white ring-line")} onClick={() => setView("table")}>
            Table view
          </button>
          <button className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", view === "pipeline" ? "bg-flame-500 text-white ring-flame-500" : "bg-white ring-line")} onClick={() => setView("pipeline")}>
            Pipeline view
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <label className="text-xs font-semibold text-muted">
          Search
          <input
            className="mt-1 min-h-11 w-full rounded-2xl border border-line px-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
            placeholder="Search name, email, organisation or message..."
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
        </label>
        <SelectFilter label="Status" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value as EnquiryFilters["status"] })} options={["ALL", ...statusOptions]} />
        <SelectFilter label="Priority" value={filters.priority} onChange={(value) => setFilters({ ...filters, priority: value as EnquiryFilters["priority"] })} options={["ALL", ...priorityOptions]} />
        <SelectFilter label="Type" value={filters.enquiryType} onChange={(value) => setFilters({ ...filters, enquiryType: value as EnquiryFilters["enquiryType"] })} options={["ALL", ...enquiryTypeOptions]} />
        <SelectFilter label="Date range" value={filters.dateRange} onChange={(value) => setFilters({ ...filters, dateRange: value as EnquiryFilters["dateRange"] })} options={["ALL", "TODAY", "7_DAYS", "30_DAYS"]} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <SelectFilter label="Organisation type" value={filters.organisationType || "ALL"} onChange={(value) => setFilters({ ...filters, organisationType: value === "ALL" ? "" : value })} options={["ALL", ...organisationTypes]} />
        <SelectFilter label="Country" value={filters.country || "ALL"} onChange={(value) => setFilters({ ...filters, country: value === "ALL" ? "" : value })} options={["ALL", ...countries]} />
        <SelectFilter label="Assigned owner" value={filters.assignedOwner || "ALL"} onChange={(value) => setFilters({ ...filters, assignedOwner: value === "ALL" ? "" : value })} options={["ALL", "__UNASSIGNED__", ...owners]} optionLabels={{ __UNASSIGNED__: "Unassigned" }} />
        <label className="flex min-h-16 items-center gap-3 rounded-2xl border border-line px-4 text-sm font-semibold">
          <input type="checkbox" checked={filters.hasNotes} onChange={(event) => setFilters({ ...filters, hasNotes: event.target.checked })} />
          Has notes
        </label>
        <label className="flex min-h-16 items-center gap-3 rounded-2xl border border-line px-4 text-sm font-semibold">
          <input type="checkbox" checked={filters.highPriorityOnly} onChange={(event) => setFilters({ ...filters, highPriorityOnly: event.target.checked, priority: event.target.checked ? "HIGH" : filters.priority })} />
          High priority only
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {activeChips.length ? activeChips.map((chip) => (
            <span key={String(chip)} className="rounded-full bg-flame-50 px-3 py-1.5 text-xs font-semibold text-flame-700 ring-1 ring-flame-100">
              {chip}
            </span>
          )) : (
            <span className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-muted">No active filters</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClear}>Clear filters</button>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-45" onClick={onExportSelected} disabled={selectedCount === 0}>
            Export selected ({selectedCount})
          </button>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-45" onClick={onBulkReviewing} disabled={selectedCount === 0}>
            Mark reviewing
          </button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => onQuickAction("Quick actions are available through selected exports, reviewing status updates, owner assignment and the enquiry detail drawer.")}>
            Quick actions
          </button>
        </div>
      </div>
    </section>
  );
}

function SelectFilter({
  label,
  value,
  options,
  optionLabels,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs font-semibold text-muted">
      {label}
      <select
        className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? (option === "ALL" ? `All ${label.toLowerCase()}` : formatLabel(option))}
          </option>
        ))}
      </select>
    </label>
  );
}

function EnquiryErrorState({
  health,
  open,
  onToggle,
  onRetry
}: {
  health: SystemHealthStatus;
  open: boolean;
  onToggle: () => void;
  onRetry: () => void;
}) {
  if (health.failingEndpoints.length === 0) return null;
  const error = health.failingEndpoints[0];

  return (
    <section className="rounded-[1.5rem] border border-flame-200 bg-flame-50 p-5 text-flame-950">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-flame-600 shadow-sm">
            <Icon name="shield" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold">Some enquiries could not be loaded.</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-flame-900/75">
              The admin workspace is available, but the API request failed. Empty-state values are shown until the connection is restored.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white" onClick={onRetry}>Retry</button>
              <button className="rounded-full border border-flame-200 bg-white px-4 py-2 text-sm font-semibold" onClick={onToggle}>
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
          <div className="flex justify-between gap-4"><span className="text-muted">Auth</span><strong>{health.authTokenPresent ? "Verified" : "Missing"}</strong></div>
        </div>
      </div>
      {open ? (
        <div className="mt-5 rounded-2xl border border-flame-200 bg-white p-4">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div><span className="block text-muted">API base URL</span><strong className="break-all">{health.apiBaseUrl}</strong></div>
            <div><span className="block text-muted">Endpoint called</span><strong>{error.path}</strong></div>
            <div><span className="block text-muted">Last status</span><strong>{error.status ?? "Network"}</strong></div>
            <div><span className="block text-muted">Auth token present</span><strong>{health.authTokenPresent ? "Yes" : "No"}</strong></div>
            <div><span className="block text-muted">Firebase configured</span><strong>{health.firebaseProjectConfigured ? "Yes" : "No"}</strong></div>
            <div><span className="block text-muted">Suggested fix</span><strong>{error.suggestedFix}</strong></div>
          </div>
          <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-muted">{error.message}</p>
        </div>
      ) : null}
    </section>
  );
}

function EnquiryEmptyState({ onCreateTest }: { onCreateTest: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-8 text-center shadow-card">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.22),transparent_60%),#f6f6f6] text-flame-600">
        <Icon name="mail" className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">No enquiries yet</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">
        New contact, device, donation, partnership and Africa deployment enquiries will appear here when public forms are submitted.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button className="rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white" onClick={onCreateTest}>Create test enquiry</button>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold" href="/contact">Open contact page</Link>
        <a className="rounded-full border border-line px-4 py-2 text-sm font-semibold" href="http://localhost:8080/api/v1" target="_blank" rel="noreferrer">View API setup</a>
      </div>
      <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
        {["Contact form", "Donate devices", "Africa deployment"].map((route) => (
          <div key={route} className="rounded-2xl bg-paper p-4 text-sm font-semibold text-muted">
            {route}
          </div>
        ))}
      </div>
    </section>
  );
}

function EnquiryTable({
  enquiries,
  selectedIds,
  onToggle,
  onTogglePage,
  onOpen,
  sortKey,
  sortDirection,
  onSort
}: {
  enquiries: AdminEnquiry[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onTogglePage: () => void;
  onOpen: (item: AdminEnquiry) => void;
  sortKey: EnquirySortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: EnquirySortKey) => void;
}) {
  const allSelected = enquiries.length > 0 && enquiries.every((item) => selectedIds.has(item.id));

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[1080px] w-full text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-4"><input type="checkbox" checked={allSelected} onChange={onTogglePage} /></th>
              {[
                ["fullName", "Enquirer"],
                ["organisation", "Organisation"],
                ["enquiryType", "Enquiry type"],
                ["country", "Country/location"],
                ["status", "Status"],
                ["priority", "Priority"],
                ["createdAt", "Created"],
                ["updatedAt", "Last update"]
              ].map(([key, label]) => (
                <th key={key} className="px-4 py-4">
                  <button className="inline-flex items-center gap-1 font-semibold" onClick={() => onSort(key as EnquirySortKey)}>
                    {label}
                    {sortKey === key ? <Icon name="chevron" className={cn("h-3 w-3", sortDirection === "asc" && "rotate-180")} /> : null}
                  </button>
                </th>
              ))}
              <th className="px-4 py-4">Owner</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {enquiries.map((item) => (
              <tr key={item.id} className="transition hover:bg-flame-50/50">
                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => onToggle(item.id)} /></td>
                <td className="px-4 py-4">
                  <button className="text-left" onClick={() => onOpen(item)}>
                    <span className="block font-semibold text-ink">{item.fullName}</span>
                    <span className="block text-xs text-muted">{item.email}</span>
                  </button>
                </td>
                <td className="px-4 py-4 text-muted">{item.organisation || "Not provided"}</td>
                <td className="px-4 py-4">{formatLabel(item.enquiryType)}</td>
                <td className="px-4 py-4 text-muted">{item.country || item.deploymentLocation || "Not provided"}</td>
                <td className="px-4 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-4 py-4"><StatusBadge value={item.priority} /></td>
                <td className="px-4 py-4 text-muted">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-4 text-muted">{formatDate(item.updatedAt)}</td>
                <td className="px-4 py-4 text-muted">{item.assignedOwner || "Unassigned"}</td>
                <td className="px-4 py-4">
                  <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold" onClick={() => onOpen(item)}>Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-4 lg:hidden">
        {enquiries.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <label className="flex gap-3">
                <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => onToggle(item.id)} />
                <span>
                  <strong className="block">{item.fullName}</strong>
                  <span className="text-sm text-muted">{item.email}</span>
                </span>
              </label>
              <button className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold" onClick={() => onOpen(item)}>Open</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge value={item.status} />
              <StatusBadge value={item.priority} />
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted">{formatLabel(item.enquiryType)}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{item.organisation || "No organisation"} · {item.country}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EnquiryPipelineView({
  enquiries,
  onOpen,
  onMove
}: {
  enquiries: AdminEnquiry[];
  onOpen: (item: AdminEnquiry) => void;
  onMove: (item: AdminEnquiry, status: EnquiryStatus) => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-5">
      {statusOptions.map((status) => {
        const columnItems = enquiries.filter((item) => item.status === status);
        return (
          <div key={status} className="rounded-[1.5rem] border border-line bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{formatLabel(status)}</h3>
              <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted">{columnItems.length}</span>
            </div>
            <div className="mt-4 grid gap-3">
              {columnItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-paper p-4 text-sm text-muted">No records</div>
              ) : columnItems.map((item) => (
                <article key={item.id} className="rounded-2xl border border-line bg-paper p-4">
                  <button className="text-left" onClick={() => onOpen(item)}>
                    <strong className="block text-sm">{item.fullName}</strong>
                    <span className="mt-1 block text-xs leading-5 text-muted">{item.organisation || item.email}</span>
                  </button>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <StatusBadge value={item.priority} />
                    <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-muted">{item.country}</span>
                  </div>
                  {status !== "REVIEWING" ? (
                    <button className="mt-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-line" onClick={() => onMove(item, "REVIEWING")}>
                      Move to reviewing
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function EnquiryDetailDrawer({
  enquiry,
  onClose,
  onUpdate,
  onPlaceholder
}: {
  enquiry: AdminEnquiry | null;
  onClose: () => void;
  onUpdate: (id: string, body: AdminEnquiryUpdate) => Promise<AdminEnquiry | null>;
  onPlaceholder: (message: string) => void;
}) {
  const [tab, setTab] = useState<"overview" | "notes" | "activity" | "related" | "metadata">("overview");
  const [notes, setNotes] = useState("");
  const [owner, setOwner] = useState("");

  useEffect(() => {
    setNotes(enquiry?.internalNotes ?? "");
    setOwner(enquiry?.assignedOwner ?? "");
    setTab("overview");
  }, [enquiry]);

  if (!enquiry) return null;
  const activeEnquiry = enquiry;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(activeEnquiry.email);
      onPlaceholder("Email copied to clipboard.");
    } catch {
      onPlaceholder("Unable to copy email in this browser.");
    }
  }

  const detailRows = [
    ["Email", enquiry.email],
    ["Phone", enquiry.phone || "Not provided"],
    ["Organisation", enquiry.organisation || "Not provided"],
    ["Organisation type", enquiry.organisationType || "Not provided"],
    ["Country/location", enquiry.country || enquiry.deploymentLocation || "Not provided"],
    ["Enquiry type", formatLabel(enquiry.enquiryType)],
    ["Created date", formatDate(enquiry.createdAt)],
    ["Last updated", formatDate(enquiry.updatedAt)]
  ];

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 540, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 540, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-line bg-white p-5 shadow-soft sm:w-[560px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Enquiry detail</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{enquiry.fullName}</h3>
            <p className="mt-1 text-sm text-muted">{enquiry.email}</p>
          </div>
          <button className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close detail drawer">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-line bg-paper p-4 sm:grid-cols-2">
          <SelectFilter label="Status" value={enquiry.status} options={statusOptions} onChange={(status) => void onUpdate(enquiry.id, { status: status as EnquiryStatus })} />
          <SelectFilter label="Priority" value={enquiry.priority} options={priorityOptions} onChange={(priority) => void onUpdate(enquiry.id, { priority: priority as EnquiryPriority })} />
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted">
              Assigned owner
              <input
                className="mt-1 min-h-11 w-full rounded-2xl border border-line px-4 text-sm text-ink outline-none"
                value={owner}
                placeholder="Assign owner"
                onChange={(event) => setOwner(event.target.value)}
              />
            </label>
            <button className="mt-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-line" onClick={() => void onUpdate(enquiry.id, { assignedOwner: owner })}>
              Save owner
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className="rounded-full border border-line px-3 py-2 text-xs font-semibold" onClick={copyEmail}>Copy email</button>
          <button className="rounded-full border border-line px-3 py-2 text-xs font-semibold" onClick={() => onPlaceholder("Reply by email will connect to an email provider later.")}>Reply by email</button>
          <button className="rounded-full border border-line px-3 py-2 text-xs font-semibold" onClick={() => onPlaceholder("Conversion to device request is prepared as a future workflow.")}>Convert to device request</button>
          <button className="rounded-full border border-line px-3 py-2 text-xs font-semibold" onClick={() => onPlaceholder("Conversion to partnership lead is prepared as a future workflow.")}>Convert to partnership lead</button>
          <button className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white" onClick={() => void onUpdate(enquiry.id, { status: "CLOSED" })}>Mark closed</button>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto">
          {(["overview", "notes", "activity", "related", "metadata"] as const).map((drawerTab) => (
            <button
              key={drawerTab}
              className={cn("shrink-0 rounded-full px-3 py-2 text-xs font-semibold ring-1", tab === drawerTab ? "bg-flame-500 text-white ring-flame-500" : "bg-white ring-line")}
              onClick={() => setTab(drawerTab)}
            >
              {formatLabel(drawerTab)}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Message</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{enquiry.message || "No message provided."}</p>
            </div>
            {detailRows.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
                <p className="mt-2 text-sm leading-6">{value}</p>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "notes" ? (
          <div className="mt-5 rounded-2xl border border-line p-4">
            <label className="text-sm font-semibold">
              Internal note
              <textarea
                className="mt-2 min-h-40 w-full rounded-2xl border border-line p-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
            <button className="mt-3 rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white" onClick={() => void onUpdate(enquiry.id, { internalNotes: notes })}>
              Save note
            </button>
          </div>
        ) : null}

        {tab === "activity" ? (
          <div className="mt-5 rounded-2xl border border-line p-4">
            <p className="text-sm font-semibold">Activity</p>
            <p className="mt-2 text-sm leading-6 text-muted">Audit events for this enquiry are captured by the API. A full activity stream can be connected here from audit logs.</p>
          </div>
        ) : null}

        {tab === "related" ? (
          <div className="mt-5 rounded-2xl border border-line p-4">
            <p className="text-sm font-semibold">Related records</p>
            <p className="mt-2 text-sm leading-6 text-muted">Device requests, donations and partnership records created from this enquiry will appear here.</p>
          </div>
        ) : null}

        {tab === "metadata" ? (
          <pre className="mt-5 overflow-auto rounded-2xl bg-ink p-4 text-xs leading-5 text-white">
            {JSON.stringify(enquiry, null, 2)}
          </pre>
        ) : null}
      </motion.aside>
    </AnimatePresence>
  );
}

function CreateEnquiryModal({
  open,
  onClose,
  onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (body: AdminEnquiryCreate) => Promise<AdminEnquiry | null>;
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    const created = await onCreate({
      fullName: String(form.get("fullName")),
      organisation: String(form.get("organisation") || ""),
      email: String(form.get("email")),
      phone: String(form.get("phone") || ""),
      country: String(form.get("country")),
      enquiryType: String(form.get("enquiryType")) as EnquiryType,
      organisationType: String(form.get("organisationType") || ""),
      priority: String(form.get("priority")) as EnquiryPriority,
      message: String(form.get("message")),
      assignedOwner: String(form.get("assignedOwner") || ""),
      internalNotes: String(form.get("internalNotes") || ""),
      sourcePage: "admin"
    });
    setLoading(false);
    if (created) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] bg-white p-6 shadow-2xl" onSubmit={submit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Manual enquiry</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Create enquiry</h3>
          </div>
          <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close create enquiry">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["fullName", "Name", true],
            ["organisation", "Organisation", false],
            ["email", "Email", true],
            ["phone", "Phone", false],
            ["country", "Country / location", true],
            ["assignedOwner", "Assigned owner", false]
          ].map(([name, label, required]) => (
            <label key={String(name)} className="text-xs font-semibold text-muted">
              {label}
              <input className="mt-1 min-h-11 w-full rounded-2xl border border-line px-4 text-sm text-ink" name={String(name)} required={Boolean(required)} type={name === "email" ? "email" : "text"} />
            </label>
          ))}
          <SelectForm name="enquiryType" label="Enquiry type" options={enquiryTypeOptions} />
          <SelectForm name="organisationType" label="Organisation type" options={organisationTypes} />
          <SelectForm name="priority" label="Priority" options={priorityOptions} />
          <label className="text-xs font-semibold text-muted sm:col-span-2">
            Message
            <textarea className="mt-1 min-h-32 w-full rounded-2xl border border-line p-4 text-sm text-ink" name="message" minLength={10} required />
          </label>
          <label className="text-xs font-semibold text-muted sm:col-span-2">
            Internal notes
            <textarea className="mt-1 min-h-24 w-full rounded-2xl border border-line p-4 text-sm text-ink" name="internalNotes" />
          </label>
        </div>
        <button className="mt-5 min-h-11 rounded-full bg-flame-500 px-5 text-sm font-semibold text-white disabled:opacity-55" disabled={loading}>
          {loading ? "Creating..." : "Create enquiry"}
        </button>
      </form>
    </div>
  );
}

function SelectForm({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="text-xs font-semibold text-muted">
      {label}
      <select className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink" name={name}>
        {options.map((option) => (
          <option key={option} value={option}>{formatLabel(option)}</option>
        ))}
      </select>
    </label>
  );
}

export function AdminEnquiriesPage() {
  const { roles } = useAdminAuth();
  const {
    enquiries,
    loading,
    health,
    lastSyncedAt,
    actionMessage,
    actionError,
    refresh,
    createEnquiry,
    updateEnquiry,
    bulkUpdate
  } = useAdminEnquiries();
  const [filters, setFilters] = useState<EnquiryFilters>(initialFilters);
  const [activeView, setActiveView] = useState<EnquiryViewKey>("all");
  const [view, setView] = useState<EnquiryTableView>("table");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<EnquirySortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const pageSize = 10;

  const countries = useMemo(() => Array.from(new Set(enquiries.map((item) => item.country).filter(Boolean))).sort(), [enquiries]);
  const owners = useMemo(() => Array.from(new Set(enquiries.map((item) => item.assignedOwner).filter(Boolean) as string[])).sort(), [enquiries]);

  useEffect(() => {
    setPage(1);
  }, [filters, view]);

  useEffect(() => {
    if (!selectedEnquiry) return;
    const latest = enquiries.find((item) => item.id === selectedEnquiry.id);
    if (latest) setSelectedEnquiry(latest);
  }, [enquiries, selectedEnquiry]);

  const filtered = useMemo(() => {
    return enquiries.filter((item) => {
      const search = filters.search.toLowerCase().trim();
      const haystack = [
        item.fullName,
        item.email,
        item.organisation,
        item.country,
        item.enquiryType,
        item.organisationType,
        item.message,
        item.assignedOwner
      ].join(" ").toLowerCase();
      if (search && !haystack.includes(search)) return false;
      if (filters.status !== "ALL" && item.status !== filters.status) return false;
      if (filters.priority !== "ALL" && item.priority !== filters.priority) return false;
      if (filters.enquiryType !== "ALL" && item.enquiryType !== filters.enquiryType) return false;
      if (filters.organisationType && item.organisationType !== filters.organisationType) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.assignedOwner === "__UNASSIGNED__" && item.assignedOwner) return false;
      if (filters.assignedOwner && filters.assignedOwner !== "__UNASSIGNED__" && item.assignedOwner !== filters.assignedOwner) return false;
      if (filters.hasNotes && !item.internalNotes) return false;
      if (filters.highPriorityOnly && item.priority !== "HIGH") return false;
      if (filters.dateRange === "TODAY" && !isToday(item.createdAt)) return false;
      if (filters.dateRange === "7_DAYS" && !isWithinDays(item.createdAt, 7)) return false;
      if (filters.dateRange === "30_DAYS" && !isWithinDays(item.createdAt, 30)) return false;
      return true;
    });
  }, [enquiries, filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aValue = String(a[sortKey] ?? "");
      const bValue = String(b[sortKey] ?? "");
      const result = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? result : -result;
    });
  }, [filtered, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const selectedRows = enquiries.filter((item) => selectedIds.has(item.id));

  function applyMetricFilter(patch: Partial<EnquiryFilters>, nextView?: EnquiryViewKey) {
    setFilters({ ...initialFilters, ...patch });
    if (nextView) setActiveView(nextView);
  }

  function toggleSort(key: EnquirySortKey) {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function togglePageSelected() {
    setSelectedIds((current) => {
      const next = new Set(current);
      const allSelected = paginated.length > 0 && paginated.every((item) => next.has(item.id));
      paginated.forEach((item) => {
        if (allSelected) next.delete(item.id);
        else next.add(item.id);
      });
      return next;
    });
  }

  function createTestEnquiry() {
    void createEnquiry({
      fullName: "Test Enquirer",
      organisation: "SIT Digital Access",
      email: "hello@sitdigitalaccess.example",
      country: "United Kingdom",
      enquiryType: "CONTACT",
      organisationType: "Company",
      priority: "MEDIUM",
      message: "This is a test enquiry created from the admin inbox empty state.",
      assignedOwner: roles[0] ?? "admin",
      internalNotes: "Created from admin empty state.",
      sourcePage: "admin-empty-state"
    });
  }

  async function updateSelected(body: AdminEnquiryUpdate) {
    const ids = Array.from(selectedIds);
    await bulkUpdate(ids, body);
    setSelectedIds(new Set());
  }

  return (
    <div className="space-y-6">
      <EnquiriesHeader
        health={health}
        role={roles[0] ?? "admin"}
        lastSyncedAt={lastSyncedAt}
        onRefresh={refresh}
        onExport={() => exportEnquiriesCsv(filtered)}
        onDiagnostics={() => setDiagnosticsOpen((value) => !value)}
        onCreate={() => setCreateOpen(true)}
      />

      <EnquiryErrorState health={health} open={diagnosticsOpen} onToggle={() => setDiagnosticsOpen((value) => !value)} onRetry={refresh} />

      {(actionMessage || actionError || notice) ? (
        <div className={cn("rounded-2xl border p-4 text-sm font-semibold", actionError ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700")}>
          {actionError || actionMessage || notice}
        </div>
      ) : null}

      <EnquiryMetricCards enquiries={enquiries} loading={loading} onFilter={applyMetricFilter} />

      <EnquiryFilterBar
        filters={filters}
        setFilters={setFilters}
        countries={countries}
        owners={owners}
        activeView={activeView}
        setActiveView={setActiveView}
        view={view}
        setView={setView}
        selectedCount={selectedIds.size}
        onClear={() => {
          setFilters(initialFilters);
          setActiveView("all");
        }}
        onExportSelected={() => exportEnquiriesCsv(selectedRows, "sit-digital-access-selected-enquiries.csv")}
        onBulkReviewing={() => void updateSelected({ status: "REVIEWING" })}
        onQuickAction={setNotice}
      />

      {loading ? (
        <div className="grid gap-4">
          <div className="h-20 animate-pulse rounded-[1.5rem] bg-line" />
          <div className="h-72 animate-pulse rounded-[1.5rem] bg-line" />
        </div>
      ) : sorted.length === 0 ? (
        <EnquiryEmptyState onCreateTest={createTestEnquiry} />
      ) : view === "table" ? (
        <>
          <EnquiryTable
            enquiries={paginated}
            selectedIds={selectedIds}
            onToggle={toggleSelected}
            onTogglePage={togglePageSelected}
            onOpen={setSelectedEnquiry}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-line bg-white p-4 text-sm shadow-card sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-muted">
              Showing {paginated.length} of {sorted.length} filtered enquiries
            </p>
            <div className="flex gap-2">
              <button className="rounded-full border border-line px-4 py-2 font-semibold disabled:opacity-45" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
              <span className="rounded-full bg-paper px-4 py-2 font-semibold">Page {page} of {totalPages}</span>
              <button className="rounded-full border border-line px-4 py-2 font-semibold disabled:opacity-45" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
            </div>
          </div>
        </>
      ) : (
        <EnquiryPipelineView enquiries={sorted} onOpen={setSelectedEnquiry} onMove={(item, status) => void updateEnquiry(item.id, { status })} />
      )}

      <EnquiryDetailDrawer
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onUpdate={updateEnquiry}
        onPlaceholder={setNotice}
      />

      <CreateEnquiryModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createEnquiry} />
    </div>
  );
}
