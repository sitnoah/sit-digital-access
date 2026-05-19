"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconKey } from "@/components/icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminDeviceRequests } from "@/hooks/useAdminDeviceRequests";
import { cn } from "@/lib/utils";
import { adminApi, type DeviceRequestStatus } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";
import type {
  AdminDeviceCategory,
  AdminDeviceRequest,
  AdminDeviceRequestCreate,
  AdminDeviceRequestUpdate,
  AdminInventoryLite,
  DeviceRequestFilters,
  DeviceRequestPriority,
  DeviceRequestSortKey,
  DeviceRequestViewKey,
  DeviceRequestWorkspaceView
} from "@/types/device-request";

const statusOptions: DeviceRequestStatus[] = ["NEW", "REVIEWING", "QUOTED", "RESERVED", "FULFILLED", "CLOSED"];
const priorityOptions: DeviceRequestPriority[] = ["LOW", "MEDIUM", "HIGH"];
const categoryOptions: AdminDeviceCategory[] = [
  "STUDENT_LAPTOPS",
  "BUSINESS_LAPTOPS",
  "DESKTOP_PCS",
  "MINI_PCS",
  "ALL_IN_ONE_PCS",
  "COMPUTER_LAB_BUNDLES",
  "AI_LEARNING_LAB_BUNDLES",
  "ACCESSORIES"
];

const deploymentTypeOptions = [
  "Individual device",
  "School lab",
  "NGO field kit",
  "Africa shipment",
  "Low-power lab"
];

const savedViews: Array<{ id: DeviceRequestViewKey; label: string; icon: IconKey }> = [
  { id: "all", label: "All requests", icon: "laptop" },
  { id: "newToday", label: "New today", icon: "sparkles" },
  { id: "labBundles", label: "Lab bundles", icon: "school" },
  { id: "africaDeployment", label: "Africa deployment", icon: "globe" },
  { id: "highQuantity", label: "High quantity", icon: "package" },
  { id: "quoteRequired", label: "Quote required", icon: "cost" },
  { id: "unassigned", label: "Unassigned", icon: "users" },
  { id: "fulfilmentReady", label: "Fulfilment ready", icon: "check" }
];

const initialFilters: DeviceRequestFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
  deviceCategory: "ALL",
  quantityRange: "ALL",
  budgetRange: "",
  country: "",
  deploymentType: "",
  requiredBy: "ALL",
  assignedOwner: "",
  highPriorityOnly: false
};

const priorityRank: Record<DeviceRequestPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

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
  return date.getTime() - Date.now() <= days * 24 * 60 * 60 * 1000 && date.getTime() >= Date.now();
}

function isOverdue(value?: string | null) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

function isLabRequest(request: AdminDeviceRequest) {
  return request.deviceCategory === "COMPUTER_LAB_BUNDLES" || request.deviceCategory === "AI_LEARNING_LAB_BUNDLES" || /lab|classroom/i.test(request.deploymentType ?? "");
}

function isAfricaRequest(request: AdminDeviceRequest) {
  const haystack = `${request.country} ${request.deploymentLocation} ${request.deploymentType ?? ""}`.toLowerCase();
  return ["africa", "liberia", "ghana", "sierra leone", "nigeria"].some((term) => haystack.includes(term));
}

function requiresQuote(request: AdminDeviceRequest) {
  return !request.budgetRange || /quote|custom|not sure|planning/i.test(request.budgetRange);
}

