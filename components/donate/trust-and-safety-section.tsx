import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { donationTrustCards } from "@/lib/donation-options";

export function TrustAndSafetySection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Trust and safety
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Secure, responsible and deployment-ready.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Built to reassure corporate donors, sponsors and partner organisations that devices
              are handled with care, prepared properly and deployed with practical support thinking.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {donationTrustCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="group h-full rounded-2xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-50 text-flame-600 transition group-hover:bg-flame-500 group-hover:text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
