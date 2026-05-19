"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconKey } from "@/components/icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminInventory } from "@/hooks/useAdminInventory";
import { cn } from "@/lib/utils";
import { adminApi, type ConditionGrade, type InventoryPayload, type InventoryStatus } from "@/lib/api";
import type { SystemHealthStatus } from "@/types/admin";
import type {
  AdminInventoryItem,
  AdminInventoryUpdate,
  InventoryDiagnostics,
  InventoryFilters,
  InventorySortKey,
  InventoryViewKey,
  InventoryWorkspaceView,
  SupportHistoryItem
} from "@/types/inventory";

const statusOptions: InventoryStatus[] = ["AVAILABLE", "RESERVED", "DEPLOYED", "REPAIR", "RETIRED"];
const gradeOptions: ConditionGrade[] = ["A", "B", "C", "PARTS_REPAIR"];
const boardStages: InventoryStatus[] = ["AVAILABLE", "RESERVED", "DEPLOYED", "REPAIR", "RETIRED"];

const deviceTypeOptions = [
  "Student laptop",
  "Business laptop",
  "Desktop PC",
  "Mini PC",
  "All-in-one PC",
  "Monitor",
  "Keyboard/mouse",
  "Headset",
  "Charger",
  "Computer lab bundle",
  "AI learning lab bundle"
];

const savedViews: Array<{ id: InventoryViewKey; label: string; icon: IconKey }> = [
  { id: "all", label: "All inventory", icon: "database" },
  { id: "available", label: "Available devices", icon: "check" },
  { id: "reserved", label: "Reserved devices", icon: "package" },
  { id: "deployed", label: "Deployed assets", icon: "truck" },
  { id: "repair", label: "Repair queue", icon: "wrench" },
  { id: "retired", label: "Retired assets", icon: "recycle" },
  { id: "labReady", label: "Lab-ready stock", icon: "school" },
  { id: "africaReady", label: "Africa-ready stock", icon: "globe" },
  { id: "missingAssetTags", label: "Missing asset tags", icon: "badge" },
  { id: "lowStock", label: "Low stock", icon: "chart" }
];

const initialFilters: InventoryFilters = {
  search: "",
  deviceType: "",
  brand: "",
  model: "",
  processor: "",
  ram: "",
  storage: "",
  conditionGrade: "ALL",
  status: "ALL",
  location: "",
  assignedTo: "",
  warrantyMonths: "ALL",
  priceRange: "ALL",
  africaReadyOnly: false,
  lowPowerOnly: false,
  labBundleReadyOnly: false,
  missingAssetTagOnly: false,
  dateAdded: "ALL"
};

type InventoryFormState = {
  assetTag: string;
  deviceType: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  conditionGrade: ConditionGrade;
  status: InventoryStatus;
  location: string;
  assignedTo: string;
  costPrice: string;
  suggestedPrice: string;
  warrantyMonths: string;
  africaReady: boolean;
  lowPowerSuitable: boolean;
  labBundleReady: boolean;
  notes: string;
};

type DetailTab = "overview" | "specifications" | "lifecycle" | "assignment" | "support" | "notes" | "metadata";

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function formatMoney(value?: number | null) {
  if (value === null || value === undefined) return "Not set";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }).format(value);
}

function isToday(value?: string | null) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.toDateString() === new Date().toDateString();
}

function isWithinDays(value: string | null | undefined, days: number) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= days * 24 * 60 * 60 * 1000;
}

function isLowPowerItem(item: AdminInventoryItem) {
  const text = `${item.deviceType} ${item.processor ?? ""} ${item.model ?? ""} ${item.notes ?? ""}`.toLowerCase();
  return Boolean(item.lowPowerSuitable)
    || text.includes("mini")
    || text.includes("tiny")
    || text.includes("micro")
    || text.includes("nuc")
    || text.includes("low power");
}

function isLabBundleReady(item: AdminInventoryItem) {
  const text = `${item.deviceType} ${item.notes ?? ""}`.toLowerCase();
  return Boolean(item.labBundleReady) || text.includes("lab") || text.includes("classroom");
}

function inventoryIcon(item: AdminInventoryItem): IconKey {
  const text = `${item.deviceType} ${item.model}`.toLowerCase();
  if (text.includes("laptop")) return "laptop";
  if (text.includes("desktop") || text.includes("all-in-one") || text.includes("monitor")) return "monitor";
  if (text.includes("mini") || text.includes("cpu")) return "cpu";
  if (text.includes("lab")) return "school";
  if (text.includes("headset")) return "headset";
  return "package";
}

function toNumberOrUndefined(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value).replaceAll("\n", " ");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportInventoryCsv(items: AdminInventoryItem[], filename = "sit-digital-access-inventory.csv") {
  const columns: Array<[string, keyof AdminInventoryItem]> = [
    ["Asset tag", "assetTag"],
    ["Device type", "deviceType"],
    ["Brand", "brand"],
    ["Model", "model"],
    ["Processor", "processor"],
    ["RAM", "ram"],
    ["Storage", "storage"],
    ["Grade", "conditionGrade"],
    ["Status", "status"],
    ["Location", "location"],
    ["Assigned to", "assignedTo"],
    ["Cost price", "costPrice"],
    ["Suggested price", "suggestedPrice"],
    ["Warranty months", "warrantyMonths"],
    ["Africa-ready", "africaReady"],
    ["Low-power", "lowPowerSuitable"],
    ["Lab-ready", "labBundleReady"],
    ["Created", "createdAt"],
    ["Updated", "updatedAt"],
    ["Notes", "notes"]
  ];
  const csv = [
    columns.map(([label]) => csvEscape(label)).join(","),
    ...items.map((item) => columns.map(([, key]) => csvEscape(item[key])).join(","))
  ].join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function inventoryToForm(item?: AdminInventoryItem): InventoryFormState {
  return {
    assetTag: item?.assetTag ?? "",
    deviceType: item?.deviceType ?? "Student laptop",
    brand: item?.brand ?? "",
    model: item?.model ?? "",
    processor: item?.processor ?? "",
    ram: item?.ram ?? "",
    storage: item?.storage ?? "",
    conditionGrade: item?.conditionGrade ?? "A",
    status: item?.status ?? "AVAILABLE",
    location: item?.location ?? "",
    assignedTo: item?.assignedTo ?? "",
    costPrice: item?.costPrice ? String(item.costPrice) : "",
    suggestedPrice: item?.suggestedPrice ? String(item.suggestedPrice) : "",
    warrantyMonths: item?.warrantyMonths ? String(item.warrantyMonths) : "",
    africaReady: Boolean(item?.africaReady),
    lowPowerSuitable: Boolean(item?.lowPowerSuitable),
    labBundleReady: Boolean(item?.labBundleReady),
    notes: item?.notes ?? ""
  };
}

function formToPayload(form: InventoryFormState): InventoryPayload {
  return {
    assetTag: form.assetTag.trim(),
    deviceType: form.deviceType.trim(),
    brand: form.brand.trim(),
    model: form.model.trim(),
    processor: form.processor.trim() || undefined,
    ram: form.ram.trim() || undefined,
    storage: form.storage.trim() || undefined,
    conditionGrade: form.conditionGrade,
    status: form.status,
    location: form.location.trim(),
    assignedTo: form.assignedTo.trim() || undefined,
    costPrice: toNumberOrUndefined(form.costPrice),
    suggestedPrice: toNumberOrUndefined(form.suggestedPrice),
    warrantyMonths: toNumberOrUndefined(form.warrantyMonths),
    africaReady: form.africaReady,
    lowPowerSuitable: form.lowPowerSuitable,
    labBundleReady: form.labBundleReady,
    notes: form.notes.trim() || undefined
  };
}

function SystemChip({
  label,
  value,
  tone = "light"
}: {
  label: string;
  value: string;
  tone?: "light" | "green" | "orange" | "dark" | "red";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
        tone === "light" && "bg-white text-ink ring-line",
        tone === "green" && "bg-green-50 text-green-700 ring-green-200",
        tone === "orange" && "bg-flame-50 text-flame-700 ring-flame-200",
        tone === "red" && "bg-red-50 text-red-700 ring-red-200",
        tone === "dark" && "bg-ink text-white ring-ink"
      )}
    >
      {label}: {value}
    </span>
  );
}

