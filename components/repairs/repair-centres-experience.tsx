"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import {
  africaRepairCountries,
  africaRepairSupport,
  batchRepairFeatures,
  repairCentreFAQs,
  repairCentreTrustCards,
  repairLocationCards,
  repairNetworkNodes,
  repairRouteWorkflow,
  repairRoutes,
  routeRecommenderRules
} from "@/lib/repair-centres";
import { getRepairRouteSlugForCentreRoute, repairRouteBookingHref } from "@/lib/repair-routes";
import { cn } from "@/lib/utils";
import type {
  RecommenderDeviceCount,
  RecommenderDeviceType,
  RecommenderLocation,
  RecommenderPosting,
  RecommenderUrgency,
  RepairCentreRouteId,
  RepairInfoCard,
  RepairRouteRecommendation
} from "@/types/repair-centre";

type RecommenderState = {
  deviceCount: RecommenderDeviceCount;
  deviceType: RecommenderDeviceType;
  location: RecommenderLocation;
  urgency: RecommenderUrgency;
  canPost: RecommenderPosting;
};

const initialRecommender: RecommenderState = {
  deviceCount: "1",
  deviceType: "Laptop",
  location: "UK",
  urgency: "Standard",
  canPost: "Yes"
};

function routeHref(routeId: RepairCentreRouteId) {
  return repairRouteBookingHref(getRepairRouteSlugForCentreRoute(routeId));
}

function routeById(routeId: RepairCentreRouteId) {
  return repairRoutes.find((route) => route.id === routeId) ?? repairRoutes[0];
}

function recommendRoute(state: RecommenderState): RepairRouteRecommendation {
  if (state.location === "Africa deployment partner") return routeRecommenderRules.africa;
  if (state.urgency === "Lab critical") return routeRecommenderRules.labCritical;
  if (state.deviceType === "School lab bundle") return routeRecommenderRules.bulk;
  if (state.deviceCount === "16+" || state.deviceCount === "6-15") return routeRecommenderRules.bulk;
  if (state.deviceCount === "2-5" && state.canPost !== "Yes") return routeRecommenderRules.smallBatchNoPost;
  if (state.deviceCount === "2-5") return routeRecommenderRules.singlePostable;
  if (state.location === "Other" && state.canPost !== "Yes") return routeRecommenderRules.partner;
  if (state.canPost === "Yes") return routeRecommenderRules.singlePostable;
  return routeRecommenderRules.singleNoPost;
}

export function RepairCentresExperience() {
  return (
    <div className="bg-white">
      <RepairCentresHero />
      <RepairRouteSelector />
      <RouteRecommender />
      <RepairNetworkMap />
      <BatchRepairsSection />
      <AfricaRepairSupportSection />
      <RepairRouteWorkflow />
      <RepairTrustSection />
      <RepairLocationCards />
      <RepairCentresFAQ />
      <RepairCentresCTA />
    </div>
  );
}

