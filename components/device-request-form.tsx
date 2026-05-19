"use client";

import { useState } from "react";
import { publicApi, type DeviceRequestPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { DeviceProduct } from "@/types/device";

type DeviceRequestFormProps = {
  product?: DeviceProduct;
  title?: string;
  description?: string;
  compact?: boolean;
};

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalString(formData: FormData, key: string): string | undefined {
  const value = formString(formData, key);
  return value || undefined;
}

export function DeviceRequestForm({
  product,
  title = "Request devices",
  description = "Share what you need, the intended use and where the devices will be deployed.",
  compact = false
}: DeviceRequestFormProps) {
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });
  const isLoading = formState.status === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ status: "loading", message: "" });
    const formData = new FormData(event.currentTarget);

    try {
      const payload: DeviceRequestPayload = {
        requesterName: formString(formData, "requesterName"),
        organisation: formString(formData, "organisation"),
        email: formString(formData, "email"),
        phone: optionalString(formData, "phone"),
        country: formString(formData, "country"),
        deviceCategory: formString(formData, "deviceCategory") as DeviceRequestPayload["deviceCategory"],
        quantity: Number(formData.get("quantity")),
        budgetRange: optionalString(formData, "budgetRange"),
        intendedUse: formString(formData, "intendedUse"),
        deploymentLocation: formString(formData, "deploymentLocation"),
        requiredBy: optionalString(formData, "requiredBy"),
        notes: optionalString(formData, "notes"),
        productSlug: product?.slug
      };

      await publicApi.createDeviceRequest(payload);
      event.currentTarget.reset();
      setFormState({
        status: "success",
        message: "Thanks. Your device request has been submitted."
      });
    } catch (error) {
      setFormState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again."
      });
    }
  }

  return (
    <form className={cn("rounded-lg border border-line bg-white p-6 shadow-soft", compact ? "sm:p-6" : "sm:p-8")} onSubmit={handleSubmit}>
      <div>
        <h2 className={cn("font-semibold tracking-tight text-ink", compact ? "text-xl" : "text-2xl")}>{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {description}
        </p>
        {product ? (
          <p className="mt-3 rounded-lg bg-flame-50 px-3 py-2 text-sm font-semibold text-flame-700">
            Product selected: {product.name}
          </p>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Requester name
          <input className={cn(inputClass, "mt-2")} name="requesterName" required minLength={2} placeholder="Your name" />
        </label>
        <label className="text-sm font-medium text-ink">
          Organisation
          <input className={cn(inputClass, "mt-2")} name="organisation" required placeholder="School, SME, NGO or centre" />
        </label>
        <label className="text-sm font-medium text-ink">
          Email
          <input className={cn(inputClass, "mt-2")} name="email" type="email" required placeholder="name@example.com" />
        </label>
        <label className="text-sm font-medium text-ink">
          Phone
          <input className={cn(inputClass, "mt-2")} name="phone" type="tel" placeholder="+44 ..." />
        </label>
        <label className="text-sm font-medium text-ink">
          Country
          <input className={cn(inputClass, "mt-2")} name="country" required placeholder="United Kingdom, Ghana, Liberia..." />
        </label>
        <label className="text-sm font-medium text-ink">
          Device category
          <select className={cn(inputClass, "mt-2")} name="deviceCategory" required defaultValue={product?.requestCategory ?? ""}>
            <option value="" disabled>
              Select category
            </option>
            <option value="STUDENT_LAPTOPS">Student laptops</option>
            <option value="BUSINESS_LAPTOPS">Business laptops</option>
            <option value="DESKTOP_PCS">Desktop PCs</option>
            <option value="MINI_PCS">Mini PCs</option>
            <option value="COMPUTER_LAB_BUNDLES">Computer lab bundles</option>
            <option value="AI_LEARNING_LAB_BUNDLES">AI learning lab bundles</option>
            <option value="ACCESSORIES">Accessories</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Quantity
          <input className={cn(inputClass, "mt-2")} name="quantity" type="number" min="1" required placeholder="e.g. 20" />
        </label>
        <label className="text-sm font-medium text-ink">
          Budget range
          <input className={cn(inputClass, "mt-2")} name="budgetRange" placeholder="Optional range or target" />
        </label>
        <label className="text-sm font-medium text-ink">
          Deployment location
          <input className={cn(inputClass, "mt-2")} name="deploymentLocation" required placeholder="School, office, city or country" />
        </label>
        <label className="text-sm font-medium text-ink">
          Required by
          <input className={cn(inputClass, "mt-2")} name="requiredBy" type="date" />
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Intended use
          <textarea
            className={cn(inputClass, "mt-2 min-h-28 resize-y")}
            name="intendedUse"
            required
            minLength={10}
            placeholder="Learning centre, classroom lab, office upgrade, coding cohort, AI literacy programme..."
          />
        </label>
        <label className="text-sm font-medium text-ink sm:col-span-2">
          Notes
          <textarea className={cn(inputClass, "mt-2 min-h-24 resize-y")} name="notes" placeholder="Any preferred specification, support needs or delivery details." />
        </label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted sm:w-auto"
      >
        {isLoading ? "Submitting..." : "Submit device request"}
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
