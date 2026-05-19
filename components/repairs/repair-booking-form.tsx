"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { repairApi } from "@/lib/repair-api";
import {
  bulkRepairFeatures,
  repairCategoryCards,
  repairPricingBands,
  repairRouteCards,
  repairTrustCards,
  repairWorkflowSteps
} from "@/lib/repair-content";
import { cn } from "@/lib/utils";
import type {
  PreferredContactMethod,
  PurchasedFromSit,
  RepairBookingPayload,
  RepairBookingResponse,
  RepairRoute,
  RepairUrgency
} from "@/types/repair";

type RepairFormValues = {
  customerName: string;
  email: string;
  phone: string;
  organisation: string;
  location: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  warrantyReference: string;
  purchasedFromSit: PurchasedFromSit;
  repairCategory: string;
  issueDescription: string;
  issueStartedAt: string;
  damagedOrDropped: "YES" | "NO" | "NOT_SURE";
  dataRecoveryNeeded: "YES" | "NO" | "NOT_SURE";
  powersOn: "YES" | "NO" | "NOT_SURE";
  urgency: RepairUrgency;
  repairRoute: RepairRoute;
  preferredContactMethod: PreferredContactMethod;
  dataHandlingConsent: boolean;
  diagnosticAcknowledgement: boolean;
};

type SubmitState =
  | { status: "idle"; message: "" }
  | { status: "submitting"; message: "" }
  | { status: "success"; message: string; response: RepairBookingResponse }
  | { status: "error"; message: string };

type StepConfig = {
  title: string;
  detail: string;
  icon: IconKey;
};

const formSteps: StepConfig[] = [
  { title: "Contact details", detail: "Who should receive updates.", icon: "mail" },
  { title: "Device details", detail: "Asset, warranty and model context.", icon: "laptop" },
  { title: "Issue details", detail: "Symptoms, risk and urgency.", icon: "search" },
  { title: "Route and consent", detail: "Handover path and approvals.", icon: "shield" }
];

const initialValues: RepairFormValues = {
  customerName: "",
  email: "",
  phone: "",
  organisation: "",
  location: "",
  deviceType: "",
  brand: "",
  model: "",
  serialNumber: "",
  assetTag: "",
  warrantyReference: "",
  purchasedFromSit: "NOT_SURE",
  repairCategory: "",
  issueDescription: "",
  issueStartedAt: "",
  damagedOrDropped: "NOT_SURE",
  dataRecoveryNeeded: "NO",
  powersOn: "NOT_SURE",
  urgency: "STANDARD",
  repairRoute: "DROP_OFF",
  preferredContactMethod: "EMAIL",
  dataHandlingConsent: false,
  diagnosticAcknowledgement: false
};

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

const choiceClass =
  "rounded-lg border border-line bg-white px-4 py-3 text-left text-sm font-semibold text-ink shadow-sm transition hover:border-flame-300 hover:bg-flame-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500";

const routeParamMap: Record<string, RepairRoute> = {
  "repair-desk": "DROP_OFF",
  "partner-handover": "DROP_OFF",
  "drop-off": "DROP_OFF",
  "drop_off": "DROP_OFF",
  "mail-in": "MAIL_IN",
  "mail_in": "MAIL_IN",
  "pickup-request": "PICKUP_REQUEST",
  "pickup_request": "PICKUP_REQUEST",
  "school-lab-batch": "PICKUP_REQUEST",
  "africa-deployment": "PICKUP_REQUEST"
};

