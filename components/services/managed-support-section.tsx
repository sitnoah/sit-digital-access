import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";

const supportFeatures = [
  "Remote support",
  "Device issue handling",
  "Account support",
  "Asset tracking",
  "Deployment maintenance",
  "Support workflows"
];

export function ManagedSupportSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <AnimatedSection>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Managed support
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Ongoing support for schools, teams and deployments.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Support can be scoped around real users and device environments, from remote issue
              handling to asset records, account readiness and deployment maintenance routes.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {supportFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-white">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-ink">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="overflow-hidden rounded-3xl border border-line bg-ink p-5 text-white shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-300">
                  Support dashboard
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Deployment health</h3>
              </div>
              <span className="rounded-full bg-flame-500 px-3 py-1 text-xs font-semibold">Operational</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Devices", "96%", "Ready"],
                ["Accounts", "82%", "In progress"],
                ["Tickets", "12", "Open"]
              ].map(([label, value, status]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-flame-300">{value}</p>
                  <p className="mt-1 text-sm text-white/60">{status}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm font-semibold">Ticket flow</p>
              <div className="mt-4 grid gap-3">
                {[
                  ["New", "Lab device login issue"],
                  ["Reviewed", "Microsoft 365 account setup"],
                  ["Matched", "Endpoint update guidance"],
                  ["Resolved", "Asset record corrected"]
                ].map(([status, title]) => (
                  <div key={title} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.06] px-4 py-3">
                    <span className="text-sm font-semibold text-white/82">{title}</span>
                    <span className="rounded-full bg-flame-500/14 px-3 py-1 text-xs font-semibold text-flame-200">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