function InventoryHeader({
  health,
  role,
  lastSyncedAt,
  diagnosticsOpen,
  onDiagnostics,
  onRefresh,
  onExport,
  onCreate
}: {
  health: SystemHealthStatus;
  role: string;
  lastSyncedAt: Date | null;
  diagnosticsOpen: boolean;
  onDiagnostics: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onCreate: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-card lg:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Asset management</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Inventory Command Centre</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Manage refurbished laptops, desktops, mini PCs, accessories, lab bundles and deployment-ready assets.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SystemChip label="Auth" value={health.authTokenPresent ? "verified" : "token invalid"} tone={health.authTokenPresent ? "green" : "red"} />
            <SystemChip label="API" value={health.api} tone={health.api === "online" ? "green" : "orange"} />
            <SystemChip label="Firestore" value={health.firestore} tone={health.firestore === "connected" ? "green" : "orange"} />
            <SystemChip label="Admin role" value={role} tone="dark" />
            <SystemChip label="Last synced" value={lastSyncedAt ? formatDate(lastSyncedAt.toISOString()) : "Waiting"} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-orange transition hover:bg-flame-600"
          >
            <Icon name="package" className="h-4 w-4" />
            Add device
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700"
          >
            <Icon name="database" className="h-4 w-4" />
            Import CSV
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700"
          >
            <Icon name="cloud" className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700"
          >
            <Icon name="sparkles" className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={onDiagnostics}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
              diagnosticsOpen
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink hover:border-flame-200 hover:text-flame-700"
            )}
          >
            <Icon name="settings" className="h-4 w-4" />
            View diagnostics
          </button>
        </div>
      </div>
    </section>
  );
}

function InventoryDiagnosticsPanel({ diagnostics }: { diagnostics: InventoryDiagnostics }) {
  const rows = [
    ["Frontend Firebase project ID", diagnostics.firebaseProjectId ?? "Not configured"],
    ["API base URL", diagnostics.apiBaseUrl],
    ["Token present", diagnostics.tokenPresent ? "Yes" : "No"],
    ["Token expiry", diagnostics.tokenExpirationTime ? formatDate(diagnostics.tokenExpirationTime) : "Unknown"],
    ["User email", diagnostics.userEmail ?? "Not signed in"],
    ["Admin claims detected", diagnostics.adminClaims.length ? diagnostics.adminClaims.join(", ") : "None"],
    ["Backend response status", diagnostics.status ? String(diagnostics.status) : "No response yet"],
    ["Endpoint called", diagnostics.endpoint],
    ["Last message", diagnostics.message ?? "No API error recorded"]
  ];

  return (
    <div className="grid gap-3 text-sm md:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-white/45">{label}</p>
          <p className="mt-2 break-words font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function InventoryErrorState({
  diagnostics,
  onRefreshToken,
  onLogout,
  onRetry
}: {
  diagnostics: InventoryDiagnostics;
  onRefreshToken: () => void;
  onLogout: () => void;
  onRetry: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-red-200 bg-ink text-white shadow-card">
      <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.2fr] lg:p-8">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-200 ring-1 ring-red-300/30">
            <Icon name="shield" className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Admin authentication needs attention.</h3>
          <p className="mt-3 text-sm leading-6 text-white/70">
            The API rejected the current Firebase ID token. Refresh your session or sign in again to continue managing inventory.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRefreshToken}
              className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame-600"
            >
              <Icon name="sparkles" className="h-4 w-4" />
              Refresh token
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Icon name="close" className="h-4 w-4" />
              Sign out and sign in again
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Icon name="settings" className="h-4 w-4" />
              Retry
            </button>
            <a
              href="/README.md"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Icon name="book" className="h-4 w-4" />
              Open Firebase setup guide
            </a>
          </div>
        </div>
        <InventoryDiagnosticsPanel diagnostics={diagnostics} />
      </div>
    </section>
  );
}

function InventoryMetricCards({
  items,
  loading,
  lowStockCount,
  onFilter
}: {
  items: AdminInventoryItem[];
  loading: boolean;
  lowStockCount: number;
  onFilter: (patch: Partial<InventoryFilters>) => void;
}) {
  const metrics = [
    { label: "Total devices", value: items.length, icon: "database" as IconKey, patch: {} },
    { label: "Available", value: items.filter((item) => item.status === "AVAILABLE").length, icon: "check" as IconKey, patch: { status: "AVAILABLE" as const } },
    { label: "Reserved", value: items.filter((item) => item.status === "RESERVED").length, icon: "package" as IconKey, patch: { status: "RESERVED" as const } },
    { label: "Deployed", value: items.filter((item) => item.status === "DEPLOYED").length, icon: "truck" as IconKey, patch: { status: "DEPLOYED" as const } },
    { label: "In repair", value: items.filter((item) => item.status === "REPAIR").length, icon: "wrench" as IconKey, patch: { status: "REPAIR" as const } },
    { label: "Retired", value: items.filter((item) => item.status === "RETIRED").length, icon: "recycle" as IconKey, patch: { status: "RETIRED" as const } },
    { label: "Lab-ready bundles", value: items.filter(isLabBundleReady).length, icon: "school" as IconKey, patch: { labBundleReadyOnly: true } },
    { label: "Low stock categories", value: lowStockCount, icon: "chart" as IconKey, patch: {} }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <button
          key={metric.label}
          type="button"
          onClick={() => onFilter(metric.patch)}
          className="group rounded-[1.5rem] border border-line bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-card"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 ring-1 ring-flame-100 transition group-hover:bg-flame-500 group-hover:text-white">
              <Icon name={metric.icon} className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-line">Live</span>
          </div>
          {loading ? (
            <div className="mt-6 h-8 w-20 animate-pulse rounded-full bg-zinc-100" />
          ) : (
            <p className="mt-6 text-3xl font-semibold tracking-tight">{metric.value}</p>
          )}
          <p className="mt-1 text-sm font-semibold text-ink">{metric.label}</p>
          <p className="mt-3 text-xs text-muted">Trend will populate as inventory events grow.</p>
        </button>
      ))}
    </div>
  );
}

