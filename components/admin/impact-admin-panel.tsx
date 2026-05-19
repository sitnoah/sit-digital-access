"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminImpact } from "@/hooks/useAdminImpact";
import { defaultImpactStats } from "@/lib/admin-impact-api";
import { cn } from "@/lib/utils";
import type { ImpactStats as CoreImpactStats } from "@/lib/api";
import type {
  ImpactAuditLog,
  ImpactDiagnostics,
  ImpactRegion,
  ImpactReuse,
  ImpactStats,
  ImpactStory
} from "@/types/impact";
import type { SystemHealthStatus } from "@/types/admin";

type ImpactMetricKey = Exclude<keyof CoreImpactStats, "id">;
type PreviewMode = "homepage" | "impact" | "donate";

const metricDefinitions: Array<{
  key: ImpactMetricKey;
  label: string;
  publicLabel: string;
  helper: string;
  icon: IconKey;
  suffix?: string;
  prefix?: string;
}> = [
  {
    key: "devicesDeployed",
    label: "Devices deployed",
    publicLabel: "devices deployed",
    helper: "Refurbished devices prepared and deployed to learners, schools, teams and partners.",
    icon: "package"
  },
  {
    key: "learnersReached",
    label: "Learners reached",
    publicLabel: "learners reached",
    helper: "Estimated learner access unlocked through devices, labs and training support.",
    icon: "graduation"
  },
  {
    key: "schoolsSupported",
    label: "Schools supported",
    publicLabel: "schools supported",
    helper: "Schools, training centres and learning hubs supported with practical digital access.",
    icon: "school"
  },
  {
    key: "businessesSupported",
    label: "Businesses supported",
    publicLabel: "businesses supported",
    helper: "SMEs, NGOs and teams supported with affordable technology and setup services.",
    icon: "business"
  },
  {
    key: "countriesServed",
    label: "Countries served",
    publicLabel: "countries served",
    helper: "Countries with active planning, delivery partnerships or deployment support.",
    icon: "globe"
  },
  {
    key: "co2SavedKg",
    label: "CO2 saved (kg)",
    publicLabel: "CO2 saved through reuse",
    helper: "Estimated circular technology benefit from device reuse and refurbishment.",
    icon: "leaf",
    suffix: "kg"
  },
  {
    key: "trainingHoursDelivered",
    label: "Training hours delivered",
    publicLabel: "training hours delivered",
    helper: "Digital skills, IT setup, cybersecurity and AI literacy hours enabled.",
    icon: "book"
  },
  {
    key: "costSavingsGenerated",
    label: "Cost savings generated",
    publicLabel: "cost savings generated",
    helper: "Estimated savings compared with equivalent new hardware and setup routes.",
    icon: "cost",
    prefix: "£"
  }
];

const storyCategories: ImpactStory["category"][] = ["Student", "School", "NGO", "Business", "Community"];
const regionStatuses: ImpactRegion["deploymentStatus"][] = ["Planning", "Active", "Scaling", "Paused"];

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatNumber(value: number, definition?: { suffix?: string; prefix?: string }) {
  const formatted = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value || 0);
  return `${definition?.prefix ?? ""}${formatted}${definition?.suffix ?? ""}`;
}

function cloneStats(stats: ImpactStats): ImpactStats {
  return {
    ...stats,
    stories: stats.stories.map((story) => ({ ...story })),
    regions: stats.regions.map((region) => ({ ...region })),
    snapshots: stats.snapshots.map((snapshot) => ({ ...snapshot, metrics: { ...snapshot.metrics } })),
    reuse: { ...stats.reuse },
    metricVisibility: { ...stats.metricVisibility }
  };
}

