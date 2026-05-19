import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { programmeAudienceCards } from "@/lib/programmes";

export function ProgrammeAudienceGrid() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Built for
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Who these programmes are built for.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Each pathway can be tailored around the type of organisation, learner group,
              deployment setting and sponsorship model.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programmeAudienceCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.03}>
              <article className="rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-50 text-flame-600">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
