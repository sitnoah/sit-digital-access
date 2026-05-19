"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import {
  bulkSupportOptions,
  calculateRepairEstimate,
  repairCategories,
  repairFaq,
  repairTrustCards,
  repairWorkflowSteps,
  turnaroundRanges,
  warrantyRules
} from "@/lib/repair-pricing";
import { cn } from "@/lib/utils";
import type { DataRiskTone, RepairEstimateInputs } from "@/types/repair-pricing";

const trustIndicators = [
  "Diagnostic-first approach",
  "Approval before paid work",
  "Warranty-aware handling",
  "School & NGO support",
  "Tracked repair workflow"
];

const estimatorInitialValues: RepairEstimateInputs = {
  deviceType: "Laptop",
  brand: "",
  issueCategory: "diagnostics-check",
  warrantyStatus: "unknown",
  urgency: "standard",
  organisationSupport: false,
  pickupRequired: false
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

function riskToneClass(tone: DataRiskTone) {
  if (tone === "red") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-green-200 bg-green-50 text-green-700";
}

export function RepairPricingExperience() {
  return (
    <div className="bg-paper">
      <RepairPricingHero />
      <RepairPricingCards />
      <RepairEstimateCalculator />
      <RepairWorkflowTimeline />
      <WarrantySupportSection />
      <BulkRepairSupport />
      <RepairTrustSection />
      <RepairStatusCTA />
      <RepairFAQ />
    </div>
  );
}

export function RepairPricingHero() {
  const pipeline = [
    ["Intake", "Ticket created"],
    ["Triage", "Symptoms reviewed"],
    ["Estimate", "Approval checkpoint"],
    ["Repair", "Technician queue"],
    ["QC", "Ready to return"]
  ];

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] px-4 pb-16 pt-36 text-white sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
      <div className="absolute inset-0 surface-grid opacity-[0.06]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#090909_0%,#111111_54%,#2b1406_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-flame-400/55 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <AnimatedSection>
          <span className="inline-flex rounded-full border border-flame-400/35 bg-flame-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-flame-100">
            REPAIR PRICING · DIAGNOSTICS · ESTIMATES
          </span>
          <p className="mt-5 text-sm font-semibold uppercase text-white/50">SIT Digital Access · Technology. Education. Empowerment.</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.04] sm:text-5xl lg:text-[52px]">
            Clear repair estimate bands before diagnostics confirm the final route.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            Repair costs depend on device model, part availability, failure type, warranty status and data recovery complexity. SIT Digital Access provides transparent estimate bands before diagnostic inspection confirms the final repair path.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/book-repair">Book a Repair</ButtonLink>
            <ButtonLink href="/repair-status" variant="secondary">Track Repair</ButtonLink>
            <ButtonLink href="#repair-estimator" variant="ghost" className="border border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.12]">
              Start Diagnostics
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {trustIndicators.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white/80">
                <Icon name="check" className="mb-2 h-4 w-4 text-flame-300" />
                {item}
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="relative rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
            <div className="rounded-lg border border-white/10 bg-[#101010] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-200">Repair estimate dashboard</p>
                  <h2 className="mt-2 text-2xl font-semibold">Transparent estimate workflow</h2>
                </div>
                <span className="inline-flex rounded-full border border-green-300/25 bg-green-400/12 px-3 py-1.5 text-xs font-semibold text-green-100">
                  Warranty validation active
                </span>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-white">
                    <Image
                      src="/repair-assets/repair-diagnostics.svg"
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 1024px) 24vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 grid gap-2">
                    {["Device diagnostics flow", "Pricing estimator cards", "Quality check status"].map((item, index) => (
                      <div key={item} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2">
                        <span className="text-sm font-semibold text-white/80">{item}</span>
                        <span className={cn("h-2.5 w-2.5 rounded-full", index === 2 ? "bg-green-300" : "bg-flame-300")} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-lg border border-flame-300/20 bg-flame-500/12 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-flame-100">Estimate band</p>
                        <p className="mt-2 text-2xl font-semibold">£XX-£XXX guide band</p>
                      </div>
                      <Icon name="cost" className="h-5 w-5 text-flame-200" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-flame-50/80">Final estimate waits for diagnostics, parts and warranty review.</p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Ticket pipeline</p>
                    <div className="mt-4 space-y-3">
                      {pipeline.map(([label, detail], index) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold", index < 3 ? "bg-flame-500 text-white" : "bg-white/10 text-white/70")}>
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-semibold">{label}</p>
                              <p className="text-xs text-white/50">{detail}</p>
                            </div>
                            <div className="mt-2 h-1.5 rounded-full bg-white/10">
                              <div className={cn("h-full rounded-full", index < 3 ? "w-3/4 bg-flame-400" : "w-1/3 bg-white/20")} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                      <p className="text-xs font-semibold uppercase text-white/50">Approval</p>
                      <p className="mt-2 text-lg font-semibold">Before paid work</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                      <p className="text-xs font-semibold uppercase text-white/50">Data risk</p>
                      <p className="mt-2 text-lg font-semibold">Reviewed at triage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export function RepairPricingCards() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair pricing"
            title="Estimate guide"
            description="Diagnostics confirm the final repair estimate."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {repairCategories.map((category, index) => (
            <AnimatedSection key={category.id} delay={index * 0.025}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.22 }}
                className="group relative flex h-full min-h-[440px] overflow-hidden rounded-lg border border-line bg-white p-5 shadow-card transition duration-300 hover:border-flame-300 hover:shadow-[0_26px_70px_rgba(249,115,22,0.16)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-flame-500 via-flame-300 to-ink transition duration-300 group-hover:scale-x-100" />
                <div className="flex w-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-700 ring-1 ring-flame-100 transition group-hover:bg-flame-500 group-hover:text-white">
                      <Icon name={category.icon} className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted ring-1 ring-line">
                      {category.categoryBadge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-ink">{category.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-muted">{category.description}</p>
                  <p className="mt-4 text-2xl font-semibold text-ink">{category.pricing}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700 ring-1 ring-flame-100">
                      {category.turnaround}
                    </span>
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                      {category.difficulty}
                    </span>
                    {category.warrantyEligible ? (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                        Warranty eligible
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 border-t border-line pt-5">
                    <p className="text-xs font-semibold uppercase text-muted">Includes</p>
                    <ul className="mt-3 space-y-2">
                      {category.includes.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-5 text-muted">
                          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-col gap-2 pt-6">
                    <Link
                      href={`/book-repair?category=${encodeURIComponent(category.title)}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-flame-600"
                    >
                      Book this repair
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-flame-300 hover:text-flame-700"
                    >
                      Request quote
                    </Link>
                  </div>
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RepairEstimateCalculator() {
  const [values, setValues] = useState<RepairEstimateInputs>(estimatorInitialValues);
  const estimate = useMemo(() => calculateRepairEstimate(values), [values]);

  function updateValue<Key extends keyof RepairEstimateInputs>(key: Key, value: RepairEstimateInputs[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <section id="repair-estimator" className="scroll-mt-32 bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Rough estimator"
            title="Get a rough repair estimate."
            description="Use the estimator to understand the likely route before diagnostics confirm parts, labour, data risk and warranty handling."
          />
          <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink">This is not a final quote. Diagnostics confirm the final repair estimate.</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Estimate bands stay intentionally broad until a technician confirms model compatibility, part availability, fault type and data recovery complexity.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.86fr]">
            <form className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Device type"
                  value={values.deviceType}
                  onChange={(value) => updateValue("deviceType", value)}
                >
                  {["Laptop", "Desktop PC", "Mini PC", "All-in-one PC", "Monitor", "School lab bundle"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </SelectField>
                <label className="block text-sm font-medium text-ink">
                  Brand
                  <input
                    className={fieldClass}
                    value={values.brand}
                    onChange={(event) => updateValue("brand", event.target.value)}
                    placeholder="Dell, HP, Lenovo..."
                  />
                </label>
                <SelectField
                  label="Issue category"
                  value={values.issueCategory}
                  onChange={(value) => updateValue("issueCategory", value)}
                >
                  {repairCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.title}</option>
                  ))}
                </SelectField>
                <SelectField
                  label="Warranty status"
                  value={values.warrantyStatus}
                  onChange={(value) => updateValue("warrantyStatus", value)}
                >
                  <option value="unknown">Not sure</option>
                  <option value="sit-refurbished">SIT refurbished warranty</option>
                  <option value="manufacturer">Manufacturer warranty</option>
                  <option value="expired">Expired warranty</option>
                  <option value="none">No warranty</option>
                </SelectField>
                <SelectField
                  label="Repair urgency"
                  value={values.urgency}
                  onChange={(value) => updateValue("urgency", value)}
                >
                  <option value="standard">Standard</option>
                  <option value="urgent">Urgent</option>
                  <option value="school-lab-critical">School/lab critical</option>
                </SelectField>
                <div className="grid gap-3 sm:col-span-2">
                  <CheckboxField
                    label="School/organisation?"
                    checked={values.organisationSupport}
                    onChange={(checked) => updateValue("organisationSupport", checked)}
                  />
                  <CheckboxField
                    label="Pickup required?"
                    checked={values.pickupRequired}
                    onChange={(checked) => updateValue("pickupRequired", checked)}
                  />
                </div>
              </div>
            </form>

            <div className="rounded-lg border border-ink bg-ink p-5 text-white shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-200">Estimate output</p>
              <div className="mt-5 space-y-3">
                {[
                  ["Estimate range", estimate.estimateRange],
                  ["Diagnostic requirement", estimate.diagnosticRequirement],
                  ["Recommended route", estimate.recommendedRoute],
                  ["Typical turnaround", estimate.typicalTurnaround]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-xs font-semibold uppercase text-white/50">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p>
                  </div>
                ))}
                <div className={cn("rounded-lg border p-4 text-sm font-semibold", riskToneClass(estimate.dataRiskTone))}>
                  Data risk indicator: {estimate.dataRisk}
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {estimate.notes.map((note) => (
                  <li key={note} className="flex gap-2 text-sm leading-6 text-white/70">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-flame-300" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export function RepairWorkflowTimeline() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair workflow"
            title="How repair pricing works."
            description="A clear diagnostic, warranty and approval path keeps estimate decisions visible before paid work starts."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 lg:grid-cols-7">
          {repairWorkflowSteps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.025}>
              <article className="relative h-full rounded-lg border border-line bg-paper p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {index + 1}
                </span>
                <Icon name={step.icon} className="mt-5 h-5 w-5 text-flame-600" />
                <h3 className="mt-3 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-flame-700 shadow-sm">{step.indicator}</p>
                  <p className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white">{step.checkpoint}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {turnaroundRanges.map((item) => (
            <div key={item.id} className="rounded-lg border border-line bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-flame-600">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{item.range}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WarrantySupportSection() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Warranty support"
            title="Warranty and refurbished device support."
            description="SIT Digital Access can connect repair decisions to refurbishment records, warranty validation, school deployment support and donor device triage."
          />
          <div className="mt-8 rounded-lg bg-ink p-6 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase text-flame-200">Supported contexts</p>
            <div className="mt-4 grid gap-3">
              {[
                "SIT Digital Access refurbished devices",
                "Warranty validation",
                "Asset references",
                "School deployment support",
                "Donor device triage",
                "Lab support agreements"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Icon name="check" className="h-4 w-4 text-flame-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2">
          {warrantyRules.map((rule, index) => (
            <AnimatedSection key={rule.id} delay={index * 0.03}>
              <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card">
                <Icon name={rule.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-lg font-semibold text-ink">{rule.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{rule.description}</p>
                <p className="mt-4 rounded-lg bg-paper px-3 py-2 text-xs font-semibold leading-5 text-muted">{rule.appliesTo}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BulkRepairSupport() {
  return (
    <section className="bg-[#101010] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase text-flame-200">Schools, NGOs and deployment partners</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
            Repair operations for schools, NGOs and deployment partners.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">
            Bulk device intake, classroom diagnostics, pickup scheduling, asset tracking, spare pool planning and deployment-aware repair planning can all feed the same repair workflow.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Bulk device intake",
              "Classroom/lab diagnostics",
              "Pickup scheduling",
              "Asset tracking",
              "Spare pool planning",
              "Deployment-aware repair planning"
            ].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white/80">
                <Icon name="check" className="mb-2 h-4 w-4 text-flame-300" />
                {item}
              </div>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2">
          {bulkSupportOptions.map((option, index) => (
            <AnimatedSection key={option.id} delay={index * 0.035}>
              <article className="h-full rounded-lg border border-white/10 bg-white/[0.065] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={option.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{option.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{option.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RepairTrustSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Transparency and trust"
            title="What customers can expect."
            description="Repair pricing is handled through diagnostics, consent, warranty checks and quality review before a device is returned or redeployed."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairTrustCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="h-full rounded-lg border border-line bg-paper p-5 shadow-sm transition hover:border-flame-200 hover:bg-white hover:shadow-card">
                <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RepairStatusCTA() {
  const ticketTimeline = ["Submitted", "Diagnostics", "Estimate", "Approval", "Quality check"];

  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-line bg-white p-6 shadow-soft lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:p-8">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase text-flame-600">Repair status</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">Already submitted a repair?</h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            Use your repair ticket ID and status token to check customer-safe progress from diagnostics through quality check and return.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/repair-status">Check repair status</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Contact repair operations</ButtonLink>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="rounded-lg border border-ink bg-ink p-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-200">Tracked ticket visual</p>
                <h3 className="mt-2 text-2xl font-semibold">Ticket ID: REP-2026-042</h3>
              </div>
              <span className="inline-flex rounded-full bg-flame-500 px-3 py-1.5 text-xs font-semibold text-white">
                Status token active
              </span>
            </div>
            <div className="mt-6 grid gap-3">
              {ticketTimeline.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3">
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", index < 3 ? "bg-flame-500 text-white" : "bg-white/10 text-white/60")}>
                    {index < 3 ? <Icon name="check" className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item}</p>
                    <p className="mt-1 text-xs text-white/50">{index === 2 ? "Estimate ready for review" : "Tracked repair workflow"}</p>
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

export function RepairFAQ() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="FAQ"
            title="Repair pricing questions."
            description="Common questions about diagnostics, estimates, data recovery, pickup, warranties and school repair support."
            align="center"
          />
        </AnimatedSection>
        <div className="mt-10 divide-y divide-line rounded-lg border border-line bg-paper shadow-card">
          {repairFaq.map((item) => (
            <details key={item.question} className="group p-5 open:bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
                {item.question}
                <Icon name="chevron" className="h-5 w-5 shrink-0 text-flame-600 transition group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-sm leading-6 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm font-semibold leading-5 text-ink transition hover:border-flame-200">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="min-w-0">{label}</span>
    </label>
  );
}
