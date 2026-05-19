"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { useRepairStatus } from "@/hooks/useRepairStatus";
import { repairRouteCards } from "@/lib/repair-content";
import { cn } from "@/lib/utils";
import type { RepairTicketStatus } from "@/types/repair";
import type { RepairStatusCustomerAction, RepairStatusError, RepairStatusResult, RepairStatusTimelineItem } from "@/types/repair-status";

type StageEducationCard = {
  title: string;
  status: RepairTicketStatus;
  explanation: string;
  action: string;
  icon: IconKey;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

const stageEducation: StageEducationCard[] = [
  { title: "Booking received", status: "NEW", explanation: "The repair request has been captured and queued for review.", action: "Keep the ticket ID and token private.", icon: "list" },
  { title: "Triage", status: "TRIAGE", explanation: "The team checks route, urgency, device type and whether more detail is needed.", action: "Watch for a public update or request for information.", icon: "search" },
  { title: "Diagnostics", status: "DIAGNOSTICS", explanation: "A technician checks symptoms and confirms the likely repair route.", action: "Wait for an estimate, warranty route or parts update.", icon: "wrench" },
  { title: "Estimate approval", status: "ESTIMATE_SENT", explanation: "Paid work is not treated as approved until the estimate route is confirmed.", action: "Contact repair operations if you need help approving.", icon: "cost" },
  { title: "Parts check", status: "WAITING_FOR_PARTS", explanation: "Some repairs need compatible parts, supplier checks or reuse decisions.", action: "No action unless the team asks for confirmation.", icon: "package" },
  { title: "Repair", status: "REPAIR_IN_PROGRESS", explanation: "Approved repair or upgrade work is underway.", action: "Wait for quality check before arranging return.", icon: "settings" },
  { title: "Quality check", status: "QUALITY_CHECK", explanation: "The device is tested before release, handover or return.", action: "Prepare pickup or return details if requested.", icon: "shield" },
  { title: "Ready / completed", status: "READY_FOR_PICKUP", explanation: "The device is ready for pickup, return or has been closed.", action: "Arrange handover or book aftercare if needed.", icon: "check" }
];

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

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatRoute(value?: string | null) {
  if (!value) return "Not recorded";
  const route = repairRouteCards.find((item) => item.value === value);
  return route?.title ?? formatStatus(value);
}

function progressTone(status: RepairTicketStatus) {
  if (status === "COMPLETED" || status === "READY_FOR_PICKUP" || status === "READY_FOR_RETURN") return "bg-green-500";
  if (status === "CANCELLED" || status === "UNREPAIRABLE") return "bg-red-500";
  if (status === "WAITING_FOR_PARTS" || status === "AWAITING_APPROVAL" || status === "ESTIMATE_SENT") return "bg-blue-500";
  return "bg-flame-500";
}

function errorCopy(error: RepairStatusError) {
  if (error.code === "MISSING_API") {
    return {
      title: "Repair status API is not configured yet.",
      detail: "Repair operations can still help find your booking details.",
      actions: ["Contact repair operations"]
    };
  }
  if (error.code === "SERVER_ERROR" || error.code === "NETWORK_ERROR") {
    return {
      title: "Repair status could not be loaded.",
      detail: "The tracking service did not respond. Please retry or contact support if this continues.",
      actions: ["Retry", "Book another repair", "Contact support"]
    };
  }
  if (error.code === "TOKEN_EXPIRED") {
    return {
      title: "This status token has expired.",
      detail: "Contact repair operations to verify your repair and receive a fresh status route.",
      actions: ["Contact repair operations"]
    };
  }
  return {
    title: "Ticket not found or token is incorrect.",
    detail: "Check your booking confirmation and make sure the ticket ID and token were entered exactly as shown.",
    actions: ["Try again", "Check booking confirmation", "Contact repair operations"]
  };
}

export function RepairStatusLookup({ className }: { className?: string }) {
  const tracker = useRepairStatus();
  const deepLinkApplied = useRef(false);
  const { lookup, setTicketId, setToken } = tracker;

  useEffect(() => {
    if (deepLinkApplied.current) return;
    const params = new URLSearchParams(window.location.search);
    const ticketParam = params.get("ticketId")?.trim() ?? "";
    const tokenParam = params.get("token")?.trim() ?? "";
    if (!ticketParam || !tokenParam) return;

    deepLinkApplied.current = true;
    setTicketId(ticketParam);
    setToken(tokenParam);
    void lookup(ticketParam, tokenParam);
  }, [lookup, setTicketId, setToken]);

  return (
    <div className={cn("bg-white", className)}>
      <RepairStatusHero />
      <section id="status-lookup" className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <AnimatedSection>
            <RepairStatusLookupForm tracker={tracker} />
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <RepairStatusResultArea state={tracker.state} onRetry={() => void tracker.lookup()} />
          </AnimatedSection>
        </div>
      </section>
      <RepairStageExplainer />
      <TicketDetailsHelper />
      <RepairRoutesSummary />
      <RepairStatusCTA />
    </div>
  );
}

export function RepairStatusPortal() {
  return <RepairStatusLookup />;
}

function RepairStatusHero() {
  const steps = ["New", "Triage", "Diagnostics", "Estimate", "Repair", "Quality Check", "Ready"];

  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            REPAIR STATUS · DIAGNOSTICS · TRACKING · QUALITY CHECK
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Track diagnostics, parts, repair progress and quality checks.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
            Use your ticket ID and status token to view a customer-safe repair timeline without exposing internal technician notes, pricing metadata or admin-only records.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#status-lookup">Check Repair Status</ButtonLink>
            <ButtonLink href="/book-repair" variant="secondary">Book Another Repair</ButtonLink>
            <ButtonLink href="/repair-centres" variant="ghost" className="text-white hover:bg-white/10">View Repair Routes</ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["Customer-safe lookup", "Internal notes protected", "Status-token access", "Quality check tracked", "Data-aware repair process"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/80">
                {item}
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-flame-100">Repair ticket dashboard</p>
                <h2 className="mt-2 text-2xl font-semibold">Secure status portal</h2>
              </div>
              <span className="rounded-full bg-flame-500/20 px-3 py-1.5 text-xs font-semibold text-flame-50">
                Token required
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-lg bg-white/[0.08] px-4 py-3">
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", index < 3 ? "bg-flame-500 text-white" : "bg-white/10 text-white/70")}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{step}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className={cn("h-full rounded-full", index < 3 ? "w-2/3 bg-flame-400" : "w-1/4 bg-white/20")} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <HeroMiniCard label="Device health" value="Diagnostics first" detail="Customer-safe stage updates" />
              <HeroMiniCard label="Technician" value="Protected" detail="Internal notes stay private" />
              <HeroMiniCard label="Access" value="Ticket ID + token" detail="Required for lookup" />
              <HeroMiniCard label="Release" value="Quality check" detail="Tracked before pickup or return" tone="orange" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function HeroMiniCard({ label, value, detail, tone = "dark" }: { label: string; value: string; detail: string; tone?: "dark" | "orange" }) {
  return (
    <div className={cn("rounded-lg p-4", tone === "orange" ? "bg-flame-500/20" : "bg-white/[0.08]")}>
      <p className="text-xs font-semibold uppercase text-white/50">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-white/60">{detail}</p>
    </div>
  );
}

function RepairStatusLookupForm({
  tracker
}: {
  tracker: ReturnType<typeof useRepairStatus>;
}) {
  const loading = tracker.state.status === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await tracker.lookup();
  }

  return (
    <form className="rounded-lg border border-line bg-white p-6 shadow-soft sm:p-8" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">Secure lookup</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">Track a repair ticket safely.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Enter the ticket ID and status token shown after booking. This lookup only returns customer-safe progress details.
          </p>
        </div>
        <span className="hidden rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex">
          Token protected
        </span>
      </div>

      <label className="mt-6 block text-sm font-medium text-ink">
        Ticket ID
        <input
          className={inputClass}
          name="ticketId"
          value={tracker.ticketId}
          onChange={(event) => tracker.setTicketId(event.target.value)}
          placeholder="Repair ticket ID"
          required
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-ink">
        Status token
        <div className="mt-2 flex overflow-hidden rounded-lg border border-line bg-white shadow-sm focus-within:border-flame-400 focus-within:ring-4 focus-within:ring-flame-100">
          <input
            className="min-h-12 min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70"
            name="token"
            type={tracker.showToken ? "text" : "password"}
            value={tracker.token}
            onChange={(event) => tracker.setToken(event.target.value)}
            placeholder="Customer status token"
            required
          />
          <button
            type="button"
            onClick={() => tracker.setShowToken(!tracker.showToken)}
            className="border-l border-line px-3 text-xs font-semibold text-muted transition hover:text-ink"
          >
            {tracker.showToken ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            onClick={() => void tracker.pasteTokenFromClipboard()}
            className="border-l border-line px-3 text-xs font-semibold text-muted transition hover:text-ink"
          >
            Paste
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted sm:w-auto"
      >
        <Icon name="search" className="h-4 w-4" />
        {loading ? "Checking..." : "Check status"}
      </button>

      <div className="mt-5 rounded-lg border border-line bg-paper p-4">
        <div className="flex items-start gap-3">
          <Icon name="shield" className="mt-0.5 h-5 w-5 text-flame-600" />
          <div>
            <p className="text-sm font-semibold text-ink">Status tokens protect repair details.</p>
            <p className="mt-1 text-sm leading-6 text-muted">Do not share your token publicly. Internal notes, staff details and admin metadata are not returned through this lookup.</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => tracker.setHelperOpen(!tracker.helperOpen)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-flame-700 transition hover:text-flame-800"
      >
        Where do I find this?
        <Icon name="chevron" className={cn("h-4 w-4 transition", tracker.helperOpen && "rotate-180")} />
      </button>

      {tracker.helperOpen ? (
        <div className="mt-4 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-muted shadow-sm">
          <p className="font-semibold text-ink">Your ticket ID and token are shown after booking.</p>
          <p className="mt-2">They may also be included in a confirmation email when email delivery is configured. If you lose the token, contact repair operations and keep any warranty or asset reference ready.</p>
          <Link href="/contact" className="mt-3 inline-flex font-semibold text-flame-700 hover:text-flame-800">
            Lost your token? Contact repair operations
          </Link>
        </div>
      ) : null}

      {tracker.state.status === "error" ? (
        <RepairStatusErrorState error={tracker.state.error} onRetry={() => void tracker.lookup()} compact />
      ) : null}
    </form>
  );
}

function RepairStatusResultArea({
  state,
  onRetry
}: {
  state: ReturnType<typeof useRepairStatus>["state"];
  onRetry: () => void;
}) {
  if (state.status === "success") {
    return <RepairStatusResultPanel repair={state.repair} />;
  }

  if (state.status === "error") {
    return <RepairStatusErrorState error={state.error} onRetry={onRetry} />;
  }

  if (state.status === "loading") {
    return (
      <section className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-36 rounded-full bg-paper" />
          <div className="h-8 w-2/3 rounded-full bg-paper" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 rounded-lg bg-paper" />
            ))}
          </div>
          <div className="h-40 rounded-lg bg-paper" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="rounded-lg border border-dashed border-line bg-paper p-6 text-sm leading-6 text-muted">
        Repair status details will appear here after a successful lookup.
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["Customer-safe access", "Protected internal notes", "Timeline and next step"].map((item) => (
          <div key={item} className="rounded-lg border border-line bg-white p-4">
            <Icon name="shield" className="h-4 w-4 text-flame-600" />
            <p className="mt-3 text-sm font-semibold text-ink">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RepairStatusResultPanel({ repair }: { repair: RepairStatusResult }) {
  return (
    <section className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">Ticket {repair.ticketId}</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">{repair.publicStatusLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{repair.publicMessage}</p>
        </div>
        <span className={cn("inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-white", progressTone(repair.status))}>
          {repair.progressPercent}% complete
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryItem label="Device" value={[repair.brand, repair.model].filter(Boolean).join(" ") || repair.deviceType || "Not recorded"} />
        <SummaryItem label="Category" value={repair.repairCategory ?? "Diagnostics"} />
        <SummaryItem label="Route" value={formatRoute(repair.repairRoute)} />
        <SummaryItem label="Location" value={repair.location ?? "Not recorded"} />
        <SummaryItem label="Created" value={formatDate(repair.createdAt)} />
        <SummaryItem label="Last updated" value={formatDate(repair.updatedAt ?? repair.createdAt)} />
        <SummaryItem label="Action required" value={repair.customerActionRequired ? "Yes" : "No"} />
        <SummaryItem label="Turnaround" value={repair.estimatedTurnaround ?? "Confirmed after diagnostics"} />
      </div>

      <RepairCurrentStageCard repair={repair} />
      <RepairTimeline items={repair.timeline} />
      <RepairCustomerActions actions={repair.customerActions} />
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 font-semibold text-ink">{value}</p>
    </div>
  );
}

function RepairCurrentStageCard({ repair }: { repair: RepairStatusResult }) {
  return (
    <div className="mt-6 rounded-lg border border-line bg-ink p-5 text-white shadow-card">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-flame-200">Current stage</p>
          <h3 className="mt-2 text-2xl font-semibold">{repair.publicStatusLabel}</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">{repair.nextStep}</p>
        </div>
        <div className="w-full lg:max-w-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-white/70">
            <span>Progress</span>
            <span>{repair.progressPercent}%</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-white/10">
            <div className={cn("h-full rounded-full", progressTone(repair.status))} style={{ width: `${repair.progressPercent}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <span className="rounded-lg bg-white/[0.08] px-3 py-2">Action: {repair.customerActionRequired ? "Yes" : "No"}</span>
            <span className="rounded-lg bg-white/[0.08] px-3 py-2">{repair.estimatedTurnaround ?? "Timing TBC"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepairTimeline({ items }: { items: RepairStatusTimelineItem[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-ink">Repair timeline</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.status}
            className={cn(
              "rounded-lg border p-4",
              item.active ? "border-flame-300 bg-flame-50" : item.completed ? "border-green-200 bg-green-50" : "border-line bg-white"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  item.active ? "bg-flame-500 text-white" : item.completed ? "bg-green-600 text-white" : "bg-paper text-muted"
                )}
              >
                {item.completed ? <Icon name="check" className="h-4 w-4" /> : item.active ? <Icon name="wrench" className="h-4 w-4" /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-ink">{item.label}</p>
                  <span className="text-xs font-semibold text-muted">{item.timestamp ? formatDate(item.timestamp) : item.completed ? "Completed" : "Pending"}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">{item.publicNote}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RepairCustomerActions({ actions }: { actions: RepairStatusCustomerAction[] }) {
  return (
    <div className="mt-6 rounded-lg border border-line bg-paper p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Customer actions</h3>
          <p className="mt-1 text-sm text-muted">Only customer-safe actions are shown here.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <div key={action.type} className={cn("rounded-lg border bg-white p-4", action.enabled ? "border-line" : "border-dashed border-line opacity-75")}>
            <p className="font-semibold text-ink">{action.label}</p>
            {action.description ? <p className="mt-1 text-sm leading-6 text-muted">{action.description}</p> : null}
            {action.enabled && action.href ? (
              <Link href={action.href} className="mt-3 inline-flex text-sm font-semibold text-flame-700 hover:text-flame-800">
                Open
              </Link>
            ) : (
              <span className="mt-3 inline-flex text-xs font-semibold uppercase text-muted">Placeholder</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RepairStatusErrorState({
  error,
  onRetry,
  compact = false
}: {
  error: RepairStatusError;
  onRetry: () => void;
  compact?: boolean;
}) {
  const copy = errorCopy(error);

  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-5", compact ? "mt-5" : "shadow-card")}>
      <div className="flex items-start gap-3">
        <Icon name="shield" className="mt-0.5 h-5 w-5 text-red-700" />
        <div>
          <p className="font-semibold text-red-800">{copy.title}</p>
          <p className="mt-1 text-sm leading-6 text-red-700">{copy.detail}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {copy.actions.map((action) => {
          if (action === "Retry" || action === "Try again") {
            return (
              <button key={action} type="button" onClick={onRetry} className="rounded-full bg-red-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-800">
                {action}
              </button>
            );
          }
          if (action === "Book another repair") {
            return (
              <Link key={action} href="/book-repair" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-red-800 shadow-sm">
                {action}
              </Link>
            );
          }
          return (
            <Link key={action} href="/contact" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-red-800 shadow-sm">
              {action}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RepairStageExplainer() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair journey"
            title="What each repair stage means."
            description="Every public stage is written for customers. Internal diagnostics, technician notes and admin metadata stay protected."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stageEducation.map((stage, index) => (
            <AnimatedSection key={stage.title} delay={index * 0.025}>
              <article className="h-full rounded-lg border border-line bg-paper p-5">
                <Icon name={stage.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{stage.explanation}</p>
                <p className="mt-4 rounded-lg bg-white p-3 text-xs font-semibold leading-5 text-muted">{stage.action}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TicketDetailsHelper() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Ticket details"
            title="Where do I find my ticket ID and status token?"
            description="They are shown after booking, can be included in confirmation email when email integration is enabled, and can be requested from repair operations. Keep the token private."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="rounded-lg border border-line bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase text-flame-600">Sample repair ticket</p>
            <div className="mt-5 grid gap-3">
              <SampleRow label="Ticket ID" value="RPR-7H42-K9M2" />
              <SampleRow label="Status token" value="•••• •••• A91F" />
              <SampleRow label="Device" value="Laptop · Dell Latitude" />
              <SampleRow label="Security" value="Customer-safe lookup only" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function SampleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-paper px-4 py-3">
      <span className="text-xs font-semibold uppercase text-muted">{label}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

function RepairRoutesSummary() {
  const routeNotes: Record<string, string> = {
    DROP_OFF: "Updates focus on handover, diagnostics and pickup readiness.",
    MAIL_IN: "Updates include diagnostics, return readiness and dispatch handover.",
    PICKUP_REQUEST: "Updates can include batch intake, school/lab coordination and collection planning."
  };

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair routes"
            title="Tracking adapts to drop-off, mail-in, pickup and bulk support."
            description="The public status page keeps route details broad and customer-safe while giving enough context for handover, return or school-lab planning."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {repairRouteCards.map((route, index) => (
            <AnimatedSection key={route.value} delay={index * 0.04}>
              <article className="h-full rounded-lg border border-line bg-paper p-5">
                <Icon name={route.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-lg font-semibold text-ink">{route.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{route.bestFor}</p>
                <p className="mt-4 rounded-lg bg-white p-3 text-sm leading-6 text-muted">{routeNotes[route.value]}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairStatusCTA() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase text-flame-200">Need another repair?</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">Need another repair or support with a school lab?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Book diagnostics, review pricing guidance or contact repair operations for school, NGO, SME and bulk device support.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.08} className="flex flex-wrap gap-3">
          <ButtonLink href="/book-repair">Book Another Repair</ButtonLink>
          <ButtonLink href="/repair-pricing" variant="secondary">View Pricing Guide</ButtonLink>
          <ButtonLink href="/contact" variant="ghost" className="text-white hover:bg-white/10">Contact Repair Operations</ButtonLink>
        </AnimatedSection>
      </div>
    </section>
  );
}
