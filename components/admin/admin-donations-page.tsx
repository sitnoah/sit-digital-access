"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconKey } from "@/components/icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminDonations } from "@/hooks/useAdminDonations";
import { cn } from "@/lib/utils";
import { adminApi, type DonationStatus } from "@/lib/api";
import type { AdminEndpointError, SystemHealthStatus } from "@/types/admin";
import type {
  AdminDonation,
  AdminDonationCreate,
  AdminDonationUpdate,
  DonationFilters,
  DonationPriority,
  DonationSortKey,
  DonationTypeValue,
  DonationViewKey,
  DonationWorkspaceView,
  DonorTypeValue
} from "@/types/donation";

const statusOptions: DonationStatus[] = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "COLLECTION_NEEDED",
  "COLLECTION_ARRANGED",
  "PROCESSING",
  "RECEIVED",
  "COMPLETED",
  "CLOSED"
];
const pipelineStages: DonationStatus[] = ["NEW", "REVIEWING", "CONTACTED", "COLLECTION_NEEDED", "PROCESSING", "COMPLETED", "CLOSED"];
const priorityOptions: DonationPriority[] = ["LOW", "MEDIUM", "HIGH"];
const donorTypeOptions: DonorTypeValue[] = ["INDIVIDUAL", "COMPANY", "NGO", "SCHOOL", "FOUNDATION", "GOVERNMENT"];
const donationTypeOptions: DonationTypeValue[] = [
  "USED_LAPTOPS",
  "DESKTOPS",
  "MINI_PCS",
  "ACCESSORIES",
  "CORPORATE_RECYCLING",
  "SPONSOR_LEARNER",
  "SPONSOR_CLASSROOM_BUNDLE",
  "SPONSOR_FULL_LAB",
  "MONTHLY_DONOR"
];

const savedViews: Array<{ id: DonationViewKey; label: string; icon: IconKey }> = [
  { id: "all", label: "All donations", icon: "heart" },
  { id: "newToday", label: "New today", icon: "sparkles" },
  { id: "corporateRecycling", label: "Corporate recycling", icon: "recycle" },
  { id: "sponsorships", label: "Sponsorships", icon: "handshake" },
  { id: "deviceDonations", label: "Device donations", icon: "package" },
  { id: "fullLabSponsors", label: "Full lab sponsors", icon: "school" },
  { id: "collectionRequired", label: "Collection required", icon: "truck" },
  { id: "highPriority", label: "High priority", icon: "shield" },
  { id: "unassigned", label: "Unassigned", icon: "users" }
];

const initialFilters: DonationFilters = {
  search: "",
  status: "ALL",
  donorType: "ALL",
  donationType: "ALL",
  deviceCondition: "",
  deviceCountRange: "ALL",
  sponsorshipAmountRange: "ALL",
  country: "",
  pickupRequired: false,
  assignedOwner: "",
  dateRange: "ALL",
  highPriorityOnly: false
};

const priorityRank: Record<DonationPriority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };

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
  if (!value) return "Not set";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
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

function normalisedPipelineStatus(status: DonationStatus): DonationStatus {
  if (status === "COLLECTION_ARRANGED") return "COLLECTION_NEEDED";
  if (status === "RECEIVED") return "COMPLETED";
  return status;
}

function isSponsorship(donation: AdminDonation) {
  return donation.donationType === "SPONSOR_LEARNER"
    || donation.donationType === "SPONSOR_CLASSROOM_BUNDLE"
    || donation.donationType === "SPONSOR_FULL_LAB"
    || donation.donationType === "MONTHLY_DONOR";
}

function isDeviceDonation(donation: AdminDonation) {
  return donation.donationType === "USED_LAPTOPS"
    || donation.donationType === "DESKTOPS"
    || donation.donationType === "MINI_PCS"
    || donation.donationType === "ACCESSORIES";
}

function needsCollection(donation: AdminDonation) {
  return Boolean(donation.pickupLocation)
    || donation.status === "COLLECTION_NEEDED"
    || donation.status === "COLLECTION_ARRANGED"
    || isDeviceDonation(donation)
    || donation.donationType === "CORPORATE_RECYCLING";
}

