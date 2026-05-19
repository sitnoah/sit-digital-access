import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { africaDeploymentServiceCards } from "@/lib/services";

const indicators = ["Power-aware", "Offline capable", "Community deployable", "Support scalable"];

export function AfricaDeploymentServices() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
                Africa deployment services
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Services designed for real deployment environments.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/68">
                Deployment services can account for power, connectivity, shared usage, local support,
                logistics and documentation before devices reach schools or community partners.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {indicators.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/78">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {africaDeploymentServiceCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.03}>
              <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-flame-300/50 hover:bg-white/[0.08]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{card.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
