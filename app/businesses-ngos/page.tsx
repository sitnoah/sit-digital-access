import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { FeatureCard } from "@/components/feature-card";
import { PageHero } from "@/components/page-hero";
import { PartnerCTA } from "@/components/partner-cta";
import { SectionHeading } from "@/components/section-heading";
import { businessCapabilities } from "@/lib/content";

export const metadata: Metadata = {
  title: "Businesses & NGOs",
  description:
    "Affordable staff devices, office setup, Microsoft 365 and Google Workspace configuration, cybersecurity basics and NGO field office kits."
};

export default function BusinessesAndNgosPage() {
  return (
    <main>
      <PageHero
        eyebrow="Businesses & NGOs"
        title="Affordable, secure IT packages for small teams and mission-led organisations."
        description="Equip staff, volunteers and field offices with refurbished devices, productivity tools, cybersecurity basics, asset records and remote support."
        primary={{ label: "Request an IT Package", href: "/contact" }}
        secondary={{ label: "View Services", href: "/services" }}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Operational technology"
              title="Professional device access for organisations that need practical reliability."
              description="SIT Digital Access helps SMEs and NGOs standardise devices, accounts and support so teams can spend less time fighting basic IT issues."
            />
          </AnimatedSection>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {businessCapabilities.map((capability, index) => (
              <AnimatedSection key={capability.title} delay={index * 0.03}>
                <FeatureCard {...capability} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          {[
            {
              title: "SME starter kit",
              body: "Staff laptops, productivity setup, baseline security, asset register and remote support options."
            },
            {
              title: "NGO field office kit",
              body: "Portable devices, accessories, account setup and support planning for distributed teams."
            },
            {
              title: "Refresh and recycle",
              body: "Replace ageing devices while turning retired hardware into a structured social-impact donation pathway."
            }
          ].map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.05}>
              <article className="rounded-lg border border-line bg-paper p-6">
                <h2 className="text-xl font-semibold tracking-tight text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <PartnerCTA />
    </main>
  );
}
