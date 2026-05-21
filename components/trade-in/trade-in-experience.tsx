"use client";

import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { impactStats } from "@/lib/data";
import { cn } from "@/lib/utils";

type DeviceType =
  | "Laptop"
  | "Desktop"
  | "Mini PC"
  | "School lab recovery"
  | "Business IT refresh"
  | "NGO device recovery"
  | "Broken device"
  | "Bulk organisation trade-in";

type DeviceCondition = "Excellent" | "Good" | "Fair" | "Broken";
type PowerState = "Yes" | "Intermittent" | "No";
type ScreenCondition = "Excellent" | "Good" | "Marked" | "Cracked or missing";
type BatteryHealth = "Strong" | "Usable" | "Weak" | "Dead or unknown" | "Not applicable";
type StorageType = "SSD" | "NVMe SSD" | "HDD" | "None / failed" | "Unknown";
type RamSize = "4GB or less" | "8GB" | "16GB" | "32GB+" | "Unknown";
type CollectionRoute = "Mail-in route" | "Pickup request" | "Partner handover" | "Corporate collection" | "Community hub intake";
type RecommendedRoute = "Reuse" | "Repair" | "Refurbish" | "Parts recovery" | "Recycling";
type Suitability = "High" | "Medium" | "Low";

type EstimatorState = {
  deviceType: DeviceType;
  brand: string;
  model: string;
  age: "0-2 years" | "3-5 years" | "6+ years" | "Unknown";
  condition: DeviceCondition;
  powersOn: PowerState;
  screenCondition: ScreenCondition;
  batteryHealth: BatteryHealth;
  storageType: StorageType;
  ramSize: RamSize;
  dataWipeRequired: "Yes" | "No" | "Not sure";
  quantity: number;
  collectionRoute: CollectionRoute;
};

const initialEstimator: EstimatorState = {
  deviceType: "Laptop",
  brand: "",
  model: "",
  age: "3-5 years",
  condition: "Good",
  powersOn: "Yes",
  screenCondition: "Good",
  batteryHealth: "Usable",
  storageType: "SSD",
  ramSize: "8GB",
  dataWipeRequired: "Yes",
  quantity: 1,
  collectionRoute: "Pickup request"
};

const trustBadges = [
  "Secure wipe support",
  "Reuse before recycling",
  "UK intake",
  "Africa deployment pathways",
  "ESG-ready reporting"
];

const flowStages = ["Trade-in", "Diagnostics", "Repair", "Refurbish", "Deploy", "Support", "Recover", "Recycle"];

const selectorCards: Array<{
  title: string;
  deviceType: DeviceType;
  bestFor: string;
  quantity: string;
  outcome: string;
  icon: IconKey;
}> = [
  { title: "Laptop trade-in", deviceType: "Laptop", bestFor: "Personal laptops, staff devices and learner-ready hardware.", quantity: "1-20 devices", outcome: "Reuse, refurbish or repair route", icon: "laptop" },
  { title: "Desktop trade-in", deviceType: "Desktop", bestFor: "Office towers, SFF desktops and workstation refreshes.", quantity: "1-50 devices", outcome: "Refurbish, parts recovery or recycling", icon: "monitor" },
  { title: "Mini PC trade-in", deviceType: "Mini PC", bestFor: "Low-power devices for labs, hubs and Africa deployment.", quantity: "1-100 devices", outcome: "High reuse or redeployment potential", icon: "cpu" },
  { title: "School lab recovery", deviceType: "School lab recovery", bestFor: "ICT labs, device trolleys, spares and classroom refreshes.", quantity: "5+ devices", outcome: "Batch assessment and lab readiness report", icon: "school" },
  { title: "Business IT refresh", deviceType: "Business IT refresh", bestFor: "SMEs replacing fleets, accessories or mixed IT equipment.", quantity: "5-250 devices", outcome: "Corporate collection and ESG evidence", icon: "business" },
  { title: "NGO device recovery", deviceType: "NGO device recovery", bestFor: "Charities, projects, field teams and community organisations.", quantity: "1-100 devices", outcome: "Reuse, donation conversion or recycling", icon: "heart" },
  { title: "Broken device recovery", deviceType: "Broken device", bestFor: "Damaged devices that may still hold parts or recoverable value.", quantity: "Any quantity", outcome: "Repair, parts recovery or recycling", icon: "wrench" },
  { title: "Bulk organisation trade-in", deviceType: "Bulk organisation trade-in", bestFor: "Large refreshes, multi-site estates and circular procurement.", quantity: "25+ devices", outcome: "Assessment, logistics and reporting pack", icon: "factory" }
];