function numberInput(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
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

function ImpactHeader({
  health,
  role,
  lastSyncedAt,
  lastPublished,
  dirty,
  saving,
  diagnosticsOpen,
  onDiagnostics,
  onSave,
  onRefresh,
  onExport
}: {
  health: SystemHealthStatus;
  role: string;
  lastSyncedAt: Date | null;
  lastPublished?: string;
  dirty: boolean;
  saving: boolean;
  diagnosticsOpen: boolean;
  onDiagnostics: () => void;
  onSave: () => void;
  onRefresh: () => void;
  onExport: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-card lg:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Impact reporting</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Impact Reporting Command Centre</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Manage public impact stats, sustainability metrics, learner reach, school support and digital access outcomes.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SystemChip label="Public API" value={health.api === "online" ? "online" : "offline"} tone={health.api === "online" ? "green" : "orange"} />
            <SystemChip label="Firestore" value={health.firestore === "connected" ? "connected" : "unavailable"} tone={health.firestore === "connected" ? "green" : "orange"} />
            <SystemChip label="Auth" value={health.authTokenPresent ? "verified" : "token invalid"} tone={health.authTokenPresent ? "green" : "red"} />
            <SystemChip label="Admin role" value={role} tone="dark" />
            <SystemChip label="Last synced" value={lastSyncedAt ? formatDate(lastSyncedAt.toISOString()) : "Waiting"} />
            <SystemChip label="Last published" value={lastPublished ? formatDate(lastPublished) : "Not published"} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-orange transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="check" className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
          <a
            href="/impact"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700"
          >
            <Icon name="chart" className="h-4 w-4" />
            Preview public impact
          </a>
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
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-flame-200 hover:text-flame-700"
          >
            <Icon name="cloud" className="h-4 w-4" />
            Export report
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

function ImpactDiagnosticsPanel({ diagnostics }: { diagnostics: ImpactDiagnostics }) {
  const rows = [
    ["Endpoint", "GET /api/v1/impact"],
    ["Update endpoint", "PATCH /api/v1/admin/impact"],
    ["API base URL", diagnostics.apiBaseUrl],
    ["Firebase project ID", diagnostics.firebaseProjectId ?? "Not configured"],
    ["Auth token present", diagnostics.tokenPresent ? "Yes" : "No"],
    ["Token expiry", diagnostics.tokenExpirationTime ? formatDate(diagnostics.tokenExpirationTime) : "Unknown"],
    ["User email", diagnostics.userEmail ?? "Not signed in"],
    ["Admin claims", diagnostics.adminClaims.length ? diagnostics.adminClaims.join(", ") : "None detected"],
    ["Firestore collection", diagnostics.firestoreCollection],
    ["Document path", diagnostics.documentPath],
    ["Backend response status", diagnostics.status ? String(diagnostics.status) : "No failing response"],
    ["Suggested fix", "Confirm Firestore is enabled and that the NestJS API has valid Firebase Admin credentials."]
  ];

  return (
    <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-white/45">{label}</p>
          <p className="mt-2 break-words font-semibold text-white">{value}</p>
        </div>
      ))}
      {diagnostics.message ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2 xl:col-span-3">
          <p className="text-xs uppercase tracking-[0.14em] text-white/45">Last API message</p>
          <p className="mt-2 break-words font-semibold text-white">{diagnostics.message}</p>
        </div>
      ) : null}
    </div>
  );
}

function ImpactErrorState({
  diagnostics,
  onRetry,
  onInitialise,
  onDiagnostics
}: {
  diagnostics: ImpactDiagnostics;
  onRetry: () => void;
  onInitialise: () => void;
  onDiagnostics: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-white shadow-card">
      <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            <Icon name="shield" className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Impact data could not be loaded.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            The admin workspace is still available. Empty impact values are shown while the API or Firestore connection is checked.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onRetry} className="rounded-full bg-flame-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame-600">
              Retry
            </button>
            <button type="button" onClick={onInitialise} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700">
              Initialise impact document
            </button>
            <button type="button" onClick={onDiagnostics} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700">
              View diagnostics
            </button>
            <a href="http://localhost:8080/api/v1/impact" target="_blank" className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-flame-200 hover:text-flame-700">
              Open API health
            </a>
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-white">
          <ImpactDiagnosticsPanel diagnostics={diagnostics} />
        </div>
      </div>
    </section>
  );
}