function booleanFromChoice(value: "YES" | "NO" | "NOT_SURE") {
  if (value === "YES") return true;
  if (value === "NO") return false;
  return undefined;
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusUrl(response: RepairBookingResponse) {
  return `/repair-status?ticketId=${encodeURIComponent(response.ticketId)}&token=${encodeURIComponent(response.statusToken)}`;
}

function validateStep(step: number, values: RepairFormValues) {
  const errors: string[] = [];

  if (step === 0) {
    if (!values.customerName.trim()) errors.push("Add the customer name.");
    if (!values.email.trim()) errors.push("Add an email address.");
    if (!values.location.trim()) errors.push("Add the repair location.");
  }

  if (step === 1) {
    if (!values.deviceType.trim()) errors.push("Select a device type.");
  }

  if (step === 2) {
    if (!values.repairCategory.trim()) errors.push("Select a repair category.");
    if (values.issueDescription.trim().length < 10) errors.push("Describe the issue in at least 10 characters.");
  }

  if (step === 3) {
    if (!values.repairRoute) errors.push("Choose a repair route.");
    if (!values.preferredContactMethod) errors.push("Choose a preferred contact method.");
    if (!values.dataHandlingConsent) errors.push("Confirm data handling consent.");
    if (!values.diagnosticAcknowledgement) errors.push("Acknowledge diagnostics and quote-first handling.");
  }

  return errors;
}

function buildPayload(values: RepairFormValues): RepairBookingPayload {
  return {
    customerName: values.customerName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || undefined,
    organisation: values.organisation.trim() || undefined,
    location: values.location.trim(),
    deviceType: values.deviceType,
    brand: values.brand.trim() || undefined,
    model: values.model.trim() || undefined,
    serialNumber: values.serialNumber.trim() || undefined,
    assetTag: values.assetTag.trim() || undefined,
    warrantyReference: values.warrantyReference.trim() || undefined,
    purchasedFromSit: values.purchasedFromSit,
    repairCategory: values.repairCategory,
    issueDescription: values.issueDescription.trim(),
    issueStartedAt: values.issueStartedAt || undefined,
    damagedOrDropped: booleanFromChoice(values.damagedOrDropped),
    dataRecoveryNeeded: booleanFromChoice(values.dataRecoveryNeeded),
    powersOn: booleanFromChoice(values.powersOn),
    urgency: values.urgency,
    repairRoute: values.repairRoute,
    preferredContactMethod: values.preferredContactMethod,
    dataHandlingConsent: values.dataHandlingConsent,
    diagnosticAcknowledgement: values.diagnosticAcknowledgement,
    mailIn: values.repairRoute === "MAIL_IN",
    pickupRequested: values.repairRoute === "PICKUP_REQUEST",
    message: values.issueDescription.trim()
  };
}

export function RepairBookingForm({ className }: { className?: string }) {
  const [values, setValues] = useState<RepairFormValues>(initialValues);
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });
  const [copied, setCopied] = useState<string | null>(null);
  const loading = submitState.status === "submitting";

  const selectedRoute = useMemo(
    () => repairRouteCards.find((route) => route.value === values.repairRoute) ?? repairRouteCards[0],
    [values.repairRoute]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get("route")?.trim().toLowerCase();
    if (!routeParam) return;
    const repairRoute = routeParamMap[routeParam];
    if (!repairRoute) return;
    setValues((current) => ({ ...current, repairRoute }));
  }, []);

  function updateValue<Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (submitState.status === "error") setSubmitState({ status: "idle", message: "" });
  }

  function goToNextStep() {
    const errors = validateStep(step, values);
    if (errors.length > 0) {
      setSubmitState({ status: "error", message: errors[0] });
      return;
    }
    setSubmitState({ status: "idle", message: "" });
    setStep((current) => Math.min(formSteps.length - 1, current + 1));
  }

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (let index = 0; index < formSteps.length; index += 1) {
      const errors = validateStep(index, values);
      if (errors.length > 0) {
        setStep(index);
        setSubmitState({ status: "error", message: errors[0] });
        return;
      }
    }

    setSubmitState({ status: "submitting", message: "" });
    try {
      const response = await repairApi.bookRepair(buildPayload(values));
      setSubmitState({
        status: "success",
        message: "Repair booking received. Keep the ticket ID and status token for customer-safe tracking.",
        response
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to submit the repair booking."
      });
    }
  }

  return (
    <div className={cn("bg-white", className)}>
      <RepairHero />
      <RepairCategorySelector
        selectedCategory={values.repairCategory}
        onSelect={(category) => updateValue("repairCategory", category)}
      />

      <section id="repair-intake" className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Repair intake"
              title="One tracked booking starts diagnostics, estimates and repair operations."
              description="The form creates a real repair ticket with public-safe status tracking, internal diagnostics context and a route for drop-off, mail-in or pickup support."
            />
            <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                  <Icon name={selectedRoute.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{selectedRoute.title}</p>
                  <p className="text-xs leading-5 text-muted">{selectedRoute.bestFor}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                {["Tracked ticket", "Diagnostic notes", "Status token", "Quote before paid work"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-muted">
                    <Icon name="check" className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            {submitState.status === "success" ? (
              <RepairSuccessPanel
                response={submitState.response}
                message={submitState.message}
                copied={copied}
                onCopy={copyValue}
                email={values.email}
              />
            ) : (
              <RepairIntakeForm
                values={values}
                step={step}
                loading={loading}
                submitState={submitState}
                onStepChange={setStep}
                onUpdate={updateValue}
                onNext={goToNextStep}
                onSubmit={handleSubmit}
              />
            )}
          </AnimatedSection>
        </div>
      </section>

      <RepairPricingPreview />
      <RepairWorkflowTimeline />
      <BulkRepairSupportSection />
      <RepairTrustSection />
    </div>
  );
}

function RepairHero() {
  const pipeline = ["New", "Triage", "Diagnostics", "Estimate", "Repair", "Quality Check", "Ready"];

  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            REPAIRS · DIAGNOSTICS · UPGRADES · RECOVERY
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Book diagnostics, upgrades or recovery support for your device.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
            Submit a tracked repair ticket for laptops, desktops, mini PCs, school lab devices and refurbished equipment. SIT Digital Access helps triage issues, plan repairs, manage upgrades and keep devices useful for learning, work and community access.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#repair-intake">Book a Repair</ButtonLink>
            <ButtonLink href="/repair-status" variant="secondary">Check Repair Status</ButtonLink>
            <ButtonLink href="/repair-pricing" variant="ghost" className="text-white hover:bg-white/10">View Pricing Guide</ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["Diagnostics first", "Upgrade-ready", "Data-aware handling", "School lab support", "Warranty tracking"].map((item) => (
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
                <p className="text-xs font-semibold uppercase text-flame-100">Repair operations</p>
                <h2 className="mt-2 text-2xl font-semibold">Live intake dashboard</h2>
              </div>
              <span className="rounded-full bg-green-400/15 px-3 py-1.5 text-xs font-semibold text-green-100">
                Tracked ticket
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {pipeline.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-white/[0.08] px-4 py-3">
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", index < 3 ? "bg-flame-500 text-white" : "bg-white/10 text-white/70")}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className={cn("h-full rounded-full", index < 3 ? "w-2/3 bg-flame-400" : "w-1/4 bg-white/20")} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white/[0.08] p-4">
                <p className="text-xs font-semibold uppercase text-white/50">Device health</p>
                <p className="mt-2 text-xl font-semibold">SSD upgrade · battery check</p>
                <p className="mt-2 text-sm text-white/60">School lab critical · data recovery not requested</p>
              </div>
              <div className="rounded-lg bg-white/[0.08] p-4">
                <p className="text-xs font-semibold uppercase text-white/50">Technician</p>
                <p className="mt-2 text-xl font-semibold">Unassigned</p>
                <p className="mt-2 text-sm text-white/60">Queued for diagnostics and SLA review</p>
              </div>
              <div className="rounded-lg bg-white/[0.08] p-4">
                <p className="text-xs font-semibold uppercase text-white/50">Warranty/reference</p>
                <p className="mt-2 text-xl font-semibold">Validated at triage</p>
                <p className="mt-2 text-sm text-white/60">Order, asset tag or refurbished support note</p>
              </div>
              <div className="rounded-lg bg-flame-500/20 p-4">
                <p className="text-xs font-semibold uppercase text-flame-100">Security</p>
                <p className="mt-2 text-xl font-semibold">Status token</p>
                <p className="mt-2 text-sm text-flame-50/80">Tracked ticket · Diagnostic notes · Public-safe status</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function RepairCategorySelector({
  selectedCategory,
  onSelect
}: {
  selectedCategory: string;
  onSelect: (category: string) => void;
}) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair categories"
            title="What do you need help with?"
            description="Choose a category to prefill the booking flow. The operations team can still adjust the final repair path after diagnostics."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairCategoryCards.map((category, index) => {
            const selected = selectedCategory === category.value;
            return (
              <motion.button
                key={category.value}
                type="button"
                onClick={() => onSelect(category.value)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.025 }}
                className={cn(
                  "rounded-lg border p-5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500",
                  selected ? "border-flame-400 bg-flame-50 shadow-card" : "border-line bg-white hover:border-flame-200 hover:bg-paper"
                )}
              >
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", selected ? "bg-flame-500 text-white" : "bg-paper text-flame-600")}>
                  <Icon name={category.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{category.title}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted">{category.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">{category.turnaround}</span>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{category.priceLabel}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RepairIntakeForm({
  values,
  step,
  loading,
  submitState,
  onStepChange,
  onUpdate,
  onNext,
  onSubmit
}: {
  values: RepairFormValues;
  step: number;
  loading: boolean;
  submitState: SubmitState;
  onStepChange: (step: number) => void;
  onUpdate: <Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) => void;
  onNext: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-7" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-4">
        {formSteps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onStepChange(index)}
            className={cn(
              "rounded-lg border px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500",
              index === step ? "border-flame-300 bg-flame-50" : "border-line bg-paper hover:border-flame-200"
            )}
          >
            <span className="flex items-center gap-2 text-xs font-semibold uppercase text-muted">
              <Icon name={item.icon} className="h-4 w-4" />
              Step {index + 1}
            </span>
            <span className="mt-2 block text-sm font-semibold text-ink">{item.title}</span>
            <span className="mt-1 block text-xs leading-5 text-muted">{item.detail}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-7"
      >
        {step === 0 ? <ContactStep values={values} onUpdate={onUpdate} /> : null}
        {step === 1 ? <DeviceStep values={values} onUpdate={onUpdate} /> : null}
        {step === 2 ? <IssueStep values={values} onUpdate={onUpdate} /> : null}
        {step === 3 ? <RouteConsentStep values={values} onUpdate={onUpdate} /> : null}
      </motion.div>

      {submitState.status === "error" ? (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitState.message}</p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onStepChange(Math.max(0, step - 1))}
          disabled={step === 0 || loading}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-ink transition hover:border-flame-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        {step < formSteps.length - 1 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-graphite disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted"
          >
            <Icon name="wrench" className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit repair booking"}
          </button>
        )}
      </div>
    </form>
  );
}

function ContactStep({
  values,
  onUpdate
}: {
  values: RepairFormValues;
  onUpdate: <Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink">Contact details</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Use the person or organisation contact that should receive repair updates.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={values.customerName} onChange={(value) => onUpdate("customerName", value)} placeholder="Your name" required />
        <TextField label="Email" type="email" value={values.email} onChange={(value) => onUpdate("email", value)} placeholder="name@example.com" required />
        <TextField label="Phone" type="tel" value={values.phone} onChange={(value) => onUpdate("phone", value)} placeholder="+44 ..." />
        <TextField label="Organisation / school / company" value={values.organisation} onChange={(value) => onUpdate("organisation", value)} placeholder="Optional organisation" />
        <div className="sm:col-span-2">
          <TextField label="Location" value={values.location} onChange={(value) => onUpdate("location", value)} placeholder="Town, city, school, office or pickup location" required />
        </div>
      </div>
    </div>
  );
}

function DeviceStep({
  values,
  onUpdate
}: {
  values: RepairFormValues;
  onUpdate: <Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink">Device details</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Model, serial and asset details make diagnostics faster and help with warranty/reference checks.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SelectField label="Device type" value={values.deviceType} onChange={(value) => onUpdate("deviceType", value)} required>
          <option value="">Select device type</option>
          {["Laptop", "Desktop PC", "Mini PC", "All-in-one PC", "Monitor", "Accessory", "School lab bundle"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectField>
        <SelectField
          label="Purchased from SIT Digital Access?"
          value={values.purchasedFromSit}
          onChange={(value) => onUpdate("purchasedFromSit", value as PurchasedFromSit)}
        >
          <option value="YES">Yes</option>
          <option value="NO">No</option>
          <option value="NOT_SURE">Not sure</option>
        </SelectField>
        <TextField label="Brand" value={values.brand} onChange={(value) => onUpdate("brand", value)} placeholder="Dell, HP, Lenovo..." />
        <TextField label="Model" value={values.model} onChange={(value) => onUpdate("model", value)} placeholder="Latitude 5400, ThinkCentre..." />
        <TextField label="Serial number" value={values.serialNumber} onChange={(value) => onUpdate("serialNumber", value)} placeholder="Optional serial number" />
        <TextField label="Asset tag" value={values.assetTag} onChange={(value) => onUpdate("assetTag", value)} placeholder="School, lab or organisation asset tag" />
        <div className="sm:col-span-2">
          <TextField label="Warranty reference" value={values.warrantyReference} onChange={(value) => onUpdate("warrantyReference", value)} placeholder="Warranty, order or refurbished device reference" />
        </div>
      </div>
    </div>
  );
}

function IssueStep({
  values,
  onUpdate
}: {
  values: RepairFormValues;
  onUpdate: <Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink">Issue details</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Capture symptoms, timing, risk and whether the device is critical for learning or operations.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SelectField label="Repair category" value={values.repairCategory} onChange={(value) => onUpdate("repairCategory", value)} required>
          <option value="">Select repair category</option>
          {repairCategoryCards.map((category) => (
            <option key={category.value} value={category.value}>{category.title}</option>
          ))}
        </SelectField>
        <TextField label="When did the issue start?" type="date" value={values.issueStartedAt} onChange={(value) => onUpdate("issueStartedAt", value)} />
        <ChoiceGroup
          label="Has the device been dropped or damaged?"
          value={values.damagedOrDropped}
          choices={[
            ["NO", "No"],
            ["YES", "Yes"],
            ["NOT_SURE", "Not sure"]
          ]}
          onChange={(value) => onUpdate("damagedOrDropped", value)}
        />
        <ChoiceGroup
          label="Is data recovery needed?"
          value={values.dataRecoveryNeeded}
          choices={[
            ["NO", "No"],
            ["YES", "Yes"],
            ["NOT_SURE", "Not sure"]
          ]}
          onChange={(value) => onUpdate("dataRecoveryNeeded", value)}
        />
        <ChoiceGroup
          label="Is the device powering on?"
          value={values.powersOn}
          choices={[
            ["YES", "Yes"],
            ["NO", "No"],
            ["NOT_SURE", "Not sure"]
          ]}
          onChange={(value) => onUpdate("powersOn", value)}
        />
        <ChoiceGroup
          label="Urgency"
          value={values.urgency}
          choices={[
            ["STANDARD", "Standard"],
            ["URGENT", "Urgent"],
            ["SCHOOL_LAB_CRITICAL", "School/lab critical"]
          ]}
          onChange={(value) => onUpdate("urgency", value)}
        />
        <label className="sm:col-span-2 text-sm font-medium text-ink">
          Issue description
          <textarea
            className={cn(inputClass, "min-h-36 resize-y")}
            value={values.issueDescription}
            onChange={(event) => onUpdate("issueDescription", event.target.value)}
            placeholder="Describe symptoms, recent changes, urgency, data recovery needs or accessibility requirements."
            required
            minLength={10}
          />
        </label>
      </div>
    </div>
  );
}

function RouteConsentStep({
  values,
  onUpdate
}: {
  values: RepairFormValues;
  onUpdate: <Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink">Route and consent</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Choose the repair path and confirm the permissions needed to triage the device.</p>
      <RepairRouteSelector selectedRoute={values.repairRoute} onSelect={(route) => onUpdate("repairRoute", route)} />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Preferred contact method"
          value={values.preferredContactMethod}
          onChange={(value) => onUpdate("preferredContactMethod", value as PreferredContactMethod)}
        >
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
          <option value="WHATSAPP">WhatsApp</option>
        </SelectField>
        <div className="rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-muted">
          <p className="font-semibold text-ink">Diagnostic fee acknowledgement</p>
          <p className="mt-1">Final pricing depends on parts, device condition, urgency and warranty/support coverage.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <CheckboxField
          checked={values.dataHandlingConsent}
          onChange={(checked) => onUpdate("dataHandlingConsent", checked)}
          label="I consent to data-aware diagnostics and understand SIT Digital Access will avoid exposing customer data in public status updates."
        />
        <CheckboxField
          checked={values.diagnosticAcknowledgement}
          onChange={(checked) => onUpdate("diagnosticAcknowledgement", checked)}
          label="I understand diagnostics, warranty validation and estimates happen before paid repair work is approved."
        />
      </div>
    </div>
  );
}

function RepairRouteSelector({
  selectedRoute,
  onSelect
}: {
  selectedRoute: RepairRoute;
  onSelect: (route: RepairRoute) => void;
}) {
  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      {repairRouteCards.map((route) => {
        const selected = selectedRoute === route.value;
        return (
          <button
            key={route.value}
            type="button"
            disabled={!route.available}
            onClick={() => onSelect(route.value)}
            className={cn(
              "rounded-lg border p-4 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500 disabled:cursor-not-allowed disabled:opacity-55",
              selected ? "border-flame-400 bg-flame-50" : "border-line bg-white hover:border-flame-200"
            )}
          >
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", selected ? "bg-flame-500 text-white" : "bg-paper text-flame-600")}>
              <Icon name={route.icon} className="h-5 w-5" />
            </span>
            <span className="mt-4 block font-semibold text-ink">{route.title}</span>
            <span className="mt-2 block text-sm leading-6 text-muted">{route.bestFor}</span>
            <span className="mt-3 block rounded-lg bg-white px-3 py-2 text-xs font-semibold text-muted shadow-sm">{route.requirements}</span>
          </button>
        );
      })}
    </div>
  );
}

function RepairSuccessPanel({
  response,
  message,
  copied,
  onCopy,
  email
}: {
  response: RepairBookingResponse;
  message: string;
  copied: string | null;
  onCopy: (value: string, label: string) => void;
  email?: string;
}) {
  const link = statusUrl(response);
  const details = `Repair ticket ID: ${response.ticketId}\nStatus token: ${response.statusToken}\nStatus link: ${link}`;
  const mailto = `mailto:${encodeURIComponent(email ?? "")}?subject=${encodeURIComponent("SIT Digital Access repair booking details")}&body=${encodeURIComponent(details)}`;

  return (
    <div className="rounded-lg border border-green-200 bg-white p-6 shadow-soft sm:p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
        <Icon name="check" className="h-6 w-6" />
      </span>
      <p className="mt-5 text-sm font-semibold uppercase text-green-700">Repair booking created</p>
      <h2 className="mt-2 text-3xl font-semibold text-ink">Save these tracking details.</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{message}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CopyCard label="Ticket ID" value={response.ticketId} copied={copied === "ticket"} onCopy={() => onCopy(response.ticketId, "ticket")} />
        <CopyCard label="Status token" value={response.statusToken} copied={copied === "token"} onCopy={() => onCopy(response.statusToken, "token")} />
        <div className="rounded-lg border border-line bg-paper p-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase text-muted">Initial status</p>
          <p className="mt-2 text-lg font-semibold text-ink">{formatStatus(response.status)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={link}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600"
        >
          Check repair status
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <a
          href={mailto}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-flame-300"
        >
          Email these details
          <Icon name="mail" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function CopyCard({
  label,
  value,
  copied,
  onCopy
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-2 break-all text-lg font-semibold text-ink">{value}</p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:bg-graphite"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function RepairPricingPreview() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Pricing guide"
            title="Transparent repair paths before work begins."
            description="Final pricing depends on parts, device condition, urgency and whether the device is covered by warranty or support."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairPricingBands.map((item, index) => (
            <AnimatedSection key={item.category} delay={index * 0.03}>
              <article className="h-full rounded-lg border border-line bg-paper p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-flame-600">{item.range}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{item.category}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairWorkflowTimeline() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair workflow"
            title="From booking to quality check, every stage is trackable."
            description="The public token exposes safe progress, while the admin queue can hold diagnostics, estimates, technician work and audit history."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairWorkflowSteps.map((item, index) => (
            <AnimatedSection key={item} delay={index * 0.025}>
              <div className="h-full rounded-lg border border-line bg-white p-5 shadow-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {index === 4 ? "Paid work waits for approval before the repair queue moves forward." : "This stage keeps the ticket aligned with diagnostics, customer updates and return planning."}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function BulkRepairSupportSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase text-flame-200">Schools, labs and organisations</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">Repair support for shared devices and bulk intake.</h2>
          <p className="mt-5 text-base leading-7 text-white/70">
            Book support for lab devices, learner laptops, donated equipment, SME teams and community hubs that need repair reporting, pickup planning and spare pool recommendations.
          </p>
          <div className="mt-8">
            <ButtonLink href="#repair-intake">Book bulk repair support</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {bulkRepairFeatures.map((feature) => (
              <div key={feature} className="rounded-lg border border-white/10 bg-white/[0.07] p-4 text-sm font-semibold text-white/80">
                <Icon name="check" className="mb-3 h-4 w-4 text-green-300" />
                {feature}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function RepairTrustSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Data security and trust"
            title="Repair handling with data awareness and accountability."
            description="Repair intake captures the consent, references and audit-friendly context needed for schools, organisations, refurbished devices and community deployments."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairTrustCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="h-full rounded-lg border border-line bg-paper p-5">
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

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        {children}
      </select>
    </label>
  );
}

function ChoiceGroup<Value extends string>({
  label,
  value,
  choices,
  onChange
}: {
  label: string;
  value: Value;
  choices: Array<[Value, string]>;
  onChange: (value: Value) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {choices.map(([choiceValue, choiceLabel]) => (
          <button
            key={choiceValue}
            type="button"
            onClick={() => onChange(choiceValue)}
            className={cn(choiceClass, value === choiceValue && "border-flame-400 bg-flame-50 text-flame-700")}
          >
            {choiceLabel}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxField({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-paper p-4 text-sm leading-6 text-muted">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-200"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
