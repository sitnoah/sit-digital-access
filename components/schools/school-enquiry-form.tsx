"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { submitEnquiry, type EnquiryPayload } from "@/lib/api";
import { labPackages } from "@/lib/school-solutions";
import { cn } from "@/lib/utils";

type FormValues = {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  country: string;
  organisationType: string;
  learnerCount: string;
  classroomCount: string;
  preferredPackage: string;
  deviceRequirement: string;
  trainingRequirement: string;
  powerConnectivityNotes: string;
  timeline: string;
  message: string;
  consent: boolean;
};

const organisationTypes = [
  "School",
  "Training centre",
  "Academy",
  "Vocational institution",
  "NGO learning provider",
  "Community organisation",
  "Government / ministry",
  "Donor / CSR team"
];

const timelines = ["Urgent", "1-3 months", "3-6 months", "Planning stage"];

const initialValues: FormValues = {
  fullName: "",
  organisation: "",
  email: "",
  phone: "",
  country: "",
  organisationType: "",
  learnerCount: "",
  classroomCount: "",
  preferredPackage: "",
  deviceRequirement: "",
  trainingRequirement: "",
  powerConnectivityNotes: "",
  timeline: "",
  message: "",
  consent: false
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function optionalNumber(value: string) {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : undefined;
}

export function SchoolEnquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      if (!values.organisation.trim()) nextErrors.organisation = "Enter the school or centre name.";
      if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email address.";
      if (values.country.trim().length < 2) nextErrors.country = "Enter a country or location.";
      if (!values.organisationType) nextErrors.organisationType = "Choose an organisation type.";
    }

    if (nextStep === 2) {
      const learners = optionalNumber(values.learnerCount);
      const classrooms = optionalNumber(values.classroomCount);
      if (learners !== undefined && (Number.isNaN(learners) || learners < 1)) {
        nextErrors.learnerCount = "Learner count must be at least 1.";
      }
      if (classrooms !== undefined && (Number.isNaN(classrooms) || classrooms < 1)) {
        nextErrors.classroomCount = "Classroom/lab count must be at least 1.";
      }
      if (!values.timeline) nextErrors.timeline = "Choose a timeline.";
      if (values.message.trim().length < 10) {
        nextErrors.message = "Tell us a little more about the school need.";
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

    const learnerCount = optionalNumber(values.learnerCount);
    const classroomCount = optionalNumber(values.classroomCount);
    const payload: EnquiryPayload = {
      fullName: values.fullName.trim(),
      organisation: values.organisation.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      country: values.country.trim(),
      enquiryType: "SCHOOL_ENQUIRY",
      priority: "MEDIUM",
      organisationType: values.organisationType,
      learnerCount,
      classroomCount,
      preferredPackage: values.preferredPackage || undefined,
      deviceRequirement: values.deviceRequirement || undefined,
      trainingRequirement: values.trainingRequirement || undefined,
      powerConnectivityNotes: values.powerConnectivityNotes || undefined,
      timeline: values.timeline,
      message: [
        values.message.trim(),
        values.preferredPackage ? `Preferred package: ${values.preferredPackage}` : "",
        learnerCount ? `Learners: ${learnerCount}` : "",
        classroomCount ? `Classrooms/labs: ${classroomCount}` : "",
        values.deviceRequirement ? `Device requirement: ${values.deviceRequirement}` : "",
        values.trainingRequirement ? `Training requirement: ${values.trainingRequirement}` : "",
        values.powerConnectivityNotes ? `Power/connectivity notes: ${values.powerConnectivityNotes}` : ""
      ]
        .filter(Boolean)
        .join("\n")
    };

    try {
      await submitEnquiry(payload);
      setStatus("success");
      setValues(initialValues);
      setStep(1);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="school-enquiry" className="scroll-mt-32 bg-ink px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <AnimatedSection>
          <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-soft backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
              School enquiry
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Plan a school lab or learner device route.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Share your learner numbers, classrooms, package preference, device needs and
              power/connectivity context. We&apos;ll help shape a practical route.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Needs and timetable review",
                "Lab/package recommendation",
                "Device preparation and setup",
                "Training, handover and support planning"
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

        <AnimatedSection delay={0.06}>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 text-white shadow-soft backdrop-blur sm:p-6"
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
                      : "border-white/15 bg-white/5 text-white/62"
                  )}
                  aria-current={step === item ? "step" : undefined}
                >
                  Step {item}
                </button>
              ))}
            </div>

            {status === "success" ? (
              <div className="mt-6 rounded-2xl border border-green-300/30 bg-green-400/10 p-5 text-green-100">
                <p className="font-semibold">School enquiry sent.</p>
                <p className="mt-2 text-sm opacity-80">
                  We&apos;ll review the school context and come back with a practical next step.
                </p>
              </div>
            ) : null}

            {status === "error" ? (
              <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-400/10 p-5 text-red-100">
                <p className="font-semibold">Could not send enquiry.</p>
                <p className="mt-2 text-sm opacity-80">{errorMessage}</p>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" error={errors.fullName}>
                    <input value={values.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={inputClass} placeholder="Your name" />
                  </Field>
                  <Field label="School / Training Centre" error={errors.organisation}>
                    <input value={values.organisation} onChange={(event) => updateField("organisation", event.target.value)} className={inputClass} placeholder="School or centre name" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" error={errors.email}>
                    <input type="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} placeholder="you@example.com" />
                  </Field>
                  <Field label="Phone">
                    <input value={values.phone} onChange={(event) => updateField("phone", event.target.value)} className={inputClass} placeholder="Optional" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Country / location" error={errors.country}>
                    <input value={values.country} onChange={(event) => updateField("country", event.target.value)} className={inputClass} placeholder="UK, Ghana, Liberia..." />
                  </Field>
                  <Field label="Organisation type" error={errors.organisationType}>
                    <select value={values.organisationType} onChange={(event) => updateField("organisationType", event.target.value)} className={inputClass}>
                      <option value="">Select type</option>
                      {organisationTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <button type="button" onClick={goNext} className="inline-flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-6 text-sm font-semibold text-white transition hover:bg-flame-600">
                  Continue
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Number of learners" error={errors.learnerCount}>
                    <input type="number" min={1} value={values.learnerCount} onChange={(event) => updateField("learnerCount", event.target.value)} className={inputClass} placeholder="Example: 120" />
                  </Field>
                  <Field label="Number of classrooms/labs" error={errors.classroomCount}>
                    <input type="number" min={1} value={values.classroomCount} onChange={(event) => updateField("classroomCount", event.target.value)} className={inputClass} placeholder="Example: 2" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Preferred package">
                    <select value={values.preferredPackage} onChange={(event) => updateField("preferredPackage", event.target.value)} className={inputClass}>
                      <option value="">Select package</option>
                      {labPackages.map((pkg) => (
                        <option key={pkg.title}>{pkg.title}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Timeline" error={errors.timeline}>
                    <select value={values.timeline} onChange={(event) => updateField("timeline", event.target.value)} className={inputClass}>
                      <option value="">Select timeline</option>
                      {timelines.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Device requirement">
                    <input value={values.deviceRequirement} onChange={(event) => updateField("deviceRequirement", event.target.value)} className={inputClass} placeholder="Laptops, mini PCs, lab bundle..." />
                  </Field>
                  <Field label="Training requirement">
                    <input value={values.trainingRequirement} onChange={(event) => updateField("trainingRequirement", event.target.value)} className={inputClass} placeholder="Digital skills, coding, AI literacy..." />
                  </Field>
                </div>
                <Field label="Power/connectivity notes">
                  <input value={values.powerConnectivityNotes} onChange={(event) => updateField("powerConnectivityNotes", event.target.value)} className={inputClass} placeholder="Power, Wi-Fi, generator, offline needs..." />
                </Field>
                <Field label="Message" error={errors.message}>
                  <textarea value={values.message} onChange={(event) => updateField("message", event.target.value)} className={cn(inputClass, "min-h-32 resize-y py-3")} placeholder="Tell us about the school, courses, learners, timetable demand and support needs." />
                </Field>
                <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <input type="checkbox" checked={values.consent} onChange={(event) => updateField("consent", event.target.checked)} className="mt-1 h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-400" />
                  <span>
                    I agree to be contacted about this school enquiry.
                    {errors.consent ? <span className="mt-1 block text-flame-500">{errors.consent}</span> : null}
                  </span>
                </label>
                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                  <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-flame-300">
                    Back
                  </button>
                  <button type="submit" disabled={status === "loading"} className="inline-flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-6 text-sm font-semibold text-white transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-60">
                    {status === "loading" ? "Sending..." : "Send school enquiry"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-1 block text-xs font-semibold text-flame-500">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none transition placeholder:text-white/38 focus:border-flame-300 focus:ring-4 focus:ring-flame-100";
