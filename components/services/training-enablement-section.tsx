import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { trainingEnablementCards } from "@/lib/services";

export function TrainingEnablementSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f5_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Training and enablement
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Skills and confidence are part of digital access.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Training services help learners, staff and community groups turn device access into
              practical capability for learning, work and everyday digital confidence.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trainingEnablementCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.04}>
              <article className="h-full rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white">
                  <Icon name={card.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{card.title}</h3>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    ["Format", card.format],
                    ["Cohort size", card.cohort],
                    ["Audience", card.audience],
                    ["Delivery mode", card.mode]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-line bg-paper p-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
                      <dd className="mt-1 font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 rounded-2xl bg-ink p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Outcome</p>
                  <p className="mt-2 text-sm font-semibold">{card.outcome}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
