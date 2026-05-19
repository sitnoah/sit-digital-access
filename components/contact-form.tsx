"use client";

import { useState } from "react";
import { publicApi, type DonationPayload, type EnquiryPayload, type EnquiryType } from "@/lib/api";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  mode?: "contact" | "donation";
  title?: string;
  description?: string;
  defaultEnquiryType?: EnquiryType;
  lockedEnquiryType?: boolean;
  className?: string;
};

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

const enquiryOptions: { label: string; value: EnquiryType }[] = [
  { label: "General enquiry", value: "CONTACT" },
  { label: "Request devices", value: "REQUEST_DEVICES" },
  { label: "Partnership enquiry", value: "PARTNERSHIP" },
  { label: "School lab enquiry", value: "SCHOOL_LAB" },
  { label: "SME/NGO enquiry", value: "SME_NGO" },
  { label: "Africa deployment enquiry", value: "AFRICA_DEPLOYMENT" },
  { label: "Device donation enquiry", value: "DEVICE_DONATION" }
];

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalString(formData: FormData, key: string): string | undefined {
  const value = formString(formData, key);
  return value || undefined;
}

function optionalNumber(formData: FormData, key: string): number | undefined {
  const value = formString(formData, key);
  return value ? Number(value) : undefined;
}

export function ContactForm({
  mode = "contact",
  title = "Start a conversation",
  description = "Tell us what you need and the SIT Digital Access team will follow up with a practical next step.",
  defaultEnquiryType = "CONTACT",
  lockedEnquiryType = false,
  className
}: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });
  const isDonation = mode === "donation";
  const isLoading = formState.status === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ status: "loading", message: "" });

    const formData = new FormData(event.currentTarget);

    try {
      if (isDonation) {
        const donationPayload: DonationPayload = {
          donorName: formString(formData, "fullName"),
          organisation: optionalString(formData, "organisation"),
          donorType: formString(formData, "donorType") as DonationPayload["donorType"],
          email: formString(formData, "email"),
          phone: optionalString(formData, "phone"),
          country: formString(formData, "country"),
          donationType: formString(formData, "donationType") as DonationPayload["donationType"],
          deviceCount: optionalNumber(formData, "deviceCount"),
          deviceCondition: optionalString(formData, "deviceCondition"),
          pickupLocation: optionalString(formData, "pickupLocation"),
          sponsorshipAmount: optionalNumber(formData, "sponsorshipAmount"),
          message: optionalString(formData, "message")
        };

        await publicApi.createDonation(donationPayload);
        event.currentTarget.reset();
        setFormState({
          status: "success",
          message: "Thanks. Your donation or sponsorship enquiry has been submitted."
        });
        return;
      }

      const enquiryPayload: EnquiryPayload = {
        fullName: formString(formData, "fullName"),
        organisation: optionalString(formData, "organisation"),
        email: formString(formData, "email"),
        phone: optionalString(formData, "phone"),
        country: formString(formData, "country"),
        enquiryType: formString(formData, "enquiryType") as EnquiryType,
        organisationType: optionalString(formData, "organisationType"),
        message: formString(formData, "message")
      };

      await publicApi.createEnquiry(enquiryPayload);
      event.currentTarget.reset();
      setFormState({
        status: "success",
        message: "Thanks. Your enquiry has been submitted and the team will follow up."
      });
    } catch (error) {
      setFormState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again."
      });
    }
  }

  return (
    <form
      className={cn("rounded-lg border border-line bg-white p-6 shadow-soft sm:p-8", className)}
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Name
          <input className={cn(inputClass, "mt-2")} name="fullName" placeholder="Your name" required minLength={2} />
        </label>
        <label className="text-sm font-medium text-ink">
          Organisation
          <input className={cn(inputClass, "mt-2")} name="organisation" placeholder="School, company or NGO" />
        </label>
        <label className="text-sm font-medium text-ink">
          Email
          <input className={cn(inputClass, "mt-2")} name="email" type="email" placeholder="name@example.com" required />
        </label>
        <label className="text-sm font-medium text-ink">
          Phone
          <input className={cn(inputClass, "mt-2")} name="phone" type="tel" placeholder="+44 ..." />
        </label>
        {isDonation ? (
          <>
            <label className="text-sm font-medium text-ink">
              Donor type
              <select className={cn(inputClass, "mt-2")} name="donorType" required defaultValue="INDIVIDUAL">
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
                <option value="NGO">NGO</option>
                <option value="SCHOOL">School</option>
                <option value="FOUNDATION">Foundation</option>
                <option value="GOVERNMENT">Government</option>
              </select>
            </label>
            <label className="text-sm font-medium text-ink">
              Donation type
              <select className={cn(inputClass, "mt-2")} name="donationType" required defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option value="USED_LAPTOPS">Donate used laptops</option>
                <option value="DESKTOPS">Donate desktops</option>
                <option value="MINI_PCS">Donate mini PCs</option>
                <option value="ACCESSORIES">Donate accessories</option>
                <option value="SPONSOR_LEARNER">Sponsor one learner device</option>
                <option value="SPONSOR_CLASSROOM_BUNDLE">Sponsor a classroom bundle</option>
                <option value="SPONSOR_FULL_LAB">Sponsor a full computer lab</option>
                <option value="CORPORATE_RECYCLING">Corporate recycling partnership</option>
                <option value="MONTHLY_DONOR">Monthly donor programme</option>
              </select>
            </label>
            <label className="text-sm font-medium text-ink">
              Number of devices
              <input className={cn(inputClass, "mt-2")} name="deviceCount" type="number" min="0" placeholder="e.g. 12" />
            </label>
            <label className="text-sm font-medium text-ink">
              Sponsorship amount
              <input className={cn(inputClass, "mt-2")} name="sponsorshipAmount" type="number" min="0" placeholder="Optional amount" />
            </label>
            <label className="text-sm font-medium text-ink">
              Device condition
              <input className={cn(inputClass, "mt-2")} name="deviceCondition" placeholder="Working, mixed, unknown" />
            </label>
            <label className="text-sm font-medium text-ink">
              Pickup location
              <input className={cn(inputClass, "mt-2")} name="pickupLocation" placeholder="Town, city or office location" />
            </label>
          </>
        ) : (
          <>
            <label className="text-sm font-medium text-ink">
              Enquiry type
              <select
                className={cn(inputClass, "mt-2")}
                name="enquiryType"
                required
                defaultValue={defaultEnquiryType}
                disabled={lockedEnquiryType}
              >
                {enquiryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {lockedEnquiryType ? (
                <input type="hidden" name="enquiryType" value={defaultEnquiryType} />
              ) : null}
            </label>
            <label className="text-sm font-medium text-ink">
              Organisation type
              <select className={cn(inputClass, "mt-2")} name="organisationType" defaultValue="">
                <option value="">Select an option</option>
                <option>School or training centre</option>
                <option>Small business</option>
                <option>NGO or community organisation</option>
                <option>Donor or sponsor</option>
                <option>Government or ministry</option>
              </select>
            </label>
          </>
        )}
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Country / location
          <input
            className={cn(inputClass, "mt-2")}
            name="country"
            placeholder="UK city, country or deployment location"
            required
          />
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Message
          <textarea
            className={cn(inputClass, "mt-2 min-h-36 resize-y")}
            name="message"
            minLength={isDonation ? 0 : 10}
            placeholder="Share device numbers, timelines, learner group, deployment location or support needs."
            required={!isDonation}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted sm:w-auto"
      >
        {isLoading ? "Submitting..." : "Submit enquiry"}
      </button>
      {formState.status === "success" ? (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {formState.message}
        </p>
      ) : null}
      {formState.status === "error" ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formState.message}
        </p>
      ) : null}
    </form>
  );
}