const comparisonCards: Array<{ title: RecommendedRoute; icon: IconKey; bullets: string[]; tone: string }> = [
  { title: "Repair", icon: "wrench", tone: "bg-flame-50 text-flame-700", bullets: ["Extend life", "Lower cost", "Faster reuse"] },
  { title: "Refurbish", icon: "settings", tone: "bg-blue-50 text-blue-700", bullets: ["Upgrade and redeploy", "School/community use", "Circular inventory"] },
  { title: "Recycling", icon: "recycle", tone: "bg-emerald-50 text-emerald-700", bullets: ["Secure disposal", "Parts harvesting", "Material recovery"] }
];

const organisationFeatures = [
  "Batch assessment",
  "Asset tagging",
  "Secure wipe certificates",
  "ESG reporting",
  "Pickup logistics",
  "Device redeployment",
  "School lab refreshes",
  "Donation conversion",
  "Circular procurement strategy"
];

const tradeInRoutes: Array<{ title: CollectionRoute; suitable: string; turnaround: string; quantity: string; icon: IconKey }> = [
  { title: "Mail-in route", suitable: "Individuals and small batches that can be packaged safely.", turnaround: "Initial review after intake", quantity: "1-3 devices", icon: "mail" },
  { title: "Pickup request", suitable: "Schools, SMEs, NGOs and mixed equipment recovery.", turnaround: "Planned around location", quantity: "2+ devices", icon: "truck" },
  { title: "Partner handover", suitable: "Community hubs, schools and trusted handover points.", turnaround: "Partner-led intake window", quantity: "1-20 devices", icon: "handshake" },
  { title: "Corporate collection", suitable: "Business IT refreshes and ESG-ready programmes.", turnaround: "Scheduled collection", quantity: "25+ devices", icon: "building" },
  { title: "Community hub intake", suitable: "Local recovery through community access points.", turnaround: "By arrangement", quantity: "Small batches", icon: "users" }
];

const processTimeline = [
  "Submit device details",
  "Initial assessment",
  "Collection or intake",
  "Diagnostics and secure wipe",
  "Repair/refurbish/recycle decision",
  "Valuation and approval",
  "Redeployment or payout"
];

const trustCards: Array<{ title: string; description: string; icon: IconKey }> = [
  { title: "Secure wipe process", description: "Data wipe needs are captured before devices move into reuse or recycling decisions.", icon: "shield" },
  { title: "ESG evidence", description: "Organisation routes can support donor, CSR and sustainability reporting workflows.", icon: "leaf" },
  { title: "Chain of custody", description: "Collection route, intake notes and device counts keep recovery work auditable.", icon: "list" },
  { title: "Reuse-first commitment", description: "Repair, refurbishment and redeployment are considered before responsible recycling.", icon: "recycle" },
  { title: "Responsible recycling partners", description: "End-of-life assets are routed toward parts recovery and compliant processing.", icon: "handshake" }
];

const publicMetrics = [
  impactStats.find((metric) => metric.label === "Devices deployed") ?? { value: "Reuse", label: "Devices reused", detail: "Tracked through deployment" },
  impactStats.find((metric) => metric.label === "CO2 saved through reuse") ?? { value: "CO2", label: "CO2 avoided", detail: "Estimated circular impact" },
  impactStats.find((metric) => metric.label === "Schools supported") ?? { value: "10+", label: "Schools supported", detail: "Labs and learner access" },
  impactStats.find((metric) => metric.label === "Countries served") ?? { value: "5+", label: "Africa pathways", detail: "UK and Africa partnerships" }
];

const inputClass = "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function roundToFive(value: number) {
  return Math.round(value / 5) * 5;
}

