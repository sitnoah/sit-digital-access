import { Icon } from "@/components/icons";
import { africaPartnerCards, africaPartnershipWorkflow } from "@/lib/data";

export function PartnershipSection() {
  return (
    <section id="partners" className="relative overflow-hidden bg-[#0A0A0A] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(249,115,22,0.2),transparent_28%),linear-gradient(135deg,#111111_0%,#090909_62%,#281102_100%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-300">
              Partnership readiness
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Built for NGOs, ministries, donors and education partners.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/66">
              SIT Digital Access can support partners that need practical governance,
              deployment planning, reporting and accountable technology reuse.
            </p>
            <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.05] p-5">
              <p className="text-sm font-semibold text-white">Partnership workflow</p>
              <div className="mt-5 grid gap-3">
                {africaPartnershipWorkflow.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-white/72">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {africaPartnerCards.map((card) => (
              <article key={card.title} className="rounded-lg border border-white/10 bg-white/[0.055] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-flame-400/45">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{card.description}</p>
                <p className="mt-4 text-sm font-semibold text-flame-200">{card.insight}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
