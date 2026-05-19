import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { FeatureCard } from "@/components/feature-card";
import { PageHero } from "@/components/page-hero";
import { PartnerCTA } from "@/components/partner-cta";
import { SectionHeading } from "@/components/section-heading";
import type { Feature } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SIT Digital Access, a UK-based, Africa-focused digital inclusion initiative within the SIT Learning and SIT Technology ecosystem."
};

const principles: Feature[] = [
  {
    title: "Access before excess",
    description:
      "We prioritise practical, reliable technology that helps learners and teams do real work, not unnecessary hardware spend.",
    icon: "cost"
  },
  {
    title: "Secure by default",
    description:
      "Devices are prepared with data wiping, software setup, endpoint protection and sensible account configuration.",
    icon: "shield"
  },
  {
    title: "Skills with equipment",
    description:
      "Through SIT Learning, device access can connect directly to training in digital skills, coding, productivity and AI literacy.",
    icon: "book"
  },
  {
    title: "Deployment that lasts",
    description:
      "We design support models around maintenance, documentation, local technician capability and long-term usability.",
    icon: "wrench"
  }
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About SIT Digital Access"
        title="A practical technology access initiative for learning, work and community growth."
        description="SIT Digital Access sits within the SIT Learning and SIT Technology ecosystem, combining refurbished devices, digital skills enablement and deployment support for organisations across the UK and Africa."
        primary={{ label: "Request Devices", href: "/contact" }}
        secondary={{ label: "Sponsor Access", href: "/donate" }}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Our role"
              title="We help organisations turn unused, unaffordable or fragmented technology into dependable digital access."
              description="Schools, training centres, businesses and NGOs often know exactly what they need to teach, operate and grow. The barrier is usually device cost, setup capacity, security, logistics and ongoing support."
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="rounded-lg border border-line bg-white p-6 shadow-soft sm:p-8">
              <p className="text-lg leading-8 text-graphite">
                SIT Digital Access focuses on the full path from device sourcing to
                deployment: responsible refurbishment, secure setup, software configuration,
                support planning and skills enablement. The result is a model that is more
                affordable than buying new equipment and more operationally useful than simply
                donating hardware.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {["Schools", "SMEs", "Communities"].map((item) => (
                  <div key={item} className="rounded-lg bg-paper p-4">
                    <p className="text-sm font-semibold text-ink">{item}</p>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Practical access pathways for real-world digital growth.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Principles"
              title="Professional, impact-led and built for deployment."
              description="The brand is premium and clean because the work needs to earn trust from schools, donors, SMEs, NGOs and public partners."
            />
          </AnimatedSection>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <AnimatedSection key={principle.title} delay={index * 0.04}>
                <FeatureCard {...principle} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <PartnerCTA />
    </main>
  );
}