function estimateTradeIn(state: EstimatorState) {
  const quantity = clamp(Number(state.quantity) || 1, 1, 1000);
  const baseByType: Record<DeviceType, number> = {
    Laptop: 165,
    Desktop: 105,
    "Mini PC": 125,
    "School lab recovery": 95,
    "Business IT refresh": 110,
    "NGO device recovery": 85,
    "Broken device": 35,
    "Bulk organisation trade-in": 95
  };
  const conditionMultiplier: Record<DeviceCondition, number> = {
    Excellent: 1.15,
    Good: 0.9,
    Fair: 0.55,
    Broken: 0.18
  };
  const ageMultiplier: Record<EstimatorState["age"], number> = {
    "0-2 years": 1.1,
    "3-5 years": 0.76,
    "6+ years": 0.42,
    Unknown: 0.55
  };
  const powerMultiplier = state.powersOn === "Yes" ? 1 : state.powersOn === "Intermittent" ? 0.62 : 0.28;
  const screenMultiplier = state.screenCondition === "Cracked or missing" ? 0.55 : state.screenCondition === "Marked" ? 0.85 : 1;
  const batteryMultiplier = state.batteryHealth === "Dead or unknown" ? 0.72 : state.batteryHealth === "Weak" ? 0.86 : 1;
  const storageBonus = state.storageType === "NVMe SSD" ? 35 : state.storageType === "SSD" ? 24 : state.storageType === "HDD" ? -8 : state.storageType === "None / failed" ? -25 : 0;
  const ramBonus = state.ramSize === "32GB+" ? 45 : state.ramSize === "16GB" ? 30 : state.ramSize === "8GB" ? 14 : state.ramSize === "4GB or less" ? -15 : 0;
  const perDevice = Math.max(0, (baseByType[state.deviceType] * conditionMultiplier[state.condition] * ageMultiplier[state.age] * powerMultiplier * screenMultiplier * batteryMultiplier) + storageBonus + ramBonus);
  const low = roundToFive(perDevice * 0.74 * quantity);
  const high = Math.max(low + 10, roundToFive(perDevice * 1.28 * quantity));
  const broken = state.condition === "Broken" || state.deviceType === "Broken device";
  const poorCore = state.powersOn === "No" && state.screenCondition === "Cracked or missing";
  const route: RecommendedRoute = broken && poorCore
    ? "Recycling"
    : broken
      ? "Parts recovery"
      : state.condition === "Fair"
        ? "Repair"
        : state.condition === "Excellent" && state.powersOn === "Yes"
          ? "Reuse"
          : "Refurbish";
  const africaReady = (
    state.powersOn === "Yes" &&
    (state.deviceType === "Laptop" || state.deviceType === "Mini PC") &&
    (state.storageType === "SSD" || state.storageType === "NVMe SSD") &&
    (state.ramSize === "8GB" || state.ramSize === "16GB" || state.ramSize === "32GB+") &&
    state.condition !== "Broken"
  );
  const africaSuitability: Suitability = africaReady ? "High" : state.powersOn !== "No" && route !== "Recycling" ? "Medium" : "Low";
  const co2Kg = Math.round(quantity * (route === "Recycling" ? 8 : route === "Parts recovery" ? 14 : 35));
  const learnerPotential = route === "Reuse" || route === "Refurbish" || route === "Repair" ? Math.max(1, Math.round(quantity)) : Math.max(0, Math.floor(quantity / 3));
  return {
    range: low <= 0 ? "Assessment-led" : `£${low.toLocaleString()} - £${high.toLocaleString()}`,
    route,
    co2Kg,
    devicesDiverted: quantity,
    componentsRecovered: route === "Recycling" ? quantity * 2 : route === "Parts recovery" ? quantity * 4 : quantity,
    learnerPotential,
    africaSuitability,
    organisationAssessment: quantity > 5
  };
}

