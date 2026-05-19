import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { ProgrammeDetailHero } from "@/components/programmes/programme-detail-hero";
import { ProgrammeEnquiryForm } from "@/components/programmes/programme-enquiry-form";
import { getProgrammeBySlug, getRelatedProgrammes, programmes } from "@/lib/programmes";
import type { Programme } from "@/types/programme";

type ProgrammePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return programmes.map((programme) => ({ slug: programme.slug }));
}

export async function generateMetadata({ params }: ProgrammePageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);

  if (!programme) {
    return { title: "Programme not found" };
  }

  return {
    title: programme.title,
    description: programme.shortDescription
  };
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);

  if (!programme) {
    notFound();
  }

  const related = getRelatedProgrammes(programme);

  return (
    <main className="bg-paper">
      <ProgrammeDetailHero programme={programme} />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Device-ready", "Prepared hardware and deployment records"],
            ["Training-supported", programme.trainingIncluded ? "Training can be included" : "Training can be added"],
            ["Deployment-aware", programme.deploymentReadiness],
            ["Impact-trackable", programme.impactModel.split(",")[0]],
            ["Sponsor-ready", programme.sponsorReady ? "Available" : "Partnership route"]
          ].map(([title, detail], index) => (
            <AnimatedSection key={title} delay={index * 0.03}>
              <article className="h-full rounded-2xl border border-line bg-white p-5 shadow-card">
                <Icon name="check" className="h-5 w-5 text-flame-600" />
                <h2 className="mt-4 text-base font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="space-y-8">
            <DetailSection eyebrow="Overview" title="Built around practical access and outcomes.">
              <p>{programme.longDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {programme.bestFor.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-semibold text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </DetailSection>

            <div className="grid gap-6 lg:grid-cols-2">
              <DetailCard icon="laptop" title="Device model" description={programme.deviceModel} />
              <DetailCard icon="book" title="Training & skills support" description={programme.trainingSupport} />
              <DetailCard icon="truck" title="Deployment & setup" description={programme.deploymentSetup} />
              <DetailCard icon="headset" title="Support & maintenance" description={programme.maintenanceSupport} />
            </div>

            <DetailSection eyebrow="Africa readiness" title="Prepared for realistic deployment conditions.">
              <p>{programme.africaReadiness}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {programme.deploymentRegions.map((region) => (
                  <div key={region} className="rounded-2xl border border-line bg-paper p-4">
                    <p className="text-sm font-semibold text-ink">{region}</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection eyebrow="Sponsorship" title="Funding routes for cohorts, classrooms and labs.">
              <div className="grid gap-3 sm:grid-cols-2">
                {programme.sponsorshipOpportunities.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-white">
                      <Icon name="handshake" className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection eyebrow="Impact tracking" title="Programme-level outputs partners can understand.">
              <p>{programme.impactModel}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {[
                  ["Scale", programme.scalabilityScore],
                  ["Education", programme.educationScore],
                  ["Africa", programme.africaScore],
                  ["Sponsor", programme.sponsorScore]
                ].map(([label, score]) => (
                  <div key={label} className="rounded-2xl border border-line bg-paper p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-flame-600">{score}%</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection eyebrow="FAQs" title="Common questions">
              <div className="divide-y divide-line">
                {programme.faqs.map((faq) => (
                  <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="font-semibold text-ink">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Related programmes</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/programmes/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft"
                  >
                    <div className="relative aspect-[16/9] bg-paper">
                      <Image src={item.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-8 transition group-hover:scale-105" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">{item.category}</p>
                      <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside id="programme-enquiry" className="sticky top-32 scroll-mt-32">
            <div className="rounded-3xl border border-line bg-white p-4 shadow-soft">
              <div className="mb-5 rounded-2xl bg-ink p-5 text-white">
                <p className="text-sm font-semibold text-flame-300">Start programme conversation</p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Share cohort size, region, device requirements and training needs.
                </p>
              </div>
              <ProgrammeEnquiryForm defaultProgrammeSlug={programme.slug} compact />
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/94 p-3 shadow-soft backdrop-blur lg:hidden">
        <Link href="#programme-enquiry" className="flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
          Enquire about this programme
        </Link>
      </div>
    </main>
  );
}

function DetailSection({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-600">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-4 text-base leading-8 text-muted">{children}</div>
    </article>
  );
}

function DetailCard({
  icon,
  title,
  description
}: {
  icon: Programme["icon"];
  title: string;
  description: string;
}) {
  return (
    <article className="h-full rounded-2xl border border-line bg-white p-6 shadow-card">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </article>
  );
}