function csvEscape(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value).replaceAll("\n", " ");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportDonationsCsv(donations: AdminDonation[], filename = "sit-digital-access-donations.csv") {
  const columns: Array<[string, keyof AdminDonation]> = [
    ["Donor", "donorName"],
    ["Organisation", "organisation"],
    ["Email", "email"],
    ["Country", "country"],
    ["Donor type", "donorType"],
    ["Donation type", "donationType"],
    ["Device count", "deviceCount"],
    ["Condition", "deviceCondition"],
    ["Pickup location", "pickupLocation"],
    ["Sponsorship amount", "sponsorshipAmount"],
    ["Status", "status"],
    ["Priority", "priority"],
    ["Owner", "assignedOwner"],
    ["Created", "createdAt"],
    ["Updated", "updatedAt"],
    ["Message", "message"]
  ];
  const csv = [
    columns.map(([label]) => csvEscape(label)).join(","),
    ...donations.map((item) => columns.map(([, key]) => csvEscape(item[key])).join(","))
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

function donationIcon(type: DonationTypeValue): IconKey {
  if (type === "CORPORATE_RECYCLING") return "recycle";
  if (type.includes("SPONSOR")) return "handshake";
  if (type === "MONTHLY_DONOR") return "heart";
  if (type.includes("MINI")) return "cpu";
  if (type.includes("DESKTOP")) return "monitor";
  return "package";
}

function DonationsHeader({
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Donor operations</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Donations & Sponsorship Command Centre</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Manage device donations, learner sponsorships, lab sponsorships and corporate recycling partnership offers.
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
            Create donation record
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

function DonationErrorState({
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
              {authIssue ? "Admin authentication needs attention." : "Some donation records could not be loaded."}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              {authIssue
                ? "The API rejected the current Firebase ID token. Refresh your session or sign in again to continue managing donation records."
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

function DonationMetricCards({
  donations,
  loading,
  onFilter
}: {
  donations: AdminDonation[];
  loading: boolean;
  onFilter: (patch: Partial<DonationFilters>, view?: DonationViewKey) => void;
}) {
  const cards = [
    { label: "New donation offers", value: donations.filter((item) => item.status === "NEW").length, icon: "heart" as IconKey, patch: { status: "NEW" as const } },
    { label: "Reviewing", value: donations.filter((item) => item.status === "REVIEWING").length, icon: "search" as IconKey, patch: { status: "REVIEWING" as const } },
    { label: "Collection needed", value: donations.filter(needsCollection).length, icon: "truck" as IconKey, patch: { pickupRequired: true }, view: "collectionRequired" as const },
    { label: "Sponsorship offers", value: donations.filter(isSponsorship).length, icon: "handshake" as IconKey, patch: {}, view: "sponsorships" as const },
    { label: "Corporate recycling leads", value: donations.filter((item) => item.donationType === "CORPORATE_RECYCLING").length, icon: "recycle" as IconKey, patch: { donationType: "CORPORATE_RECYCLING" as const }, view: "corporateRecycling" as const },
    { label: "Full lab sponsors", value: donations.filter((item) => item.donationType === "SPONSOR_FULL_LAB").length, icon: "school" as IconKey, patch: { donationType: "SPONSOR_FULL_LAB" as const }, view: "fullLabSponsors" as const },
    { label: "High priority", value: donations.filter((item) => item.priority === "HIGH").length, icon: "shield" as IconKey, patch: { priority: "HIGH" as const, highPriorityOnly: true }, view: "highPriority" as const },
    { label: "Closed", value: donations.filter((item) => item.status === "CLOSED").length, icon: "badge" as IconKey, patch: { status: "CLOSED" as const } }
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

function DonationSavedViews({
  activeView,
  onSelect
}: {
  activeView: DonationViewKey;
  onSelect: (view: DonationViewKey) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {savedViews.map((view) => (
        <button
          key={view.id}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition",
            activeView === view.id ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line hover:ring-flame-300"
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

function DonationFilterBar({
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
  filters: DonationFilters;
  activeView: DonationViewKey;
  workspaceView: DonationWorkspaceView;
  countries: string[];
  owners: string[];
  selectedCount: number;
  onFiltersChange: (patch: Partial<DonationFilters>) => void;
  onSavedView: (view: DonationViewKey) => void;
  onWorkspaceViewChange: (view: DonationWorkspaceView) => void;
  onClear: () => void;
  onExportSelected: () => void;
  onBulkReviewing: () => void;
}) {
  const activeChips = [
    filters.status !== "ALL" ? `Status: ${formatLabel(filters.status)}` : null,
    filters.donorType !== "ALL" ? `Donor: ${formatLabel(filters.donorType)}` : null,
    filters.donationType !== "ALL" ? `Type: ${formatLabel(filters.donationType)}` : null,
    filters.deviceCondition ? `Condition: ${filters.deviceCondition}` : null,
    filters.deviceCountRange !== "ALL" ? `Devices: ${filters.deviceCountRange.replace("_", "-")}` : null,
    filters.sponsorshipAmountRange !== "ALL" ? `Amount: ${filters.sponsorshipAmountRange.replaceAll("_", "-")}` : null,
    filters.country ? `Country: ${filters.country}` : null,
    filters.pickupRequired ? "Pickup required" : null,
    filters.assignedOwner ? `Owner: ${filters.assignedOwner}` : null,
    filters.dateRange !== "ALL" ? `Date: ${formatLabel(filters.dateRange)}` : null,
    filters.highPriorityOnly ? "High priority only" : null
  ].filter(Boolean) as string[];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <DonationSavedViews activeView={activeView} onSelect={onSavedView} />
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
          <span className="sr-only">Search donations</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="min-h-12 w-full rounded-2xl border border-line bg-paper pl-11 pr-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
            placeholder="Search donor, organisation, type or location..."
            value={filters.search}
            onChange={(event) => onFiltersChange({ search: event.target.value })}
          />
        </label>
        <FilterSelect label="Status" value={filters.status} onChange={(value) => onFiltersChange({ status: value as DonationFilters["status"] })}>
          <option value="ALL">All statuses</option>
          {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
        </FilterSelect>
        <FilterSelect label="Donor type" value={filters.donorType} onChange={(value) => onFiltersChange({ donorType: value as DonationFilters["donorType"] })}>
          <option value="ALL">All donors</option>
          {donorTypeOptions.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
        </FilterSelect>
        <FilterSelect label="Donation type" value={filters.donationType} onChange={(value) => onFiltersChange({ donationType: value as DonationFilters["donationType"] })}>
          <option value="ALL">All donation types</option>
          {donationTypeOptions.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
        </FilterSelect>
        <FilterSelect label="Device count" value={filters.deviceCountRange} onChange={(value) => onFiltersChange({ deviceCountRange: value as DonationFilters["deviceCountRange"] })}>
          <option value="ALL">Any device count</option>
          <option value="1_5">1-5 devices</option>
          <option value="6_20">6-20 devices</option>
          <option value="21_50">21-50 devices</option>
          <option value="51_PLUS">51+ devices</option>
        </FilterSelect>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <FilterSelect label="Amount" value={filters.sponsorshipAmountRange} onChange={(value) => onFiltersChange({ sponsorshipAmountRange: value as DonationFilters["sponsorshipAmountRange"] })}>
          <option value="ALL">Any amount</option>
          <option value="1_500">£1-£500</option>
          <option value="501_2500">£501-£2,500</option>
          <option value="2501_10000">£2,501-£10,000</option>
          <option value="10001_PLUS">£10,001+</option>
        </FilterSelect>
        <FilterSelect label="Country" value={filters.country} onChange={(value) => onFiltersChange({ country: value })}>
          <option value="">All countries</option>
          {countries.map((country) => <option key={country} value={country}>{country}</option>)}
        </FilterSelect>
        <FilterSelect label="Owner" value={filters.assignedOwner} onChange={(value) => onFiltersChange({ assignedOwner: value })}>
          <option value="">All owners</option>
          <option value="UNASSIGNED">Unassigned</option>
          {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
        </FilterSelect>
        <FilterSelect label="Date range" value={filters.dateRange} onChange={(value) => onFiltersChange({ dateRange: value as DonationFilters["dateRange"] })}>
          <option value="ALL">Any date</option>
          <option value="TODAY">Today</option>
          <option value="7_DAYS">Last 7 days</option>
          <option value="30_DAYS">Last 30 days</option>
        </FilterSelect>
        <input
          className="min-h-12 rounded-2xl border border-line bg-paper px-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
          placeholder="Device condition"
          value={filters.deviceCondition}
          onChange={(event) => onFiltersChange({ deviceCondition: event.target.value })}
        />
        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-paper px-4 text-sm font-semibold">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-line text-flame-600 focus:ring-flame-500"
            checked={filters.highPriorityOnly}
            onChange={(event) => onFiltersChange({ highPriorityOnly: event.target.checked })}
          />
          High priority
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-line bg-paper px-4 text-sm font-semibold">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-line text-flame-600 focus:ring-flame-500"
            checked={filters.pickupRequired}
            onChange={(event) => onFiltersChange({ pickupRequired: event.target.checked })}
          />
          Pickup required
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

function DonationTable({
  donations,
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
  donations: AdminDonation[];
  loading: boolean;
  selectedIds: Set<string>;
  sortKey: DonationSortKey;
  sortDirection: "asc" | "desc";
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort: (key: DonationSortKey) => void;
  onToggleSelected: (id: string) => void;
  onToggleAll: () => void;
  onOpen: (donation: AdminDonation) => void;
}) {
  const allSelected = donations.length > 0 && donations.every((item) => selectedIds.has(item.id));

  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
      <div className="hidden overflow-x-auto xl:block">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-paper/70 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="w-12 px-5 py-4">
                <input type="checkbox" className="h-4 w-4 rounded border-line text-flame-600" checked={allSelected} onChange={onToggleAll} aria-label="Select all visible donations" />
              </th>
              <SortableHeader label="Donor" sortKey="donorName" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Organisation" sortKey="organisation" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Donor type" sortKey="donorType" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Donation type" sortKey="donationType" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Devices" sortKey="deviceCount" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <SortableHeader label="Amount" sortKey="sponsorshipAmount" activeKey={sortKey} direction={sortDirection} onSort={onSort} />
              <th className="px-5 py-4">Location</th>
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
            )) : donations.map((donation) => (
              <tr key={donation.id} className="group transition hover:bg-flame-50/35">
                <td className="px-5 py-5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-line text-flame-600"
                    checked={selectedIds.has(donation.id)}
                    onChange={() => onToggleSelected(donation.id)}
                    aria-label={`Select ${donation.donorName}`}
                  />
                </td>
                <td className="px-5 py-5">
                  <button className="text-left font-semibold text-ink underline-offset-4 hover:text-flame-600 hover:underline" onClick={() => onOpen(donation)}>
                    {donation.donorName}
                  </button>
                  <p className="mt-1 text-xs text-muted">{donation.email}</p>
                </td>
                <td className="px-5 py-5 font-medium">{donation.organisation ?? "Not provided"}</td>
                <td className="px-5 py-5 text-muted">{formatLabel(donation.donorType)}</td>
                <td className="px-5 py-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold">
                    <Icon name={donationIcon(donation.donationType)} className="h-4 w-4 text-flame-600" />
                    {formatLabel(donation.donationType)}
                  </span>
                </td>
                <td className="px-5 py-5 font-semibold">{donation.deviceCount ?? "N/A"}</td>
                <td className="px-5 py-5 font-semibold">{formatMoney(donation.sponsorshipAmount)}</td>
                <td className="px-5 py-5">
                  <p className="font-medium">{donation.pickupLocation ?? donation.country}</p>
                  <p className="mt-1 text-xs text-muted">{donation.country}</p>
                </td>
                <td className="px-5 py-5"><StatusBadge value={donation.status} /></td>
                <td className="px-5 py-5"><StatusBadge value={donation.priority} /></td>
                <td className="px-5 py-5 text-muted">{donation.assignedOwner ?? "Unassigned"}</td>
                <td className="px-5 py-5 text-muted">{formatDate(donation.createdAt)}</td>
                <td className="px-5 py-5">
                  <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-flame-300 hover:text-flame-600" onClick={() => onOpen(donation)}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DonationMobileCards donations={donations} loading={loading} selectedIds={selectedIds} onToggleSelected={onToggleSelected} onOpen={onOpen} />

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
  sortKey: DonationSortKey;
  activeKey: DonationSortKey;
  direction: "asc" | "desc";
  onSort: (key: DonationSortKey) => void;
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

function DonationMobileCards({
  donations,
  loading,
  selectedIds,
  onToggleSelected,
  onOpen
}: {
  donations: AdminDonation[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggleSelected: (id: string) => void;
  onOpen: (donation: AdminDonation) => void;
}) {
  return (
    <div className="grid gap-4 p-4 xl:hidden">
      {loading ? Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-line bg-white p-5">
          <div className="h-5 w-40 animate-pulse rounded-full bg-line" />
          <div className="mt-4 h-20 animate-pulse rounded-2xl bg-line" />
        </div>
      )) : donations.map((donation) => (
        <article key={donation.id} className="rounded-3xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{donation.donorName}</p>
              <p className="mt-1 text-xs text-muted">{donation.organisation ?? donation.email}</p>
            </div>
            <input type="checkbox" className="h-4 w-4 rounded border-line text-flame-600" checked={selectedIds.has(donation.id)} onChange={() => onToggleSelected(donation.id)} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge value={donation.status} />
            <StatusBadge value={donation.priority} />
            <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-muted">{formatLabel(donation.donationType)}</span>
          </div>
          <p className="mt-4 text-sm font-medium">{donation.deviceCount ? `${donation.deviceCount} devices` : formatMoney(donation.sponsorshipAmount)}</p>
          <p className="mt-1 text-sm text-muted">{donation.pickupLocation ?? donation.country}</p>
          <button className="mt-4 min-h-10 w-full rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => onOpen(donation)}>
            Open donation
          </button>
        </article>
      ))}
    </div>
  );
}

function DonationPipelineView({
  donations,
  onOpen,
  onStatusChange
}: {
  donations: AdminDonation[];
  onOpen: (donation: AdminDonation) => void;
  onStatusChange: (id: string, status: DonationStatus) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-line bg-white p-4 shadow-card">
      <div className="grid gap-4 xl:grid-cols-7">
        {pipelineStages.map((stage) => {
          const items = donations.filter((donation) => normalisedPipelineStatus(donation.status) === stage);
          return (
            <div key={stage} className="rounded-3xl border border-line bg-paper/70 p-3">
              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <p className="text-sm font-semibold">{formatLabel(stage)}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-muted ring-1 ring-line">{items.length}</span>
              </div>
              <div className="mt-2 grid gap-3">
                {items.length ? items.map((donation) => (
                  <article key={donation.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-flame-200">
                    <button className="text-left text-sm font-semibold text-ink hover:text-flame-600" onClick={() => onOpen(donation)}>
                      {donation.donorName}
                    </button>
                    <p className="mt-1 text-xs text-muted">{formatLabel(donation.donationType)}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <StatusBadge value={donation.priority} />
                      <span className="rounded-full bg-paper px-2 py-1 text-xs font-semibold text-muted">{donation.country}</span>
                      <span className="rounded-full bg-paper px-2 py-1 text-xs font-semibold text-muted">{donation.deviceCount ?? formatMoney(donation.sponsorshipAmount)}</span>
                    </div>
                    <select
                      className="mt-3 min-h-9 w-full rounded-full border border-line bg-paper px-3 text-xs font-semibold outline-none focus:border-flame-300"
                      value={normalisedPipelineStatus(donation.status)}
                      onChange={(event) => onStatusChange(donation.id, event.target.value as DonationStatus)}
                    >
                      {pipelineStages.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}
                    </select>
                  </article>
                )) : (
                  <div className="rounded-2xl border border-dashed border-line bg-white/70 p-4 text-center text-xs font-medium text-muted">
                    No records
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

function CorporateRecyclingPanel({ donations }: { donations: AdminDonation[] }) {
  const corporate = donations.filter((item) => item.donorType === "COMPANY" || item.donationType === "CORPORATE_RECYCLING");
  const estimatedDevices = corporate.reduce((sum, item) => sum + (item.deviceCount ?? 0), 0);
  const collectionRequired = corporate.filter(needsCollection).length;
  const partnershipPotential = corporate.filter((item) => (item.deviceCount ?? 0) >= 10 || item.donationType === "CORPORATE_RECYCLING").length;

  return (
    <aside className="rounded-[2rem] border border-line bg-white p-5 shadow-card">
      <PanelHeader eyebrow="CSR operations" title="Corporate recycling opportunities" icon="recycle" />
      {corporate.length ? (
        <div className="mt-5 grid gap-3">
          <PanelMetric label="Company donors" value={corporate.length} />
          <PanelMetric label="Estimated device volume" value={estimatedDevices} />
          <PanelMetric label="Collection required" value={collectionRequired} />
          <PanelMetric label="Partnership potential" value={partnershipPotential} />
          <div className="rounded-3xl border border-line bg-paper p-4">
            <p className="text-sm font-semibold">Operational flags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold ring-1 ring-line">Data wipe required</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold ring-1 ring-line">Impact reporting</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold ring-1 ring-line">Collection planning</span>
            </div>
          </div>
        </div>
      ) : (
        <PanelEmpty icon="recycle" title="No corporate recycling leads yet" text="Company donors and recycling partnerships will appear here when records are submitted." />
      )}
    </aside>
  );
}

function SponsorshipImpactPanel({ donations }: { donations: AdminDonation[] }) {
  const sponsors = donations.filter(isSponsorship);
  const learnerDevices = sponsors.filter((item) => item.donationType === "SPONSOR_LEARNER").length;
  const classrooms = sponsors.filter((item) => item.donationType === "SPONSOR_CLASSROOM_BUNDLE").length;
  const labs = sponsors.filter((item) => item.donationType === "SPONSOR_FULL_LAB").length;
  const estimatedLearners = learnerDevices + classrooms * 30 + labs * 90;
  const africaPotential = sponsors.filter((item) => /africa|liberia|ghana|sierra leone|nigeria/i.test(`${item.country} ${item.message ?? ""}`)).length;

  return (
    <aside className="rounded-[2rem] border border-line bg-white p-5 shadow-card">
      <PanelHeader eyebrow="Impact model" title="Sponsorship impact potential" icon="chart" />
      {sponsors.length ? (
        <div className="mt-5 grid gap-3">
          <PanelMetric label="Learner devices sponsored" value={learnerDevices} />
          <PanelMetric label="Classroom bundles sponsored" value={classrooms} />
          <PanelMetric label="Labs sponsored" value={labs} />
          <PanelMetric label="Estimated learners reached" value={estimatedLearners} />
          <PanelMetric label="Africa deployment potential" value={africaPotential} />
          <PanelMetric label="CO2 reuse impact" value={`${Math.max(0, labs * 750 + classrooms * 250 + learnerDevices * 25)}kg`} />
        </div>
      ) : (
        <PanelEmpty icon="handshake" title="No sponsorship records yet" text="Learner, classroom and lab sponsorship offers will power this panel." />
      )}
    </aside>
  );
}

function PanelHeader({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: IconKey }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      </div>
    </div>
  );
}

function PanelMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper p-4">
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
    </div>
  );
}

function PanelEmpty({ icon, title, text }: { icon: IconKey; title: string; text: string }) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed border-line bg-paper p-6 text-center">
      <Icon name={icon} className="mx-auto h-8 w-8 text-flame-500" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </div>
  );
}

function DonationDetailDrawer({
  donation,
  open,
  onClose,
  onUpdate,
  onRefresh
}: {
  donation: AdminDonation | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, body: AdminDonationUpdate) => Promise<AdminDonation | null>;
  onRefresh: () => void;
}) {
  const { token } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "collection" | "sponsorship" | "notes" | "activity" | "metadata">("overview");
  const [owner, setOwner] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [collectionPlan, setCollectionPlan] = useState("");
  const [sponsorshipPlan, setSponsorshipPlan] = useState("");
  const [workflowBusy, setWorkflowBusy] = useState<string | null>(null);

  useEffect(() => {
    setOwner(donation?.assignedOwner ?? "");
    setInternalNotes(donation?.internalNotes ?? "");
    setCollectionPlan(donation?.collectionPlan ?? "");
    setSponsorshipPlan(donation?.sponsorshipPlan ?? "");
    setActiveTab("overview");
  }, [donation?.id, donation?.assignedOwner, donation?.internalNotes, donation?.collectionPlan, donation?.sponsorshipPlan]);

  if (!donation) return null;

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
    ["details", "Donation details"],
    ["collection", "Collection plan"],
    ["sponsorship", "Sponsorship plan"],
    ["notes", "Notes"],
    ["activity", "Activity"],
    ["metadata", "API metadata"]
  ] as const;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close donation drawer overlay"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">Donation record</p>
                  <h3 className="mt-2 text-2xl font-semibold">{donation.donorName}</h3>
                  <p className="mt-2 text-sm text-white/65">{donation.organisation ?? donation.email} · {formatLabel(donation.donationType)}</p>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-white/10" onClick={onClose} aria-label="Close donation details">
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <StatusBadge value={donation.status} className="bg-white/10 text-white ring-white/15" />
                <StatusBadge value={donation.priority} />
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/15">{formatLabel(donation.donorType)}</span>
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
                      ["Donor", donation.donorName],
                      ["Organisation", donation.organisation ?? "Not provided"],
                      ["Email", donation.email],
                      ["Phone", donation.phone ?? "Not provided"],
                      ["Country", donation.country],
                      ["Donor type", formatLabel(donation.donorType)],
                      ["Created", formatDate(donation.createdAt)],
                      ["Updated", formatDate(donation.updatedAt)]
                    ]}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Update status</span>
                      <select className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={donation.status} onChange={(event) => void onUpdate(donation.id, { status: event.target.value as DonationStatus })}>
                        {statusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                      </select>
                    </label>
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Change priority</span>
                      <select className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={donation.priority} onChange={(event) => void onUpdate(donation.id, { priority: event.target.value as DonationPriority })}>
                        {priorityOptions.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="rounded-3xl border border-line bg-paper p-4">
                    <label>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Assigned owner</span>
                      <input className="mt-2 min-h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-flame-300" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="donations@sitdigitalaccess.example" />
                    </label>
                    <button className="mt-3 min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(donation.id, { assignedOwner: owner || null })}>
                      Save owner
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "details" ? (
                <div className="grid gap-4">
                  <FieldGrid
                    items={[
                      ["Donation type", formatLabel(donation.donationType)],
                      ["Device count", donation.deviceCount ? String(donation.deviceCount) : "Not provided"],
                      ["Device condition", donation.deviceCondition ?? "Not provided"],
                      ["Pickup location", donation.pickupLocation ?? "Not provided"],
                      ["Sponsorship amount", formatMoney(donation.sponsorshipAmount)],
                      ["Preferred timeline", donation.preferredTimeline ?? "Not provided"]
                    ]}
                  />
                  <ContentBlock title="Message" text={donation.message || "No message provided."} />
                </div>
              ) : null}

              {activeTab === "collection" ? (
                <div className="grid gap-4">
                  <FieldGrid
                    items={[
                      ["Pickup required", needsCollection(donation) ? "Yes" : "No"],
                      ["Collection address", donation.pickupLocation ?? "Not provided"],
                      ["Preferred timeline", donation.preferredTimeline ?? "Not provided"],
                      ["Device wipe guidance", isDeviceDonation(donation) || donation.donationType === "CORPORATE_RECYCLING" ? "Required" : "Not required"],
                      ["Assigned owner", donation.assignedOwner ?? "Unassigned"],
                      ["Logistics notes", donation.collectionPlan ? "Recorded" : "Not recorded"]
                    ]}
                  />
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Collection plan</span>
                    <textarea className="mt-2 min-h-44 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-flame-300" value={collectionPlan} onChange={(event) => setCollectionPlan(event.target.value)} placeholder="Collection address, secure wipe route, logistics notes and handover plan..." />
                  </label>
                  <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(donation.id, { collectionPlan })}>
                    Save collection plan
                  </button>
                </div>
              ) : null}

              {activeTab === "sponsorship" ? (
                <div className="grid gap-4">
                  <FieldGrid
                    items={[
                      ["Sponsor route", isSponsorship(donation) ? formatLabel(donation.donationType) : "Not sponsorship"],
                      ["Learner device", donation.donationType === "SPONSOR_LEARNER" ? "Yes" : "No"],
                      ["Classroom bundle", donation.donationType === "SPONSOR_CLASSROOM_BUNDLE" ? "Yes" : "No"],
                      ["Full lab", donation.donationType === "SPONSOR_FULL_LAB" ? "Yes" : "No"],
                      ["Africa deployment", /africa|liberia|ghana|sierra leone|nigeria/i.test(`${donation.country} ${donation.message ?? ""}`) ? "Potential" : "Not flagged"],
                      ["Impact reporting", donation.donorType === "COMPANY" || donation.donorType === "FOUNDATION" ? "Likely required" : "Optional"]
                    ]}
                  />
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Sponsorship plan</span>
                    <textarea className="mt-2 min-h-44 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-flame-300" value={sponsorshipPlan} onChange={(event) => setSponsorshipPlan(event.target.value)} placeholder="Learner, classroom, lab, Africa deployment and impact-reporting route..." />
                  </label>
                  <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(donation.id, { sponsorshipPlan })}>
                    Save sponsorship plan
                  </button>
                </div>
              ) : null}

              {activeTab === "notes" ? (
                <div className="grid gap-4">
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Internal notes</span>
                    <textarea className="mt-2 min-h-52 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-flame-300" value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} placeholder="Add private donor, sponsorship or collection notes..." />
                  </label>
                  <button className="min-h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(donation.id, { internalNotes })}>
                    Save notes
                  </button>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300" onClick={() => navigator.clipboard?.writeText(donation.email)}>
                      Copy donor email
                    </button>
                    <button className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold transition hover:border-flame-300" onClick={() => void runWorkflow("follow-up", (authToken) => adminApi.createNotification(authToken, { title: `Follow up with ${donation.donorName}`, message: `Prepare donor follow-up for ${donation.email}`, category: "Donation", priority: donation.priority, linkedResourceType: "donations", linkedResourceId: donation.id, actionHref: "/admin/donations" }))}>
                      Queue follow-up
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "activity" ? (
                <div className="grid gap-3">
                  {[
                    ["Created", donation.createdAt],
                    ["Last updated", donation.updatedAt],
                    ["Current status", donation.status],
                    ["Owner", donation.assignedOwner ?? "Unassigned"]
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
                  {JSON.stringify(donation, null, 2)}
                </pre>
              ) : null}
            </div>

            <div className="grid gap-2 border-t border-line bg-paper p-4 sm:grid-cols-2">
              <button disabled={workflowBusy === "collection"} className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-flame-300 disabled:opacity-50" onClick={() => void runWorkflow("collection", (authToken) => adminApi.scheduleDonationCollection(authToken, donation.id, { title: `${donation.organisation ?? donation.donorName} collection`, pickupLocation: donation.pickupLocation ?? undefined, notes: collectionPlan || donation.message || undefined, deviceCount: donation.deviceCount ?? undefined, assignedOwner: owner || donation.assignedOwner || undefined }))}>
                {workflowBusy === "collection" ? "Creating..." : "Create collection task"}
              </button>
              <button className="min-h-11 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={() => void onUpdate(donation.id, { status: "COMPLETED" })}>
                Mark completed
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

function DonationEmptyState({
  onCreateTest,
  onCreate
}: {
  onCreateTest: () => void;
  onCreate: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white p-8 text-center shadow-card">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-flame-50 text-flame-600">
        <Icon name="heart" className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold">No donation records yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Device donations, sponsorship offers and corporate recycling partnership enquiries will appear here when public donation forms are submitted.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:inline-flex">
        <button className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-flame-600" onClick={onCreateTest}>
          Create test donation
        </button>
        <button className="min-h-11 rounded-full border border-line bg-white px-5 text-sm font-semibold transition hover:border-flame-300" onClick={onCreate}>
          Create donation record
        </button>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold transition hover:border-flame-300" href="/donate">
          Open donate page
        </Link>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold transition hover:border-flame-300" href="/donate#donation-form">
          Open sponsor form
        </Link>
      </div>
    </section>
  );
}

function CreateDonationModal({
  open,
  onClose,
  onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (body: AdminDonationCreate) => Promise<AdminDonation | null>;
}) {
  const [form, setForm] = useState<AdminDonationCreate>({
    donorName: "",
    organisation: "",
    donorType: "INDIVIDUAL",
    email: "",
    phone: "",
    country: "",
    donationType: "USED_LAPTOPS",
    deviceCount: undefined,
    deviceCondition: "",
    pickupLocation: "",
    sponsorshipAmount: undefined,
    preferredTimeline: "",
    message: "",
    priority: "MEDIUM",
    assignedOwner: "",
    internalNotes: "",
    collectionPlan: "",
    sponsorshipPlan: ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const update = (patch: Partial<AdminDonationCreate>) => setForm((current) => ({ ...current, ...patch }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const body: AdminDonationCreate = {
      ...form,
      phone: form.phone || undefined,
      organisation: form.organisation || undefined,
      deviceCount: form.deviceCount ? Number(form.deviceCount) : undefined,
      deviceCondition: form.deviceCondition || undefined,
      pickupLocation: form.pickupLocation || undefined,
      sponsorshipAmount: form.sponsorshipAmount ? Number(form.sponsorshipAmount) : undefined,
      preferredTimeline: form.preferredTimeline || undefined,
      message: form.message || undefined,
      assignedOwner: form.assignedOwner || undefined,
      internalNotes: form.internalNotes || undefined,
      collectionPlan: form.collectionPlan || undefined,
      sponsorshipPlan: form.sponsorshipPlan || undefined
    };
    const created = await onCreate(body);
    setSubmitting(false);
    if (created) onClose();
  }

  return (
    <AnimatePresence>
      <motion.button className="fixed inset-0 z-40 bg-black/40" aria-label="Close create donation modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="fixed inset-x-4 top-6 z-50 mx-auto max-h-[calc(100vh-3rem)] max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-ink p-6 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">Manual record</p>
            <h3 className="mt-2 text-2xl font-semibold">Create donation record</h3>
            <p className="mt-2 text-sm text-white/65">Add a donor, sponsorship or corporate recycling lead into the operations queue.</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:bg-white/10" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <form className="grid gap-4 p-6" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Donor name" value={form.donorName} onChange={(value) => update({ donorName: value })} required />
            <FormInput label="Organisation" value={form.organisation ?? ""} onChange={(value) => update({ organisation: value })} />
            <FormInput label="Email" type="email" value={form.email} onChange={(value) => update({ email: value })} required />
            <FormInput label="Phone" value={form.phone ?? ""} onChange={(value) => update({ phone: value })} />
            <FormInput label="Country" value={form.country} onChange={(value) => update({ country: value })} required />
            <FormInput label="Pickup location" value={form.pickupLocation ?? ""} onChange={(value) => update({ pickupLocation: value })} />
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Donor type</span>
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={form.donorType} onChange={(event) => update({ donorType: event.target.value as DonorTypeValue })}>
                {donorTypeOptions.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
              </select>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Donation type</span>
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={form.donationType} onChange={(event) => update({ donationType: event.target.value as DonationTypeValue })}>
                {donationTypeOptions.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
              </select>
            </label>
            <FormInput label="Device count" type="number" value={form.deviceCount ? String(form.deviceCount) : ""} onChange={(value) => update({ deviceCount: value ? Number(value) : undefined })} min={0} />
            <FormInput label="Sponsorship amount" type="number" value={form.sponsorshipAmount ? String(form.sponsorshipAmount) : ""} onChange={(value) => update({ sponsorshipAmount: value ? Number(value) : undefined })} min={0} />
            <FormInput label="Device condition" value={form.deviceCondition ?? ""} onChange={(value) => update({ deviceCondition: value })} />
            <FormInput label="Preferred timeline" value={form.preferredTimeline ?? ""} onChange={(value) => update({ preferredTimeline: value })} />
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Priority</span>
              <select className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-paper px-4 text-sm font-semibold outline-none focus:border-flame-300" value={form.priority} onChange={(event) => update({ priority: event.target.value as DonationPriority })}>
                {priorityOptions.map((priority) => <option key={priority} value={priority}>{formatLabel(priority)}</option>)}
              </select>
            </label>
            <FormInput label="Assigned owner" value={form.assignedOwner ?? ""} onChange={(value) => update({ assignedOwner: value })} />
          </div>
          <FormTextarea label="Message" value={form.message ?? ""} onChange={(value) => update({ message: value })} />
          <FormTextarea label="Internal notes" value={form.internalNotes ?? ""} onChange={(value) => update({ internalNotes: value })} />
          <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
            <button type="button" className="min-h-11 rounded-full border border-line px-5 text-sm font-semibold transition hover:border-flame-300" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="min-h-11 rounded-full bg-flame-500 px-5 text-sm font-semibold text-white shadow-lg shadow-flame-500/20 transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-50" disabled={submitting}>
              {submitting ? "Creating..." : "Create donation"}
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
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function applySavedView(view: DonationViewKey): Partial<DonationFilters> {
  switch (view) {
    case "newToday":
      return { dateRange: "TODAY", status: "NEW" };
    case "corporateRecycling":
      return { donationType: "CORPORATE_RECYCLING" };
    case "sponsorships":
      return {};
    case "deviceDonations":
      return {};
    case "fullLabSponsors":
      return { donationType: "SPONSOR_FULL_LAB" };
    case "collectionRequired":
      return { pickupRequired: true };
    case "highPriority":
      return { highPriorityOnly: true };
    case "unassigned":
      return { assignedOwner: "UNASSIGNED" };
    default:
      return {};
  }
}

function donationMatchesFilters(donation: AdminDonation, filters: DonationFilters, activeView: DonationViewKey) {
  const search = filters.search.trim().toLowerCase();
  if (search) {
    const haystack = [
      donation.donorName,
      donation.organisation,
      donation.email,
      donation.country,
      donation.donorType,
      donation.donationType,
      donation.deviceCondition,
      donation.pickupLocation,
      donation.message
    ].join(" ").toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  if (filters.status !== "ALL" && donation.status !== filters.status) return false;
  if (filters.donorType !== "ALL" && donation.donorType !== filters.donorType) return false;
  if (filters.donationType !== "ALL" && donation.donationType !== filters.donationType) return false;
  if (filters.deviceCondition && !(donation.deviceCondition ?? "").toLowerCase().includes(filters.deviceCondition.toLowerCase())) return false;
  if (filters.country && donation.country !== filters.country) return false;
  if (filters.pickupRequired && !needsCollection(donation)) return false;
  if (filters.assignedOwner === "UNASSIGNED" && donation.assignedOwner) return false;
  if (filters.assignedOwner && filters.assignedOwner !== "UNASSIGNED" && donation.assignedOwner !== filters.assignedOwner) return false;
  if (filters.highPriorityOnly && donation.priority !== "HIGH") return false;

  const deviceCount = donation.deviceCount ?? 0;
  if (filters.deviceCountRange === "1_5" && !(deviceCount >= 1 && deviceCount <= 5)) return false;
  if (filters.deviceCountRange === "6_20" && !(deviceCount >= 6 && deviceCount <= 20)) return false;
  if (filters.deviceCountRange === "21_50" && !(deviceCount >= 21 && deviceCount <= 50)) return false;
  if (filters.deviceCountRange === "51_PLUS" && deviceCount < 51) return false;

  const amount = donation.sponsorshipAmount ?? 0;
  if (filters.sponsorshipAmountRange === "1_500" && !(amount >= 1 && amount <= 500)) return false;
  if (filters.sponsorshipAmountRange === "501_2500" && !(amount >= 501 && amount <= 2500)) return false;
  if (filters.sponsorshipAmountRange === "2501_10000" && !(amount >= 2501 && amount <= 10000)) return false;
  if (filters.sponsorshipAmountRange === "10001_PLUS" && amount < 10001) return false;

  if (filters.dateRange === "TODAY" && !isToday(donation.createdAt)) return false;
  if (filters.dateRange === "7_DAYS" && !isWithinDays(donation.createdAt, 7)) return false;
  if (filters.dateRange === "30_DAYS" && !isWithinDays(donation.createdAt, 30)) return false;

  if (activeView === "newToday" && !isToday(donation.createdAt)) return false;
  if (activeView === "corporateRecycling" && donation.donationType !== "CORPORATE_RECYCLING" && donation.donorType !== "COMPANY") return false;
  if (activeView === "sponsorships" && !isSponsorship(donation)) return false;
  if (activeView === "deviceDonations" && !isDeviceDonation(donation)) return false;
  if (activeView === "fullLabSponsors" && donation.donationType !== "SPONSOR_FULL_LAB") return false;
  if (activeView === "collectionRequired" && !needsCollection(donation)) return false;
  if (activeView === "highPriority" && donation.priority !== "HIGH") return false;
  if (activeView === "unassigned" && donation.assignedOwner) return false;

  return true;
}

function sortDonations(donations: AdminDonation[], sortKey: DonationSortKey, direction: "asc" | "desc") {
  return [...donations].sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    if (sortKey === "deviceCount" || sortKey === "sponsorshipAmount") {
      aValue = Number(a[sortKey] ?? 0);
      bValue = Number(b[sortKey] ?? 0);
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

export function AdminDonationsWorkspace() {
  const {
    donations,
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
    createDonation,
    updateDonation,
    bulkUpdate
  } = useAdminDonations();
  const { roles } = useAdminAuth();

  const [filters, setFilters] = useState<DonationFilters>(initialFilters);
  const [activeView, setActiveView] = useState<DonationViewKey>("all");
  const [workspaceView, setWorkspaceView] = useState<DonationWorkspaceView>("table");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<DonationSortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [drawerDonation, setDrawerDonation] = useState<AdminDonation | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const pageSize = 10;

  const countries = useMemo(() => Array.from(new Set(donations.map((item) => item.country).filter(Boolean))).sort(), [donations]);
  const owners = useMemo(() => Array.from(new Set(donations.map((item) => item.assignedOwner).filter(Boolean) as string[])).sort(), [donations]);
  const primaryRole = roles[0] ?? "admin";

  const filtered = useMemo(
    () => donations.filter((donation) => donationMatchesFilters(donation, filters, activeView)),
    [activeView, donations, filters]
  );
  const sorted = useMemo(() => sortDonations(filtered, sortKey, sortDirection), [filtered, sortDirection, sortKey]);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const selectedDonations = sorted.filter((donation) => selectedIds.has(donation.id));

  useEffect(() => {
    setPage(1);
  }, [filters, activeView, workspaceView]);

  useEffect(() => {
    if (drawerDonation) {
      const updated = donations.find((donation) => donation.id === drawerDonation.id);
      if (updated) setDrawerDonation(updated);
    }
  }, [donations, drawerDonation]);

  function setFilterPatch(patch: Partial<DonationFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function selectSavedView(view: DonationViewKey) {
    setActiveView(view);
    setFilters({ ...initialFilters, ...applySavedView(view) });
  }

  function applyMetricFilter(patch: Partial<DonationFilters>, view?: DonationViewKey) {
    setActiveView(view ?? "all");
    setFilters({ ...initialFilters, ...patch });
  }

  function clearFilters() {
    setActiveView("all");
    setFilters(initialFilters);
  }

  function toggleSort(key: DonationSortKey) {
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
      const allSelected = paginated.length > 0 && paginated.every((donation) => next.has(donation.id));
      paginated.forEach((donation) => {
        if (allSelected) next.delete(donation.id);
        else next.add(donation.id);
      });
      return next;
    });
  }

  async function createTestDonation() {
    const created = await createDonation({
      donorName: "Test Donor",
      organisation: "SIT Digital Access Demo Partner",
      donorType: "COMPANY",
      email: "hello@sitdigitalaccess.example",
      country: "United Kingdom",
      donationType: "CORPORATE_RECYCLING",
      deviceCount: 25,
      deviceCondition: "Mixed condition",
      pickupLocation: "London, UK",
      preferredTimeline: "1-3 months",
      message: "Demo corporate recycling offer for testing the donation operations workspace.",
      priority: "MEDIUM",
      internalNotes: "Test donation created by admin."
    });
    if (created) setDrawerDonation(created);
  }

  return (
    <div className="grid gap-6">
      <DonationsHeader
        health={health}
        role={primaryRole}
        lastSyncedAt={lastSyncedAt}
        diagnosticsOpen={diagnosticsOpen}
        onDiagnostics={() => setDiagnosticsOpen((value) => !value)}
        onRefresh={refresh}
        onExport={() => exportDonationsCsv(sorted)}
        onCreate={() => setCreateOpen(true)}
      />

      <DonationErrorState
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

      <DonationMetricCards donations={donations} loading={loading} onFilter={applyMetricFilter} />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <DonationFilterBar
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
            onExportSelected={() => exportDonationsCsv(selectedDonations, "sit-digital-access-selected-donations.csv")}
            onBulkReviewing={() => void bulkUpdate(Array.from(selectedIds), { status: "REVIEWING" })}
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-muted">
              Showing {sorted.length.toLocaleString("en-GB")} of {donations.length.toLocaleString("en-GB")} records
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-line">{selectedIds.size} selected</span>
              <button
                className="rounded-full bg-white px-3 py-1.5 ring-1 ring-line transition hover:ring-flame-300 disabled:opacity-45"
                disabled={selectedIds.size === 0}
                onClick={() => {
                  const owner = window.prompt("Assign selected donation records to owner email or team");
                  if (owner?.trim()) void bulkUpdate(Array.from(selectedIds), { assignedOwner: owner.trim() });
                }}
              >
                Assign selected
              </button>
              <button className="rounded-full bg-white px-3 py-1.5 ring-1 ring-line transition hover:ring-flame-300" onClick={() => exportDonationsCsv(sorted, "sit-digital-access-visible-donations.csv")}>Export visible</button>
            </div>
          </div>

          {workspaceView === "table" ? (
            sorted.length || loading ? (
              <DonationTable
                donations={paginated}
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
                onOpen={setDrawerDonation}
              />
            ) : (
              <DonationEmptyState onCreateTest={() => void createTestDonation()} onCreate={() => setCreateOpen(true)} />
            )
          ) : (
            <DonationPipelineView
              donations={sorted}
              onOpen={setDrawerDonation}
              onStatusChange={(id, status) => void updateDonation(id, { status })}
            />
          )}
        </div>

        <div className="grid gap-6 content-start">
          <CorporateRecyclingPanel donations={sorted} />
          <SponsorshipImpactPanel donations={sorted} />
        </div>
      </div>

      <DonationDetailDrawer
        donation={drawerDonation}
        open={Boolean(drawerDonation)}
        onClose={() => setDrawerDonation(null)}
        onUpdate={updateDonation}
        onRefresh={refresh}
      />

      <CreateDonationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createDonation}
      />
    </div>
  );
}
