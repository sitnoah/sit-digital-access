"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import {
  contactEnquiryTypeOptions,
  contactOrganisationTypeOptions,
  contactTimelineOptions,
  deviceRelatedEnquiryTypes,
  preferredDeviceCategoryOptions
} from "@/lib/contact-options";
import { submitEnquiry, type EnquiryPayload, type EnquiryType } from "@/lib/api";
import { cn } from "@/lib/utils";

type ContactFormValues = {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  enquiryType: EnquiryType;
  organisationType: string;
  country: string;
  deviceQuantity: string;
  preferredDeviceCategory: string;
  timeline: string;
  message: string;
  consent: boolean;
};

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const initialValues: ContactFormValues = {
  fullName: "",
  organisation: "",
  email: "",
  phone: "",
  enquiryType: "CONTACT",
  organisationType: "",
  country: "",
  deviceQuantity: "",
  preferredDeviceCategory: "",
  timeline: "",
  message: "",
  consent: false
};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

function optionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : undefined;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });

  const showDeviceFields = useMemo(
    () => deviceRelatedEnquiryTypes.includes(values.enquiryType) || values.enquiryType === "SPONSORSHIP",
    [values.enquiryType]
  );

  const isLoading = formState.status === "loading";
  const messageLength = values.message.length;

  useEffect(() => {
    const type = searchParams.get("type");
    if (!type) return;

    const validType = contactEnquiryTypeOptions.some((option) => option.value === type);
    if (validType) {
      setValues((current) => ({ ...current, enquiryType: type as EnquiryType }));
    }
  }, [searchParams]);

  function updateValue<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    if (formState.status !== "idle") {
      setFormState({ status: "idle", message: "" });
    }
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    const quantity = optionalNumber(values.deviceQuantity);

    if (values.fullName.trim().length < 2) nextErrors.fullName = "Name is required.";
    if (!isValidEmail(values.email)) nextErrors.email = "A valid email address is required.";
    if (values.country.trim().length < 2) nextErrors.country = "Country or location is required.";
    if (!values.organisationType) nextErrors.organisationType = "Choose an organisation type.";
    if (!values.timeline) nextErrors.timeline = "Choose a timeline.";
    if (values.message.trim().length < 10) nextErrors.message = "Message must be at least 10 characters.";
    if (values.message.length > 2000) nextErrors.message = "Message must be 2,000 characters or fewer.";
    if (quantity !== undefined && (Number.isNaN(quantity) || quantity < 1)) {
      nextErrors.deviceQuantity = "Device quantity must be 1 or more.";
    }
    if (!values.consent) nextErrors.consent = "Please agree to be contacted about your enquiry.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setFormState({ status: "loading", message: "" });

    const payload: EnquiryPayload = {
      fullName: values.fullName.trim(),
      organisation: optionalString(values.organisation),
      email: values.email.trim(),
      phone: optionalString(values.phone),
      country: values.country.trim(),
      enquiryType: values.enquiryType,
      organisationType: values.organisationType,
      deviceQuantity: optionalNumber(values.deviceQuantity),
      preferredDeviceCategory: optionalString(values.preferredDeviceCategory),
      timeline: values.timeline,
      message: values.message.trim(),
      priority: "MEDIUM"
    };

    try {
      await submitEnquiry(payload);
      setValues(initialValues);
      setErrors({});
      setFormState({
        status: "success",
        message: "Thanks. Your enquiry has been submitted and the team will follow up."
      });
    } catch (error) {
      setFormState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your enquiry could not be submitted. Please try again."
      });
    }
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="scroll-mt-36 rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-6 lg:p-8"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
          Enquiry form
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          Start a conversation.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Tell us what you need, where it is needed and what timeline you are working toward.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink">
          Name
          <input
            className={inputClass}
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName ? <span id="fullName-error" className="mt-1 block text-xs font-medium text-red-600">{errors.fullName}</span> : null}
        </label>

        <label className="text-sm font-semibold text-ink">
          Organisation
          <input
            className={inputClass}
            value={values.organisation}
            onChange={(event) => updateValue("organisation", event.target.value)}
            placeholder="School, company, NGO or partner"
            autoComplete="organization"
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          Email
          <input
            className={inputClass}
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? <span id="email-error" className="mt-1 block text-xs font-medium text-red-600">{errors.email}</span> : null}
        </label>

        <label className="text-sm font-semibold text-ink">
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

        <label className="text-sm font-semibold text-ink">
          Enquiry type
          <select
            className={inputClass}
            value={values.enquiryType}
            onChange={(event) => updateValue("enquiryType", event.target.value as EnquiryType)}
          >
            {contactEnquiryTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-ink">
          Organisation type
          <select
            className={inputClass}
            value={values.organisationType}
            onChange={(event) => updateValue("organisationType", event.target.value)}
            aria-describedby={errors.organisationType ? "organisationType-error" : undefined}
          >
            <option value="">Select organisation type</option>
            {contactOrganisationTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.organisationType ? <span id="organisationType-error" className="mt-1 block text-xs font-medium text-red-600">{errors.organisationType}</span> : null}
        </label>

        <label className="text-sm font-semibold text-ink">
          Country / location
          <input
            className={inputClass}
            value={values.country}
            onChange={(event) => updateValue("country", event.target.value)}
            placeholder="UK city, Ghana, Liberia..."
            aria-describedby={errors.country ? "country-error" : undefined}
          />
          {errors.country ? <span id="country-error" className="mt-1 block text-xs font-medium text-red-600">{errors.country}</span> : null}
        </label>

        <label className="text-sm font-semibold text-ink">
          Timeline
          <select
            className={inputClass}
            value={values.timeline}
            onChange={(event) => updateValue("timeline", event.target.value)}
            aria-describedby={errors.timeline ? "timeline-error" : undefined}
          >
            <option value="">Select timeline</option>
            {contactTimelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.timeline ? <span id="timeline-error" className="mt-1 block text-xs font-medium text-red-600">{errors.timeline}</span> : null}
        </label>

        {showDeviceFields ? (
          <>
            <label className="text-sm font-semibold text-ink">
              Device quantity
              <input
                className={inputClass}
                type="number"
                min="1"
                value={values.deviceQuantity}
                onChange={(event) => updateValue("deviceQuantity", event.target.value)}
                placeholder="e.g. 20"
                aria-describedby={errors.deviceQuantity ? "deviceQuantity-error" : undefined}
              />
              {errors.deviceQuantity ? <span id="deviceQuantity-error" className="mt-1 block text-xs font-medium text-red-600">{errors.deviceQuantity}</span> : null}
            </label>

            <label className="text-sm font-semibold text-ink">
              Preferred device category
              <select
                className={inputClass}
                value={values.preferredDeviceCategory}
                onChange={(event) => updateValue("preferredDeviceCategory", event.target.value)}
              >
                <option value="">Select category</option>
                {preferredDeviceCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}

        <label className="text-sm font-semibold text-ink sm:col-span-2">
          Message
          <textarea
            className={cn(inputClass, "min-h-36 resize-y")}
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            placeholder="Share device numbers, learner group, deployment location, support needs or partnership context."
            aria-describedby={errors.message ? "message-error message-counter" : "message-counter"}
          />
          <span id="message-counter" className="mt-1 block text-right text-xs text-muted">
            {messageLength}/2000 characters
          </span>
          {errors.message ? <span id="message-error" className="mt-1 block text-xs font-medium text-red-600">{errors.message}</span> : null}
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 text-sm leading-6 text-muted">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(event) => updateValue("consent", event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-400"
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <span>I agree to be contacted about my enquiry.</span>
      </label>
      {errors.consent ? <p id="consent-error" className="mt-2 text-xs font-medium text-red-600">{errors.consent}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted sm:w-auto"
      >
        {isLoading ? "Sending..." : "Send enquiry"}
        <Icon name="arrow" className="h-4 w-4" />
      </button>

      {formState.status === "success" ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {formState.message}
        </p>
      ) : null}
      {formState.status === "error" ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {formState.message}
        </p>
      ) : null}
    </form>
  );
}