function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value).replaceAll("\n", " ");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportDeviceRequestsCsv(requests: AdminDeviceRequest[], filename = "sit-digital-access-device-requests.csv") {
  const columns: Array<[string, keyof AdminDeviceRequest]> = [
    ["Requester", "requesterName"],
    ["Organisation", "organisation"],
    ["Email", "email"],
    ["Country", "country"],
    ["Device category", "deviceCategory"],
    ["Quantity", "quantity"],
    ["Budget", "budgetRange"],
    ["Deployment location", "deploymentLocation"],
    ["Required by", "requiredBy"],
    ["Status", "status"],
    ["Priority", "priority"],
    ["Owner", "assignedOwner"],
    ["Created", "createdAt"],
    ["Updated", "updatedAt"],
    ["Notes", "notes"]
  ];
  const csv = [
    columns.map(([label]) => csvEscape(label)).join(","),
    ...requests.map((item) => columns.map(([, key]) => csvEscape(item[key])).join(","))
  ].join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SystemChip({ label, value, tone = "light" }: { label: string; value: string; tone?: "light" | "green" | "orange" | "dark" | "red" }) {
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

function categoryIcon(category: AdminDeviceCategory): IconKey {
  if (category.includes("LAPTOP")) return "laptop";
  if (category.includes("DESKTOP") || category.includes("ALL_IN_ONE")) return "monitor";
  if (category.includes("MINI")) return "cpu";
  if (category.includes("LAB")) return "school";
  return "package";
}

function requestMatchesInventory(request: AdminDeviceRequest, item: AdminInventoryLite) {
  if (item.status && item.status !== "AVAILABLE") return false;
  const text = `${item.deviceType ?? ""} ${item.brand ?? ""} ${item.model ?? ""} ${item.notes ?? ""}`.toLowerCase();
  const keywordMap: Record<AdminDeviceCategory, string[]> = {
    STUDENT_LAPTOPS: ["laptop", "notebook", "chromebook"],
    BUSINESS_LAPTOPS: ["laptop", "notebook", "thinkpad", "latitude", "elitebook"],
    DESKTOP_PCS: ["desktop", "tower", "sff", "pc"],
    MINI_PCS: ["mini", "micro", "tiny", "nuc"],
    ALL_IN_ONE_PCS: ["all-in-one", "aio", "all in one"],
    COMPUTER_LAB_BUNDLES: ["laptop", "desktop", "mini", "pc"],
    AI_LEARNING_LAB_BUNDLES: ["laptop", "desktop", "mini", "pc"],
    ACCESSORIES: ["monitor", "keyboard", "mouse", "headset", "accessory"]
  };
  return keywordMap[request.deviceCategory].some((keyword) => text.includes(keyword));
}

function DeviceRequestsHeader({
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Fulfilment workspace</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Device Request Command Centre</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Manage structured requests for laptops, desktops, mini PCs, accessories, computer labs and deployment bundles.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SystemChip label="Auth" value={health.authTokenPresent ? "verified" : "token invalid"} tone={health.authTokenPresent ? "green" : "red"} />
            <SystemChip label="API" value={health.api} tone={health.api === "online" ? "green" : "orange"} />
            <SystemChip label="Firestore" value={health.firestore} tone={health.firestore === "connected" ? "green" : "orange"} />
            <SystemChip label="Admin role" value={role} tone="dark" />
            <SystemChip label="Last synced" value={lastSyncedAt ? formatDate(lastSyncedAt.toISOString()) : "Waiting"} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:flex">
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-flame-300" onClick={onExport}>
            Export CSV
          </button>
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-flame-300" onClick={onCreate}>
            Create request
          </button>
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-sm transition hover:border-flame-300" onClick={onRefresh}>
            Refresh
          </button>
          <button className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-flame-600" onClick={onDiagnostics}>
            {diagnosticsOpen ? "Hide diagnostics" : "View diagnostics"}
          </button>
        </div>
      </div>
    </section>
  );
}

function DeviceRequestErrorState({
  errors,
  diagnostics,
  open,
  onToggle,
  onRetry,
  onRefreshToken,
  onLogout
}: {
  errors: AdminEndpointError[];
  diagnostics: {
    apiBaseUrl: string;
    endpoint: string;
    tokenPresent: boolean;
    tokenExpirationTime: string | null;
    userEmail: string | null;
    adminClaims: string[];
    firebaseProjectId: string | null;
    status?: number;
    message?: string;
  };
  open: boolean;
  onToggle: () => void;
  onRetry: () => void;
  onRefreshToken: () => void;
  onLogout: () => void;
}) {
  if (!errors.length && !open) return null;

  const firstError = errors[0];
  const authIssue = firstError
    ? firstError.status === 401 || firstError.status === 403 || /invalid firebase id token|missing firebase id token/i.test(firstError.message)
    : !diagnostics.tokenPresent;

  return (
    <section className={cn("rounded-[2rem] border p-6 shadow-card", authIssue ? "border-red-200 bg-red-50" : "border-flame-200 bg-flame-50")}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white", authIssue ? "bg-red-600" : "bg-flame-600")}>
            <Icon name={authIssue ? "shield" : "database"} className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold">
              {authIssue ? "Admin authentication needs attention." : "Some device requests could not be loaded."}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              {authIssue
                ? "The API rejected the current Firebase ID token. This can happen if the token expired, the Firebase project does not match the backend, or the API is using different Firebase Admin credentials."
                : "The workspace is available, but one or more admin requests failed. Empty-state values are shown until the connection is restored."}
            </p>
            {firstError ? (
              <p className="mt-2 rounded-2xl bg-white/70 px-3 py-2 text-sm font-medium text-ink ring-1 ring-black/5">
                {firstError.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-80">
          {authIssue ? (
            <>
              <button className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={onRefreshToken}>
                Refresh token
              </button>
              <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-red-300" onClick={onLogout}>
                Sign out and sign in
              </button>
            </>
          ) : (
            <button className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600 sm:col-span-2" onClick={onRetry}>
              Retry
            </button>
          )}
          <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-flame-300" onClick={onToggle}>
            {open ? "Hide diagnostics" : "View diagnostics"}
          </button>
          <Link
            href={diagnostics.firebaseProjectId ? `https://console.firebase.google.com/project/${diagnostics.firebaseProjectId}/authentication/providers` : "https://console.firebase.google.com/"}
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-flame-300"
          >
            Open Firebase setup
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid gap-3 rounded-3xl border border-black/5 bg-white p-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <DiagnosticItem label="Frontend Firebase project" value={diagnostics.firebaseProjectId ?? "Missing"} />
              <DiagnosticItem label="API base URL" value={diagnostics.apiBaseUrl} />
              <DiagnosticItem label="Token present" value={diagnostics.tokenPresent ? "Yes" : "No"} />
              <DiagnosticItem label="Token expiry" value={diagnostics.tokenExpirationTime ?? "Unknown"} />
              <DiagnosticItem label="User email" value={diagnostics.userEmail ?? "Unknown"} />
              <DiagnosticItem label="Admin claims" value={diagnostics.adminClaims.length ? diagnostics.adminClaims.join(", ") : "None detected"} />
              <DiagnosticItem label="Backend status" value={diagnostics.status ? String(diagnostics.status) : "No response"} />
              <DiagnosticItem label="Endpoint called" value={diagnostics.endpoint} />
              <div className="sm:col-span-2 xl:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Suggested fix</p>
                <p className="mt-1 text-sm text-ink">
                  {firstError?.suggestedFix ?? "Refresh the token, confirm the Firebase project IDs match, then retry the request."}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function DiagnosticItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-paper p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function DeviceRequestMetricCards({
  requests,
  loading,
  onFilter
}: {
  requests: AdminDeviceRequest[];
  loading: boolean;
  onFilter: (patch: Partial<DeviceRequestFilters>, view?: DeviceRequestViewKey) => void;
}) {
  const cards = [
    { label: "New requests", value: requests.filter((item) => item.status === "NEW").length, icon: "mail" as IconKey, patch: { status: "NEW" as const } },
    { label: "Reviewing", value: requests.filter((item) => item.status === "REVIEWING").length, icon: "search" as IconKey, patch: { status: "REVIEWING" as const } },
    { label: "Quoted", value: requests.filter((item) => item.status === "QUOTED").length, icon: "cost" as IconKey, patch: { status: "QUOTED" as const } },
    { label: "Reserved", value: requests.filter((item) => item.status === "RESERVED").length, icon: "package" as IconKey, patch: { status: "RESERVED" as const } },
    { label: "Fulfilled", value: requests.filter((item) => item.status === "FULFILLED").length, icon: "check" as IconKey, patch: { status: "FULFILLED" as const } },
    { label: "High priority", value: requests.filter((item) => item.priority === "HIGH").length, icon: "shield" as IconKey, patch: { priority: "HIGH" as const, highPriorityOnly: true } },
    { label: "Lab bundle requests", value: requests.filter(isLabRequest).length, icon: "school" as IconKey, patch: { deviceCategory: "COMPUTER_LAB_BUNDLES" as const }, view: "labBundles" as const },
    { label: "Africa deployment", value: requests.filter(isAfricaRequest).length, icon: "globe" as IconKey, patch: { deploymentType: "Africa shipment" }, view: "africaDeployment" as const }
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
              <div className="h-8 w-20 animate-pulse rounded-full bg-line" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-line" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 transition group-hover:bg-flame-500 group-hover:text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-muted">Live</span>
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{card.label}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper">
                <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-flame-500 to-orange-300" />
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

function DeviceRequestSavedViews({
  activeView,
  onSelect
}: {
  activeView: DeviceRequestViewKey;
  onSelect: (view: DeviceRequestViewKey) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {savedViews.map((view) => (
        <button
          key={view.id}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
            activeView === view.id
              ? "bg-ink text-white ring-ink"
              : "bg-white text-ink ring-line hover:ring-flame-300"
          )}
          onClick={() => onSelect(view.id)}
        >
          <Icon name={view.icon} className="h-4 w-4" />
          {view.label}
        </button>
      ))}
    </div>
  );
}

function DeviceRequestFilterBar({
  filters,
  activeView,
  workspaceView,
  countries,
  owners,
  selectedCount,
  onFiltersChange,
  onSavedView,
  onWorkspaceViewChange,
  onClear,
  onExportSelected,
  onBulkReviewing
}: {
  filters: DeviceRequestFilters;
  activeView: DeviceRequestViewKey;
  workspaceView: DeviceRequestWorkspaceView;
  countries: string[];
  owners: string[];
  selectedCount: number;
  onFiltersChange: (patch: Partial<DeviceRequestFilters>) => void;
  onSavedView: (view: DeviceRequestViewKey) => void;
  onWorkspaceViewChange: (view: DeviceRequestWorkspaceView) => void;
  onClear: () => void;
  onExportSelected: () => void;
  onBulkReviewing: () => void;
}) {
  const activeChips = [
    filters.status !== "ALL" ? `Status: ${formatLabel(filters.status)}` : null,
    filters.priority !== "ALL" ? `Priority: ${formatLabel(filters.priority)}` : null,
    filters.deviceCategory !== "ALL" ? `Category: ${formatLabel(filters.deviceCategory)}` : null,
    filters.quantityRange !== "ALL" ? `Quantity: ${filters.quantityRange.replace("_", "-")}` : null,
    filters.country ? `Country: ${filters.country}` : null,
    filters.deploymentType ? `Deployment: ${filters.deploymentType}` : null,
    filters.requiredBy !== "ALL" ? `Required: ${formatLabel(filters.requiredBy)}` : null,
    filters.assignedOwner ? `Owner: ${filters.assignedOwner}` : null,
    filters.highPriorityOnly ? "High priority only" : null
  ].filter(Boolean) as string[];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <DeviceRequestSavedViews activeView={activeView} onSelect={onSavedView} />
        <div className="flex gap-2">
          <button
            className={cn("min-h-10 rounded-full px-4 text-sm font-semibold ring-1 transition", workspaceView === "table" ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-flame-300")}
            onClick={() => onWorkspaceViewChange("table")}
          >
            Table view
          </button>
          <button
            className={cn("min-h-10 rounded-full px-4 text-sm font-semibold ring-1 transition", workspaceView === "pipeline" ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-flame-300")}
            onClick={() => onWorkspaceViewChange("pipeline")}
          >
            Pipeline view
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <label className="relative">
          <span className="sr-only">Search device requests</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="min-h-12 w-full rounded-2xl border border-line bg-paper pl-11 pr-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
            placeholder="Search requester, organisation, category or location..."
            value={filters.search}
            onChange={(event) => onFiltersChange({ search: event.target.value })}
          />
        </label>
        <FilterSelect label="Status" value={filters.status} onChange={(value) => onFiltersChange({ status: value as DeviceRequestFilters["status"] })}>
          <option value="ALL">All statuses</option>
          {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
        </FilterSelect>
        <FilterSelect label="Priority" value={filters.priority} onChange={(value) => onFiltersChange({ priority: value as DeviceRequestFilters["priority"] })}>
          <option value="ALL">All priorities</option>
          {priorityOptions.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}
        </FilterSelect>
        <FilterSelect label="Category" value={filters.deviceCategory} onChange={(value) => onFiltersChange({ deviceCategory: value as DeviceRequestFilters["deviceCategory"] })}>
          <option value="ALL">All categories</option>
          {categoryOptions.map((category) => <option key={category} value={category}>{formatLabel(category)}</option>)}
        </FilterSelect>
        <FilterSelect label="Quantity" value={filters.quantityRange} onChange={(value) => onFiltersChange({ quantityRange: value as DeviceRequestFilters["quantityRange"] })}>
          <option value="ALL">Any quantity</option>
          <option value="1_5">1-5 devices</option>
          <option value="6_20">6-20 devices</option>
          <option value="21_50">21-50 devices</option>
          <option value="51_PLUS">51+ devices</option>
        </FilterSelect>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <FilterSelect label="Country" value={filters.country} onChange={(value) => onFiltersChange({ country: value })}>
          <option value="">All countries</option>
          {countries.map((country) => <option key={country} value={country}>{country}</option>)}
        </FilterSelect>
        <FilterSelect label="Deployment type" value={filters.deploymentType} onChange={(value) => onFiltersChange({ deploymentType: value })}>
          <option value="">All deployment types</option>
          {deploymentTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
        </FilterSelect>
        <FilterSelect label="Required by" value={filters.requiredBy} onChange={(value) => onFiltersChange({ requiredBy: value as DeviceRequestFilters["requiredBy"] })}>
          <option value="ALL">Any timeline</option>
          <option value="OVERDUE">Overdue</option>
          <option value="7_DAYS">Next 7 days</option>
          <option value="30_DAYS">Next 30 days</option>
        </FilterSelect>
        <FilterSelect label="Owner" value={filters.assignedOwner} onChange={(value) => onFiltersChange({ assignedOwner: value })}>
          <option value="">All owners</option>
          <option value="UNASSIGNED">Unassigned</option>
          {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
        </FilterSelect>
        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-paper px-4 text-sm font-semibold">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-line text-flame-600 focus:ring-flame-500"
            checked={filters.highPriorityOnly}
            onChange={(event) => onFiltersChange({ highPriorityOnly: event.target.checked })}
          />
          High priority only
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {activeChips.length ? activeChips.map((chip) => (
            <span key={chip} className="rounded-full bg-flame-50 px-3 py-1.5 text-xs font-semibold text-flame-700 ring-1 ring-flame-100">
              {chip}
            </span>
          )) : (
            <span className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-muted">No active filters</span>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-3 xl:flex">
          <button className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-flame-300" onClick={onClear}>
            Clear filters
          </button>
          <button
            className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-flame-300 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onExportSelected}
            disabled={selectedCount === 0}
          >
            Export selected ({selectedCount})
          </button>
          <button
            className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onBulkReviewing}
            disabled={selectedCount === 0}
          >
            Mark reviewing
          </button>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        className="min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold text-ink outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

function DeviceRequestTable({
  requests,
  loading,
  selectedIds,
  sortKey,
  sortDirection,
  page,
  totalPages,
  onPageChange,
  onSort,
  onToggleSelected,
  onToggleAll,
  onOpen
}: {
  requests: AdminDeviceRequest[];
  loading: boolean;
  selectedIds: Set<string>;
  sortKey: DeviceRequestSortKey;
  sortDirection: "asc" | "desc";
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort: (key: DeviceRequestSortKey) => void;
  onToggleSelected: (id: string) => void;
  onToggleAll: () => void;
  onOpen: (request: AdminDeviceRequest) => void;
}) {
  const allSelected = requests.length > 0 && requests.every((item) => selectedIds.has(item.id));

  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
      <div className="hidden overflow-x-auto xl:block">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-paper/70 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="w-12 px-5 py-4">
                <input type="checkbox" className="h-4 w-4 rounded border-line text-flame-600" checked={allSelected} onChange={onToggleAll} aria-label="Select all visible requests" />
              </th>
              <SortableHeader label="Requester" sortKey="requesterName" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Organisation" sortKey="organisation" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Device category" sortKey="deviceCategory" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Quantity" sortKey="quantity" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <th className="px-5 py-4">Budget</th>
              <th className="px-5 py-4">Deployment</th>
              <SortableHeader label="Required by" sortKey="requiredBy" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Priority" sortKey="priority" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <th className="px-5 py-4">Owner</th>
              <SortableHeader label="Created" sortKey="createdAt" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {loading ? Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                {Array.from({ length: 13 }).map((__, cell) => (
                  <td key={cell} className="px-5 py-5">
                    <div className="h-4 animate-pulse rounded-full bg-line" />
                  </td>
                ))}
              </tr>
            )) : requests.map((request) => (
              <tr key={request.id} className="group transition hover:bg-flame-50/35">
                <td className="px-5 py-5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-line text-flame-600"
                    checked={selectedIds.has(request.id)}
                    onChange={() => onToggleSelected(request.id)}
                    aria-label={`Select ${request.organisation}`}
                  />
                </td>
                <td className="px-5 py-5">
                  <button className="text-left font-semibold text-ink underline-offset-4 hover:text-flame-600 hover:underline" onClick={() => onOpen(request)}>
                    {request.requesterName}
                  </button>
                  <p className="mt-1 text-xs text-muted">{request.email}</p>
                </td>
                <td className="px-5 py-5 font-medium">{request.organisation}</td>
                <td className="px-5 py-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold">
                    <Icon name={categoryIcon(request.deviceCategory)} className="h-4 w-4 text-flame-600" />
                    {formatLabel(request.deviceCategory)}
                  </span>
                </td>
                <td className="px-5 py-5 font-semibold">{request.quantity.toLocaleString("en-GB")}</td>
                <td className="px-5 py-5 text-muted">{request.budgetRange ?? "Quote required"}</td>
                <td className="px-5 py-5">
                  <p className="font-medium">{request.deploymentLocation}</p>
                  <p className="mt-1 text-xs text-muted">{request.country}</p>
                </td>
                <td className="px-5 py-5 text-muted">{formatDate(request.requiredBy)}</td>
                <td className="px-5 py-5"><StatusBadge value={request.status} /></td>
                <td className="px-5 py-5"><StatusBadge value={request.priority} /></td>
                <td className="px-5 py-5 text-muted">{request.assignedOwner ?? "Unassigned"}</td>
                <td className="px-5 py-5 text-muted">{formatDate(request.createdAt)}</td>
                <td className="px-5 py-5">
                  <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-flame-300 hover:text-flame-600" onClick={() => onOpen(request)}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeviceRequestMobileCards requests={requests} loading={loading} selectedIds={selectedIds} onToggleSelected={onToggleSelected} onOpen={onOpen} />

      <div className="flex flex-col gap-3 border-t border-line bg-paper/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-muted">Page {totalPages === 0 ? 0 : page} of {totalPages}</p>
        <div className="flex gap-2">
          <button className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
          <button className="min-h-10 rounded-full border border-line bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort
}: {
  label: string;
  sortKey: DeviceRequestSortKey;
  activeKey: DeviceRequestSortKey;
  direction: "asc" | "desc";
  onSort: (key: DeviceRequestSortKey) => void;
}) {
  return (
    <th className="px-5 py-4">
      <button className="inline-flex items-center gap-1 transition hover:text-ink" onClick={() => onSort(sortKey)}>
        {label}
        {activeKey === sortKey ? <Icon name="chevron" className={cn("h-3.5 w-3.5", direction === "asc" && "rotate-180")} /> : null}
      </button>
    </th>
  );
}

function DeviceRequestMobileCards({
  requests,
  loading,
  selectedIds,
  onToggleSelected,
  onOpen
}: {
  requests: AdminDeviceRequest[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggleSelected: (id: string) => void;
  onOpen: (request: AdminDeviceRequest) => void;
}) {
  return (
    <div className="grid gap-4 p-4 xl:hidden">
      {loading ? Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-line bg-white p-5">
          <div className="h-5 w-40 animate-pulse rounded-full bg-line" />
          <div className="mt-4 h-20 animate-pulse rounded-2xl bg-line" />
        </div>
      )) : requests.map((request) => (
        <article key={request.id} className="rounded-3xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{request.requesterName}</p>
              <p className="mt-1 text-xs text-muted">{request.organisation}</p>
            </div>
            <input type="checkbox" className="h-4 w-4 rounded border-line text-flame-600" checked={selectedIds.has(request.id)} onChange={() => onToggleSelected(request.id)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge value={request.status} />
            <StatusBadge value={request.priority} />
            <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted">{request.quantity} devices</span>
          </div>
          <p className="mt-4 text-sm font-medium">{formatLabel(request.deviceCategory)}</p>
          <p className="mt-1 text-sm text-muted">{request.deploymentLocation}</p>
          <button className="mt-4 min-h-10 w-full rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => onOpen(request)}>
            Open request
          </button>
        </article>
      ))}
    </div>
  );
}

function DeviceRequestPipelineView({
  requests,
  onOpen,
  onStatusChange
}: {
  requests: AdminDeviceRequest[];
  onOpen: (request: AdminDeviceRequest) => void;
  onStatusChange: (id: string, status: DeviceRequestStatus) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-line bg-white p-4 shadow-card">
      <div className="grid gap-4 xl:grid-cols-6">
        {statusOptions.map((status) => {
          const items = requests.filter((request) => request.status === status);
          return (
            <div key={status} className="rounded-3xl border border-line bg-paper/70 p-3">
              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <p className="text-sm font-semibold">{formatLabel(status)}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-muted ring-1 ring-line">{items.length}</span>
              </div>
              <div className="mt-2 grid gap-3">
                {items.length ? items.map((request) => (
                  <article key={request.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-flame-200">
                    <button className="text-left text-sm font-semibold text-ink hover:text-flame-600" onClick={() => onOpen(request)}>
                      {request.organisation}
                    </button>
                    <p className="mt-1 text-xs text-muted">{formatLabel(request.deviceCategory)}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <StatusBadge value={request.priority} />
                      <span className="rounded-full bg-paper px-2 py-1 text-xs font-semibold text-muted">{request.quantity} devices</span>
                      <span className="rounded-full bg-paper px-2 py-1 text-xs font-semibold text-muted">{request.country}</span>
                    </div>
                    <select
                      className="mt-3 min-h-9 w-full rounded-full border border-line bg-paper px-3 text-xs font-semibold outline-none focus:border-flame-300"
                      value={request.status}
                      onChange={(event) => onStatusChange(request.id, event.target.value as DeviceRequestStatus)}
                    >
                      {statusOptions.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}
                    </select>
                  </article>
                )) : (
                  <div className="rounded-2xl border border-dashed border-line bg-white/70 p-4 text-center text-xs font-medium text-muted">
                    No requests
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InventoryFitPanel({
  requests,
  inventory,
  errors,
  selectedRequest,
  onOpenInventory
}: {
  requests: AdminDeviceRequest[];
  inventory: AdminInventoryLite[];
  errors: AdminEndpointError[];
  selectedRequest: AdminDeviceRequest | null;
  onOpenInventory: () => void;
}) {
  const inventoryError = errors.find((error) => error.path.includes("/admin/inventory"));
  const focusRequest = selectedRequest ?? requests.find((request) => request.status !== "FULFILLED" && request.status !== "CLOSED") ?? requests[0] ?? null;
  const available = inventory.filter((item) => !item.status || item.status === "AVAILABLE");
  const matching = focusRequest ? available.filter((item) => requestMatchesInventory(focusRequest, item)) : [];
  const shortage = focusRequest ? Math.max(0, focusRequest.quantity - matching.length) : 0;
  const miniPcAvailable = available.filter((item) => `${item.deviceType ?? ""} ${item.model ?? ""}`.toLowerCase().includes("mini")).length;
  const alternatives = focusRequest ? available.filter((item) => !requestMatchesInventory(focusRequest, item)).slice(0, 3) : [];

  return (
    <aside className="rounded-[2rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Operations panel</p>
          <h3 className="mt-2 text-xl font-semibold">Inventory fit</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Heuristic matching for available devices, bundle readiness and deployment suitability.
          </p>
        </div>
        <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-flame-300" onClick={onOpenInventory}>
          Inventory
        </button>
      </div>

      {inventoryError ? (
        <div className="mt-5 rounded-3xl border border-flame-200 bg-flame-50 p-4">
          <p className="font-semibold">Inventory data unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted">{inventoryError.message}</p>
          <p className="mt-2 text-xs font-semibold text-flame-700">{inventoryError.suggestedFix}</p>
        </div>
      ) : focusRequest ? (
        <div className="mt-5 grid gap-3">
          <div className="rounded-3xl bg-ink p-5 text-white">
            <p className="text-sm font-semibold text-white/65">Focused request</p>
            <p className="mt-2 text-lg font-semibold">{focusRequest.organisation}</p>
            <p className="mt-1 text-sm text-white/65">{formatLabel(focusRequest.deviceCategory)} · {focusRequest.quantity} devices</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <FitMetric label="Matching available" value={matching.length} tone="green" />
            <FitMetric label="Shortage count" value={shortage} tone={shortage > 0 ? "orange" : "green"} />
            <FitMetric label="Low-power suitability" value={miniPcAvailable} tone={miniPcAvailable > 0 ? "green" : "orange"} />
            <FitMetric label="Africa ready" value={isAfricaRequest(focusRequest) ? (matching.length > 0 ? "Partial" : "Needs stock") : "N/A"} tone={isAfricaRequest(focusRequest) ? "orange" : "green"} />
          </div>
          <div className="rounded-3xl border border-line bg-paper p-4">
            <p className="text-sm font-semibold">Recommended alternatives</p>
            <div className="mt-3 grid gap-2">
              {alternatives.length ? alternatives.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white px-3 py-2 text-sm ring-1 ring-line">
                  <p className="font-semibold">{item.assetTag ?? item.id}</p>
                  <p className="text-xs text-muted">{[item.deviceType, item.brand, item.model].filter(Boolean).join(" · ") || "Inventory item"}</p>
                </div>
              )) : <p className="text-sm text-muted">No alternatives available yet.</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-line bg-paper p-6 text-center">
          <Icon name="database" className="mx-auto h-8 w-8 text-flame-500" />
          <p className="mt-3 font-semibold">No request selected</p>
          <p className="mt-2 text-sm text-muted">Inventory fit will appear once requests are available.</p>
        </div>
      )}
    </aside>
  );
}

function FitMetric({ label, value, tone }: { label: string; value: number | string; tone: "green" | "orange" }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-4">
      <p className={cn("text-2xl font-semibold", tone === "green" ? "text-green-700" : "text-flame-600")}>{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
    </div>
  );
}

function DeviceRequestDetailDrawer({
  request,
  open,
  onClose,
  onUpdate,
  onRefresh
}: {
  request: AdminDeviceRequest | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, body: AdminDeviceRequestUpdate) => Promise<AdminDeviceRequest | null>;
  onRefresh: () => void;
}) {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "fulfilment" | "notes" | "activity" | "metadata">("overview");
  const [owner, setOwner] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [fulfilmentPlan, setFulfilmentPlan] = useState("");
  const [workflowBusy, setWorkflowBusy] = useState<string | null>(null);

  useEffect(() => {
    setOwner(request?.assignedOwner ?? "");
    setInternalNotes(request?.internalNotes ?? "");
    setFulfilmentPlan(request?.fulfilmentPlan ?? "");
    setActiveTab("overview");
  }, [request?.id, request?.assignedOwner, request?.internalNotes, request?.fulfilmentPlan]);

  if (!request) return null;

  const runWorkflow = async (key: string, action: (authToken: string) => Promise<unknown>) => {
    if (!token) return;
    setWorkflowBusy(key);
    try {
      await action(token);
      onRefresh();
    } finally {
      setWorkflowBusy(null);
    }
  };

  const tabs = [
    ["overview", "Overview"],
    ["requirements", "Device requirements"],
    ["fulfilment", "Fulfilment plan"],
    ["notes", "Notes"],
    ["activity", "Activity"],
    ["metadata", "API metadata"]
  ] as const;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close request drawer overlay"
            className="fixed inset-0 z-40 bg-black/35"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
          >
            <div className="border-b border-line bg-ink p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">Device request</p>
                  <h3 className="mt-2 text-2xl font-semibold">{request.organisation}</h3>
                  <p className="mt-2 text-sm text-white/65">{request.requesterName} · {request.email}</p>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-white/10" onClick={onClose} aria-label="Close request details">
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <StatusBadge value={request.status} className="bg-white/10 text-white ring-white/15" />
                <StatusBadge value={request.priority} />
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/15">{formatLabel(request.deviceCategory)}</span>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-line bg-paper px-5 py-3">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition", activeTab === id ? "bg-ink text-white" : "bg-white text-muted ring-1 ring-line hover:text-ink")}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "overview" ? (
                <div className="grid gap-4">
                  <FieldGrid
                    items={[
                      ["Requester", request.requesterName],
                      ["Organisation", request.organisation],
                      ["Email", request.email],
                      ["Phone", request.phone ?? "Not provided"],
                      ["Country", request.country],
                      ["Created", formatDate(request.createdAt)],
                      ["Updated", formatDate(request.updatedAt)],
                      ["Owner", request.assignedOwner ?? "Unassigned"]
                    ]}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Update status</span>
                      <select className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={request.status} onChange={(event) => void onUpdate(request.id, { status: event.target.value as DeviceRequestStatus })}>
                        {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                      </select>
                    </label>
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Change priority</span>
                      <select className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={request.priority} onChange={(event) => void onUpdate(request.id, { priority: event.target.value as DeviceRequestPriority })}>
                        {priorityOptions.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="rounded-3xl border border-line bg-paper p-4">
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Assigned owner</span>
                      <input className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="operations@sitdigitalaccess.example" />
                    </label>
                    <button className="mt-3 min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(request.id, { assignedOwner: owner || null })}>
                      Save owner
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "requirements" ? (
                <div className="grid gap-4">
                  <FieldGrid
                    items={[
                      ["Device category", formatLabel(request.deviceCategory)],
                      ["Quantity", request.quantity.toLocaleString("en-GB")],
                      ["Budget range", request.budgetRange ?? "Quote required"],
                      ["Deployment type", request.deploymentType ?? "Not specified"],
                      ["Deployment location", request.deploymentLocation],
                      ["Required by", formatDate(request.requiredBy)]
                    ]}
                  />
                  <ContentBlock title="Intended use" text={request.intendedUse || "No intended use provided."} />
                  <ContentBlock title="Requester notes" text={request.notes || "No requester notes provided."} />
                </div>
              ) : null}

              {activeTab === "fulfilment" ? (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FitMetric label="Quote required" value={requiresQuote(request) ? "Yes" : "No"} tone={requiresQuote(request) ? "orange" : "green"} />
                    <FitMetric label="Deployment complexity" value={isLabRequest(request) || isAfricaRequest(request) ? "High" : "Medium"} tone={isLabRequest(request) || isAfricaRequest(request) ? "orange" : "green"} />
                    <FitMetric label="Africa readiness" value={isAfricaRequest(request) ? "Review" : "N/A"} tone={isAfricaRequest(request) ? "orange" : "green"} />
                    <FitMetric label="Support package" value={isLabRequest(request) ? "Lab setup" : "Device setup"} tone="green" />
                  </div>
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Fulfilment plan</span>
                    <textarea className="mt-2 min-h-40 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-flame-300" value={fulfilmentPlan} onChange={(event) => setFulfilmentPlan(event.target.value)} placeholder="Suggested stock match, quote route, support package and deployment steps..." />
                  </label>
                  <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(request.id, { fulfilmentPlan })}>
                    Save fulfilment plan
                  </button>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <button disabled={workflowBusy === "quote"} className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300 disabled:opacity-50" onClick={() => void runWorkflow("quote", (authToken) => adminApi.createQuoteDraft(authToken, request.id, { fulfilmentPlan, title: `${request.organisation} quote` }))}>
                      {workflowBusy === "quote" ? "Creating..." : "Create quote"}
                    </button>
                    <button disabled={workflowBusy === "reserve"} className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300 disabled:opacity-50" onClick={() => void runWorkflow("reserve", (authToken) => adminApi.reserveInventoryForRequest(authToken, request.id, { notes: fulfilmentPlan }))}>
                      {workflowBusy === "reserve" ? "Reserving..." : "Reserve inventory"}
                    </button>
                    <button disabled={workflowBusy === "deployment"} className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300 disabled:opacity-50" onClick={() => void runWorkflow("deployment", (authToken) => adminApi.convertDeviceRequestToDeployment(authToken, request.id, { title: `${request.organisation} deployment`, summary: request.intendedUse, assignedOwner: owner || request.assignedOwner || undefined }))}>
                      {workflowBusy === "deployment" ? "Converting..." : "Convert project"}
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "notes" ? (
                <div className="grid gap-4">
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Internal notes</span>
                    <textarea className="mt-2 min-h-52 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-flame-300" value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} placeholder="Add private fulfilment notes, call outcomes or owner context..." />
                  </label>
                  <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(request.id, { internalNotes })}>
                    Save notes
                  </button>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300" onClick={() => navigator.clipboard?.writeText(request.email)}>
                      Copy email
                    </button>
                    <button className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300" onClick={() => void runWorkflow("reply", (authToken) => adminApi.createNotification(authToken, { title: `Reply needed: ${request.organisation}`, message: `Prepare follow-up for ${request.email}`, category: "Device request", priority: request.priority, linkedResourceType: "deviceRequests", linkedResourceId: request.id, actionHref: "/admin/device-requests" }))}>
                      Queue reply
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "activity" ? (
                <div className="grid gap-3">
                  {[
                    ["Created", request.createdAt],
                    ["Last updated", request.updatedAt],
                    ["Current status", request.status],
                    ["Owner", request.assignedOwner ?? "Unassigned"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-line bg-paper p-4">
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-sm text-muted">{value ? String(value) : "Not available"}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "metadata" ? (
                <pre className="overflow-auto rounded-3xl bg-ink p-4 text-xs leading-6 text-white">
                  {JSON.stringify(request, null, 2)}
                </pre>
              ) : null}
            </div>

            <div className="grid gap-2 border-t border-line bg-paper p-4 sm:grid-cols-2">
              <button className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-flame-300" onClick={() => void onUpdate(request.id, { status: "FULFILLED" })}>
                Mark fulfilled
              </button>
              <button className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={onClose}>
                Done
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function FieldGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}

function ContentBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-5">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

function DeviceRequestEmptyState({
  onCreateTest,
  onCreate
}: {
  onCreateTest: () => void;
  onCreate: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white p-8 text-center shadow-card">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-flame-50 text-flame-600">
        <Icon name="laptop" className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold">No device requests yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Requests for laptops, desktops, mini PCs, accessories and computer lab bundles will appear here when public forms are submitted.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:inline-flex">
        <button className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={onCreateTest}>
          Create test request
        </button>
        <button className="min-h-11 rounded-full border border-line bg-white px-5 text-sm font-semibold transition hover:border-flame-300" onClick={onCreate}>
          Create manual request
        </button>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold transition hover:border-flame-300" href="/devices#device-catalogue">
          Open device catalogue
        </Link>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold transition hover:border-flame-300" href="/contact#contact-form">
          Open request form
        </Link>
      </div>
    </section>
  );
}

function CreateDeviceRequestModal({
  open,
  onClose,
  onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (body: AdminDeviceRequestCreate) => Promise<AdminDeviceRequest | null>;
}) {
  const [form, setForm] = useState<AdminDeviceRequestCreate>({
    requesterName: "",
    organisation: "",
    email: "",
    phone: "",
    country: "",
    deviceCategory: "STUDENT_LAPTOPS",
    quantity: 10,
    budgetRange: "",
    intendedUse: "",
    deploymentLocation: "",
    requiredBy: "",
    notes: "",
    priority: "MEDIUM",
    assignedOwner: "",
    internalNotes: "",
    fulfilmentPlan: "",
    deploymentType: "School lab"
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const update = (patch: Partial<AdminDeviceRequestCreate>) => setForm((current) => ({ ...current, ...patch }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const body: AdminDeviceRequestCreate = {
      ...form,
      quantity: Number(form.quantity),
      requiredBy: form.requiredBy || undefined,
      phone: form.phone || undefined,
      budgetRange: form.budgetRange || undefined,
      notes: form.notes || undefined,
      assignedOwner: form.assignedOwner || undefined,
      internalNotes: form.internalNotes || undefined,
      fulfilmentPlan: form.fulfilmentPlan || undefined,
      deploymentType: form.deploymentType || undefined
    };
    const created = await onCreate(body);
    setSubmitting(false);
    if (created) onClose();
  }

  return (
    <AnimatePresence>
      <motion.button className="fixed inset-0 z-40 bg-black/40" aria-label="Close create request modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="fixed inset-x-4 top-6 z-50 mx-auto max-h-[calc(100vh-3rem)] max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-ink p-6 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">Manual request</p>
            <h3 className="mt-2 text-2xl font-semibold">Create device request</h3>
            <p className="mt-2 text-sm text-white/65">Add a phone, email or internal request into the fulfilment queue.</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-white/10" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <form className="grid gap-4 p-6" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Requester name" value={form.requesterName} onChange={(value) => update({ requesterName: value })} required />
            <FormInput label="Organisation" value={form.organisation} onChange={(value) => update({ organisation: value })} required />
            <FormInput label="Email" type="email" value={form.email} onChange={(value) => update({ email: value })} required />
            <FormInput label="Phone" value={form.phone ?? ""} onChange={(value) => update({ phone: value })} />
            <FormInput label="Country" value={form.country} onChange={(value) => update({ country: value })} required />
            <FormInput label="Deployment location" value={form.deploymentLocation} onChange={(value) => update({ deploymentLocation: value })} required />
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Device category</span>
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={form.deviceCategory} onChange={(event) => update({ deviceCategory: event.target.value as AdminDeviceCategory })}>
                {categoryOptions.map((category) => <option key={category} value={category}>{formatLabel(category)}</option>)}
              </select>
            </label>
            <FormInput label="Quantity" type="number" value={String(form.quantity)} onChange={(value) => update({ quantity: Number(value) })} required min={1} />
            <FormInput label="Budget range" value={form.budgetRange ?? ""} onChange={(value) => update({ budgetRange: value })} />
            <FormInput label="Required by" type="date" value={form.requiredBy ?? ""} onChange={(value) => update({ requiredBy: value })} />
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Priority</span>
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={form.priority} onChange={(event) => update({ priority: event.target.value as DeviceRequestPriority })}>
                {priorityOptions.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}
              </select>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Deployment type</span>
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={form.deploymentType ?? ""} onChange={(event) => update({ deploymentType: event.target.value })}>
                {deploymentTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>
          <FormTextarea label="Intended use" value={form.intendedUse} onChange={(value) => update({ intendedUse: value })} required />
          <FormTextarea label="Requester notes" value={form.notes ?? ""} onChange={(value) => update({ notes: value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Assigned owner" value={form.assignedOwner ?? ""} onChange={(value) => update({ assignedOwner: value })} />
            <FormInput label="Internal notes" value={form.internalNotes ?? ""} onChange={(value) => update({ internalNotes: value })} />
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
            <button type="button" className="min-h-11 rounded-full border border-line px-5 text-sm font-semibold transition hover:border-flame-300" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="min-h-11 rounded-full bg-flame-500 px-5 text-sm font-semibold text-white shadow-lg shadow-flame-500/20 transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-50" disabled={submitting}>
              {submitting ? "Creating..." : "Create request"}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required,
  min
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
      <input
        className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        min={min}
      />
    </label>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

function applySavedView(view: DeviceRequestViewKey): Partial<DeviceRequestFilters> {
  switch (view) {
    case "newToday":
      return { status: "NEW" };
    case "labBundles":
      return { deviceCategory: "COMPUTER_LAB_BUNDLES" };
    case "africaDeployment":
      return { deploymentType: "Africa shipment" };
    case "highQuantity":
      return { quantityRange: "51_PLUS" };
    case "quoteRequired":
      return { budgetRange: "quote" };
    case "unassigned":
      return { assignedOwner: "UNASSIGNED" };
    case "fulfilmentReady":
      return { status: "RESERVED" };
    default:
      return {};
  }
}

function requestMatchesFilters(request: AdminDeviceRequest, filters: DeviceRequestFilters, activeView: DeviceRequestViewKey) {
  const search = filters.search.trim().toLowerCase();
  if (search) {
    const haystack = [
      request.requesterName,
      request.organisation,
      request.email,
      request.country,
      request.deviceCategory,
      request.deploymentLocation,
      request.intendedUse,
      request.notes
    ].join(" ").toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  if (filters.status !== "ALL" && request.status !== filters.status) return false;
  if (filters.priority !== "ALL" && request.priority !== filters.priority) return false;
  if (filters.highPriorityOnly && request.priority !== "HIGH") return false;
  if (filters.deviceCategory !== "ALL" && request.deviceCategory !== filters.deviceCategory) return false;
  if (filters.country && request.country !== filters.country) return false;
  if (filters.assignedOwner === "UNASSIGNED" && request.assignedOwner) return false;
  if (filters.assignedOwner && filters.assignedOwner !== "UNASSIGNED" && request.assignedOwner !== filters.assignedOwner) return false;
  if (filters.deploymentType && !(request.deploymentType ?? "").toLowerCase().includes(filters.deploymentType.toLowerCase())) {
    if (!(filters.deploymentType === "Africa shipment" && isAfricaRequest(request))) return false;
  }
  if (filters.budgetRange && !(request.budgetRange ?? "").toLowerCase().includes(filters.budgetRange.toLowerCase()) && !(filters.budgetRange === "quote" && requiresQuote(request))) return false;

  if (filters.quantityRange === "1_5" && !(request.quantity >= 1 && request.quantity <= 5)) return false;
  if (filters.quantityRange === "6_20" && !(request.quantity >= 6 && request.quantity <= 20)) return false;
  if (filters.quantityRange === "21_50" && !(request.quantity >= 21 && request.quantity <= 50)) return false;
  if (filters.quantityRange === "51_PLUS" && request.quantity < 51) return false;
  if (filters.requiredBy === "OVERDUE" && !isOverdue(request.requiredBy)) return false;
  if (filters.requiredBy === "7_DAYS" && !isWithinDays(request.requiredBy, 7)) return false;
  if (filters.requiredBy === "30_DAYS" && !isWithinDays(request.requiredBy, 30)) return false;

  if (activeView === "newToday" && !isToday(request.createdAt)) return false;
  if (activeView === "labBundles" && !isLabRequest(request)) return false;
  if (activeView === "africaDeployment" && !isAfricaRequest(request)) return false;
  if (activeView === "quoteRequired" && !requiresQuote(request)) return false;
  if (activeView === "unassigned" && request.assignedOwner) return false;
  if (activeView === "fulfilmentReady" && request.status !== "RESERVED") return false;

  return true;
}

function sortRequests(requests: AdminDeviceRequest[], sortKey: DeviceRequestSortKey, direction: "asc" | "desc") {
  return [...requests].sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    if (sortKey === "quantity") {
      aValue = a.quantity;
      bValue = b.quantity;
    } else if (sortKey === "priority") {
      aValue = priorityRank[a.priority];
      bValue = priorityRank[b.priority];
    } else {
      aValue = String(a[sortKey] ?? "");
      bValue = String(b[sortKey] ?? "");
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
}

export function AdminDeviceRequestsWorkspace() {
  const {
    deviceRequests,
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
    createRequest,
    updateRequest,
    bulkUpdate
  } = useAdminDeviceRequests();
  const { roles } = useAdminAuth();

  const [filters, setFilters] = useState<DeviceRequestFilters>(initialFilters);
  const [activeView, setActiveView] = useState<DeviceRequestViewKey>("all");
  const [workspaceView, setWorkspaceView] = useState<DeviceRequestWorkspaceView>("table");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<DeviceRequestSortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [drawerRequest, setDrawerRequest] = useState<AdminDeviceRequest | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const pageSize = 10;

  const countries = useMemo(() => Array.from(new Set(deviceRequests.map((item) => item.country).filter(Boolean))).sort(), [deviceRequests]);
  const owners = useMemo(() => Array.from(new Set(deviceRequests.map((item) => item.assignedOwner).filter(Boolean) as string[])).sort(), [deviceRequests]);
  const primaryRole = roles[0] ?? "admin";

  const filtered = useMemo(
    () => deviceRequests.filter((request) => requestMatchesFilters(request, filters, activeView)),
    [activeView, deviceRequests, filters]
  );
  const sorted = useMemo(() => sortRequests(filtered, sortKey, sortDirection), [filtered, sortDirection, sortKey]);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const selectedRequests = sorted.filter((request) => selectedIds.has(request.id));
  const selectedRequest = drawerRequest ?? selectedRequests[0] ?? null;

  useEffect(() => {
    setPage(1);
  }, [filters, activeView, workspaceView]);

  useEffect(() => {
    if (drawerRequest) {
      const updated = deviceRequests.find((request) => request.id === drawerRequest.id);
      if (updated) setDrawerRequest(updated);
    }
  }, [deviceRequests, drawerRequest]);

  function setFilterPatch(patch: Partial<DeviceRequestFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function selectSavedView(view: DeviceRequestViewKey) {
    setActiveView(view);
    setFilters({ ...initialFilters, ...applySavedView(view) });
  }

  function applyMetricFilter(patch: Partial<DeviceRequestFilters>, view?: DeviceRequestViewKey) {
    setActiveView(view ?? "all");
    setFilters({ ...initialFilters, ...patch });
  }

  function clearFilters() {
    setActiveView("all");
    setFilters(initialFilters);
  }

  function toggleSort(key: DeviceRequestSortKey) {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      const allSelected = paginated.length > 0 && paginated.every((request) => next.has(request.id));
      paginated.forEach((request) => {
        if (allSelected) next.delete(request.id);
        else next.add(request.id);
      });
      return next;
    });
  }

  async function createTestRequest() {
    const created = await createRequest({
      requesterName: "Test School Lead",
      organisation: "SIT Digital Access Demo School",
      email: "hello@sitdigitalaccess.example",
      country: "United Kingdom",
      deviceCategory: "STUDENT_LAPTOPS",
      quantity: 10,
      budgetRange: "Quote required",
      intendedUse: "Demo request for testing the admin device fulfilment workflow and school lab planning.",
      deploymentLocation: "London, UK",
      notes: "Generated from the admin device request empty state.",
      priority: "MEDIUM",
      deploymentType: "School lab",
      internalNotes: "Test request created by admin."
    });
    if (created) setDrawerRequest(created);
  }

  return (
    <div className="grid gap-6">
      <DeviceRequestsHeader
        health={health}
        role={primaryRole}
        lastSyncedAt={lastSyncedAt}
        diagnosticsOpen={diagnosticsOpen}
        onDiagnostics={() => setDiagnosticsOpen((value) => !value)}
        onRefresh={refresh}
        onExport={() => exportDeviceRequestsCsv(sorted)}
        onCreate={() => setCreateOpen(true)}
      />

      <DeviceRequestErrorState
        errors={errors}
        diagnostics={diagnostics}
        open={diagnosticsOpen}
        onToggle={() => setDiagnosticsOpen((value) => !value)}
        onRetry={refresh}
        onRefreshToken={() => void refreshTokenAndData()}
        onLogout={() => void logout()}
      />

      {(actionMessage || actionError) ? (
        <div className={cn("rounded-3xl border p-4 text-sm font-semibold shadow-card", actionError ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700")}>
          {actionError ?? actionMessage}
        </div>
      ) : null}

      <DeviceRequestMetricCards requests={deviceRequests} loading={loading} onFilter={applyMetricFilter} />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <DeviceRequestFilterBar
            filters={filters}
            activeView={activeView}
            workspaceView={workspaceView}
            countries={countries}
            owners={owners}
            selectedCount={selectedIds.size}
            onFiltersChange={setFilterPatch}
            onSavedView={selectSavedView}
            onWorkspaceViewChange={setWorkspaceView}
            onClear={clearFilters}
            onExportSelected={() => exportDeviceRequestsCsv(selectedRequests, "sit-digital-access-selected-device-requests.csv")}
            onBulkReviewing={() => void bulkUpdate(Array.from(selectedIds), { status: "REVIEWING" })}
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-muted">
              Showing {sorted.length.toLocaleString("en-GB")} of {deviceRequests.length.toLocaleString("en-GB")} requests
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-line">{selectedIds.size} selected</span>
              <button
                className="rounded-full bg-white px-3 py-1.5 ring-1 ring-line transition hover:ring-flame-300 disabled:opacity-45"
                disabled={selectedIds.size === 0}
                onClick={() => {
                  const owner = window.prompt("Assign selected requests to owner email or team");
                  if (owner?.trim()) void bulkUpdate(Array.from(selectedIds), { assignedOwner: owner.trim() });
                }}
              >
                Assign selected
              </button>
              <button className="rounded-full bg-white px-3 py-1.5 ring-1 ring-line transition hover:ring-flame-300" onClick={() => exportDeviceRequestsCsv(sorted, "sit-digital-access-visible-device-requests.csv")}>Export visible</button>
            </div>
          </div>

          {workspaceView === "table" ? (
            sorted.length || loading ? (
              <DeviceRequestTable
                requests={paginated}
                loading={loading}
                selectedIds={selectedIds}
                sortKey={sortKey}
                sortDirection={sortDirection}
                page={Math.min(page, Math.max(totalPages, 1))}
                totalPages={totalPages}
                onPageChange={setPage}
                onSort={toggleSort}
                onToggleSelected={toggleSelected}
                onToggleAll={toggleAllVisible}
                onOpen={setDrawerRequest}
              />
            ) : (
              <DeviceRequestEmptyState onCreateTest={() => void createTestRequest()} onCreate={() => setCreateOpen(true)} />
            )
          ) : (
            <DeviceRequestPipelineView
              requests={sorted}
              onOpen={setDrawerRequest}
              onStatusChange={(id, status) => void updateRequest(id, { status })}
            />
          )}
        </div>

        <InventoryFitPanel
          requests={sorted}
          inventory={inventory}
          errors={errors}
          selectedRequest={selectedRequest}
          onOpenInventory={() => window.location.assign("/admin/inventory")}
        />
      </div>

      <DeviceRequestDetailDrawer
        request={drawerRequest}
        open={Boolean(drawerRequest)}
        onClose={() => setDrawerRequest(null)}
        onUpdate={updateRequest}
        onRefresh={refresh}
      />

      <CreateDeviceRequestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createRequest}
      />
    </div>
  );
}
