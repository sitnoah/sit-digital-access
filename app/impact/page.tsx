import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { LiveImpactStats } from "@/components/live-impact-stats";
import { PageHero } from "@/components/page-hero";
import { PartnerCTA } from "@/components/partner-cta";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import { impactStats, impactStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Impact dashboard for SIT Digital Access, including devices deployed, learners reached, schools supported, CO2 saved, cost savings and training hours."
};

export default function ImpactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Impact"
        title="Measuring device access through learning, productivity and sustainability."
        description="SIT Digital Access is designed to show practical outcomes: devices deployed, learners reached, schools supported, businesses upgraded, emissions avoided and training delivered."
        primary={{ label: "Sponsor Impact", href: "/donate" }}
        secondary={{ label: "Partner With Us", href: "/contact" }}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Dashboard"
              title="Impact indicators ready for live reporting."
              description="These metrics are structured for a future data layer, giving donors and partners a clear view of reach, reuse and training outcomes."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <LiveImpactStats fallback={impactStats} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Stories"
              title="The outcomes behind the numbers."
              description="These placeholder story formats are ready for real student, school, NGO and SME case studies."
            />
          </AnimatedSection>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {impactStories.map((story, index) => (
              <AnimatedSection key={story.title} delay={index * 0.04}>
                <TestimonialCard {...story} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <PartnerCTA />
    </main>
  );
}
