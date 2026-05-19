import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { lifecycleSteps } from "@/lib/repair-content";

export const metadata: Metadata = {
  title: "Device Lifecycle",
  description:
    "The SIT Digital Access circular device lifecycle from procurement and diagnostics to repair, deployment and recycling."
};

export default function DeviceLifecyclePage() {
  return (
    <main>
      <PageHero
        eyebrow="Device lifecycle"
        title="One circular operating model for every device."
        description="Procurement, diagnostics, repair, refurbishment, inventory, deployment, support, recovery, recycling and retirement become one trackable lifecycle."
        primary={{ label: "Book repair", href: "/book-repair" }}
        secondary={{ label: "Device recycling", href: "/device-recycling" }}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Lifecycle system"
              title="Repair connects ecommerce, recycling, support and deployment."
              description="This is the platform differentiator: each asset can move through operational stages with history, impact and next action visible."
            />
          </AnimatedSection>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {lifecycleSteps.map((step, index) => (
              <AnimatedSection key={step.title} delay={index * 0.035}>
                <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-700 ring-1 ring-flame-100">
                      <Icon name={step.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-ink">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-ink p-6 text-white shadow-soft md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Operations backbone</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Lifecycle data turns circular technology into infrastructure.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
                Inventory, repair tickets, recycling intake, sustainability reporting and impact metrics can all point back to the same device journey.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/devices" variant="secondary">Marketplace</ButtonLink>
              <ButtonLink href="/sustainability" variant="secondary">Sustainability</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
