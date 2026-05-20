"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { Icon } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "chart" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "mail" },
  { label: "Device Requests", href: "/admin/device-requests", icon: "laptop" },
  { label: "Donations", href: "/admin/donations", icon: "heart" },
  { label: "Inventory", href: "/admin/inventory", icon: "database" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  { label: "Deployments", href: "/admin/deployments", icon: "truck", badge: "New" },
  { label: "Repairs", href: "/admin/repairs", icon: "wrench", badge: "Ops" },
  { label: "Repair Queue", href: "/admin/repair-queue", icon: "list" },
  { label: "Repair Parts", href: "/admin/repair-parts", icon: "hardDrive" },
  { label: "Technicians", href: "/admin/repair-technicians", icon: "users", section: "Ops", badge: "Ops" },
  { label: "Recycling", href: "/admin/recycling", icon: "recycle" },
  { label: "Support", href: "/admin/support", icon: "headset" },
  { label: "Impact", href: "/admin/impact", icon: "leaf" },
  { label: "Sustainability Reports", href: "/admin/sustainability-reports", icon: "leaf" },
  { label: "Success Stories", href: "/admin/success-stories", icon: "sparkles" },
  { label: "Training Cohorts", href: "/admin/training-cohorts", icon: "graduation" },
  { label: "Users & Employees", href: "/admin/users", icon: "users", badge: "Team" },
  { label: "Teams", href: "/admin/teams", icon: "handshake" },
  { label: "Roles & Permissions", href: "/admin/roles", icon: "shield" },
  { label: "Activity Logs", href: "/admin/activity-logs", icon: "list" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: "shield" },
  { label: "Notifications", href: "/admin/notifications", icon: "bell", badge: "4" },
  { label: "Settings", href: "/admin/settings", icon: "settings" }
] as const;

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Operational Command Centre",
  "/admin/enquiries": "Enquiries",
  "/admin/device-requests": "Device Requests",
  "/admin/deployments": "Deployments",
  "/admin/donations": "Donations",
  "/admin/inventory": "Inventory",
  "/admin/analytics": "Analytics",
  "/admin/recycling": "Recycling Operations",
  "/admin/support": "Support Operations",
  "/admin/audit-logs": "Audit Logs",
  "/admin/impact": "Impact",
  "/admin/repairs": "Repairs",
  "/admin/repair-queue": "Repair Queue",
  "/admin/repair-parts": "Repair Parts",
  "/admin/repair-technicians": "Repair Technicians",
  "/admin/sustainability-reports": "Sustainability Reports",
  "/admin/success-stories": "Success Stories",
  "/admin/training-cohorts": "Training Cohorts",
  "/admin/search": "Search",
  "/admin/users": "Users & Workforce Management",
  "/admin/teams": "Teams",
  "/admin/roles": "Roles & Permissions",
  "/admin/activity-logs": "Activity Logs",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings"
};

function AdminSidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggleCollapse
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const { user, roles } = useAdminAuth();
  const primaryRole = roles[0] ?? "admin";
  const environment = process.env.NODE_ENV === "production" ? "Production" : "Local";

  const sidebar = (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden border-r border-white/10 bg-[#090909] p-4 text-white shadow-2xl shadow-black/25",
        collapsed ? "lg:w-[96px]" : "lg:w-[292px]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex min-w-0 items-center rounded-2xl transition hover:bg-white/5",
            collapsed ? "justify-center p-2" : "gap-3 px-2 py-3"
          )}
          onClick={onClose}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-flame-500 text-sm font-bold shadow-lg shadow-flame-500/20">
            SIT
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Digital Access Admin</span>
              <span className="block truncate text-xs text-white/55">Technology operations</span>
            </span>
          ) : null}
        </Link>
        <button
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name="chevron" className={cn("h-4 w-4 transition", collapsed ? "-rotate-90" : "rotate-90")} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
          aria-label="Close admin navigation"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      {!collapsed ? (
        <Link
          href="/admin/settings"
          className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left transition hover:bg-white/[0.1]"
          onClick={onClose}
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Workspace</span>
            <span className="mt-1 block text-sm font-semibold text-white">SIT Digital Access</span>
          </span>
          <Icon name="chevron" className="h-4 w-4 text-white/55" />
        </Link>
      ) : null}

      <div className={cn("mt-5 rounded-2xl border border-white/10 bg-white/[0.06]", collapsed ? "p-2" : "p-4")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-3")}>
          <span className="rounded-full bg-flame-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-flame-200">
            {collapsed ? environment[0] : environment}
          </span>
          {!collapsed ? <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" /> : null}
        </div>
        {!collapsed ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Secure role</p>
            <p className="mt-2 text-sm font-semibold text-white">{primaryRole}</p>
            <p className="mt-1 truncate text-xs text-white/45">{user?.email}</p>
          </div>
        ) : null}
      </div>

      <nav aria-label="Admin navigation" className="mt-4 grid min-h-0 flex-1 gap-1 overflow-y-auto overflow-x-hidden pr-1">
        {adminNav.map((item) => {
          const active = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-2xl text-sm font-semibold transition",
                collapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3",
                active
                  ? "bg-white text-ink shadow-lg shadow-flame-500/10 ring-1 ring-flame-300/40"
                  : "text-white/68 hover:bg-white/10 hover:text-white"
              )}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
            >
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", active ? "bg-flame-500 text-white" : "bg-white/5 text-flame-300 group-hover:bg-flame-500/15")}>
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              {!collapsed ? (
                <>
                  <span className="min-w-0 flex-1">{item.label}</span>
                  {"badge" in item && item.badge ? (
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", active ? "bg-flame-100 text-flame-700" : "bg-flame-500/15 text-flame-200")}>
                      {item.badge}
                    </span>
                  ) : null}
                </>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="mt-4 shrink-0 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.22),transparent_35%),rgba(255,255,255,0.06)] p-4">
          <p className="text-sm font-semibold">Deployment-ready admin</p>
          <p className="mt-2 text-xs leading-5 text-white/55">
            Manage requests, inventory, donations and Africa deployment workflows from one command centre.
          </p>
        </div>
      ) : null}
    </aside>
  );

  return (
    <>
      <div className={cn("fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        {sidebar}
      </div>
      {mobileOpen ? <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} /> : null}
    </>
  );
}

function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roles, logout } = useAdminAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pageTitle = useMemo(() => pageTitles[pathname] ?? "SIT Digital Access", [pathname]);
  const primaryRole = roles[0] ?? "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm lg:hidden"
            onClick={onMenuClick}
            aria-label="Open admin navigation"
          >
            <Icon name="menu" className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Admin</p>
            <h1 className="truncate text-xl font-semibold tracking-tight">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <form
            className="relative min-w-0 md:w-80"
            onSubmit={(event) => {
              event.preventDefault();
              const query = searchQuery.trim();
              if (query) router.push(`/admin/search?q=${encodeURIComponent(query)}`);
            }}
          >
            <span className="sr-only">Search admin records</span>
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="min-h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              placeholder="Search enquiries, devices, donors..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>
          <Link
            href="/admin/inventory"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white shadow-lg shadow-flame-500/20 transition hover:bg-flame-600"
          >
            <Icon name="package" className="h-4 w-4" />
            Quick action
          </Link>
          <Link
            href="/admin/notifications"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-flame-300 md:flex"
            aria-label="Notifications"
          >
            <span className="relative">
              <Icon name="badge" className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-flame-500" />
            </span>
          </Link>
          <div className="relative">
            <button
              className="flex min-h-11 w-full items-center gap-3 rounded-full border border-line bg-white px-3 py-2 text-left text-sm font-semibold text-ink shadow-sm transition hover:border-flame-300 md:w-auto"
              onClick={() => setProfileOpen((value) => !value)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                {(user?.email?.[0] ?? "A").toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 md:max-w-44">
                <span className="block truncate">{user?.email}</span>
                <span className="block text-xs font-semibold text-flame-600">{primaryRole}</span>
              </span>
              <Icon name="chevron" className={cn("h-4 w-4 transition", profileOpen && "rotate-180")} />
            </button>
            {profileOpen ? (
              <div className="absolute right-0 mt-3 w-full min-w-72 rounded-2xl border border-line bg-white p-3 shadow-2xl md:w-80">
                <div className="rounded-xl bg-paper p-3">
                  <p className="truncate text-sm font-semibold">{user?.email}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {roles.map((role) => (
                      <span key={role} className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-flame-700 ring-1 ring-line">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="mt-3 flex min-h-10 w-full items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600"
                  onClick={() => void logout()}
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminConsole({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="min-h-screen bg-[#F4F5F4] text-ink">
      <div className={cn("grid min-h-screen transition-[grid-template-columns] duration-300 lg:grid", collapsed ? "lg:grid-cols-[96px_1fr]" : "lg:grid-cols-[292px_1fr]")}>
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onToggleCollapse={() => setCollapsed((value) => !value)}
        />
        <section className="min-w-0">
          <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
          <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <AdminConsole>{children}</AdminConsole>
    </AdminAuthGuard>
  );
}
