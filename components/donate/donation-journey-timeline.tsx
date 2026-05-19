import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { donationJourneySteps } from "@/lib/donation-options";

export function DonationJourneyTimeline() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Donor journey
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              From donation to deployment.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              A clear route from your enquiry through secure preparation, configuration, deployment
              and impact updates.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="grid lg:grid-cols-6">
            {donationJourneySteps.map((step, index) => (
              <article
                key={step.title}
                className="relative border-b border-line p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-flame-300">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                {index < donationJourneySteps.length - 1 ? (
                  <Icon
                    name="arrow"
                    className="absolute right-4 top-8 hidden h-4 w-4 text-flame-400 lg:block"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
