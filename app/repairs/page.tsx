import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { FeatureCard } from "@/components/feature-card";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { repairCategories, repairServiceCards } from "@/lib/repair-content";

export const metadata: Metadata = {
  title: "Repairs",
  description:
    "Laptop, desktop, mini PC and school lab repair operations from SIT Digital Access."
};

export default function RepairsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Repair operations"
        title="Keep useful devices working before replacement or recycling."
        description="Book diagnostics, track repairs and connect device maintenance into the wider SIT Digital Access circular technology lifecycle."
        primary={{ label: "Book a repair", href: "/book-repair" }}
        secondary={{ label: "Track repair status", href: "/repair-status" }}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Repair platform"
              title="A repair system for learners, schools, SMEs and circular inventory."
              description="Repairs sit beside refurbishment, recycling and deployment so each device has a documented route back into productive use."
            />
          </AnimatedSection>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {repairServiceCards.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.05}>
                <FeatureCard {...feature} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Repair categories"
              title="From quick upgrades to deeper diagnostics."
              description="The first pass captures the category and symptoms so the operations team can triage parts, SLA and technician routing."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/repair-pricing" variant="dark">View pricing guide</ButtonLink>
              <ButtonLink href="/repair-centres" variant="secondary">Repair routes</ButtonLink>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {repairCategories.map((category) => (
                <div key={category} className="flex items-center gap-3 rounded-lg border border-line bg-paper p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-flame-600 ring-1 ring-line">
                    <Icon name="wrench" className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-ink">{category}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-ink p-6 text-white shadow-soft md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Circular lifecycle</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Repair is now a first-class device lifecycle stage.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
                Procurement, diagnostics, repair, refurbishment, inventory, deployment, support, recovery and recycling can be tracked as one operational flow.
              </p>
            </div>
            <ButtonLink href="/device-lifecycle" variant="secondary">View lifecycle</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
