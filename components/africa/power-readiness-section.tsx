import { Icon } from "@/components/icons";
import { africaPowerReadinessCards } from "@/lib/data";

export function PowerReadinessSection() {
  return (
    <section id="power-connectivity" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
              Power and connectivity
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Designed for real infrastructure conditions.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Deployment plans should work in the real classroom, not only in the proposal.
              SIT Digital Access plans around power availability, bandwidth, shared access
              and local maintenance capacity.
            </p>
            <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-ink">Low-power device strategy</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Mini PCs, efficient laptops, offline content servers and device rotation models
                can lower energy demand while keeping learning available to more students.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {africaPowerReadinessCards.map((card) => (
              <article key={card.title} className="rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-flame-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
                <p className="mt-4 rounded-lg bg-flame-50 px-3 py-2 text-sm font-semibold leading-6 text-flame-700">
                  {card.insight}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