function InitialiseImpactDocumentCard({ onInitialise, saving }: { onInitialise: () => void; saving: boolean }) {
  return (
    <section className="rounded-[2rem] border border-dashed border-flame-200 bg-flame-50 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-700">Document setup</p>
          <h3 className="mt-2 text-xl font-semibold">Impact document has not been initialised.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-flame-900/70">
            Create `impactStats/current` with zero metrics, draft story structures, regional structures and snapshot arrays. This is safe to run because the backend uses merge writes.
          </p>
        </div>
        <button
          type="button"
          onClick={onInitialise}
          disabled={saving}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create impactStats/current"}
        </button>
      </div>
    </section>
  );
}

function ImpactMetricEditorGrid({
  draft,
  previous,
  onMetricChange,
  onVisibilityChange
}: {
  draft: ImpactStats;
  previous: ImpactStats;
  onMetricChange: (key: ImpactMetricKey, value: number) => void;
  onVisibilityChange: (key: ImpactMetricKey, visible: boolean) => void;
}) {
  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">KPI editor</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Editable public impact metrics</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Update the headline outcomes shown across the public website. Values remain local until you save.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricDefinitions.map((metric) => {
          const value = numberInput(draft[metric.key]);
          const previousValue = numberInput(previous[metric.key]);
          const delta = value - previousValue;
          const visible = draft.metricVisibility?.[metric.key] ?? true;

          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-[1.5rem] border border-line bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 ring-1 ring-flame-100">
                  <Icon name={metric.icon} className="h-5 w-5" />
                </span>
                <label className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-muted ring-1 ring-line">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(event) => onVisibilityChange(metric.key, event.target.checked)}
                    className="h-3.5 w-3.5 rounded border-line text-flame-500 focus:ring-flame-200"
                  />
                  Public
                </label>
              </div>
              <label className="mt-5 block">
                <span className="text-sm font-semibold text-ink">{metric.label}</span>
                <div className="mt-2 flex items-center rounded-2xl border border-line bg-white focus-within:border-flame-300 focus-within:ring-4 focus-within:ring-flame-100">
                  {metric.prefix ? <span className="pl-4 text-sm font-semibold text-muted">{metric.prefix}</span> : null}
                  <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(event) => onMetricChange(metric.key, numberInput(event.target.value))}
                    className="h-12 w-full rounded-2xl border-0 bg-transparent px-4 text-lg font-semibold outline-none"
                  />
                  {metric.suffix ? <span className="pr-4 text-sm font-semibold text-muted">{metric.suffix}</span> : null}
                </div>
              </label>
              <p className="mt-3 min-h-10 text-xs leading-5 text-muted">{metric.helper}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs">
                <span className="text-muted">Previous: {formatNumber(previousValue, metric)}</span>
                <span className={cn("font-semibold", delta > 0 ? "text-green-700" : delta < 0 ? "text-red-700" : "text-muted")}>
                  {delta === 0 ? "No change" : `${delta > 0 ? "+" : ""}${formatNumber(delta, metric)}`}
                </span>
              </div>
              <div className="mt-3 h-8 rounded-xl bg-zinc-100 p-1">
                <div className="h-full rounded-lg bg-gradient-to-r from-flame-400 to-orange-300" style={{ width: `${Math.min(100, Math.max(12, value ? 72 : 18))}%` }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function PublicImpactPreview({ draft, mode, onMode }: { draft: ImpactStats; mode: PreviewMode; onMode: (mode: PreviewMode) => void }) {
  const visibleMetrics = metricDefinitions.filter((metric) => draft.metricVisibility?.[metric.key] ?? true);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
      <div className="border-b border-line p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Public preview</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Public impact preview</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Preview how the public impact metrics can appear across the website before publishing.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(["homepage", "impact", "donate"] as PreviewMode[]).map((previewMode) => (
              <button
                key={previewMode}
                type="button"
                onClick={() => onMode(previewMode)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition",
                  mode === previewMode ? "bg-ink text-white" : "bg-zinc-50 text-muted hover:text-ink"
                )}
              >
                {previewMode === "impact" ? "Impact page" : previewMode}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("p-6", mode === "homepage" ? "bg-zinc-950 text-white" : "bg-zinc-50")}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleMetrics.slice(0, mode === "homepage" ? 4 : 8).map((metric) => (
            <div key={metric.key} className={cn("rounded-2xl p-5 ring-1", mode === "homepage" ? "bg-white/10 ring-white/10" : "bg-white ring-line")}>
              <Icon name={metric.icon} className={cn("h-5 w-5", mode === "homepage" ? "text-flame-300" : "text-flame-600")} />
              <p className="mt-4 text-3xl font-semibold">{formatNumber(numberInput(draft[metric.key]), metric)}</p>
              <p className={cn("mt-1 text-sm", mode === "homepage" ? "text-white/65" : "text-muted")}>{metric.publicLabel}</p>
            </div>
          ))}
        </div>
        <div className={cn("mt-5 rounded-2xl p-5", mode === "homepage" ? "bg-white/10" : "bg-white ring-1 ring-line")}>
          <p className="text-sm font-semibold">Sustainability badge</p>
          <p className={cn("mt-2 text-sm leading-6", mode === "homepage" ? "text-white/70" : "text-muted")}>
            Circular technology reuse has helped save an estimated {formatNumber(draft.co2SavedKg, { suffix: "kg" })} CO2 while reducing technology access costs by an estimated {formatNumber(draft.costSavingsGenerated, { prefix: "£" })}.
          </p>
        </div>
      </div>
    </section>
  );
}

