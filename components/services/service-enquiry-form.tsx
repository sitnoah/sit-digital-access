"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { submitEnquiry, type EnquiryPayload } from "@/lib/api";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

type ServiceEnquiryFormProps = {
  defaultServiceSlug?: string;
  compact?: boolean;
};

type FormValues = {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  serviceSlug: string;
  organisationType: string;
  deploymentRegion: string;
  deviceCount: string;
  timeline: string;
  message: string;
  consent: boolean;
};

const organisationTypes = [
  "School",
  "Training centre",
  "SME",
  "NGO",
  "Company",
  "Donor / CSR team",
  "Government / ministry",
  "Community organisation"
];

const timelines = ["Urgent", "1-3 months", "3-6 months", "Planning stage"];

function initialValues(defaultServiceSlug?: string): FormValues {
  return {
    fullName: "",
    organisation: "",
    email: "",
    phone: "",
    serviceSlug: defaultServiceSlug ?? services[0]?.slug ?? "",
    organisationType: "",
    deploymentRegion: "",
    deviceCount: "",
    timeline: "",
    message: "",
    consent: false
  };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ServiceEnquiryForm({ defaultServiceSlug, compact = false }: ServiceEnquiryFormProps) {
  const [values, setValues] = useState<FormValues>(() => initialValues(defaultServiceSlug));
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedService = useMemo(
    () => services.find((service) => service.slug === values.serviceSlug),
    [values.serviceSlug]
  );

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  function validateStep(nextStep = step) {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};

    if (nextStep === 1) {
      if (!values.fullName.trim()) nextErrors.fullName = "Enter your name.";
      if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email address.";
      if (!values.serviceSlug) nextErrors.serviceSlug = "Choose a service.";
      if (!values.deploymentRegion.trim()) nextErrors.deploymentRegion = "Enter a deployment region.";
    }

    if (nextStep === 2) {
      if (values.deviceCount && Number(values.deviceCount) < 1) {
        nextErrors.deviceCount = "Device count must be at least 1.";
      }
      if (values.message.trim().length < 10) {
        nextErrors.message = "Tell us a little more about what you need.";
      }
      if (!values.consent) nextErrors.consent = "Please confirm we can contact you.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (validateStep(1)) setStep(2);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(2)) return;

    setStatus("loading");
    setErrorMessage("");

    const deviceQuantity = values.deviceCount ? Number(values.deviceCount) : undefined;
    const serviceTitle = selectedService?.title ?? values.serviceSlug;
    const payload: EnquiryPayload = {
      fullName: values.fullName.trim(),
      organisation: values.organisation.trim() || undefined,
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      country: values.deploymentRegion.trim(),
      enquiryType: "SERVICE_ENQUIRY",
      priority: "MEDIUM",
      organisationType: values.organisationType || undefined,
      timeline: values.timeline || undefined,
      serviceSlug: values.serviceSlug,
      deploymentRegion: values.deploymentRegion.trim(),
      deviceQuantity,
      message: [
        `Service of interest: ${serviceTitle}`,
        values.message.trim(),
        values.deviceCount ? `Device count: ${values.deviceCount}` : "",
        values.timeline ? `Timeline: ${values.timeline}` : ""
      ]
        .filter(Boolean)
        .join("\n")
    };

    try {
      await submitEnquiry(payload);
      setStatus("success");
      setValues(initialValues(defaultServiceSlug));
      setStep(1);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  const formCard = (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.07] p-5 text-white shadow-soft backdrop-blur sm:p-6",
        compact && "border-line bg-white text-ink shadow-card"
      )}
    >
      <div className="flex items-center gap-3">
        {[1, 2].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              if (item === 1 || validateStep(1)) setStep(item);
            }}
            className={cn(
              "flex h-10 flex-1 items-center justify-center rounded-full border text-xs font-semibold transition",
              step === item
                ? "border-flame-500 bg-flame-500 text-white"
                : compact
                  ? "border-line bg-paper text-muted"
                  : "border-white/15 bg-white/5 text-white/62"
            )}
            aria-current={step === item ? "step" : undefined}
          >
            Step {item}
          </button>
        ))}
      </div>

      {status === "success" ? (
        <div className={cn("mt-6 rounded-2xl border p-5", compact ? "border-green-200 bg-green-50 text-green-800" : "border-green-300/30 bg-green-400/10 text-green-100")}>
          <p className="font-semibold">Service enquiry sent.</p>
          <p className="mt-2 text-sm opacity-80">
            We&apos;ll review the request and come back with a practical next step.
          </p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className={cn("mt-6 rounded-2xl border p-5", compact ? "border-red-200 bg-red-50 text-red-800" : "border-red-300/30 bg-red-400/10 text-red-100")}>
          <p className="font-semibold">Could not send enquiry.</p>
          <p className="mt-2 text-sm opacity-80">{errorMessage}</p>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.fullName} compact={compact}>
              <input
                value={values.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className={inputClass(compact)}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email" error={errors.email} compact={compact}>
              <input
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={inputClass(compact)}
                placeholder="you@example.com"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organisation" compact={compact}>
              <input
                value={values.organisation}
                onChange={(event) => updateField("organisation", event.target.value)}
                className={inputClass(compact)}
                placeholder="School, company or NGO"
              />
            </Field>
            <Field label="Phone" compact={compact}>
              <input
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className={inputClass(compact)}
                placeholder="Optional"
              />
            </Field>
          </div>
          <Field label="Service of interest" error={errors.serviceSlug} compact={compact}>
            <select
              value={values.serviceSlug}
              onChange={(event) => updateField("serviceSlug", event.target.value)}
              className={inputClass(compact)}
            >
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organisation type" compact={compact}>
              <select
                value={values.organisationType}
                onChange={(event) => updateField("organisationType", event.target.value)}
                className={inputClass(compact)}
              >
                <option value="">Select type</option>
                {organisationTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Deployment region" error={errors.deploymentRegion} compact={compact}>
              <input
                value={values.deploymentRegion}
                onChange={(event) => updateField("deploymentRegion", event.target.value)}
                className={inputClass(compact)}
                placeholder="UK, Liberia, Ghana..."
              />
            </Field>
          </div>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-6 text-sm font-semibold text-white transition hover:bg-flame-600"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Device count" error={errors.deviceCount} compact={compact}>
              <input
                type="number"
                min={1}
                value={values.deviceCount}
                onChange={(event) => updateField("deviceCount", event.target.value)}
                className={inputClass(compact)}
                placeholder="Example: 30"
              />
            </Field>
            <Field label="Timeline" compact={compact}>
              <select
                value={values.timeline}
                onChange={(event) => updateField("timeline", event.target.value)}
                className={inputClass(compact)}
              >
                <option value="">Select timeline</option>
                {timelines.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Message" error={errors.message} compact={compact}>
            <textarea
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              className={cn(inputClass(compact), "min-h-32 resize-y py-3")}
              placeholder="Tell us what service support you need, how many users or devices are involved, and any deployment constraints."
            />
          </Field>
          <label className={cn("flex gap-3 rounded-2xl border p-4 text-sm", compact ? "border-line bg-paper text-muted" : "border-white/10 bg-white/5 text-white/70")}>
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(event) => updateField("consent", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-400"
            />
            <span>
              I agree to be contacted about my service enquiry.
              {errors.consent ? <span className="mt-1 block text-flame-500">{errors.consent}</span> : null}
            </span>
          </label>
          <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold transition",
                compact
                  ? "border-line text-ink hover:border-flame-300"
                  : "border-white/20 text-white hover:border-flame-300"
              )}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-6 text-sm font-semibold text-white transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Request service"}
            </button>
          </div>
        </div>
      )}
    </form>
  );

  if (compact) return formCard;

  return (
    <section id="service-enquiry" className="scroll-mt-32 bg-ink px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <AnimatedSection>
          <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-soft backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
              Service enquiry
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start a service request.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Share the service you need, the deployment region, device count and timeline. We&apos;ll
              help shape the most practical delivery route.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Request review",
                "Service scope and dependencies",
                "Delivery model recommendation",
                "Setup, training or support route"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-white">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.06}>{formCard}</AnimatedSection>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  compact,
  children
}: {
  label: string;
  error?: string;
  compact: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={cn("text-sm font-semibold", compact ? "text-ink" : "text-white")}>{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-1 block text-xs font-semibold text-flame-500">{error}</span> : null}
    </label>
  );
}

function inputClass(compact: boolean) {
  return cn(
    "min-h-12 w-full rounded-2xl border px-4 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100",
    compact
      ? "border-line bg-white text-ink placeholder:text-muted/70"
      : "border-white/10 bg-white/10 text-white placeholder:text-white/38"
  );
}
