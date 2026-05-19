"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Icon } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { assertFirebaseAuth } from "@/lib/firebase";
import {
  workforceNotifications,
  workforcePermissions,
  workforceRoles,
  workforceTeams
} from "@/lib/workforce-data";
import { cn } from "@/lib/utils";
import type {
  WorkforceActivityLog,
  WorkforceDiagnostic,
  WorkforceInvitePayload,
  WorkforceMetric,
  WorkforceNotification,
  WorkforceRole,
  WorkforceTeam,
  WorkforceUser,
  WorkforceUserStatus
} from "@/types/workforce";

const statusTone: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 ring-green-200",
  INVITED: "bg-blue-50 text-blue-700 ring-blue-200",
  SUSPENDED: "bg-amber-50 text-amber-700 ring-amber-200",
  DISABLED: "bg-red-50 text-red-700 ring-red-200",
  SUCCESS: "bg-green-50 text-green-700 ring-green-200",
  WARNING: "bg-amber-50 text-amber-700 ring-amber-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-green-50 text-green-700 ring-green-200"
};

const userStatuses: WorkforceUserStatus[] = ["ACTIVE", "INVITED", "SUSPENDED", "DISABLED"];
const allRoles = workforceRoles.map((role) => role.id);
const allTeams = workforceTeams.map((team) => team.name);

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function humanise(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();
}

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        statusTone[tone] ?? "bg-slate-50 text-slate-700 ring-slate-200"
      )}
    >
      {children}
    </span>
  );
}

function StatusChip({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/78">
      <span className={cn("h-2 w-2 rounded-full", good ? "bg-green-400" : "bg-flame-400")} />
      {label}: <span className="text-white">{value}</span>
    </span>
  );
}

function WorkforceHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  diagnostics,
  lastSyncedAt
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  diagnostics?: WorkforceDiagnostic[];
  lastSyncedAt?: string | null;
}) {
  const { roles } = useAdminAuth();
  const tokenHealthy = diagnostics?.find((item) => item.label === "Token present")?.status === "Healthy";

  return (
    <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.28),transparent_32%),linear-gradient(135deg,#080808,#171717_58%,#2b1204)] p-6 text-white shadow-2xl shadow-black/10 sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flame-200">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">{subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusChip label="Auth" value={tokenHealthy ? "verified" : "checking"} good={tokenHealthy} />
            <StatusChip label="Admin role" value={roles[0] ?? "unknown"} good={roles.length > 0} />
            <StatusChip label="Environment" value={process.env.NODE_ENV === "production" ? "Production" : "Local"} good />
            <StatusChip label="Last synced" value={lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString("en-GB") : "Pending"} />
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

function ActionButton({
  children,
  onClick,
  href,
  variant = "dark"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "dark" | "light" | "orange";
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition",
    variant === "orange" && "bg-flame-500 text-white shadow-lg shadow-flame-500/20 hover:bg-flame-600",
    variant === "dark" && "bg-ink text-white hover:bg-flame-600",
    variant === "light" && "border border-line bg-white text-ink hover:border-flame-300"
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

function MetricGrid({
  metrics,
  onFilter
}: {
  metrics: WorkforceMetric[];
  onFilter?: (filter: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <button
          type="button"
          key={metric.label}
          onClick={() => metric.filter && onFilter?.(metric.filter)}
          className="group rounded-3xl border border-line bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 transition group-hover:bg-flame-500 group-hover:text-white">
              <Icon name={metric.icon} className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-100">
              Trend ready
            </span>
          </div>
          <p className="mt-5 text-3xl font-semibold tracking-tight">{metric.value}</p>
          <p className="mt-1 text-sm font-semibold">{metric.label}</p>
          <p className="mt-2 text-xs leading-5 text-muted">{metric.detail}</p>
        </button>
      ))}
    </div>
  );
}

function DiagnosticsCard({
  title,
  message,
  diagnostics,
  onRetry,
  onRefreshToken,
  onLogout
}: {
  title: string;
  message: string;
  diagnostics: WorkforceDiagnostic[];
  onRetry?: () => void;
  onRefreshToken?: () => void;
  onLogout?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-900">{title}</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-amber-800">{message}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onRefreshToken ? <ActionButton variant="light" onClick={onRefreshToken}>Refresh token</ActionButton> : null}
          {onRetry ? <ActionButton variant="light" onClick={onRetry}>Retry</ActionButton> : null}
          <ActionButton variant="light" onClick={() => setOpen((value) => !value)}>View diagnostics</ActionButton>
          {onLogout ? <ActionButton variant="dark" onClick={onLogout}>Sign out</ActionButton> : null}
        </div>
      </div>
      {open ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {diagnostics.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 ring-1 ring-amber-100">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</p>
              <p className="mt-2 break-words text-sm font-semibold text-ink">{item.value}</p>
              <Pill tone={item.status === "Healthy" ? "ACTIVE" : item.status === "Error" ? "FAILED" : "WARNING"}>{item.status}</Pill>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function exportCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return `"${String(Array.isArray(value) ? value.join("; ") : value ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    )
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function UserAvatar({ user }: { user: Pick<WorkforceUser, "fullName" | "email" | "avatarUrl"> }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink text-sm font-bold text-white">
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(user.fullName || user.email)
      )}
    </span>
  );
}

function EmptyState({
  title,
  text,
  actions
}: {
  title: string;
  text: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-line bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name="users" className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted">{text}</p>
      {actions ? <div className="mt-5 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </div>
  );
}

function InviteUserModal({
  open,
  saving,
  onClose,
  onInvite
}: {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onInvite: (payload: WorkforceInvitePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<WorkforceInvitePayload>({
    fullName: "",
    email: "",
    role: "supportAgent",
    team: "Operations",
    country: "United Kingdom",
    deploymentRegion: "UK",
    permissionsPreset: "supportAgent"
  });
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof WorkforceInvitePayload, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      return;
    }

    try {
      await onInvite(form);
      onClose();
      setForm({
        fullName: "",
        email: "",
        role: "supportAgent",
        team: "Operations",
        country: "United Kingdom",
        deploymentRegion: "UK",
        permissionsPreset: "supportAgent"
      });
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Unable to invite this user.");
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={submit}
            className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Invite team member</p>
                <h3 className="mt-2 text-2xl font-semibold">Create workforce access</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Creates or links a Firebase Auth user, assigns a custom claim, and stores a workforce profile.
                </p>
              </div>
              <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close invite modal">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Full name
                <input className="rounded-2xl border border-line px-4 py-3 outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input type="email" className="rounded-2xl border border-line px-4 py-3 outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" value={form.email} onChange={(event) => update("email", event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Role
                <select className="rounded-2xl border border-line px-4 py-3 outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" value={form.role} onChange={(event) => update("role", event.target.value)}>
                  {allRoles.map((role) => <option key={role} value={role}>{humanise(role)}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Team
                <select className="rounded-2xl border border-line px-4 py-3 outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" value={form.team} onChange={(event) => update("team", event.target.value)}>
                  {allTeams.map((team) => <option key={team} value={team}>{team}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Country
                <input className="rounded-2xl border border-line px-4 py-3 outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" value={form.country ?? ""} onChange={(event) => update("country", event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Deployment region
                <input className="rounded-2xl border border-line px-4 py-3 outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" value={form.deploymentRegion ?? ""} onChange={(event) => update("deploymentRegion", event.target.value)} />
              </label>
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <ActionButton variant="light" onClick={onClose}>Cancel</ActionButton>
              <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white shadow-lg shadow-flame-500/20 transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Inviting..." : "Invite team member"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function UserDetailDrawer({
  user,
  onClose,
  onUpdate
}: {
  user: WorkforceUser | null;
  onClose: () => void;
  onUpdate: (uid: string, payload: { status?: WorkforceUserStatus; role?: WorkforceRole; team?: string }) => Promise<void>;
}) {
  const [tab, setTab] = useState("overview");
  const [accountBusy, setAccountBusy] = useState<"reset" | "invite" | null>(null);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const tabs = ["overview", "permissions", "teams", "deployments", "activity", "devices", "audit"];

  async function sendAccountEmail(kind: "reset" | "invite") {
    if (!user?.email) return;
    setAccountBusy(kind);
    setAccountMessage(null);
    setAccountError(null);
    try {
      await sendPasswordResetEmail(assertFirebaseAuth(), user.email);
      setAccountMessage(kind === "reset" ? `Password reset email sent to ${user.email}.` : `Invite reminder sent to ${user.email}.`);
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : "Unable to send account email.");
    } finally {
      setAccountBusy(null);
    }
  }

  return (
    <AnimatePresence>
      {user ? (
        <motion.aside
          className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-2xl flex-col overflow-y-auto border-l border-line bg-white shadow-2xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
        >
          <div className="sticky top-0 z-10 border-b border-line bg-white/95 p-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold">{user.fullName}</h3>
                  <p className="truncate text-sm text-muted">{user.email}</p>
                </div>
              </div>
              <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close user detail">
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone={user.status}>{humanise(user.status)}</Pill>
              <Pill>{humanise(user.role)}</Pill>
              <Pill>{user.team}</Pill>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn("shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition", tab === item ? "bg-ink text-white" : "bg-paper text-muted hover:text-ink")}
                  onClick={() => setTab(item)}
                >
                  {humanise(item)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 p-5">
            {tab === "overview" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Phone", user.phone ?? "Not recorded"],
                  ["Country", user.country],
                  ["Status", humanise(user.status)],
                  ["Last login", formatDate(user.lastLoginAt)],
                  ["Created", formatDate(user.createdAt)],
                  ["MFA", user.mfaEnabled ? "Enabled" : "Not confirmed"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-paper p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                    <p className="mt-2 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === "permissions" ? (
              <div className="grid gap-3">
                {workforcePermissions.map((permission) => {
                  const hasPermission = workforceRoles.find((role) => role.id === user.role)?.permissions.includes(permission.id);
                  return (
                    <div key={permission.id} className="flex items-start justify-between gap-4 rounded-2xl border border-line p-4">
                      <div>
                        <p className="font-semibold">{permission.label}</p>
                        <p className="mt-1 text-sm text-muted">{permission.description}</p>
                      </div>
                      <Pill tone={hasPermission ? "ACTIVE" : "DISABLED"}>{hasPermission ? "Allowed" : "Not assigned"}</Pill>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {tab === "teams" ? (
              <div className="rounded-3xl border border-line p-5">
                <p className="text-sm font-semibold">Team assignment</p>
                <p className="mt-2 text-sm text-muted">{user.fullName} is assigned to {user.team}. Team assignment can drive routing, ownership and reporting.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {allTeams.map((team) => (
                    <button key={team} type="button" className={cn("rounded-full px-3 py-2 text-xs font-semibold", user.team === team ? "bg-flame-500 text-white" : "bg-paper text-muted")} onClick={() => void onUpdate(user.uid, { team })}>
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === "deployments" ? (
              <div className="grid gap-3">
                {(user.deploymentRegions.length ? user.deploymentRegions : ["UK", "Liberia", "Ghana", "Sierra Leone", "Nigeria"]).map((region) => (
                  <div key={region} className="rounded-2xl border border-line p-4">
                    <p className="font-semibold">{region}</p>
                    <p className="mt-1 text-sm text-muted">Deployment coverage, school projects and local support assignments can be linked here.</p>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === "activity" || tab === "audit" ? (
              <EmptyState title="Activity-ready profile" text="Login activity, role changes and operational actions will appear here as audit logs are recorded." />
            ) : null}

            {tab === "devices" ? (
              <EmptyState title="No assigned devices" text="Employee laptop, support devices and field deployment kits can be associated with this profile later." />
            ) : null}

            <div className="rounded-3xl bg-ink p-5 text-white">
              <p className="font-semibold">User actions</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink" onClick={() => void onUpdate(user.uid, { role: "supportAgent" })}>Change role</button>
                <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={accountBusy === "reset"} onClick={() => void sendAccountEmail("reset")}>{accountBusy === "reset" ? "Sending..." : "Reset password"}</button>
                <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white" onClick={() => void onUpdate(user.uid, { status: "SUSPENDED" })}>Suspend account</button>
                <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={accountBusy === "invite"} onClick={() => void sendAccountEmail("invite")}>{accountBusy === "invite" ? "Sending..." : "Send invite reminder"}</button>
              </div>
              {accountMessage ? <p className="mt-3 rounded-2xl bg-green-500/15 px-4 py-3 text-sm font-semibold text-green-100">{accountMessage}</p> : null}
              {accountError ? <p className="mt-3 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100">{accountError}</p> : null}
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function UsersTable({
  users,
  selected,
  onToggleSelected,
  onOpen
}: {
  users: WorkforceUser[];
  selected: string[];
  onToggleSelected: (uid: string) => void;
  onOpen: (user: WorkforceUser) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-paper text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Team</th>
              <th className="px-5 py-4">Country</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Last login</th>
              <th className="px-5 py-4">MFA</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => (
              <tr key={user.uid} className="transition hover:bg-flame-50/35">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.includes(user.uid)} onChange={() => onToggleSelected(user.uid)} className="h-4 w-4 rounded border-line text-flame-500" />
                    <UserAvatar user={user} />
                    <div>
                      <button type="button" onClick={() => onOpen(user)} className="font-semibold hover:text-flame-600">{user.fullName}</button>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><Pill>{humanise(user.role)}</Pill></td>
                <td className="px-5 py-4">{user.team}</td>
                <td className="px-5 py-4">{user.country}</td>
                <td className="px-5 py-4"><Pill tone={user.status}>{humanise(user.status)}</Pill></td>
                <td className="px-5 py-4 text-muted">{formatDate(user.lastLoginAt)}</td>
                <td className="px-5 py-4">{user.mfaEnabled ? "Enabled" : "Not confirmed"}</td>
                <td className="px-5 py-4">
                  <button type="button" className="rounded-full border border-line px-3 py-2 text-xs font-semibold hover:border-flame-300" onClick={() => onOpen(user)}>Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 lg:hidden">
        {users.map((user) => (
          <button key={user.uid} type="button" className="rounded-3xl border border-line p-4 text-left" onClick={() => onOpen(user)}>
            <div className="flex items-start gap-3">
              <UserAvatar user={user} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{user.fullName}</p>
                <p className="truncate text-sm text-muted">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill tone={user.status}>{humanise(user.status)}</Pill>
                  <Pill>{humanise(user.role)}</Pill>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const { users, loading, saving, error, diagnostics, lastSyncedAt, retry, inviteUser, updateUser, refreshToken, logout } = useAdminUsers();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [team, setTeam] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerUser, setDrawerUser] = useState<WorkforceUser | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !lowerQuery ||
        [user.fullName, user.email, user.team, user.country, user.role].some((value) =>
          String(value).toLowerCase().includes(lowerQuery)
        );
      const matchesRole = role === "all" || user.role === role || user.roles.includes(role as WorkforceRole);
      const matchesTeam = team === "all" || user.team === team;
      const matchesStatus = status === "all" || user.status === status;
      return matchesQuery && matchesRole && matchesTeam && matchesStatus;
    });
  }, [query, role, status, team, users]);

  const metrics: WorkforceMetric[] = [
    { label: "Total users", value: users.length, detail: "Firebase Auth users visible to the admin API.", icon: "users", filter: "all" },
    { label: "Active admins", value: users.filter((user) => user.status === "ACTIVE").length, detail: "Accounts currently enabled for admin work.", icon: "shield", filter: "ACTIVE" },
    { label: "Operations staff", value: users.filter((user) => user.team === "Operations").length, detail: "Team members assigned to operations workflows.", icon: "settings", filter: "Operations" },
    { label: "Deployment coordinators", value: users.filter((user) => user.role === "deploymentCoordinator" || user.role === "countryManager").length, detail: "Country and deployment-ready staff.", icon: "globe", filter: "deploymentCoordinator" },
    { label: "Pending invitations", value: users.filter((user) => user.status === "INVITED").length, detail: "Accounts waiting for first sign-in or onboarding.", icon: "mail", filter: "INVITED" },
    { label: "Suspended accounts", value: users.filter((user) => user.status === "SUSPENDED" || user.status === "DISABLED").length, detail: "Accounts requiring security or HR review.", icon: "shield", filter: "SUSPENDED" },
    { label: "Online now", value: "Live soon", detail: "Presence can be wired to Firebase Realtime Database later.", icon: "badge" },
    { label: "Recent logins", value: users.filter((user) => user.lastLoginAt).length, detail: "Accounts with recorded Firebase login activity.", icon: "chart" }
  ];

  const applyMetricFilter = (filter: string) => {
    if (filter === "all") {
      setRole("all");
      setTeam("all");
      setStatus("all");
      return;
    }
    if (userStatuses.includes(filter as WorkforceUserStatus)) setStatus(filter);
    if (allTeams.includes(filter)) setTeam(filter);
    if (allRoles.includes(filter as WorkforceRole)) setRole(filter);
  };

  const toggleSelected = (uid: string) => {
    setSelected((current) => current.includes(uid) ? current.filter((id) => id !== uid) : [...current, uid]);
  };

  const rowsForExport = filteredUsers.map((user) => ({
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    team: user.team,
    country: user.country,
    status: user.status,
    lastLoginAt: user.lastLoginAt ?? "",
    mfaEnabled: user.mfaEnabled ? "yes" : "no"
  }));

  return (
    <div className="space-y-6">
      <WorkforceHeader
        eyebrow="Users · employees · access"
        title="Users & Workforce Management"
        subtitle="Manage admin users, operational teams, deployment staff and role-based access for SIT Digital Access."
        diagnostics={diagnostics}
        lastSyncedAt={lastSyncedAt}
        actions={
          <>
            <ActionButton variant="light" onClick={() => exportCsv("sit-admin-users.csv", rowsForExport)}><Icon name="arrow" className="h-4 w-4" /> Export CSV</ActionButton>
            <ActionButton variant="orange" onClick={() => setInviteOpen(true)}><Icon name="users" className="h-4 w-4" /> Invite team member</ActionButton>
            <ActionButton variant="light" onClick={() => void retry()}><Icon name="cloud" className="h-4 w-4" /> Refresh</ActionButton>
          </>
        }
      />

      {error ? (
        <DiagnosticsCard
          title={error.title}
          message={error.message}
          diagnostics={diagnostics}
          onRetry={() => void retry()}
          onRefreshToken={() => void refreshToken()}
          onLogout={() => void logout()}
        />
      ) : null}

      <MetricGrid metrics={metrics} onFilter={applyMetricFilter} />

      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold">Workforce filters</p>
            <p className="mt-1 text-sm text-muted">Search by user, role, team, country and account status.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All users", "Super admins", "Operations team", "Deployment staff", "Support agents", "Recently active", "Suspended accounts"].map((view) => (
              <button key={view} className="rounded-full bg-paper px-3 py-2 text-xs font-semibold text-muted transition hover:bg-flame-50 hover:text-flame-700" onClick={() => {
                if (view === "All users") { setRole("all"); setTeam("all"); setStatus("all"); }
                if (view === "Super admins") setRole("superAdmin");
                if (view === "Operations team") setTeam("Operations");
                if (view === "Deployment staff") setRole("deploymentCoordinator");
                if (view === "Support agents") setRole("supportAgent");
                if (view === "Suspended accounts") setStatus("SUSPENDED");
              }}>{view}</button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="sr-only">Search users</span>
            <input className="min-h-11 w-full rounded-2xl border border-line px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" placeholder="Search users, email, country..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="min-h-11 rounded-2xl border border-line px-4 text-sm outline-none" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="all">All roles</option>
            {allRoles.map((roleOption) => <option key={roleOption} value={roleOption}>{humanise(roleOption)}</option>)}
          </select>
          <select className="min-h-11 rounded-2xl border border-line px-4 text-sm outline-none" value={team} onChange={(event) => setTeam(event.target.value)}>
            <option value="all">All teams</option>
            {allTeams.map((teamOption) => <option key={teamOption} value={teamOption}>{teamOption}</option>)}
          </select>
          <select className="min-h-11 rounded-2xl border border-line px-4 text-sm outline-none" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            {userStatuses.map((statusOption) => <option key={statusOption} value={statusOption}>{humanise(statusOption)}</option>)}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{filteredUsers.length} visible</span>
          {selected.length ? <Pill>{selected.length} selected</Pill> : null}
          <button className="font-semibold text-flame-700" onClick={() => { setQuery(""); setRole("all"); setTeam("all"); setStatus("all"); }}>Clear filters</button>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-3xl bg-white" />)}
        </div>
      ) : filteredUsers.length ? (
        <UsersTable users={filteredUsers} selected={selected} onToggleSelected={toggleSelected} onOpen={setDrawerUser} />
      ) : (
        <EmptyState
          title="No users found"
          text="Admin users and employees will appear here when Firebase Auth users exist or when you invite a new team member."
          actions={
            <>
              <ActionButton variant="orange" onClick={() => setInviteOpen(true)}>Invite first user</ActionButton>
              <ActionButton variant="light" href="/admin/settings">View Firebase setup</ActionButton>
            </>
          }
        />
      )}

      <InviteUserModal open={inviteOpen} saving={saving} onClose={() => setInviteOpen(false)} onInvite={inviteUser} />
      <UserDetailDrawer user={drawerUser} onClose={() => setDrawerUser(null)} onUpdate={updateUser} />
    </div>
  );
}

function TeamCard({ team }: { team: WorkforceTeam }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
          <Icon name={team.icon} className="h-5 w-5" />
        </span>
        <Pill>{team.workload}% workload</Pill>
      </div>
      <h3 className="mt-5 text-xl font-semibold">{team.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{team.description}</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-paper p-3"><p className="text-lg font-semibold">{team.members}</p><p className="text-xs text-muted">Members</p></div>
        <div className="rounded-2xl bg-paper p-3"><p className="text-lg font-semibold">{team.activeProjects}</p><p className="text-xs text-muted">Projects</p></div>
        <div className="rounded-2xl bg-paper p-3"><p className="text-lg font-semibold">{team.countriesCovered.length}</p><p className="text-xs text-muted">Regions</p></div>
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Lead</p>
        <p className="mt-1 text-sm font-semibold">{team.lead}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {team.kpis.map((kpi) => <Pill key={kpi}>{kpi}</Pill>)}
      </div>
    </motion.article>
  );
}

export function AdminTeamsPage() {
  const { users, diagnostics, lastSyncedAt } = useAdminUsers();
  const teamRows = workforceTeams.map((team) => ({
    name: team.name,
    lead: team.lead,
    members: users.filter((user) => user.team === team.name).length || team.members,
    activeProjects: team.activeProjects,
    workload: team.workload,
    countriesCovered: team.countriesCovered.join("; "),
    kpis: team.kpis.join("; ")
  }));
  const metrics: WorkforceMetric[] = [
    { label: "Teams", value: workforceTeams.length, detail: "Operational groups configured for SIT Digital Access.", icon: "users" },
    { label: "Team members", value: users.length || workforceTeams.reduce((sum, team) => sum + team.members, 0), detail: "Live Firebase users when available, otherwise planning baseline.", icon: "badge" },
    { label: "Active projects", value: workforceTeams.reduce((sum, team) => sum + team.activeProjects, 0), detail: "Planning workload across teams.", icon: "chart" },
    { label: "Countries covered", value: new Set(workforceTeams.flatMap((team) => team.countriesCovered)).size, detail: "UK and Africa deployment coverage.", icon: "globe" }
  ];

  return (
    <div className="space-y-6">
      <WorkforceHeader
        eyebrow="Teams · org chart · workload"
        title="Teams"
        subtitle="Coordinate operations, inventory, donations, Africa deployment, support, analytics, partnerships and training teams."
        diagnostics={diagnostics}
        lastSyncedAt={lastSyncedAt}
        actions={<ActionButton variant="orange" onClick={() => exportCsv("sit-workforce-teams.csv", teamRows)}>Export teams</ActionButton>}
      />
      <MetricGrid metrics={metrics} />
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {workforceTeams.map((team) => <TeamCard key={team.id} team={team} />)}
      </div>
      <section className="rounded-[2rem] bg-ink p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Org chart</p>
        <h3 className="mt-2 text-2xl font-semibold">Deployment-ready hierarchy</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Leadership", "Operations leads", "Country coordinators"].map((level, index) => (
            <div key={level} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm font-semibold">{level}</p>
              <p className="mt-2 text-sm leading-6 text-white/60">{index === 0 ? "Super admins and platform administrators." : index === 1 ? "Inventory, donations, support and analytics leads." : "Liberia, Ghana, Sierra Leone, Nigeria and wider Africa coverage."}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminRolesPage() {
  const { diagnostics, lastSyncedAt } = useAdminUsers();
  const [selectedRole, setSelectedRole] = useState<WorkforceRole>("superAdmin");
  const activeRole = workforceRoles.find((role) => role.id === selectedRole) ?? workforceRoles[0];

  return (
    <div className="space-y-6">
      <WorkforceHeader
        eyebrow="Roles · permissions · claims"
        title="Roles & Permissions"
        subtitle="Review role hierarchy, Firebase custom claim mapping, access scopes and permission risk levels."
        diagnostics={diagnostics}
        lastSyncedAt={lastSyncedAt}
        actions={<ActionButton variant="light" href="/admin/settings">Open setup guide</ActionButton>}
      />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="grid gap-3">
          {workforceRoles.map((role) => (
            <button key={role.id} className={cn("rounded-3xl border p-4 text-left transition", selectedRole === role.id ? "border-flame-300 bg-flame-50 shadow-sm" : "border-line bg-white hover:border-flame-200")} onClick={() => setSelectedRole(role.id)}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{role.label}</p>
                <Pill tone={role.riskLevel === "Critical" ? "High" : role.riskLevel}>{role.riskLevel}</Pill>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{role.description}</p>
            </button>
          ))}
        </div>
        <section className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Firebase claim</p>
          <h3 className="mt-2 text-2xl font-semibold">{activeRole.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{activeRole.description}</p>
          <div className="mt-5 rounded-2xl bg-ink p-4 font-mono text-sm text-white">
            customClaims.{activeRole.claim} = true
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-paper text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                <tr><th className="px-4 py-3">Permission</th><th className="px-4 py-3">Access</th><th className="px-4 py-3">Pages</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {workforcePermissions.map((permission) => {
                  const allowed = activeRole.permissions.includes(permission.id);
                  return (
                    <tr key={permission.id}>
                      <td className="px-4 py-3 font-semibold">{permission.label}</td>
                      <td className="px-4 py-3"><Pill tone={allowed ? "ACTIVE" : "DISABLED"}>{allowed ? "Allowed" : "Blocked"}</Pill></td>
                      <td className="px-4 py-3 text-muted">{permission.pages.join(", ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-2xl bg-paper p-4">
            <p className="text-sm font-semibold">How to assign claims</p>
            <code className="mt-2 block overflow-x-auto rounded-xl bg-white p-3 text-xs text-ink ring-1 ring-line">
              npm --prefix api run set-admin -- --email admin@example.com --role {activeRole.id}
            </code>
          </div>
        </section>
      </div>
    </div>
  );
}

function activityRowsFromUsers(users: WorkforceUser[]): WorkforceActivityLog[] {
  return users.slice(0, 8).map((user, index) => ({
    id: `activity-${user.uid}`,
    actor: user.fullName,
    action: index % 2 === 0 ? "ADMIN_SESSION_ACTIVE" : "WORKFORCE_PROFILE_VIEWED",
    resource: user.email,
    resourceType: "users",
    timestamp: user.lastLoginAt ?? user.updatedAt ?? user.createdAt ?? new Date().toISOString(),
    status: "SUCCESS",
    ipAddress: "Pending"
  }));
}

export function AdminActivityLogsPage() {
  const { users, error, diagnostics, lastSyncedAt, retry } = useAdminUsers();
  const [query, setQuery] = useState("");
  const logs = activityRowsFromUsers(users);
  const filtered = logs.filter((log) => !query || [log.actor, log.action, log.resource, log.resourceType].some((value) => value.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-6">
      <WorkforceHeader
        eyebrow="Audit · activity · security"
        title="Activity Logs"
        subtitle="Track login activity, role changes, inventory updates, donation actions, deployment changes and settings events."
        diagnostics={diagnostics}
        lastSyncedAt={lastSyncedAt}
        actions={<><ActionButton variant="light" onClick={() => void retry()}>Refresh</ActionButton><ActionButton variant="orange" onClick={() => exportCsv("sit-activity-logs.csv", filtered)}>Export logs</ActionButton></>}
      />
      {error ? <DiagnosticsCard title="Activity data is degraded" message={error.message} diagnostics={diagnostics} onRetry={() => void retry()} /> : null}
      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
        <input className="min-h-11 w-full rounded-2xl border border-line px-4 text-sm outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100" placeholder="Filter by actor, action, resource or type..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </section>
      {filtered.length ? (
        <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-paper text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              <tr><th className="px-5 py-4">Actor</th><th className="px-5 py-4">Action</th><th className="px-5 py-4">Resource</th><th className="px-5 py-4">Timestamp</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">IP</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td className="px-5 py-4 font-semibold">{log.actor}</td>
                  <td className="px-5 py-4">{humanise(log.action)}</td>
                  <td className="px-5 py-4 text-muted">{log.resource}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(log.timestamp)}</td>
                  <td className="px-5 py-4"><Pill tone={log.status}>{log.status}</Pill></td>
                  <td className="px-5 py-4 text-muted">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No activity logs yet" text="Admin audit logs will appear here when role changes, inventory updates and settings actions are recorded." />
      )}
    </div>
  );
}

export function AdminNotificationsPage() {
  const { diagnostics, lastSyncedAt } = useAdminUsers();
  const [filter, setFilter] = useState("all");
  const visible = workforceNotifications.filter((item) => filter === "all" || (filter === "unread" ? !item.read : item.category === filter));
  const metrics: WorkforceMetric[] = [
    { label: "Unread", value: workforceNotifications.filter((item) => !item.read).length, detail: "Notifications needing attention.", icon: "badge" },
    { label: "High priority", value: workforceNotifications.filter((item) => item.priority === "High").length, detail: "Operational alerts and setup warnings.", icon: "shield" },
    { label: "Deployment alerts", value: workforceNotifications.filter((item) => item.category === "Deployment").length, detail: "Africa deployment and readiness signals.", icon: "globe" },
    { label: "System notices", value: workforceNotifications.filter((item) => item.category === "System").length, detail: "API, Firestore and platform health notices.", icon: "settings" }
  ];

  return (
    <div className="space-y-6">
      <WorkforceHeader
        eyebrow="Notifications · alerts · routing"
        title="Notifications Centre"
        subtitle="Review new enquiries, device requests, donation offers, deployment alerts, low inventory and platform health notices."
        diagnostics={diagnostics}
        lastSyncedAt={lastSyncedAt}
        actions={<ActionButton variant="orange" href="/admin/settings">Notification settings</ActionButton>}
      />
      <MetricGrid metrics={metrics} />
      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {["all", "unread", "Deployment", "Inventory", "Donation", "System", "Security"].map((item) => (
            <button key={item} className={cn("rounded-full px-3 py-2 text-xs font-semibold", filter === item ? "bg-ink text-white" : "bg-paper text-muted")} onClick={() => setFilter(item)}>{humanise(item)}</button>
          ))}
        </div>
      </section>
      <div className="grid gap-4">
        {visible.map((notification: WorkforceNotification) => (
          <Link key={notification.id} href={notification.actionHref ?? "/admin/dashboard"} className="rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2"><Pill>{notification.category}</Pill><Pill tone={notification.priority}>{notification.priority}</Pill>{!notification.read ? <Pill tone="ACTIVE">Unread</Pill> : null}</div>
                <h3 className="mt-3 text-lg font-semibold">{notification.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{notification.message}</p>
              </div>
              <p className="text-xs font-semibold text-muted">{formatDate(notification.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function AdminDeploymentsPage() {
  const { users, diagnostics, lastSyncedAt } = useAdminUsers();
  const deploymentStaff = users.filter((user) => ["deploymentCoordinator", "countryManager", "operationsManager"].includes(user.role));
  const metrics: WorkforceMetric[] = [
    { label: "Deployment staff", value: deploymentStaff.length || 6, detail: "Country managers, coordinators and operations leads.", icon: "users" },
    { label: "Countries covered", value: 5, detail: "Liberia, Ghana, Sierra Leone, Nigeria and wider Africa.", icon: "globe" },
    { label: "Open assignments", value: 9, detail: "Planning baseline for deployment projects.", icon: "truck" },
    { label: "Availability", value: "78%", detail: "Indicative team capacity for new deployments.", icon: "chart" }
  ];

  return (
    <div className="space-y-6">
      <WorkforceHeader
        eyebrow="Deployments · staffing · regions"
        title="Deployment Workforce"
        subtitle="Track assigned deployments, countries, active projects, workload, availability, languages and technical skills."
        diagnostics={diagnostics}
        lastSyncedAt={lastSyncedAt}
        actions={<ActionButton variant="orange" href="/admin/enquiries">Review deployment enquiries</ActionButton>}
      />
      <MetricGrid metrics={metrics} />
      <div className="grid gap-5 lg:grid-cols-3">
        {["Liberia", "Ghana", "Sierra Leone", "Nigeria", "Wider Africa", "UK coordination"].map((country) => (
          <article key={country} className="rounded-[2rem] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600"><Icon name="map" className="h-5 w-5" /></span>
              <Pill>Staffing ready</Pill>
            </div>
            <h3 className="mt-5 text-xl font-semibold">{country}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">Deployment coordinator, local partner follow-up, logistics readiness and support escalation can be assigned here.</p>
            <div className="mt-4 grid gap-2">
              {["Power-aware planning", "Offline-first support", "Local technician model"].map((item) => <div key={item} className="rounded-2xl bg-paper px-3 py-2 text-sm font-semibold">{item}</div>)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
