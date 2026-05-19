"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import {
  deviceConditionOptions,
  donationFormSteps,
  donationNextSteps,
  donationTypeOptions,
  donorTypeOptions
} from "@/lib/donation-options";
import { publicApi, type DonationPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { DonationTypeValue, DonorTypeValue } from "@/types/donation";

type DonationFormValues = {
  donorName: string;
  organisation: string;
  email: string;
  phone: string;
  donorType: DonorTypeValue;
  donationType: DonationTypeValue | "";
  deviceCount: string;
  sponsorshipAmount: string;
  deviceCondition: string;
  pickupLocation: string;
  country: string;
  preferredTimeline: string;
  message: string;
};

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const initialValues: DonationFormValues = {
  donorName: "",
  organisation: "",
  email: "",
  phone: "",
  donorType: "INDIVIDUAL",
  donationType: "",
  deviceCount: "",
  sponsorshipAmount: "",
  deviceCondition: "",
  pickupLocation: "",
  country: "",
  preferredTimeline: "",
  message: ""
};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-flame-300 focus:ring-4 focus:ring-flame-500/15";

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : undefined;
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function DonationForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<DonationFormValues>(initialValues);
  const [errors, setErrors] = useState<string[]>([]);
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });

  const selectedDonationLabel = useMemo(
    () => donationTypeOptions.find((option) => option.value === values.donationType)?.label,
    [values.donationType]
  );

  const isLoading = formState.status === "loading";

  function updateValue<K extends keyof DonationFormValues>(key: K, value: DonationFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors([]);
    if (formState.status !== "idle") {
      setFormState({ status: "idle", message: "" });
    }
  }

  function validateStep(targetStep: number): string[] {
    const nextErrors: string[] = [];

    if (targetStep === 0) {
      if (values.donorName.trim().length < 2) nextErrors.push("Name is required.");
      if (!isValidEmail(values.email)) nextErrors.push("A valid email address is required.");
      if (!values.donorType) nextErrors.push("Choose a donor type.");
    }

    if (targetStep === 1 && !values.donationType) {
      nextErrors.push("Choose a donation or sponsorship type.");
    }

    if (targetStep === 2) {
      const deviceCount = optionalNumber(values.deviceCount);
      const sponsorshipAmount = optionalNumber(values.sponsorshipAmount);
      if (deviceCount !== undefined && (Number.isNaN(deviceCount) || deviceCount < 0)) {
        nextErrors.push("Number of devices must be zero or more.");
      }
      if (sponsorshipAmount !== undefined && (Number.isNaN(sponsorshipAmount) || sponsorshipAmount < 0)) {
        nextErrors.push("Sponsorship amount must be zero or more.");
      }
    }

    if (targetStep === 3 && values.country.trim().length < 2) {
      nextErrors.push("Country or location is required.");
    }

    return nextErrors;
  }

  function goNext() {
    const nextErrors = validateStep(step);
    setErrors(nextErrors);
    if (nextErrors.length === 0) {
      setStep((current) => Math.min(current + 1, donationFormSteps.length - 1));
    }
  }

  function goBack() {
    setErrors([]);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const allErrors: string[] = [];
    let firstInvalidStep = step;
    donationFormSteps.forEach((_, index) => {
      const stepErrors = validateStep(index);
      if (stepErrors.length > 0 && allErrors.length === 0) {
        firstInvalidStep = index;
      }
      allErrors.push(...stepErrors);
    });
    setErrors(allErrors);
    if (allErrors.length > 0) {
      setStep(firstInvalidStep);
      return;
    }

    setFormState({ status: "loading", message: "" });

    const payload: DonationPayload = {
      donorName: values.donorName.trim(),
      organisation: optionalString(values.organisation),
      donorType: values.donorType,
      email: values.email.trim(),
      phone: optionalString(values.phone),
      country: values.country.trim(),
      donationType: values.donationType as DonationTypeValue,
      deviceCount: optionalNumber(values.deviceCount),
      deviceCondition: optionalString(values.deviceCondition),
      pickupLocation: optionalString(values.pickupLocation),
      sponsorshipAmount: optionalNumber(values.sponsorshipAmount),
      preferredTimeline: optionalString(values.preferredTimeline),
      message: optionalString(values.message)
    };

    try {
      await publicApi.createDonation(payload);
      setValues(initialValues);
      setStep(0);
      setFormState({
        status: "success",
        message: "Thanks. Your donation or sponsorship enquiry has been submitted."
      });
    } catch (error) {
      setFormState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again or contact the team."
      });
    }
  }

  return (
    <section id="donation-form" className="scroll-mt-36 bg-[#0a0a0a] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
            Donation enquiry
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Start your donation or sponsorship enquiry.
          </h2>
          <p className="mt-5 text-base leading-8 text-white/68">
            Share your device donation, sponsorship or corporate recycling plan. We will review the
            details and help shape a practical next step.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.055] p-5">
            <h3 className="text-lg font-semibold text-white">What happens next?</h3>
            <div className="mt-5 grid gap-3">
              {donationNextSteps.map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:p-6 lg:p-8"
        >
          <div className="grid gap-2 sm:grid-cols-2 xl:flex" aria-label="Donation form progress">
            {donationFormSteps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (index <= step) setStep(index);
                }}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
                  index === step
                    ? "border-flame-400 bg-flame-500 text-white"
                    : index < step
                      ? "border-white/16 bg-white/10 text-white/78"
                      : "border-white/10 bg-white/[0.04] text-white/40"
                )}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {step === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-white">
                  Name
                  <input
                    className={inputClass}
                    value={values.donorName}
                    onChange={(event) => updateValue("donorName", event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  Organisation
                  <input
                    className={inputClass}
                    value={values.organisation}
                    onChange={(event) => updateValue("organisation", event.target.value)}
                    placeholder="Company, school, NGO or foundation"
                    autoComplete="organization"
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  Email
                  <input
                    className={inputClass}
                    type="email"
                    value={values.email}
                    onChange={(event) => updateValue("email", event.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  Phone
                  <input
                    className={inputClass}
                    type="tel"
                    value={values.phone}
                    onChange={(event) => updateValue("phone", event.target.value)}
                    placeholder="+44 ..."
                    autoComplete="tel"
                  />
                </label>
                <label className="text-sm font-semibold text-white sm:col-span-2">
                  Donor type
                  <select
                    className={inputClass}
                    value={values.donorType}
                    onChange={(event) => updateValue("donorType", event.target.value as DonorTypeValue)}
                  >
                    {donorTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {donationTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateValue("donationType", option.value)}
                    className={cn(
                      "rounded-2xl border p-4 text-left text-sm font-semibold transition",
                      values.donationType === option.value
                        ? "border-flame-400 bg-flame-500 text-white"
                        : "border-white/10 bg-white/[0.05] text-white/72 hover:border-flame-300/50 hover:text-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-white">
                  Number of devices
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    value={values.deviceCount}
                    onChange={(event) => updateValue("deviceCount", event.target.value)}
                    placeholder="e.g. 12"
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  Sponsorship amount
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    value={values.sponsorshipAmount}
                    onChange={(event) => updateValue("sponsorshipAmount", event.target.value)}
                    placeholder="Optional amount"
                  />
                </label>
                <label className="text-sm font-semibold text-white sm:col-span-2">
                  Device condition
                  <select
                    className={inputClass}
                    value={values.deviceCondition}
                    onChange={(event) => updateValue("deviceCondition", event.target.value)}
                  >
                    <option value="">Select condition</option>
                    {deviceConditionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-white">
                  Pickup location
                  <input
                    className={inputClass}
                    value={values.pickupLocation}
                    onChange={(event) => updateValue("pickupLocation", event.target.value)}
                    placeholder="Town, city or office location"
                  />
                </label>
                <label className="text-sm font-semibold text-white">
                  Country / location
                  <input
                    className={inputClass}
                    value={values.country}
                    onChange={(event) => updateValue("country", event.target.value)}
                    placeholder="UK, Ghana, Liberia..."
                  />
                </label>
                <label className="text-sm font-semibold text-white sm:col-span-2">
                  Preferred timeline
                  <input
                    className={inputClass}
                    value={values.preferredTimeline}
                    onChange={(event) => updateValue("preferredTimeline", event.target.value)}
                    placeholder="e.g. this quarter, next school term, flexible"
                  />
                </label>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
                  <p className="text-sm font-semibold text-white">Selected route</p>
                  <p className="mt-2 text-sm leading-6 text-white/64">
                    {selectedDonationLabel ?? "No donation type selected yet."}
                  </p>
                </div>
                <label className="text-sm font-semibold text-white">
                  Message
                  <textarea
                    className={cn(inputClass, "min-h-36 resize-y")}
                    value={values.message}
                    onChange={(event) => updateValue("message", event.target.value)}
                    placeholder="Share device quantities, collection details, sponsorship goals, learner group or deployment location."
                  />
                </label>
              </div>
            ) : null}
          </div>

          {errors.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}

          {formState.status === "success" ? (
            <p className="mt-5 rounded-2xl border border-green-300/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-100">
              {formState.message}
            </p>
          ) : null}
          {formState.status === "error" ? (
            <p className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              {formState.message}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || isLoading}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white transition hover:border-flame-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {step < donationFormSteps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={isLoading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Submitting..." : "Submit enquiry"}
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
