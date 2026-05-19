import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { africaReadinessCards, africaReadinessIndicators } from "@/lib/programmes";

export function AfricaDeploymentReadiness() {
  return (
    <section className="bg-[#0a0a0a] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
                Africa deployment readiness
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for practical deployment across Africa.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/68">
                Programmes can be shaped around offline learning, low-power device strategies,
                local technician enablement, shared lab usage and logistics planning.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {africaReadinessIndicators.map((item) => (
                <span key={item} className="rounded-full border border-flame-300/25 bg-flame-500/12 px-3 py-1 text-xs font-semibold text-flame-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {africaReadinessCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.03}>
              <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-flame-400/45">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{card.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
