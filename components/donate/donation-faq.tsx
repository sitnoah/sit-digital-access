import { AnimatedSection } from "@/components/animated-section";
import { FAQAccordion } from "@/components/faq-accordion";
import { donationFaqs } from "@/lib/donation-options";

export function DonationFAQ() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
            Donation FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Clear answers for donors and sponsors.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted">
            Practical answers about device condition, data protection, bulk donations,
            sponsorship, Africa deployment and recurring partnerships.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <FAQAccordion items={donationFaqs} />
        </AnimatedSection>
      </div>
    </section>
  );
}