export function TradeInExperience() {
  const [estimator, setEstimator] = useState<EstimatorState>(initialEstimator);
  const result = useMemo(() => estimateTradeIn(estimator), [estimator]);

  function update<Key extends keyof EstimatorState>(key: Key, value: EstimatorState[Key]) {
    setEstimator((current) => ({ ...current, [key]: value }));
  }

  function selectDevice(deviceType: DeviceType) {
    setEstimator((current) => ({
      ...current,
      deviceType,
      quantity: deviceType.includes("Bulk") || deviceType.includes("School") || deviceType.includes("Business") ? Math.max(current.quantity, 10) : current.quantity,
      collectionRoute: deviceType.includes("Business") || deviceType.includes("Bulk") ? "Corporate collection" : current.collectionRoute
    }));
    document.getElementById("trade-in-estimator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="bg-paper">
      <HeroSection />
      <DeviceSelectorSection onSelect={selectDevice} />
      <EstimatorSection state={estimator} result={result} update={update} />
      <DecisionEngineSection />
      <OrganisationSupportSection />
      <CircularImpactSection result={result} />
      <TradeInRoutesSection />
      <ProcessTimelineSection />
      <TrustSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(249,115,22,0.26),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.14),transparent_28%),linear-gradient(135deg,#080808_0%,#151515_58%,#291304_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            Trade-in · Buyback · Circular recovery
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Trade-in and circular technology recovery
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">
            Value retired laptops, desktops, mini PCs and IT equipment before repair, refurbishment, redeployment or responsible recycling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#trade-in-estimator">Start trade-in</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Request organisation assessment</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/78">
                {badge}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase text-flame-100">Circular recovery flow</p>
                <h2 className="mt-2 text-2xl font-semibold">From retired asset to second-life impact</h2>
              </div>
              <span className="rounded-full bg-flame-500/20 px-3 py-1.5 text-xs font-semibold text-flame-50">
                Reuse first
              </span>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-2">
              {publicMetrics.map((metric) => (
                <div key={metric.label} className="border border-white/10 bg-black/18 p-4">
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-flame-100">{metric.label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/55">{metric.detail}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-2">
              {flowStages.map((stage, index) => (
                <div key={stage} className="flex items-center gap-3 border border-white/10 bg-white/[0.06] px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white/82">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function DeviceSelectorSection({ onSelect }: { onSelect: (deviceType: DeviceType) => void }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Device trade-in selector"
            title="Choose the recovery path that best matches your devices."
            description="Start with a device category, then use the estimator to understand value, likely route, impact and Africa redeployment suitability."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {selectorCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{card.title}</h3>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div><dt className="font-semibold text-ink">Best for</dt><dd className="mt-1 text-muted">{card.bestFor}</dd></div>
                  <div><dt className="font-semibold text-ink">Typical quantity</dt><dd className="mt-1 text-muted">{card.quantity}</dd></div>
                  <div><dt className="font-semibold text-ink">Likely outcome</dt><dd className="mt-1 text-muted">{card.outcome}</dd></div>
                </dl>
                <button
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-graphite"
                  onClick={() => onSelect(card.deviceType)}
                >
                  Estimate this device
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function EstimatorSection({
  state,
  result,
  update
}: {
  state: EstimatorState;
  result: ReturnType<typeof estimateTradeIn>;
  update: <Key extends keyof EstimatorState>(key: Key, value: EstimatorState[Key]) => void;
}) {
  return (
    <section id="trade-in-estimator" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Trade-in estimator"
            title="Estimate value, recovery route and circular impact."
            description="This is a guidance estimate only. Final value depends on diagnostics, condition, data handling, parts demand and collection assessment."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SelectField label="Device type" value={state.deviceType} options={selectorCards.map((card) => card.deviceType)} onChange={(value) => update("deviceType", value as DeviceType)} />
            <InputField label="Brand" value={state.brand} placeholder="Dell, HP, Lenovo, Apple..." onChange={(value) => update("brand", value)} />
            <InputField label="Model" value={state.model} placeholder="Latitude 5400, EliteDesk..." onChange={(value) => update("model", value)} />
            <SelectField label="Age" value={state.age} options={["0-2 years", "3-5 years", "6+ years", "Unknown"]} onChange={(value) => update("age", value as EstimatorState["age"])} />
            <SelectField label="Device condition" value={state.condition} options={["Excellent", "Good", "Fair", "Broken"]} onChange={(value) => update("condition", value as DeviceCondition)} />
            <SelectField label="Powers on?" value={state.powersOn} options={["Yes", "Intermittent", "No"]} onChange={(value) => update("powersOn", value as PowerState)} />
            <SelectField label="Screen condition" value={state.screenCondition} options={["Excellent", "Good", "Marked", "Cracked or missing"]} onChange={(value) => update("screenCondition", value as ScreenCondition)} />
            <SelectField label="Battery health" value={state.batteryHealth} options={["Strong", "Usable", "Weak", "Dead or unknown", "Not applicable"]} onChange={(value) => update("batteryHealth", value as BatteryHealth)} />
            <SelectField label="Storage type" value={state.storageType} options={["SSD", "NVMe SSD", "HDD", "None / failed", "Unknown"]} onChange={(value) => update("storageType", value as StorageType)} />
            <SelectField label="RAM size" value={state.ramSize} options={["4GB or less", "8GB", "16GB", "32GB+", "Unknown"]} onChange={(value) => update("ramSize", value as RamSize)} />
            <SelectField label="Data wipe required?" value={state.dataWipeRequired} options={["Yes", "No", "Not sure"]} onChange={(value) => update("dataWipeRequired", value as EstimatorState["dataWipeRequired"])} />
            <InputField label="Quantity" value={String(state.quantity)} type="number" min={1} onChange={(value) => update("quantity", clamp(Number(value) || 1, 1, 1000))} />
            <div className="sm:col-span-2">
              <SelectField label="Collection route" value={state.collectionRoute} options={tradeInRoutes.map((route) => route.title)} onChange={(value) => update("collectionRoute", value as CollectionRoute)} />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <EstimatorResult state={state} result={result} />
        </AnimatedSection>
      </div>
    </section>
  );
}

function EstimatorResult({ state, result }: { state: EstimatorState; result: ReturnType<typeof estimateTradeIn> }) {
  return (
    <aside className="sticky top-28 border border-line bg-paper p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-700">Guidance estimate</p>
      <h3 className="mt-3 text-3xl font-semibold text-ink">{result.range}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">
        Estimated value range for {state.quantity} {state.quantity === 1 ? "device" : "devices"} before diagnostics and assessment.
      </p>
      <div className="mt-6 grid gap-3">
        <ResultCard label="Recommended route" value={result.route} icon={routeIcon(result.route)} />
        <ResultCard label="Circular impact estimate" value={`${result.co2Kg.toLocaleString()}kg CO2 avoided indicator`} icon="leaf" />
        <ResultCard label="Devices diverted" value={`${result.devicesDiverted.toLocaleString()} from landfill route`} icon="recycle" />
        <ResultCard label="Africa redeployment suitability" value={result.africaSuitability} icon="globe" tone={result.africaSuitability === "High" ? "green" : result.africaSuitability === "Medium" ? "orange" : "slate"} />
        <ResultCard label="Learners potentially supported" value={`${result.learnerPotential.toLocaleString()} potential seats`} icon="graduation" />
      </div>
      {result.organisationAssessment ? (
        <div className="mt-5 border border-flame-200 bg-flame-50 p-4 text-sm leading-6 text-flame-900">
          This quantity is best handled as an organisation assessment with collection, asset tagging and ESG evidence planning.
        </div>
      ) : null}
      <p className="mt-5 text-xs leading-5 text-muted">Final value subject to diagnostics and assessment.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="dark">Request assessment</ButtonLink>
        <ButtonLink href="/donate#donation-form" variant="secondary">Donation route</ButtonLink>
      </div>
    </aside>
  );
}

function DecisionEngineSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair vs reuse engine"
            title="Every device gets a practical next-best route."
            description="The goal is not disposal first. SIT Digital Access considers repair, refurbishment, circular inventory and redeployment before recycling."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {comparisonCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.04}>
              <article className="h-full border border-line bg-white p-6 shadow-card">
                <span className={cn("flex h-12 w-12 items-center justify-center rounded-lg", card.tone)}>
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-ink">{card.title}</h3>
                <div className="mt-5 grid gap-3">
                  {card.bullets.map((item) => (
                    <p key={item} className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <Icon name="check" className="h-4 w-4 text-green-600" />
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrganisationSupportSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Organisation programmes"
            title="School, NGO and business recovery programmes"
            description="Batch recovery can become a structured circular technology programme with secure wipe needs, redeployment decisions and ESG-ready reporting."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="dark">Talk to SIT Digital Access</ButtonLink>
            <ButtonLink href="/device-recycling" variant="secondary">View recycling route</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {organisationFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3 border border-line bg-paper p-4 text-sm font-semibold text-ink">
                <Icon name="check" className="h-4 w-4 text-green-600" />
                {feature}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function CircularImpactSection({ result }: { result: ReturnType<typeof estimateTradeIn> }) {
  const metrics = [
    { label: "Estimated CO2 avoided", value: `${result.co2Kg.toLocaleString()}kg`, icon: "leaf" as IconKey },
    { label: "Devices diverted from landfill", value: result.devicesDiverted.toLocaleString(), icon: "recycle" as IconKey },
    { label: "Devices suitable for reuse", value: result.route === "Reuse" || result.route === "Refurbish" || result.route === "Repair" ? result.devicesDiverted.toLocaleString() : "Assessment-led", icon: "package" as IconKey },
    { label: "Components recovered", value: result.componentsRecovered.toLocaleString(), icon: "cpu" as IconKey },
    { label: "Learners potentially supported", value: result.learnerPotential.toLocaleString(), icon: "graduation" as IconKey }
  ];
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Circular impact reporting"
            title="Recovered technology can become measurable access."
            description="Every recovered device creates another opportunity for learning, work or community access."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.035}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <Icon name={metric.icon} className="h-5 w-5 text-flame-600" />
                <p className="mt-5 text-2xl font-semibold text-ink">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{metric.label}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TradeInRoutesSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Trade-in routes"
            title="Flexible intake for individuals, schools, hubs and organisations."
            description="Choose a route based on quantity, location, data handling needs and whether the devices are ready for reuse, repair or circular recovery."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {tradeInRoutes.map((route, index) => (
            <AnimatedSection key={route.title} delay={index * 0.035}>
              <article className="h-full border border-line bg-paper p-5">
                <Icon name={route.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-lg font-semibold text-ink">{route.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{route.suitable}</p>
                <div className="mt-5 space-y-2 text-xs font-semibold text-muted">
                  <p>{route.turnaround}</p>
                  <p>{route.quantity}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessTimelineSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Process timeline"
            title="From device details to redeployment or payout."
            description="Trade-in work becomes operationally useful when assessment, data handling, valuation and circular decisions are captured as one flow."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 lg:grid-cols-7">
          {processTimeline.map((step, index) => (
            <AnimatedSection key={step} delay={index * 0.04}>
              <article className="h-full border border-line bg-white p-4 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">{step}</h3>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Sustainability and trust</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Secure, auditable and reuse-first by design.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Trade-in is connected to repairs, recycling, inventory, refurbishment, Africa deployment and sustainability reporting.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/device-lifecycle" variant="secondary">View lifecycle</ButtonLink>
                <ButtonLink href="/sustainability" variant="ghost" className="text-white hover:bg-white/10">Sustainability</ButtonLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustCards.map((card) => (
                <article key={card.title} className="border border-white/10 bg-white/[0.06] p-5">
                  <Icon name={card.icon} className="h-5 w-5 text-flame-200" />
                  <h3 className="mt-4 text-base font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border border-line bg-ink p-6 text-white shadow-2xl md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Circular recovery</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">Ready to recover value from unused technology?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Estimate a route, request organisation assessment or talk to SIT Digital Access about trade-in, reuse, refurbishment and recovery workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#trade-in-estimator">Start trade-in</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Request organisation assessment</ButtonLink>
            <ButtonLink href="/contact" variant="ghost" className="text-white hover:bg-white/10">Talk to our operations team</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  value,
  placeholder,
  type = "text",
  min,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  min?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input className={inputClass} min={min} placeholder={placeholder} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({
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
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ResultCard({
  label,
  value,
  icon,
  tone = "orange"
}: {
  label: string;
  value: string;
  icon: IconKey;
  tone?: "orange" | "green" | "slate";
}) {
  return (
    <div className="border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <span className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "slate" ? "bg-slate-100 text-slate-600" : "bg-flame-50 text-flame-700"
        )}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-1 font-semibold text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}

function routeIcon(route: RecommendedRoute): IconKey {
  if (route === "Reuse") return "package";
  if (route === "Repair") return "wrench";
  if (route === "Refurbish") return "settings";
  if (route === "Parts recovery") return "cpu";
  return "recycle";
}
