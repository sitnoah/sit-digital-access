import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { schoolInventoryGroups } from "@/lib/school-solutions";

export function SchoolInventoryDashboard() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <AnimatedSection>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Inventory dashboard concept
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Know what you have, where it is and when it needs attention.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              This dashboard can connect to Firebase or a NestJS API for inventory, support tickets,
              school locations and refresh planning.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Device register", "Support history", "Lab visibility", "Refresh planning"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-white">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="rounded-3xl border border-line bg-ink p-5 text-white shadow-soft">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Total devices", "120", "Inventory"],
                ["Assigned", "96", "In use"],
                ["Open issues", "04", "Support"],
                ["Lab uptime", "98%", "This month"],
                ["Spare pool", "08", "Available"],
                ["Due refresh", "12", "Next term"],
                ["Warranty/support", "84%", "Covered"],
                ["Software", "92%", "Ready"]
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{label}</p>
                  <p className="mt-3 text-2xl font-semibold text-flame-300">{value}</p>
                  <p className="mt-1 text-sm text-white/55">{note}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl bg-white">
              {schoolInventoryGroups.map((row) => (
                <div key={row.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-line px-4 py-4 text-sm last:border-b-0">
                  <span className="font-semibold text-ink">{row.name}</span>
                  <span className="text-muted">{row.assets}</span>
                  <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
