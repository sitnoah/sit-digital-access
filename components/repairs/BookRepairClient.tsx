"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { RepairIntakeForm } from "@/components/repairs/RepairIntakeForm";
import { RepairRouteSelector } from "@/components/repairs/RepairRouteSelector";
import {
  defaultRepairRoute,
  getRepairRouteBySlug,
  repairRoutes,
  type RepairRouteOption,
  type RepairRouteSlug
} from "@/lib/repair-routes";

export function BookRepairClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeSelectorRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToRoute = useRef(false);

  const routeParam = searchParams.get("route");
  const routeFromQuery = useMemo(() => getRepairRouteBySlug(routeParam), [routeParam]);
  const invalidRouteWarning = Boolean(routeParam && !routeFromQuery);
  const [selectedRoute, setSelectedRoute] = useState<RepairRouteOption>(routeFromQuery ?? defaultRepairRoute);

  useEffect(() => {
    const nextRoute = routeFromQuery ?? defaultRepairRoute;
    if (selectedRoute.slug !== nextRoute.slug) {
      setSelectedRoute(nextRoute);
    }
  }, [routeFromQuery, selectedRoute.slug]);

  useEffect(() => {
    if ((!routeFromQuery && !invalidRouteWarning) || hasScrolledToRoute.current) return;
    hasScrolledToRoute.current = true;
    window.requestAnimationFrame(() => {
      const scrollTarget = invalidRouteWarning ? routeSelectorRef.current : formRef.current;
      scrollTarget?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [invalidRouteWarning, routeFromQuery]);

  function updateRoute(slug: RepairRouteSlug) {
    const nextRoute = getRepairRouteBySlug(slug) ?? defaultRepairRoute;
    setSelectedRoute(nextRoute);
    router.replace(`/book-repair?route=${nextRoute.slug}`, { scroll: false });
  }

  return (
    <div className="bg-paper">
      <BookRepairHero selectedRoute={selectedRoute} />

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Repair routes"
              title="Choose how your repair should enter the workflow."
              description="Route selection controls handover guidance, pickup fields, validation and the repair booking payload."
            />
          </AnimatedSection>
          <div ref={routeSelectorRef} className="mt-10 scroll-mt-32">
            <RepairRouteSelector selectedRoute={selectedRoute} onSelect={updateRoute} />
          </div>
        </div>
      </section>

      <section id="repair-intake" ref={formRef} className="scroll-mt-32 bg-paper px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Repair intake"
              title="Create the repair ticket with the selected route."
              description="The selected route stays linked to the form, the URL and the payload sent to repair operations."
            />
            <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
                  <Icon name={selectedRoute.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{selectedRoute.guidanceTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{selectedRoute.guidanceMessage}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                {[
                  "Tracked repair ticket",
                  "Route-specific validation",
                  "Approval before paid work",
                  "Customer-safe status token"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-muted">
                    <Icon name="check" className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <RepairIntakeForm
              selectedRoute={selectedRoute}
              selectedRepairRoute={selectedRoute.slug}
              invalidRouteWarning={invalidRouteWarning}
            />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function BookRepairHero({ selectedRoute }: { selectedRoute: RepairRouteOption }) {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-20 pt-36 text-white sm:px-6 lg:px-8 lg:pt-28">
      <div className="absolute inset-0 surface-grid opacity-[0.06]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#090909_0%,#111111_58%,#321604_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-flame-100">
            REPAIR BOOKING · ROUTE-AWARE INTAKE
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Book diagnostics, repair or pickup support with the right route already selected.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
            SIT Digital Access repair booking now understands route links from repair centres, pricing guidance and partner workflows so customers land in the right intake path.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#repair-intake">Open repair intake</ButtonLink>
            <ButtonLink href="/repair-status" variant="secondary">Track repair</ButtonLink>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-100">Selected route</p>
                <h2 className="mt-2 text-3xl font-semibold">{selectedRoute.label}</h2>
                <p className="mt-3 text-sm leading-6 text-white/64">{selectedRoute.bestFor}</p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
                <Icon name={selectedRoute.icon} className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {repairRoutes.map((route) => (
                <div key={route.slug} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center gap-2">
                    <Icon name={route.slug === selectedRoute.slug ? "check" : route.icon} className="h-4 w-4 text-flame-300" />
                    <p className="text-sm font-semibold text-white/82">{route.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