function RepairCentresHero() {
  const statusBadges = ["Diagnostics", "Repair queue", "Quality check", "Ready for return"];
  const heroRoutes = ["Mail-in repair", "Pickup request", "Partner handover", "School lab batch support"];

  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            REPAIR CENTRES · MAIL-IN · PICKUP · PARTNER HANDOVER
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Flexible repair routes for individuals, schools and organisations.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
            Choose mail-in repair, pickup request, partner handover or bulk lab maintenance depending on device count, urgency, location and deployment model.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book-repair">Book a Repair</ButtonLink>
            <ButtonLink href="/repair-pricing" variant="secondary">View Pricing Guide</ButtonLink>
            <ButtonLink href="/repair-status" variant="ghost" className="text-white hover:bg-white/10">Check Repair Status</ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["UK-wide intake", "School batch support", "Africa deployment route", "Tracked repair tickets", "Secure data-aware process"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white/80">
                {item}
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-flame-100">Repair route dashboard</p>
                <h2 className="mt-2 text-2xl font-semibold">UK + Africa support network</h2>
              </div>
              <span className="rounded-full bg-green-400/15 px-3 py-1.5 text-xs font-semibold text-green-100">Route matched</span>
            </div>
            <div className="mt-6 rounded-lg border border-white/10 bg-ink/40 p-4">
              <div className="relative h-56 overflow-hidden rounded-lg bg-white/[0.04]">
                <div className="absolute left-[17%] top-[22%] h-20 w-16 rounded-full border border-flame-300/50 bg-flame-400/10" />
                <div className="absolute right-[13%] bottom-[18%] h-24 w-24 rounded-full border border-green-300/40 bg-green-400/10" />
                <div className="absolute left-[26%] top-[37%] h-px w-[48%] rotate-12 bg-gradient-to-r from-flame-400/80 via-white/30 to-green-300/70" />
                <div className="absolute left-[43%] top-[56%] h-px w-[34%] -rotate-12 bg-gradient-to-r from-white/20 to-flame-300/70" />
                <MapNode className="left-[18%] top-[28%]" label="UK intake" />
                <MapNode className="left-[45%] top-[53%]" label="Schools" />
                <MapNode className="right-[12%] bottom-[24%]" label="Africa route" />
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {heroRoutes.map((route) => (
                <div key={route} className="rounded-lg bg-white/[0.08] p-4">
                  <p className="text-sm font-semibold">{route}</p>
                  <p className="mt-1 text-xs text-white/60">Tracked intake · diagnostics · return planning</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {statusBadges.map((badge) => (
                <span key={badge} className="rounded-full bg-flame-500/20 px-3 py-1.5 text-xs font-semibold text-flame-50">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function MapNode({ className, label }: { className: string; label: string }) {
  return (
    <div className={cn("absolute", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-white shadow-lg shadow-flame-500/30">
        <Icon name="map" className="h-4 w-4" />
      </span>
      <span className="mt-2 block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{label}</span>
    </div>
  );
}

function RepairRouteSelector() {
  const [selectedRoute, setSelectedRoute] = useState<RepairCentreRouteId>("repair-desk");
  const selected = routeById(selectedRoute);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair route selector"
            title="Choose the repair route that fits your device and organisation."
            description="Each route creates a tracked repair ticket, but intake, handover and reporting change depending on device count, location and urgency."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {repairRoutes.map((route, index) => {
            const active = selectedRoute === route.id;
            return (
              <motion.button
                key={route.id}
                type="button"
                onClick={() => setSelectedRoute(route.id)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.025 }}
                className={cn(
                  "rounded-lg border p-5 text-left shadow-sm transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500",
                  active ? "border-flame-400 bg-flame-50 shadow-card" : "border-line bg-white hover:border-flame-200 hover:bg-paper"
                )}
              >
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", active ? "bg-flame-500 text-white" : "bg-paper text-flame-600")}>
                  <Icon name={route.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{route.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-flame-700">{route.subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{route.bestFor}</p>
              </motion.button>
            );
          })}
        </div>

        <AnimatedSection delay={0.08}>
          <div className="mt-8 rounded-lg border border-line bg-paper p-5 shadow-card">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <Icon name={selected.icon} className="h-6 w-6 text-flame-600" />
                <h3 className="mt-4 text-2xl font-semibold text-ink">{selected.title}</h3>
                <p className="mt-2 text-sm font-semibold text-flame-700">{selected.subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-muted">{selected.requirements}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted shadow-sm">{selected.deviceCount}</span>
                  <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">{selected.turnaround}</span>
                </div>
                <Link href={routeHref(selected.id)} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600">
                  Choose this route
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {selected.includes.map((item) => (
                  <div key={item} className="rounded-lg border border-line bg-white p-4">
                    <Icon name="check" className="h-4 w-4 text-green-600" />
                    <p className="mt-3 text-sm font-semibold text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function RouteRecommender() {
  const [state, setState] = useState<RecommenderState>(initialRecommender);
  const recommendation = useMemo(() => recommendRoute(state), [state]);
  const route = routeById(recommendation.routeId);

  function update<Key extends keyof RecommenderState>(key: Key, value: RecommenderState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Route recommender"
            title="Not sure which route to use?"
            description="Answer a few operational questions and the page will recommend the best repair intake path."
          />
          <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink">Recommended route</p>
            <div className="mt-4 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
                <Icon name={route.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-ink">{route.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{recommendation.reason}</p>
                <p className="mt-3 rounded-lg bg-paper p-3 text-sm font-semibold leading-6 text-muted">{recommendation.nextStep}</p>
              </div>
            </div>
            <ButtonLink href={routeHref(route.id)} className="mt-6">Book repair with this route</ButtonLink>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-7">
            <ChoiceGroup label="Device count" value={state.deviceCount} options={["1", "2-5", "6-15", "16+"]} onChange={(value) => update("deviceCount", value as RecommenderDeviceCount)} />
            <ChoiceGroup label="Device type" value={state.deviceType} options={["Laptop", "Desktop", "Mini PC", "Accessories", "School lab bundle"]} onChange={(value) => update("deviceType", value as RecommenderDeviceType)} />
            <ChoiceGroup label="Location" value={state.location} options={["UK", "Africa deployment partner", "Other"]} onChange={(value) => update("location", value as RecommenderLocation)} />
            <ChoiceGroup label="Urgency" value={state.urgency} options={["Standard", "Urgent", "Lab critical"]} onChange={(value) => update("urgency", value as RecommenderUrgency)} />
            <ChoiceGroup label="Can you post the device?" value={state.canPost} options={["Yes", "No", "Not sure"]} onChange={(value) => update("canPost", value as RecommenderPosting)} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="mt-5 first:mt-0">
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500",
              value === option ? "border-flame-400 bg-flame-50 text-flame-700" : "border-line bg-paper text-ink hover:border-flame-200"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function RepairNetworkMap() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Service network"
            title="The repair centre model follows the device, not the other way around."
            description="Repair operations can support single devices, batches, corporate refreshes, school labs and Africa deployment maintenance workflows."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 rounded-lg border border-line bg-ink p-5 text-white shadow-2xl">
            <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
              <div className="absolute inset-0 opacity-70">
                <div className="absolute left-[18%] top-[24%] h-28 w-20 rounded-full border border-flame-300/50 bg-flame-500/10" />
                <div className="absolute left-[42%] top-[42%] h-24 w-28 rounded-full border border-white/20 bg-white/5" />
                <div className="absolute right-[15%] bottom-[18%] h-32 w-32 rounded-full border border-green-300/40 bg-green-400/10" />
                <div className="absolute left-[27%] top-[36%] h-px w-[48%] rotate-12 bg-gradient-to-r from-flame-400 via-white/30 to-green-300" />
                <div className="absolute left-[38%] top-[52%] h-px w-[39%] -rotate-12 bg-gradient-to-r from-white/20 to-flame-300" />
                <div className="absolute left-[25%] top-[29%] h-px w-[31%] -rotate-6 bg-white/20" />
              </div>
              {repairNetworkNodes.map((node) => (
                <div key={node.id} className="absolute w-56 -translate-x-1/2 -translate-y-1/2" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                  <div className="rounded-lg border border-white/10 bg-ink/90 p-4 shadow-2xl backdrop-blur">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame-500 text-white">
                      <Icon name={node.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold">{node.label}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase text-flame-100">{node.region}</p>
                    <p className="mt-2 text-xs leading-5 text-white/60">{node.detail}</p>
                    <span className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{node.metric}</span>
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

function BatchRepairsSection() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="School and batch repairs"
              title="Batch repairs and school lab maintenance."
              description="For multiple devices, use pickup request in the booking form and include device count, location and deadline in the issue description."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routeHref("pickup-request")}>Request Pickup</ButtonLink>
              <ButtonLink href={routeHref("bulk-school-lab-support")} variant="secondary">Book Bulk Repair</ButtonLink>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <InfoCardGrid cards={batchRepairFeatures} columns="xl:grid-cols-4" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function AfricaRepairSupportSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <AnimatedSection>
            <p className="text-sm font-semibold uppercase text-flame-200">Africa deployment support</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">Repair support for Africa deployment and community partners.</h2>
            <p className="mt-5 text-base leading-7 text-white/70">
              Deployment repair support can combine remote triage, local technician enablement, spare device planning and repair-vs-replace decisions for education and community access partners.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {africaRepairCountries.map((country) => (
                <span key={country} className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/80">
                  {country}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink href={routeHref("africa-deployment")}>Discuss Africa repair support</ButtonLink>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="grid gap-3 md:grid-cols-2">
              {africaRepairSupport.map((card) => (
                <article key={card.title} className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
                  <Icon name={card.icon} className="h-5 w-5 text-flame-200" />
                  <h3 className="mt-4 text-base font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{card.description}</p>
                </article>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function RepairRouteWorkflow() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Workflow"
            title="From booking to return, every route stays trackable."
            description="The route changes the handover model, but every repair still starts with a ticket and ends with quality check, return, handover or redeployment."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairRouteWorkflow.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.025}>
              <article className="h-full rounded-lg border border-line bg-paper p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">{index + 1}</span>
                <Icon name={step.icon} className="mt-5 h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairTrustSection() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Trust and security"
            title="Repair routes built around tracking, accountability and data awareness."
            description="SIT Digital Access repair routing is designed for individuals, schools, organisations and deployment partners that need clear handover and protected status tracking."
          />
        </AnimatedSection>
        <div className="mt-10">
          <InfoCardGrid cards={repairCentreTrustCards} columns="xl:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}

function RepairLocationCards() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Route cards"
            title="Practical routes for different repair contexts."
            description="These are route models rather than a live location directory; real partner locations can be added later."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {repairLocationCards.map((location, index) => (
            <AnimatedSection key={location.title} delay={index * 0.025}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-paper p-5">
                <Icon name={location.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{location.title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-flame-700">{location.serviceType}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{location.bestFor}</p>
                <p className="mt-4 rounded-lg bg-white p-3 text-xs font-semibold leading-5 text-muted">{location.availableRoutes}</p>
                <Link href={routeHref(location.routeId)} className="mt-auto pt-5 text-sm font-semibold text-flame-700 hover:text-flame-800">
                  Choose route
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairCentresFAQ() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="FAQ"
            title="Repair route questions."
            description="A practical guide to mail-in repair, pickup requests, partner handover and deployment support."
          />
        </AnimatedSection>
        <div className="mt-10 divide-y divide-line rounded-lg border border-line bg-white shadow-card">
          {repairCentreFAQs.map((item) => (
            <details key={item.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-ink">
                {item.question}
                <Icon name="chevron" className="h-4 w-4 text-muted transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairCentresCTA() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase text-flame-200">Ready to route a repair?</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">Book a tracked repair route for one device, a batch or a deployment partner.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Choose the route now, check pricing guidance, or use repair status tracking once your ticket is created.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.08} className="flex flex-wrap gap-3">
          <ButtonLink href="/book-repair">Book a Repair</ButtonLink>
          <ButtonLink href="/repair-pricing" variant="secondary">View Pricing Guide</ButtonLink>
          <ButtonLink href="/repair-status" variant="ghost" className="text-white hover:bg-white/10">Check Repair Status</ButtonLink>
        </AnimatedSection>
      </div>
    </section>
  );
}

function InfoCardGrid({ cards, columns = "xl:grid-cols-4" }: { cards: RepairInfoCard[]; columns?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", columns)}>
      {cards.map((card, index) => (
        <AnimatedSection key={card.title} delay={index * 0.025}>
          <article className="h-full rounded-lg border border-line bg-white p-5 shadow-sm">
            <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
            <h3 className="mt-4 text-base font-semibold text-ink">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
          </article>
        </AnimatedSection>
      ))}
    </div>
  );
}