function InventorySavedViews({
  active,
  onSelect
}: {
  active: InventoryViewKey;
  onSelect: (view: InventoryViewKey) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-[1.5rem] border border-line bg-white p-2 shadow-sm">
      {savedViews.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onSelect(view.id)}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
            active === view.id ? "bg-ink text-white" : "text-muted hover:bg-zinc-50 hover:text-ink"
          )}
        >
          <Icon name={view.icon} className="h-4 w-4" />
          {view.label}
        </button>
      ))}
    </div>
  );
}

function InventoryFilterBar({
  filters,
  onChange,
  onClear,
  resultCount
}: {
  filters: InventoryFilters;
  onChange: (patch: Partial<InventoryFilters>) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const chips = [
    filters.status !== "ALL" && `Status: ${filters.status}`,
    filters.conditionGrade !== "ALL" && `Grade: ${filters.conditionGrade}`,
    filters.deviceType && `Type: ${filters.deviceType === "__LOW_STOCK__" ? "Low stock" : filters.deviceType}`,
    filters.brand && `Brand: ${filters.brand}`,
    filters.location && `Location: ${filters.location}`,
    filters.assignedTo && `Assigned: ${filters.assignedTo}`,
    filters.africaReadyOnly && "Africa-ready",
    filters.lowPowerOnly && "Low-power",
    filters.labBundleReadyOnly && "Lab-ready",
    filters.missingAssetTagOnly && "Missing tag"
  ].filter(Boolean) as string[];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[1.3fr_repeat(4,minmax(0,0.8fr))]">
        <label className="relative block">
          <span className="sr-only">Search inventory</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search asset tag, brand, model, location..."
            className="h-12 w-full rounded-2xl border border-line bg-zinc-50 pl-11 pr-4 text-sm outline-none transition focus:border-flame-300 focus:bg-white focus:ring-4 focus:ring-flame-100"
          />
        </label>
        <select
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value as InventoryFilters["status"] })}
          className="h-12 rounded-2xl border border-line bg-white px-4 text-sm font-medium outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
          aria-label="Status"
        >
          <option value="ALL">All statuses</option>
          {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
        </select>
        <select
          value={filters.conditionGrade}
          onChange={(event) => onChange({ conditionGrade: event.target.value as InventoryFilters["conditionGrade"] })}
          className="h-12 rounded-2xl border border-line bg-white px-4 text-sm font-medium outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
          aria-label="Condition grade"
        >
          <option value="ALL">All grades</option>
          {gradeOptions.map((grade) => <option key={grade} value={grade}>{formatLabel(grade)}</option>)}
        </select>
        <select
          value={filters.deviceType}
          onChange={(event) => onChange({ deviceType: event.target.value })}
          className="h-12 rounded-2xl border border-line bg-white px-4 text-sm font-medium outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
          aria-label="Device type"
        >
          <option value="">All device types</option>
          {deviceTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <button
          type="button"
          onClick={onClear}
          className="h-12 rounded-2xl border border-line px-4 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <input
          value={filters.brand}
          onChange={(event) => onChange({ brand: event.target.value })}
          placeholder="Brand"
          className="h-11 rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        />
        <input
          value={filters.model}
          onChange={(event) => onChange({ model: event.target.value })}
          placeholder="Model"
          className="h-11 rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        />
        <input
          value={filters.location}
          onChange={(event) => onChange({ location: event.target.value })}
          placeholder="Location"
          className="h-11 rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        />
        <input
          value={filters.assignedTo}
          onChange={(event) => onChange({ assignedTo: event.target.value })}
          placeholder="Assigned to"
          className="h-11 rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {[
          ["Africa-ready only", "africaReadyOnly"],
          ["Low-power only", "lowPowerOnly"],
          ["Lab-bundle ready", "labBundleReadyOnly"],
          ["Missing asset tag", "missingAssetTagOnly"]
        ].map(([label, key]) => (
          <label key={key} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-zinc-50 px-3 py-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={Boolean(filters[key as keyof InventoryFilters])}
              onChange={(event) => onChange({ [key]: event.target.checked } as Partial<InventoryFilters>)}
              className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
            />
            {label}
          </label>
        ))}
        <span className="ml-auto text-sm font-semibold text-muted">{resultCount} result{resultCount === 1 ? "" : "s"}</span>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700 ring-1 ring-flame-100">
              {chip}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function InventoryTable({
  items,
  selectedIds,
  sortKey,
  sortDirection,
  onSort,
  onSelect,
  onSelectAll,
  onOpen,
  onUpdate
}: {
  items: AdminInventoryItem[];
  selectedIds: Set<string>;
  sortKey: InventorySortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: InventorySortKey) => void;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onOpen: (item: AdminInventoryItem) => void;
  onUpdate: (id: string, body: AdminInventoryUpdate) => void;
}) {
  const headers: Array<{ key: InventorySortKey; label: string }> = [
    { key: "assetTag", label: "Asset tag" },
    { key: "deviceType", label: "Device" },
    { key: "brand", label: "Brand / model" },
    { key: "processor", label: "Processor" },
    { key: "ram", label: "RAM" },
    { key: "storage", label: "Storage" },
    { key: "conditionGrade", label: "Grade" },
    { key: "status", label: "Status" },
    { key: "location", label: "Location" },
    { key: "assignedTo", label: "Assigned" },
    { key: "suggestedPrice", label: "Price" },
    { key: "warrantyMonths", label: "Warranty" },
    { key: "updatedAt", label: "Updated" }
  ];

  return (
    <div className="hidden overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-[1280px] w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="w-12 px-4 py-4">
                <input
                  type="checkbox"
                  checked={items.length > 0 && items.every((item) => selectedIds.has(item.id))}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
                  aria-label="Select all inventory rows"
                />
              </th>
              {headers.map((header) => (
                <th key={header.key} className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onSort(header.key)}
                    className="inline-flex items-center gap-1 font-semibold hover:text-ink"
                  >
                    {header.label}
                    {sortKey === header.key && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
              ))}
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((item) => (
              <tr key={item.id} className="transition hover:bg-flame-50/40">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onSelect(item.id)}
                    className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
                    aria-label={`Select ${item.assetTag || item.model}`}
                  />
                </td>
                <td className="px-4 py-4 font-semibold text-ink">{item.assetTag || "Missing tag"}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 text-flame-600 ring-1 ring-line">
                      <Icon name={inventoryIcon(item)} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{item.deviceType}</p>
                      <p className="text-xs text-muted">{item.africaReady ? "Africa-ready" : "Standard stock"} · {isLowPowerItem(item) ? "Low power" : "General use"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-ink">{item.brand}</p>
                  <p className="text-xs text-muted">{item.model}</p>
                </td>
                <td className="px-4 py-4 text-muted">{item.processor ?? "Not set"}</td>
                <td className="px-4 py-4 text-muted">{item.ram ?? "Not set"}</td>
                <td className="px-4 py-4 text-muted">{item.storage ?? "Not set"}</td>
                <td className="px-4 py-4"><StatusBadge value={item.conditionGrade} /></td>
                <td className="px-4 py-4"><StatusBadge value={item.status} /></td>
                <td className="px-4 py-4 text-muted">{item.location}</td>
                <td className="px-4 py-4 text-muted">{item.assignedTo ?? "Unassigned"}</td>
                <td className="px-4 py-4 font-semibold text-ink">{formatMoney(item.suggestedPrice)}</td>
                <td className="px-4 py-4 text-muted">{item.warrantyMonths ? `${item.warrantyMonths} months` : "Not set"}</td>
                <td className="px-4 py-4 text-muted">{formatDate(item.updatedAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(item)}
                      className="rounded-full border border-line px-3 py-2 text-xs font-semibold transition hover:border-flame-200 hover:text-flame-700"
                    >
                      Open
                    </button>
                    <select
                      value={item.status}
                      onChange={(event) => onUpdate(item.id, { status: event.target.value as InventoryStatus })}
                      className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300 focus:ring-2 focus:ring-flame-100"
                      aria-label={`Update status for ${item.assetTag}`}
                    >
                      {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryMobileCards({
  items,
  selectedIds,
  onSelect,
  onOpen
}: {
  items: AdminInventoryItem[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onOpen: (item: AdminInventoryItem) => void;
}) {
  return (
    <div className="grid gap-4 xl:hidden">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(item)}
          className="rounded-[1.5rem] border border-line bg-white p-5 text-left shadow-sm transition hover:border-flame-200"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
                <Icon name={inventoryIcon(item)} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{item.assetTag || "Missing tag"}</p>
                <p className="text-sm text-muted">{item.brand} {item.model}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedIds.has(item.id)}
              onChange={(event) => {
                event.stopPropagation();
                onSelect(item.id);
              }}
              onClick={(event) => event.stopPropagation()}
              className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
              aria-label={`Select ${item.assetTag || item.model}`}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge value={item.status} />
            <StatusBadge value={item.conditionGrade} />
            {item.africaReady && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">Africa-ready</span>}
            {isLowPowerItem(item) && <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">Low-power</span>}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-muted">Location</p><p className="font-semibold">{item.location}</p></div>
            <div><p className="text-xs text-muted">Price</p><p className="font-semibold">{formatMoney(item.suggestedPrice)}</p></div>
            <div><p className="text-xs text-muted">RAM</p><p className="font-semibold">{item.ram ?? "Not set"}</p></div>
            <div><p className="text-xs text-muted">Storage</p><p className="font-semibold">{item.storage ?? "Not set"}</p></div>
          </div>
        </button>
      ))}
    </div>
  );
}

function InventoryBoardView({
  items,
  onOpen,
  onUpdate
}: {
  items: AdminInventoryItem[];
  onOpen: (item: AdminInventoryItem) => void;
  onUpdate: (id: string, body: AdminInventoryUpdate) => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-5">
      {boardStages.map((stage) => {
        const stageItems = items.filter((item) => item.status === stage);
        return (
          <div key={stage} className="rounded-[1.5rem] border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <StatusBadge value={stage} />
              <span className="text-sm font-semibold text-muted">{stageItems.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {stageItems.length === 0 && (
                <div className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">No assets in this lifecycle stage.</div>
              )}
              {stageItems.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpen(item)}
                  className="w-full rounded-2xl border border-line bg-zinc-50 p-4 text-left transition hover:border-flame-200 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-flame-600 ring-1 ring-line">
                      <Icon name={inventoryIcon(item)} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{item.assetTag || "Missing tag"}</p>
                      <p className="text-xs text-muted">{item.brand} {item.model}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge value={item.conditionGrade} />
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted ring-1 ring-line">{item.location}</span>
                  </div>
                  <select
                    value={item.status}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => onUpdate(item.id, { status: event.target.value as InventoryStatus })}
                    className="mt-3 w-full rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300"
                    aria-label={`Move ${item.assetTag}`}
                  >
                    {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                  </select>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function InventoryCategoryGrid({ items, onFilter }: { items: AdminInventoryItem[]; onFilter: (type: string) => void }) {
  const groups = Array.from(items.reduce((map, item) => {
    const current = map.get(item.deviceType) ?? [];
    current.push(item);
    map.set(item.deviceType, current);
    return map;
  }, new Map<string, AdminInventoryItem[]>()).entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {groups.length === 0 && (
        <div className="col-span-full rounded-[2rem] border border-dashed border-line bg-white p-8 text-center text-muted">
          Categories will appear once inventory records exist.
        </div>
      )}
      {groups.map(([type, group]) => {
        const available = group.filter((item) => item.status === "AVAILABLE").length;
        const labReady = group.filter(isLabBundleReady).length;
        const africaReady = group.filter((item) => item.africaReady).length;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onFilter(type)}
            className="rounded-[1.5rem] border border-line bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 ring-1 ring-flame-100">
                <Icon name={inventoryIcon(group[0])} className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{group.length} total</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{type}</h3>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-2xl bg-zinc-50 p-3"><p className="text-lg font-semibold">{available}</p><p className="text-muted">Available</p></div>
              <div className="rounded-2xl bg-zinc-50 p-3"><p className="text-lg font-semibold">{labReady}</p><p className="text-muted">Lab</p></div>
              <div className="rounded-2xl bg-zinc-50 p-3"><p className="text-lg font-semibold">{africaReady}</p><p className="text-muted">Africa</p></div>
            </div>
          </button>
        );
      })}
    </section>
  );
}

function InventoryDetailDrawer({
  item,
  tab,
  onTab,
  onClose,
  onEdit,
  onUpdate,
  onDelete,
  onRefresh
}: {
  item: AdminInventoryItem | null;
  tab: DetailTab;
  onTab: (tab: DetailTab) => void;
  onClose: () => void;
  onEdit: (item: AdminInventoryItem) => void;
  onUpdate: (id: string, body: AdminInventoryUpdate) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const { token } = useAdminAuth();
  const [note, setNote] = useState("");
  const [workflowBusy, setWorkflowBusy] = useState<string | null>(null);

  if (!item) return null;

  const createRepairTicket = async () => {
    if (!token) return;
    setWorkflowBusy("repair");
    try {
      await adminApi.createRepairTicketFromInventory(token, item.id, {
        title: `Repair ${item.assetTag}`,
        summary: item.notes ?? `${item.brand} ${item.model} needs diagnostics`,
        category: "Diagnostics",
        priority: item.status === "REPAIR" ? "HIGH" : "MEDIUM"
      });
      onRefresh();
    } finally {
      setWorkflowBusy(null);
    }
  };

  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "specifications", label: "Specifications" },
    { id: "lifecycle", label: "Lifecycle" },
    { id: "assignment", label: "Assignment" },
    { id: "support", label: "Support history" },
    { id: "notes", label: "Notes" },
    { id: "metadata", label: "API metadata" }
  ];

  const addNote = () => {
    if (!note.trim()) return;
    const nextHistory: SupportHistoryItem[] = [
      ...(item.supportHistory ?? []),
      { note: note.trim(), createdAt: new Date().toISOString(), author: "Admin" }
    ];
    onUpdate(item.id, { supportHistory: nextHistory });
    setNote("");
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 520 }}
          animate={{ x: 0 }}
          exit={{ x: 520 }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          onClick={(event) => event.stopPropagation()}
          className="ml-auto flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl"
        >
          <div className="border-b border-line p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Inventory record</p>
                <h3 className="mt-2 text-2xl font-semibold">{item.assetTag || "Missing asset tag"}</h3>
                <p className="mt-1 text-sm text-muted">{item.brand} {item.model} · {item.deviceType}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-line p-2 text-muted hover:text-ink">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge value={item.status} />
              <StatusBadge value={item.conditionGrade} />
              {item.africaReady && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">Africa-ready</span>}
              {isLowPowerItem(item) && <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">Low-power</span>}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-line p-3">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => onTab(tabItem.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition",
                  tab === tabItem.id ? "bg-ink text-white" : "text-muted hover:bg-zinc-50 hover:text-ink"
                )}
              >
                {tabItem.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {tab === "overview" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Asset tag", item.assetTag || "Missing"],
                  ["Device type", item.deviceType],
                  ["Brand", item.brand],
                  ["Model", item.model],
                  ["Location", item.location],
                  ["Assigned to", item.assignedTo ?? "Unassigned"],
                  ["Cost price", formatMoney(item.costPrice)],
                  ["Suggested price", formatMoney(item.suggestedPrice)],
                  ["Warranty", item.warrantyMonths ? `${item.warrantyMonths} months` : "Not set"],
                  ["Last updated", formatDate(item.updatedAt)]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-line bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
                    <p className="mt-2 font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "specifications" && (
              <div className="space-y-4">
                {[
                  ["Processor", item.processor ?? "Not set"],
                  ["RAM", item.ram ?? "Not set"],
                  ["Storage", item.storage ?? "Not set"],
                  ["Screen size", item.lifecycle?.screenSize ?? "Not recorded"],
                  ["Battery health", item.lifecycle?.batteryHealth ?? "Not recorded"],
                  ["OS installed", item.lifecycle?.osInstalled ?? "Not recorded"],
                  ["Accessories included", item.lifecycle?.accessoriesIncluded ?? "Not recorded"]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-line p-4">
                    <span className="text-sm text-muted">{label}</span>
                    <span className="text-sm font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "lifecycle" && (
              <div className="space-y-3">
                {[
                  ["Sourced", item.lifecycle?.sourcedDate],
                  ["Tested", item.lifecycle?.testedDate],
                  ["Wiped", item.lifecycle?.wipedDate],
                  ["Configured", item.lifecycle?.configuredDate],
                  ["Deployed", item.lifecycle?.deployedDate],
                  ["Retired", item.lifecycle?.retiredDate],
                  ["Last inspection", item.lifecycle?.lastInspection]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-flame-50 text-flame-600">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{label}</p>
                      <p className="text-sm text-muted">{typeof value === "string" ? formatDate(value) : "Not recorded"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "assignment" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Assigned organisation", item.lifecycle?.assignedOrganisation ?? item.assignedTo ?? "Unassigned"],
                  ["Organisation type", item.lifecycle?.organisationType ?? "Not recorded"],
                  ["Deployment country", item.lifecycle?.deploymentCountry ?? "Not recorded"],
                  ["Programme / cohort", item.lifecycle?.programmeOrCohort ?? "Not recorded"],
                  ["Support owner", item.lifecycle?.supportOwner ?? "Not assigned"],
                  ["Current location", item.location]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-line bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
                    <p className="mt-2 font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "support" && (
              <div className="space-y-4">
                {(item.supportHistory ?? []).length === 0 && (
                  <div className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">No support history has been recorded for this asset.</div>
                )}
                {(item.supportHistory ?? []).map((history, index) => (
                  <div key={`${history.createdAt}-${index}`} className="rounded-2xl border border-line bg-zinc-50 p-4">
                    <p className="font-semibold text-ink">{history.note}</p>
                    <p className="mt-2 text-xs text-muted">{history.author ?? "Admin"} · {formatDate(history.createdAt)}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-line p-4">
                  <label className="text-sm font-semibold text-ink" htmlFor="support-note">Add support note</label>
                  <textarea
                    id="support-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-line p-3 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
                    placeholder="Record repair notes, deployment observations or support actions..."
                  />
                  <button type="button" onClick={addNote} className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Add note</button>
                </div>
              </div>
            )}

            {tab === "notes" && (
              <div className="rounded-2xl border border-line bg-zinc-50 p-5 text-sm leading-6 text-muted">
                {item.notes || "No inventory notes recorded."}
              </div>
            )}

            {tab === "metadata" && (
              <pre className="overflow-x-auto rounded-2xl border border-line bg-zinc-950 p-5 text-xs leading-6 text-zinc-100">
                {JSON.stringify(item, null, 2)}
              </pre>
            )}
          </div>

          <div className="border-t border-line bg-zinc-50 p-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => onEdit(item)} className="rounded-full bg-flame-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame-600">
                Edit device
              </button>
              <select
                value={item.status}
                onChange={(event) => onUpdate(item.id, { status: event.target.value as InventoryStatus })}
                className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-flame-300"
                aria-label="Update device status"
              >
                {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
              </select>
              <button type="button" onClick={() => onUpdate(item.id, { status: "RESERVED", labBundleReady: true })} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:text-flame-700">
                Reserve for lab
              </button>
              <button type="button" onClick={() => onUpdate(item.id, { status: "DEPLOYED" })} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:text-flame-700">
                Mark deployed
              </button>
              <button type="button" onClick={() => onUpdate(item.id, { status: "REPAIR" })} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:text-flame-700">
                Move to repair
              </button>
              <button type="button" onClick={() => onUpdate(item.id, { status: "RETIRED" })} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:text-flame-700">
                Retire asset
              </button>
              <button type="button" onClick={() => void createRepairTicket()} disabled={workflowBusy === "repair"} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:text-flame-700 disabled:opacity-50">
                {workflowBusy === "repair" ? "Opening repair..." : "Open repair ticket"}
              </button>
              <button type="button" className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted">
                Duplicate record
              </button>
              <button type="button" onClick={() => onDelete(item.id)} className="rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">
                Delete record
              </button>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </AnimatePresence>
  );
}

function InventoryFormModal({
  open,
  item,
  onClose,
  onSubmit
}: {
  open: boolean;
  item: AdminInventoryItem | null;
  onClose: () => void;
  onSubmit: (payload: InventoryPayload, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<InventoryFormState>(() => inventoryToForm(item ?? undefined));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(inventoryToForm(item ?? undefined));
  }, [item, open]);

  if (!open) return null;

  const update = (patch: Partial<InventoryFormState>) => setForm((current) => ({ ...current, ...patch }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.form
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          onClick={(event) => event.stopPropagation()}
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            await onSubmit(formToPayload(form), item?.id);
            setSaving(false);
          }}
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">{item ? "Edit asset" : "New asset"}</p>
              <h3 className="mt-2 text-2xl font-semibold">{item ? "Update inventory record" : "Add inventory device"}</h3>
              <p className="mt-2 text-sm text-muted">Create deployment-ready records for refurbished devices, accessories and lab assets.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-line p-2 text-muted hover:text-ink">
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FormField label="Asset tag" required value={form.assetTag} onChange={(value) => update({ assetTag: value })} />
            <label className="block">
              <span className="text-sm font-semibold text-ink">Device type</span>
              <select
                required
                value={form.deviceType}
                onChange={(event) => update({ deviceType: event.target.value })}
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              >
                {deviceTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <FormField label="Brand" required value={form.brand} onChange={(value) => update({ brand: value })} />
            <FormField label="Model" required value={form.model} onChange={(value) => update({ model: value })} />
            <FormField label="Processor" value={form.processor} onChange={(value) => update({ processor: value })} />
            <FormField label="RAM" value={form.ram} onChange={(value) => update({ ram: value })} />
            <FormField label="Storage" value={form.storage} onChange={(value) => update({ storage: value })} />
            <label className="block">
              <span className="text-sm font-semibold text-ink">Condition grade</span>
              <select
                required
                value={form.conditionGrade}
                onChange={(event) => update({ conditionGrade: event.target.value as ConditionGrade })}
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              >
                {gradeOptions.map((grade) => <option key={grade} value={grade}>{formatLabel(grade)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Status</span>
              <select
                required
                value={form.status}
                onChange={(event) => update({ status: event.target.value as InventoryStatus })}
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              >
                {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
              </select>
            </label>
            <FormField label="Location" required value={form.location} onChange={(value) => update({ location: value })} />
            <FormField label="Assigned to" value={form.assignedTo} onChange={(value) => update({ assignedTo: value })} />
            <FormField label="Cost price" type="number" value={form.costPrice} onChange={(value) => update({ costPrice: value })} />
            <FormField label="Suggested price" type="number" value={form.suggestedPrice} onChange={(value) => update({ suggestedPrice: value })} />
            <FormField label="Warranty months" type="number" value={form.warrantyMonths} onChange={(value) => update({ warrantyMonths: value })} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Africa-ready", "africaReady"],
              ["Low-power suitable", "lowPowerSuitable"],
              ["Lab-bundle ready", "labBundleReady"]
            ].map(([label, key]) => (
              <label key={key} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-zinc-50 p-4 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={Boolean(form[key as keyof InventoryFormState])}
                  onChange={(event) => update({ [key]: event.target.checked } as Partial<InventoryFormState>)}
                  className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
                />
                {label}
              </label>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-ink">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => update({ notes: event.target.value })}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-line p-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              placeholder="Device condition, included accessories, deployment suitability or repair notes..."
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:bg-zinc-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-orange hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Saving..." : item ? "Save changes" : "Add device"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

function FormField({
  label,
  value,
  onChange,
  required,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "number";
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
      />
    </label>
  );
}

function FulfilmentMatchingPanel({ items }: { items: AdminInventoryItem[] }) {
  const available = items.filter((item) => item.status === "AVAILABLE");
  const laptops = available.filter((item) => /laptop/i.test(item.deviceType));
  const desktops = available.filter((item) => /desktop|all-in-one/i.test(item.deviceType));
  const mini = available.filter((item) => /mini/i.test(item.deviceType));
  const labReady = available.filter(isLabBundleReady);
  const africaReady = available.filter((item) => item.africaReady);

  const rows = [
    ["Matching available devices", available.length, "Ready for live request matching once requests are loaded."],
    ["Laptop stock", laptops.length, "Useful for learner and staff device requests."],
    ["Desktop / AIO stock", desktops.length, "Useful for fixed labs and office teams."],
    ["Mini PC stock", mini.length, "Low-power fit for compact labs and Africa deployment."],
    ["Lab bundle readiness", labReady.length, "Assets flagged for classroom bundles."],
    ["Africa deployment suitability", africaReady.length, "Devices marked for deployment-ready workflows."]
  ];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Fulfilment matching</p>
          <h3 className="mt-2 text-xl font-semibold">Inventory fit</h3>
          <p className="mt-2 text-sm text-muted">A practical view of stock readiness for pending device requests, lab bundles and Africa deployments.</p>
        </div>
        <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">Heuristic</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rows.map(([label, value, description]) => (
          <div key={label} className="rounded-2xl border border-line bg-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-2xl font-semibold text-flame-600">{value}</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
          </div>
        ))}
      </div>
      {available.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-white p-5 text-sm text-muted">
          No available inventory to match yet. Add available assets or import stock to unlock fulfilment recommendations.
        </div>
      )}
    </section>
  );
}

function LabBundleBuilder({ items }: { items: AdminInventoryItem[] }) {
  const available = items.filter((item) => item.status === "AVAILABLE");
  const labReady = available.filter((item) => isLabBundleReady(item) || /laptop|desktop|mini|all-in-one/i.test(item.deviceType));
  const accessoryCount = available.filter((item) => /monitor|keyboard|mouse|headset|charger/i.test(item.deviceType)).length;
  const bundles = [
    { name: "Starter lab", devices: 10, icon: "school" as IconKey, support: "Basic handover" },
    { name: "Growth lab", devices: 20, icon: "grid" as IconKey, support: "Setup and training" },
    { name: "Full lab", devices: 30, icon: "building" as IconKey, support: "Deployment model" },
    { name: "AI learning lab", devices: 24, icon: "sparkles" as IconKey, support: "AI literacy ready" },
    { name: "Low-power Africa lab", devices: 15, icon: "sun" as IconKey, support: "Power-aware setup" }
  ];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Lab bundle builder</p>
          <h3 className="mt-2 text-xl font-semibold">Draft classroom bundles from available stock.</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">Use this panel to estimate bundle readiness before reserving inventory for a school, NGO or Africa deployment.</p>
        </div>
        <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700 ring-1 ring-flame-100">{labReady.length} lab-fit devices available</span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {bundles.map((bundle) => {
          const availableCount = Math.min(bundle.devices, labReady.length);
          const missing = Math.max(bundle.devices - labReady.length, 0);
          return (
            <div key={bundle.name} className="rounded-2xl border border-line bg-zinc-50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-flame-600 ring-1 ring-line">
                <Icon name={bundle.icon} className="h-5 w-5" />
              </span>
              <h4 className="mt-4 font-semibold text-ink">{bundle.name}</h4>
              <p className="mt-1 text-sm text-muted">{bundle.devices} required devices</p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between"><span>Available match</span><strong>{availableCount}</strong></div>
                <div className="flex justify-between"><span>Missing</span><strong>{missing}</strong></div>
                <div className="flex justify-between"><span>Accessories</span><strong>{accessoryCount}</strong></div>
                <div className="flex justify-between"><span>Support</span><strong>{bundle.support}</strong></div>
              </div>
              <button type="button" className="mt-4 w-full rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-muted">
                Create bundle
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InventoryEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-[2rem] border border-dashed border-line bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-flame-50 text-flame-600 ring-1 ring-flame-100">
        <Icon name="database" className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold">No inventory records yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Refurbished laptops, desktops, mini PCs, accessories and lab bundles will appear here once inventory records are created or imported.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onCreate} className="rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-orange hover:bg-flame-600">
          Add first device
        </button>
        <button type="button" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700">
          Import CSV
        </button>
        <button type="button" onClick={onCreate} className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700">
          Create sample inventory
        </button>
        <a href="/README.md" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700">
          View API setup
        </a>
      </div>
    </section>
  );
}

function matchesFilters(item: AdminInventoryItem, filters: InventoryFilters, lowStockTypes: Set<string>) {
  const search = filters.search.trim().toLowerCase();
  const haystack = [
    item.assetTag,
    item.deviceType,
    item.brand,
    item.model,
    item.processor,
    item.ram,
    item.storage,
    item.location,
    item.assignedTo,
    item.notes
  ].filter(Boolean).join(" ").toLowerCase();

  if (search && !haystack.includes(search)) return false;
  if (filters.status !== "ALL" && item.status !== filters.status) return false;
  if (filters.conditionGrade !== "ALL" && item.conditionGrade !== filters.conditionGrade) return false;
  if (filters.deviceType && filters.deviceType !== "__LOW_STOCK__" && !item.deviceType.toLowerCase().includes(filters.deviceType.toLowerCase())) return false;
  if (filters.brand && !item.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
  if (filters.model && !item.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
  if (filters.processor && !(item.processor ?? "").toLowerCase().includes(filters.processor.toLowerCase())) return false;
  if (filters.ram && !(item.ram ?? "").toLowerCase().includes(filters.ram.toLowerCase())) return false;
  if (filters.storage && !(item.storage ?? "").toLowerCase().includes(filters.storage.toLowerCase())) return false;
  if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
  if (filters.assignedTo && !(item.assignedTo ?? "").toLowerCase().includes(filters.assignedTo.toLowerCase())) return false;
  if (filters.africaReadyOnly && !item.africaReady) return false;
  if (filters.lowPowerOnly && !isLowPowerItem(item)) return false;
  if (filters.labBundleReadyOnly && !isLabBundleReady(item)) return false;
  if (filters.missingAssetTagOnly && item.assetTag.trim()) return false;
  if (filters.dateAdded === "TODAY" && !isToday(item.createdAt)) return false;
  if (filters.dateAdded === "7_DAYS" && !isWithinDays(item.createdAt, 7)) return false;
  if (filters.dateAdded === "30_DAYS" && !isWithinDays(item.createdAt, 30)) return false;

  const price = item.suggestedPrice ?? 0;
  if (filters.priceRange === "0_150" && price > 150) return false;
  if (filters.priceRange === "151_300" && (price < 151 || price > 300)) return false;
  if (filters.priceRange === "301_600" && (price < 301 || price > 600)) return false;
  if (filters.priceRange === "601_PLUS" && price < 601) return false;

  const warranty = item.warrantyMonths ?? 0;
  if (filters.warrantyMonths === "NONE" && warranty > 0) return false;
  if (filters.warrantyMonths === "1_6" && (warranty < 1 || warranty > 6)) return false;
  if (filters.warrantyMonths === "7_12" && (warranty < 7 || warranty > 12)) return false;
  if (filters.warrantyMonths === "13_PLUS" && warranty < 13) return false;

  if (lowStockTypes.size > 0 && filters.deviceType === "__LOW_STOCK__" && !lowStockTypes.has(item.deviceType)) return false;

  return true;
}

function sortInventory(items: AdminInventoryItem[], sortKey: InventorySortKey, direction: "asc" | "desc") {
  return [...items].sort((a, b) => {
    const left = a[sortKey];
    const right = b[sortKey];
    const leftValue = typeof left === "number" ? left : String(left ?? "").toLowerCase();
    const rightValue = typeof right === "number" ? right : String(right ?? "").toLowerCase();
    if (leftValue < rightValue) return direction === "asc" ? -1 : 1;
    if (leftValue > rightValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

function lowStockTypes(items: AdminInventoryItem[]) {
  const availableByType = items.reduce((map, item) => {
    if (item.status === "AVAILABLE") {
      map.set(item.deviceType, (map.get(item.deviceType) ?? 0) + 1);
    }
    return map;
  }, new Map<string, number>());
  return new Set(Array.from(availableByType.entries()).filter(([, count]) => count < 3).map(([type]) => type));
}

function applySavedView(view: InventoryViewKey, setFilters: (filters: InventoryFilters) => void) {
  const base = { ...initialFilters };
  if (view === "available") base.status = "AVAILABLE";
  if (view === "reserved") base.status = "RESERVED";
  if (view === "deployed") base.status = "DEPLOYED";
  if (view === "repair") base.status = "REPAIR";
  if (view === "retired") base.status = "RETIRED";
  if (view === "labReady") base.labBundleReadyOnly = true;
  if (view === "africaReady") base.africaReadyOnly = true;
  if (view === "missingAssetTags") base.missingAssetTagOnly = true;
  if (view === "lowStock") base.deviceType = "__LOW_STOCK__";
  setFilters(base);
}

export function AdminInventoryWorkspace() {
  const {
    inventory,
    loading,
    errors,
    health,
    diagnostics,
    lastSyncedAt,
    actionMessage,
    actionError,
    refresh,
    refreshTokenAndData,
    logout,
    claims,
    createItem,
    updateItem,
    deleteItem,
    bulkUpdate
  } = useAdminInventory();

  const [filters, setFilters] = useState<InventoryFilters>(initialFilters);
  const [savedView, setSavedView] = useState<InventoryViewKey>("all");
  const [workspaceView, setWorkspaceView] = useState<InventoryWorkspaceView>("table");
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<AdminInventoryItem | null>(null);
  const [drawerTab, setDrawerTab] = useState<DetailTab>("overview");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminInventoryItem | null>(null);
  const [sortKey, setSortKey] = useState<InventorySortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const lowStockSet = useMemo(() => lowStockTypes(inventory), [inventory]);
  const role = diagnostics.adminClaims[0] ?? (claims?.superAdmin ? "superAdmin" : "admin");

  const filtered = useMemo(
    () => inventory.filter((item) => matchesFilters(item, filters, lowStockSet)),
    [filters, inventory, lowStockSet]
  );
  const sorted = useMemo(() => sortInventory(filtered, sortKey, sortDirection), [filtered, sortDirection, sortKey]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const selectedItems = sorted.filter((item) => selectedIds.has(item.id));

  const hasAuthError = errors.some((error) => error.status === 401 || error.status === 403 || /invalid firebase id token/i.test(error.message));
  const showDegraded = errors.length > 0;

  const setFilterPatch = (patch: Partial<InventoryFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const handleSavedView = (view: InventoryViewKey) => {
    setSavedView(view);
    applySavedView(view, (next) => {
      setFilters(next);
      setPage(1);
    });
  };

  const handleSort = (key: InventorySortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const handleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds((current) => {
      if (paginated.length > 0 && paginated.every((item) => current.has(item.id))) return new Set();
      return new Set(paginated.map((item) => item.id));
    });
  };

  const handleOpen = (item: AdminInventoryItem) => {
    setSelectedItem(item);
    setDrawerTab("overview");
  };

  const handleEdit = (item: AdminInventoryItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (payload: InventoryPayload, id?: string) => {
    const saved = id ? await updateItem(id, payload as AdminInventoryUpdate) : await createItem(payload);
    if (saved) {
      setFormOpen(false);
      setEditingItem(null);
      setSelectedItem(saved);
    }
  };

  const handleUpdate = async (id: string, body: AdminInventoryUpdate) => {
    const updated = await updateItem(id, body);
    if (updated && selectedItem?.id === id) setSelectedItem(updated);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteItem(id);
    if (ok) {
      setSelectedItem(null);
      setSelectedIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBulkStatus = async (status: InventoryStatus) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    await bulkUpdate(ids, { status });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <InventoryHeader
        health={health}
        role={role}
        lastSyncedAt={lastSyncedAt}
        diagnosticsOpen={diagnosticsOpen}
        onDiagnostics={() => setDiagnosticsOpen((value) => !value)}
        onRefresh={refresh}
        onExport={() => exportInventoryCsv(selectedItems.length ? selectedItems : sorted)}
        onCreate={handleCreate}
      />

      {diagnosticsOpen && (
        <section className="rounded-[2rem] bg-ink p-6 text-white shadow-card">
          <InventoryDiagnosticsPanel diagnostics={diagnostics} />
        </section>
      )}

      {showDegraded && (
        <InventoryErrorState
          diagnostics={diagnostics}
          onRefreshToken={refreshTokenAndData}
          onLogout={logout}
          onRetry={refresh}
        />
      )}

      {(actionMessage || actionError) && (
        <div
          className={cn(
            "rounded-2xl border p-4 text-sm font-semibold",
            actionError ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
          )}
        >
          {actionError ?? actionMessage}
        </div>
      )}

      <InventoryMetricCards
        items={inventory}
        loading={loading}
        lowStockCount={lowStockSet.size}
        onFilter={setFilterPatch}
      />

      <InventorySavedViews active={savedView} onSelect={handleSavedView} />

      <InventoryFilterBar
        filters={filters}
        onChange={setFilterPatch}
        onClear={() => {
          setFilters(initialFilters);
          setSavedView("all");
          setPage(1);
        }}
        resultCount={sorted.length}
      />

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-line bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["table", "board", "category"] as InventoryWorkspaceView[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setWorkspaceView(view)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold capitalize transition",
                workspaceView === view ? "bg-ink text-white" : "bg-zinc-50 text-muted hover:text-ink"
              )}
            >
              {view === "category" ? "Category grid" : `${view} view`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">{selectedIds.size} selected</span>
          <select
            onChange={(event) => {
              if (event.target.value) void handleBulkStatus(event.target.value as InventoryStatus);
              event.currentTarget.value = "";
            }}
            className="rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-flame-300"
            aria-label="Bulk status update"
            defaultValue=""
          >
            <option value="" disabled>Bulk status</option>
            {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
          </select>
          <button
            type="button"
            onClick={() => exportInventoryCsv(selectedItems.length ? selectedItems : sorted)}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700"
          >
            Export selected
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[1.5rem] border border-line bg-white shadow-sm" />
          ))}
        </div>
      )}

      {!loading && sorted.length === 0 && !showDegraded && <InventoryEmptyState onCreate={handleCreate} />}

      {!loading && sorted.length === 0 && showDegraded && (
        <section className="rounded-[2rem] border border-line bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold">Inventory data is temporarily unavailable</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
            The workspace is still usable, but live inventory records could not be loaded. Use diagnostics to confirm Firebase Admin credentials, Firestore status and token validity.
          </p>
        </section>
      )}

      {!loading && sorted.length > 0 && workspaceView === "table" && (
        <>
          <InventoryTable
            items={paginated}
            selectedIds={selectedIds}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onOpen={handleOpen}
            onUpdate={handleUpdate}
          />
          <InventoryMobileCards items={paginated} selectedIds={selectedIds} onSelect={handleSelect} onOpen={handleOpen} />
          <div className="flex items-center justify-between rounded-[1.5rem] border border-line bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-muted">Page {page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}

      {!loading && sorted.length > 0 && workspaceView === "board" && (
        <InventoryBoardView items={sorted} onOpen={handleOpen} onUpdate={handleUpdate} />
      )}

      {!loading && sorted.length > 0 && workspaceView === "category" && (
        <InventoryCategoryGrid items={sorted} onFilter={(type) => setFilterPatch({ deviceType: type })} />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <FulfilmentMatchingPanel items={inventory} />
        <LabBundleBuilder items={inventory} />
      </div>

      {hasAuthError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          The token recovery actions above are available because the API returned an authentication or authorization error.
        </div>
      )}

      <InventoryDetailDrawer
        item={selectedItem}
        tab={drawerTab}
        onTab={setDrawerTab}
        onClose={() => setSelectedItem(null)}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onRefresh={refresh}
      />

      <InventoryFormModal
        open={formOpen}
        item={editingItem}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
