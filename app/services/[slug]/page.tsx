import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { ServiceDetailHero } from "@/components/services/service-detail-hero";
import { ServiceEnquiryForm } from "@/components/services/service-enquiry-form";
import { getRelatedServices, getServiceBySlug, services } from "@/lib/services";
import type { ServiceItem } from "@/types/service";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: service.title,
    description: service.shortDescription
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const related = getRelatedServices(service);

  return (
    <main className="bg-paper">
      <ServiceDetailHero service={service} />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Deployment-ready", service.deploymentReadiness],
            ["Support level", service.supportLevel],
            ["Africa readiness", service.africaReady ? "Africa-ready" : "Standard"],
            ["Training", service.trainingLinked ? "Training-linked" : "Optional"],
            ["Complexity", service.deliveryComplexity]
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
            <DetailSection eyebrow="Overview" title="Prepared for practical service delivery.">
              <p>{service.longDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.bestFor.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-semibold text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </DetailSection>

            <DetailSection eyebrow="What is included" title="Core service features">
              <div className="grid gap-3 sm:grid-cols-2">
                {service.includedFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-white">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-ink">{feature}</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            <div className="grid gap-6 lg:grid-cols-2">
              <DetailCard icon="settings" title="Delivery model" items={service.deliveryModel} />
              <DetailCard icon="headset" title="Support options" items={[service.supportLevel, "Remote support route", "Handover guidance", "Escalation planning"]} />
            </div>

            <DetailSection eyebrow="Deployment readiness" title="Designed around the environment where it will be used.">
              <p>
                This service is rated <strong className="text-ink">{service.deploymentReadiness}</strong> for deployment
                readiness, with <strong className="text-ink">{service.deliveryComplexity.toLowerCase()}</strong> delivery complexity.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-5">
                {[
                  ["Requested", service.requestedScore],
                  ["Deployment", service.deploymentScore],
                  ["Education", service.educationScore],
                  ["SME", service.smeScore],
                  ["Africa", service.africaScore]
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
                {service.faqs.map((faq) => (
                  <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="font-semibold text-ink">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </DetailSection>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Related services</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="group rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">{item.category}</p>
                    <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside id="service-enquiry" className="sticky top-32 scroll-mt-32">
            <div className="rounded-3xl border border-line bg-white p-4 shadow-soft">
              <div className="mb-5 rounded-2xl bg-ink p-5 text-white">
                <p className="text-sm font-semibold text-flame-300">Request this service</p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Share the service scope, region, device count and timeline.
                </p>
              </div>
              <ServiceEnquiryForm defaultServiceSlug={service.slug} compact />
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/94 p-3 shadow-soft backdrop-blur lg:hidden">
        <Link href="#service-enquiry" className="flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
          Request this service
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
  items
}: {
  icon: ServiceItem["icon"];
  title: string;
  items: string[];
}) {
  return (
    <article className="h-full rounded-2xl border border-line bg-white p-6 shadow-card">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="rounded-xl bg-paper px-4 py-3 text-sm font-semibold text-muted">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