function ImpactStoryBuilder({
  stories,
  onChange
}: {
  stories: ImpactStory[];
  onChange: (stories: ImpactStory[]) => void;
}) {
  const updateStory = (index: number, patch: Partial<ImpactStory>) => {
    onChange(stories.map((story, storyIndex) => storyIndex === index ? { ...story, ...patch } : story));
  };

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Stories</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Impact story builder</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Prepare draft stories for future public impact pages and donor reporting workflows.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([
            ...stories,
            {
              id: `story-${Date.now()}`,
              title: "New impact story",
              category: "Community",
              summary: "Add a short, evidence-led impact summary.",
              region: "UK",
              relatedMetric: "learnersReached",
              visible: false
            }
          ])}
          className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          Add story
        </button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {stories.map((story, index) => (
          <div key={story.id} className="rounded-[1.5rem] border border-line bg-zinc-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <select
                value={story.category}
                onChange={(event) => updateStory(index, { category: event.target.value as ImpactStory["category"] })}
                className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300"
              >
                {storyCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
                <input
                  type="checkbox"
                  checked={story.visible}
                  onChange={(event) => updateStory(index, { visible: event.target.checked })}
                  className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
                />
                Visible
              </label>
            </div>
            <input
              value={story.title}
              onChange={(event) => updateStory(index, { title: event.target.value })}
              className="mt-4 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
            />
            <textarea
              value={story.summary}
              onChange={(event) => updateStory(index, { summary: event.target.value })}
              rows={3}
              className="mt-3 w-full rounded-2xl border border-line bg-white p-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={story.region}
                onChange={(event) => updateStory(index, { region: event.target.value })}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-flame-300"
                placeholder="Region"
              />
              <select
                value={story.relatedMetric}
                onChange={(event) => updateStory(index, { relatedMetric: event.target.value as ImpactStory["relatedMetric"] })}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-flame-300"
              >
                {metricDefinitions.map((metric) => <option key={metric.key} value={metric.key}>{metric.label}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={() => onChange(stories.filter((_, storyIndex) => storyIndex !== index))}
              className="mt-4 text-sm font-semibold text-red-700"
            >
              Remove story
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SustainabilityReusePanel({
  draft,
  onReuseChange,
  onMetricChange
}: {
  draft: ImpactStats;
  onReuseChange: (reuse: ImpactReuse) => void;
  onMetricChange: (key: ImpactMetricKey, value: number) => void;
}) {
  const estimate = Math.round((draft.reuse.devicesReused || draft.devicesDeployed) * draft.reuse.averageCo2KgPerDevice);
  const update = (patch: Partial<ImpactReuse>) => onReuseChange({ ...draft.reuse, ...patch });

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Sustainability</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">Circular technology and reuse impact</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Estimate reuse benefits while keeping a manual override available for audited figures.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricMiniInput label="Devices reused" value={draft.reuse.devicesReused} onChange={(value) => update({ devicesReused: value })} />
        <MetricMiniInput label="Devices diverted from waste" value={draft.reuse.devicesDivertedFromWaste} onChange={(value) => update({ devicesDivertedFromWaste: value })} />
        <MetricMiniInput label="Average kg CO2 per device" value={draft.reuse.averageCo2KgPerDevice} onChange={(value) => update({ averageCo2KgPerDevice: value })} />
        <div className="rounded-2xl border border-line bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-ink">Auto-estimate</p>
          <p className="mt-2 text-3xl font-semibold text-flame-600">{formatNumber(estimate, { suffix: "kg" })}</p>
          <button
            type="button"
            onClick={() => onMetricChange("co2SavedKg", estimate)}
            className="mt-3 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white"
          >
            Apply estimate
          </button>
        </div>
      </div>
      <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink">
        <input
          type="checkbox"
          checked={draft.reuse.manualCo2Override}
          onChange={(event) => update({ manualCo2Override: event.target.checked })}
          className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
        />
        Manual CO2 override has been reviewed
      </label>
      <textarea
        value={draft.reuse.notes}
        onChange={(event) => update({ notes: event.target.value })}
        rows={3}
        className="mt-4 w-full rounded-2xl border border-line p-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
        placeholder="Reuse notes, calculation assumptions or audit context..."
      />
    </section>
  );
}

function MetricMiniInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-2xl border border-line bg-zinc-50 p-4">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(numberInput(event.target.value))}
        className="mt-2 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-flame-300"
      />
    </label>
  );
}

function ImpactRegionDashboard({
  regions,
  onChange
}: {
  regions: ImpactRegion[];
  onChange: (regions: ImpactRegion[]) => void;
}) {
  const updateRegion = (index: number, patch: Partial<ImpactRegion>) => {
    onChange(regions.map((region, regionIndex) => regionIndex === index ? { ...region, ...patch } : region));
  };

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Regions</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">Impact by region</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Track public and internal impact readiness across the UK and Africa deployment regions.
        </p>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {regions.map((region, index) => (
          <div key={region.id} className="rounded-[1.5rem] border border-line bg-zinc-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-ink">{region.name}</h4>
              <select
                value={region.deploymentStatus}
                onChange={(event) => updateRegion(index, { deploymentStatus: event.target.value as ImpactRegion["deploymentStatus"] })}
                className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-flame-300"
              >
                {regionStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricMiniInput label="Devices deployed" value={region.devicesDeployed} onChange={(value) => updateRegion(index, { devicesDeployed: value })} />
              <MetricMiniInput label="Learners reached" value={region.learnersReached} onChange={(value) => updateRegion(index, { learnersReached: value })} />
              <MetricMiniInput label="Schools supported" value={region.schoolsSupported} onChange={(value) => updateRegion(index, { schoolsSupported: value })} />
              <MetricMiniInput label="Active partnerships" value={region.activePartnerships} onChange={(value) => updateRegion(index, { activePartnerships: value })} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImpactCharts({ draft, onSnapshot }: { draft: ImpactStats; onSnapshot: () => void }) {
  const hasSnapshots = draft.snapshots.length > 0;
  const chartCards = [
    "Impact growth over time",
    "Devices deployed by region",
    "Learners reached by programme",
    "Training hours by month",
    "CO2 saved trend"
  ];

  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Analytics</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Impact analytics charts</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Historical impact data will appear after monthly snapshots are saved.
          </p>
        </div>
        <button type="button" onClick={onSnapshot} className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Save monthly snapshot
        </button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {chartCards.map((title, index) => (
          <div key={title} className="rounded-[1.5rem] border border-line bg-zinc-50 p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-ink">{title}</h4>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted ring-1 ring-line">{hasSnapshots ? `${draft.snapshots.length} snapshots` : "Waiting"}</span>
            </div>
            <svg viewBox="0 0 420 140" className="mt-5 h-36 w-full">
              <defs>
                <linearGradient id={`impact-chart-${index}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ff7a00" />
                  <stop offset="100%" stopColor="#111111" />
                </linearGradient>
              </defs>
              <path d="M10 120 C70 80 105 96 140 72 C190 38 220 68 260 42 C310 10 350 34 410 18" fill="none" stroke={`url(#impact-chart-${index})`} strokeWidth="5" strokeLinecap="round" />
              <path d="M10 120 C70 80 105 96 140 72 C190 38 220 68 260 42 C310 10 350 34 410 18 L410 140 L10 140 Z" fill="#ff7a00" opacity="0.08" />
              {[0, 1, 2, 3, 4].map((line) => <line key={line} x1="0" x2="420" y1={25 + line * 24} y2={25 + line * 24} stroke="#e4e4e7" />)}
            </svg>
            {!hasSnapshots ? <p className="mt-3 text-sm text-muted">Historical impact data will appear after monthly snapshots are saved.</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ImpactAuditTrail({ logs }: { logs: ImpactAuditLog[] }) {
  return (
    <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Audit trail</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">Recent impact admin activity</h3>
      <div className="mt-6 space-y-3">
        {logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
            No impact audit events yet. Updates and snapshots will appear here once Firestore audit logs are available.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 rounded-2xl border border-line bg-zinc-50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-flame-600 ring-1 ring-line">
                <Icon name="badge" className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{log.action.replaceAll("_", " ")}</p>
                <p className="mt-1 text-sm text-muted">{log.actorEmail ?? "Unknown admin"} · {formatDate(log.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function exportImpactReport(draft: ImpactStats) {
  const lines = [
    "SIT Digital Access Impact Report",
    `Generated,${new Date().toISOString()}`,
    "",
    "Metric,Value",
    ...metricDefinitions.map((metric) => `${metric.label},${draft[metric.key]}`),
    "",
    "Region,Devices,Learners,Schools,Partnerships,Status",
    ...draft.regions.map((region) => `${region.name},${region.devicesDeployed},${region.learnersReached},${region.schoolsSupported},${region.activePartnerships},${region.deploymentStatus}`)
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sit-digital-access-impact-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function ImpactAdminPanel() {
  const { roles, claims } = useAdminAuth();
  const {
    stats,
    auditLogs,
    loading,
    saving,
    errors,
    health,
    diagnostics,
    lastSyncedAt,
    actionMessage,
    actionError,
    refresh,
    refreshTokenAndData,
    initialiseImpactStats,
    updateImpactStats,
    saveImpactSnapshot
  } = useAdminImpact();
  const [draft, setDraft] = useState<ImpactStats>(defaultImpactStats);
  const [savedDraft, setSavedDraft] = useState<ImpactStats>(defaultImpactStats);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("homepage");

  useEffect(() => {
    const next = cloneStats(stats);
    setDraft(next);
    setSavedDraft(next);
  }, [stats]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedDraft), [draft, savedDraft]);
  const role = roles[0] ?? (claims?.superAdmin ? "superAdmin" : "admin");
  const likelyMissingDocument = !stats.createdAt && !stats.updatedAt && errors.length === 0;

  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const setMetric = (key: ImpactMetricKey, value: number) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setVisibility = (key: ImpactMetricKey, visible: boolean) => {
    setDraft((current) => ({
      ...current,
      metricVisibility: {
        ...current.metricVisibility,
        [key]: visible
      }
    }));
  };

  const handleSave = async () => {
    const saved = await updateImpactStats(draft);
    if (saved) {
      const next = cloneStats(saved);
      setDraft(next);
      setSavedDraft(next);
    }
  };

  const handleInitialise = async () => {
    const initialised = await initialiseImpactStats();
    if (initialised) {
      const next = cloneStats(initialised);
      setDraft(next);
      setSavedDraft(next);
    }
  };

  const handleSnapshot = async () => {
    const label = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date());
    const saved = await saveImpactSnapshot(label, draft);
    if (saved) {
      const next = cloneStats(saved);
      setDraft(next);
      setSavedDraft(next);
    }
  };

  return (
    <div className="space-y-6">
      <ImpactHeader
        health={health}
        role={role}
        lastSyncedAt={lastSyncedAt}
        lastPublished={draft.updatedAt}
        dirty={dirty}
        saving={saving}
        diagnosticsOpen={diagnosticsOpen}
        onDiagnostics={() => setDiagnosticsOpen((value) => !value)}
        onSave={handleSave}
        onRefresh={refresh}
        onExport={() => exportImpactReport(draft)}
      />

      {diagnosticsOpen ? (
        <section className="rounded-[2rem] bg-ink p-6 text-white shadow-card">
          <ImpactDiagnosticsPanel diagnostics={diagnostics} />
        </section>
      ) : null}

      {errors.length > 0 ? (
        <ImpactErrorState
          diagnostics={diagnostics}
          onRetry={refresh}
          onInitialise={handleInitialise}
          onDiagnostics={() => setDiagnosticsOpen(true)}
        />
      ) : null}

      {(likelyMissingDocument || errors.some((error) => error.status === 404)) ? (
        <InitialiseImpactDocumentCard onInitialise={handleInitialise} saving={saving} />
      ) : null}

      {(actionMessage || actionError) ? (
        <div className={cn(
          "rounded-2xl border p-4 text-sm font-semibold",
          actionError ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
        )}>
          {actionError ?? actionMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-[1.5rem] border border-line bg-white shadow-sm" />
          ))}
        </div>
      ) : (
        <>
          <ImpactMetricEditorGrid
            draft={draft}
            previous={savedDraft}
            onMetricChange={setMetric}
            onVisibilityChange={setVisibility}
          />

          <PublicImpactPreview draft={draft} mode={previewMode} onMode={setPreviewMode} />

          <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <SustainabilityReusePanel
              draft={draft}
              onReuseChange={(reuse) => setDraft((current) => ({ ...current, reuse }))}
              onMetricChange={setMetric}
            />
            <section className="rounded-[2rem] border border-line bg-zinc-950 p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-300">Publishing state</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Ready for public reporting</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Save changes to publish public metric updates through `GET /api/v1/impact`. Use monthly snapshots for future historical reporting.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Unsaved changes</p>
                  <p className="mt-1 text-2xl font-semibold">{dirty ? "Yes" : "No"}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-white/60">Snapshots saved</p>
                  <p className="mt-1 text-2xl font-semibold">{draft.snapshots.length}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void refreshTokenAndData()}
                  className="rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Refresh token and data
                </button>
              </div>
            </section>
          </div>

          <ImpactStoryBuilder
            stories={draft.stories}
            onChange={(stories) => setDraft((current) => ({ ...current, stories }))}
          />

          <ImpactRegionDashboard
            regions={draft.regions}
            onChange={(regions) => setDraft((current) => ({ ...current, regions }))}
          />

          <ImpactCharts draft={draft} onSnapshot={handleSnapshot} />

          <ImpactAuditTrail logs={auditLogs} />
        </>
      )}
    </div>
  );
}
