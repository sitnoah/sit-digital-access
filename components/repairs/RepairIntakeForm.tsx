"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { repairApi, REPAIR_API_CONFIGURED } from "@/lib/repair-api";
import { getRepairRouteBySlug, type RepairRouteOption, type RepairRouteSlug } from "@/lib/repair-routes";
import { cn } from "@/lib/utils";
import type {
  DeviceChargerIncluded,
  PreferredContactMethod,
  PurchasedFromSit,
  RepairBookingPayload,
  RepairBookingResponse,
  RepairUrgency
} from "@/types/repair";

type RepairFormValues = {
  repairRoute: RepairRouteSlug | "";
  customerName: string;
  email: string;
  phone: string;
  organisation: string;
  country: string;
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
  urgency: RepairUrgency;
  preferredContactMethod: PreferredContactMethod;
  dataHandlingConsent: boolean;
  diagnosticAcknowledgement: boolean;
  preferredDropOffDate: string;
  handoverNotes: string;
  deviceChargerIncluded: DeviceChargerIncluded | "";
  pickupAddress: string;
  preferredPickupDate: string;
  deviceCount: string;
  organisationType: string;
  accessInstructions: string;
  batchRepairRequired: "YES" | "NO";
};

type SubmitState =
  | { status: "idle"; message: "" }
  | { status: "submitting"; message: "" }
  | { status: "success"; message: string; response: RepairBookingResponse; payload: RepairBookingPayload }
  | { status: "error"; message: string };

type RepairIntakeFormProps = {
  selectedRoute: RepairRouteOption;
  selectedRepairRoute: RepairRouteSlug;
  invalidRouteWarning?: boolean;
};

const initialValues: RepairFormValues = {
  repairRoute: "drop-off-handover",
  customerName: "",
  email: "",
  phone: "",
  organisation: "",
  country: "United Kingdom",
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
  urgency: "STANDARD",
  preferredContactMethod: "EMAIL",
  dataHandlingConsent: false,
  diagnosticAcknowledgement: false,
  preferredDropOffDate: "",
  handoverNotes: "",
  deviceChargerIncluded: "",
  pickupAddress: "",
  preferredPickupDate: "",
  deviceCount: "",
  organisationType: "",
  accessInstructions: "",
  batchRepairRequired: "NO"
};

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

const repairCategories = [
  "Laptop repair",
  "Desktop repair",
  "Mini PC repair",
  "Screen issue",
  "Battery or power issue",
  "Keyboard / touchpad issue",
  "SSD / RAM upgrade",
  "Operating system recovery",
  "Virus / malware cleanup",
  "Data recovery request",
  "School lab device support",
  "Warranty / refurbished device support"
];

const dropOffHandoverChecklist = [
  "Bring the device and charger",
  "Include warranty, order or asset reference",
  "Describe symptoms clearly",
  "Back up important data if possible",
  "Keep your ticket ID and status token after booking"
];

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function numericDeviceCount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusUrl(response: RepairBookingResponse) {
  return `/repair-status?ticketId=${encodeURIComponent(response.ticketId)}&token=${encodeURIComponent(response.statusToken)}`;
}

export function RepairIntakeForm({
  selectedRoute,
  selectedRepairRoute,
  invalidRouteWarning = false
}: RepairIntakeFormProps) {
  const [values, setValues] = useState<RepairFormValues>(() => ({
    ...initialValues,
    repairRoute: selectedRepairRoute
  }));
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "" });
  const [copied, setCopied] = useState(false);
  const showPickupFields = selectedRoute.requiresPickupDetails === true;
  const showPickupSelectedBlock = selectedRoute.slug === "pickup-request";
  const showDropOffHandoverFields = values.repairRoute === "drop-off-handover";
  const loading = submitState.status === "submitting";

  useEffect(() => {
    setValues((current) =>
      current.repairRoute === selectedRepairRoute ? current : { ...current, repairRoute: selectedRepairRoute }
    );
  }, [selectedRepairRoute]);

  useEffect(() => {
    setSubmitState((current) => (current.status === "error" ? { status: "idle", message: "" } : current));
  }, [selectedRoute.slug]);

  const selectedRouteSummary = useMemo(() => {
    if (selectedRoute.slug === "pickup-request") return "Pickup request";
    if (selectedRoute.slug === "bulk-school-lab-support") return "Bulk school/lab support";
    if (selectedRoute.slug === "africa-deployment-support") return "Africa deployment support";
    return selectedRoute.label;
  }, [selectedRoute]);

  function updateValue<Key extends keyof RepairFormValues>(key: Key, value: RepairFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (submitState.status === "error") setSubmitState({ status: "idle", message: "" });
  }

  function validate() {
    const errors: string[] = [];
    const count = numericDeviceCount(values.deviceCount);

    if (!values.customerName.trim()) errors.push("Name is required.");
    if (!validEmail(values.email)) errors.push("A valid email is required.");
    if (!values.deviceType.trim()) errors.push("Device type is required.");
    if (!values.repairCategory.trim()) errors.push("Repair category is required.");
    if (!values.repairRoute || !getRepairRouteBySlug(values.repairRoute)) errors.push("Repair route is required.");
    if (!values.issueDescription.trim()) errors.push("Issue description is required.");
    if (!values.dataHandlingConsent) errors.push("Data handling consent is required.");

    if (selectedRoute.slug === "pickup-request") {
      if (!values.pickupAddress.trim()) errors.push("Pickup address is required for pickup requests.");
      if (count < 1) errors.push("Device count must be at least 1 for pickup requests.");
      if (!values.preferredPickupDate) errors.push("Preferred pickup date is required for pickup requests.");
    }

    if (selectedRoute.slug === "bulk-school-lab-support") {
      if (count < 2) errors.push("Device count must be at least 2 for bulk school/lab support.");
      if (!values.organisation.trim()) errors.push("Organisation is required for bulk school/lab support.");
      if (!values.location.trim()) errors.push("Location is required for bulk school/lab support.");
    }

    return errors;
  }

  function buildPayload(): RepairBookingPayload {
    const count = numericDeviceCount(values.deviceCount);
    const includePickupDetails = showPickupFields;
    const includeDropOffDetails = values.repairRoute === "drop-off-handover";
    const repairRouteForPayload = includeDropOffDetails ? selectedRoute.label : selectedRoute.value;

    return {
      customerName: values.customerName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      organisation: values.organisation.trim() || undefined,
      country: values.country.trim() || undefined,
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
      urgency: values.urgency,
      repairRoute: repairRouteForPayload,
      repairRouteSlug: values.repairRoute || selectedRoute.slug,
      preferredDropOffDate: includeDropOffDetails ? values.preferredDropOffDate || undefined : undefined,
      handoverNotes: includeDropOffDetails ? values.handoverNotes.trim() || undefined : undefined,
      deviceChargerIncluded: includeDropOffDetails ? values.deviceChargerIncluded || undefined : undefined,
      pickupAddress: includePickupDetails ? values.pickupAddress.trim() || undefined : undefined,
      preferredPickupDate: includePickupDetails ? values.preferredPickupDate || undefined : undefined,
      deviceCount: includePickupDetails && count > 0 ? count : undefined,
      organisationType: includePickupDetails ? values.organisationType.trim() || undefined : undefined,
      accessInstructions: includePickupDetails ? values.accessInstructions.trim() || undefined : undefined,
      batchRepairRequired: includePickupDetails ? values.batchRepairRequired === "YES" : undefined,
      preferredContactMethod: values.preferredContactMethod,
      dataHandlingConsent: values.dataHandlingConsent,
      diagnosticAcknowledgement: values.diagnosticAcknowledgement,
      mailIn: selectedRoute.value === "MAIL_IN",
      pickupRequested: selectedRoute.value === "PICKUP_REQUEST" || selectedRoute.requiresPickupDetails === true,
      message: values.issueDescription.trim()
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    if (errors.length > 0) {
      setSubmitState({ status: "error", message: errors[0] });
      return;
    }

    const payload = buildPayload();
    setSubmitState({ status: "submitting", message: "" });

    try {
      const response = await repairApi.bookRepair(payload);
      setSubmitState({
        status: "success",
        message: "Your repair booking has been submitted. Keep these details safe for repair tracking.",
        response,
        payload
      });
    } catch {
      setSubmitState({ status: "error", message: "Repair booking could not be submitted." });
    }
  }

  async function copyTicketDetails() {
    if (submitState.status !== "success") return;
    const details = [
      `Ticket ID: ${submitState.response.ticketId}`,
      `Status token: ${submitState.response.statusToken}`,
      `Selected route: ${selectedRoute.label}`,
      `Status link: ${statusUrl(submitState.response)}`
    ].join("\n");

    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (submitState.status === "success") {
    return (
      <RepairSuccessState
        response={submitState.response}
        payload={submitState.payload}
        selectedRoute={selectedRoute}
        copied={copied}
        onCopy={copyTicketDetails}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-7">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-flame-600">Repair intake form</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Create a tracked repair ticket.</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Selected route: <span className="font-semibold text-ink">{selectedRouteSummary}</span></p>
        </div>
        <span className="inline-flex rounded-full bg-flame-50 px-3 py-1.5 text-xs font-semibold text-flame-700 ring-1 ring-flame-100">
          {selectedRoute.value}
        </span>
      </div>
      <input type="hidden" name="repairRoute" value={values.repairRoute} />

      {invalidRouteWarning ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          The selected repair route was not recognised. Please choose a route below.
        </div>
      ) : null}

      {showDropOffHandoverFields ? (
        <div className="mt-5 rounded-lg border border-flame-200 bg-flame-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
              <Icon name="package" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-flame-800">Drop-off / handover selected</p>
              <p className="mt-2 text-sm leading-6 text-flame-900/75">
                This route is best when you can safely hand over the device directly or through an arranged local drop-off point. Include your charger, warranty reference, asset tag or order reference where available.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            {dropOffHandoverChecklist.map((item) => (
              <div key={item} className="flex items-center gap-2 text-flame-900/80">
                <Icon name="check" className="h-4 w-4 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showPickupSelectedBlock ? (
        <div className="mt-5 rounded-lg border border-flame-200 bg-flame-50 p-4">
          <p className="font-semibold text-flame-800">Pickup request selected</p>
          <p className="mt-2 text-sm leading-6 text-flame-900/75">
            This route is best for schools, SMEs, NGOs, bulk repairs, lab assets or organisations that need coordinated device collection.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TextField label="Name" value={values.customerName} onChange={(value) => updateValue("customerName", value)} required />
        <TextField label="Email" type="email" value={values.email} onChange={(value) => updateValue("email", value)} required />
        <TextField label="Phone" type="tel" value={values.phone} onChange={(value) => updateValue("phone", value)} />
        <TextField label="Organisation" value={values.organisation} onChange={(value) => updateValue("organisation", value)} required={selectedRoute.slug === "bulk-school-lab-support"} />
        <TextField label="Country" value={values.country} onChange={(value) => updateValue("country", value)} />
        <TextField label="Location" value={values.location} onChange={(value) => updateValue("location", value)} placeholder="Town, school, office or deployment location" required={selectedRoute.slug === "bulk-school-lab-support"} />
        <SelectField label="Device type" value={values.deviceType} onChange={(value) => updateValue("deviceType", value)} required>
          <option value="">Select device type</option>
          {["Laptop", "Desktop PC", "Mini PC", "All-in-one PC", "Monitor", "Accessory", "School lab bundle"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </SelectField>
        <SelectField label="Repair category" value={values.repairCategory} onChange={(value) => updateValue("repairCategory", value)} required>
          <option value="">Select repair category</option>
          {repairCategories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </SelectField>
        <TextField label="Brand" value={values.brand} onChange={(value) => updateValue("brand", value)} placeholder="Dell, HP, Lenovo..." />
        <TextField label="Model" value={values.model} onChange={(value) => updateValue("model", value)} />
        <TextField label="Serial number" value={values.serialNumber} onChange={(value) => updateValue("serialNumber", value)} />
        <TextField label="Asset tag" value={values.assetTag} onChange={(value) => updateValue("assetTag", value)} />
        <TextField label="Warranty reference" value={values.warrantyReference} onChange={(value) => updateValue("warrantyReference", value)} />
        <SelectField
          label="Purchased from SIT Digital Access?"
          value={values.purchasedFromSit}
          onChange={(value) => updateValue("purchasedFromSit", value as PurchasedFromSit)}
        >
          <option value="YES">Yes</option>
          <option value="NO">No</option>
          <option value="NOT_SURE">Not sure</option>
        </SelectField>
        <SelectField label="Urgency" value={values.urgency} onChange={(value) => updateValue("urgency", value as RepairUrgency)}>
          <option value="STANDARD">Standard</option>
          <option value="URGENT">Urgent</option>
          <option value="SCHOOL_LAB_CRITICAL">School/lab critical</option>
        </SelectField>
        <SelectField
          label="Preferred contact method"
          value={values.preferredContactMethod}
          onChange={(value) => updateValue("preferredContactMethod", value as PreferredContactMethod)}
        >
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
          <option value="WHATSAPP">WhatsApp</option>
        </SelectField>
      </div>

      {showDropOffHandoverFields ? (
        <div className="mt-7 rounded-lg border border-line bg-paper p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
              <Icon name="package" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-ink">Optional handover details</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Add anything that helps the team identify the device, charger, warranty record or local handover plan.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField
              label="Preferred drop-off date"
              type="date"
              value={values.preferredDropOffDate}
              onChange={(value) => updateValue("preferredDropOffDate", value)}
            />
            <SelectField
              label="Device charger included?"
              value={values.deviceChargerIncluded}
              onChange={(value) => updateValue("deviceChargerIncluded", value as DeviceChargerIncluded | "")}
            >
              <option value="">Select yes/no</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </SelectField>
            <label className="block text-sm font-medium text-ink sm:col-span-2">
              Handover notes
              <textarea
                className={cn(inputClass, "min-h-28 resize-y")}
                value={values.handoverNotes}
                onChange={(event) => updateValue("handoverNotes", event.target.value)}
                placeholder="Local drop-off point, charger/accessory notes, order reference, opening hours or handover contact."
              />
            </label>
          </div>
        </div>
      ) : null}

      {showPickupFields ? (
        <div className="mt-7 rounded-lg border border-line bg-paper p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
              <Icon name={selectedRoute.icon} className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-ink">{selectedRoute.guidanceTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{selectedRoute.guidanceMessage}</p>
              <p className="mt-2 text-sm font-semibold text-flame-700">
                For multiple devices, include device count, location, deadline and any school/lab requirements.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField label="Pickup address" value={values.pickupAddress} onChange={(value) => updateValue("pickupAddress", value)} required={selectedRoute.slug === "pickup-request"} />
            <TextField label="Preferred pickup date" type="date" value={values.preferredPickupDate} onChange={(value) => updateValue("preferredPickupDate", value)} required={selectedRoute.slug === "pickup-request"} />
            <TextField label="Device count" type="number" min={selectedRoute.slug === "bulk-school-lab-support" ? 2 : 1} value={values.deviceCount} onChange={(value) => updateValue("deviceCount", value)} required={selectedRoute.slug === "pickup-request" || selectedRoute.slug === "bulk-school-lab-support"} />
            <SelectField label="Organisation type" value={values.organisationType} onChange={(value) => updateValue("organisationType", value)}>
              <option value="">Select organisation type</option>
              {["School", "SME", "NGO", "Training centre", "Community hub", "Deployment partner", "Other"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectField>
            <SelectField label="Batch repair required?" value={values.batchRepairRequired} onChange={(value) => updateValue("batchRepairRequired", value as "YES" | "NO")}>
              <option value="NO">No</option>
              <option value="YES">Yes</option>
            </SelectField>
            <label className="block text-sm font-medium text-ink sm:col-span-2">
              Access instructions
              <textarea
                className={cn(inputClass, "min-h-28 resize-y")}
                value={values.accessInstructions}
                onChange={(event) => updateValue("accessInstructions", event.target.value)}
                placeholder="Access times, reception details, parking, device storage, school/lab requirements or deadline notes."
              />
            </label>
          </div>
        </div>
      ) : null}

      <label className="mt-6 block text-sm font-medium text-ink">
        Issue description
        <textarea
          className={cn(inputClass, "min-h-36 resize-y")}
          value={values.issueDescription}
          onChange={(event) => updateValue("issueDescription", event.target.value)}
          placeholder="Describe symptoms, timing, urgency, data recovery needs, device count or school/lab requirements."
          required
        />
      </label>

      <div className="mt-5 grid gap-3">
        <CheckboxField
          checked={values.dataHandlingConsent}
          onChange={(checked) => updateValue("dataHandlingConsent", checked)}
          label="I consent to data-aware diagnostics and understand public repair status updates will not expose customer data."
        />
        <CheckboxField
          checked={values.diagnosticAcknowledgement}
          onChange={(checked) => updateValue("diagnosticAcknowledgement", checked)}
          label="I understand diagnostics, warranty validation and estimates happen before paid repair work is approved."
        />
      </div>

      {submitState.status === "error" ? (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">Repair booking could not be submitted.</p>
          <p className="mt-2 text-sm leading-6 text-red-700">{submitState.message}</p>
          {!REPAIR_API_CONFIGURED ? (
            <p className="mt-2 text-sm leading-6 text-red-700">
              API configuration hint: set NEXT_PUBLIC_API_BASE_URL so the booking form can reach the repair API.
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setSubmitState({ status: "idle", message: "" })}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted sm:w-auto"
      >
        <Icon name="wrench" className="h-4 w-4" />
        {loading ? "Submitting repair booking..." : "Submit repair booking"}
      </button>
    </form>
  );
}

function RepairSuccessState({
  response,
  payload,
  selectedRoute,
  copied,
  onCopy
}: {
  response: RepairBookingResponse;
  payload: RepairBookingPayload;
  selectedRoute: RepairRouteOption;
  copied: boolean;
  onCopy: () => void;
}) {
  const pickupDetails = selectedRoute.requiresPickupDetails
    ? [
        ["Pickup address", payload.pickupAddress],
        ["Preferred pickup date", payload.preferredPickupDate],
        ["Device count", payload.deviceCount ? String(payload.deviceCount) : undefined],
        ["Organisation type", payload.organisationType],
        ["Access instructions", payload.accessInstructions]
      ].filter(([, value]) => Boolean(value))
    : [];
  const dropOffDetails = selectedRoute.slug === "drop-off-handover"
    ? [
        ["Preferred drop-off date", payload.preferredDropOffDate],
        ["Charger included", payload.deviceChargerIncluded],
        ["Warranty reference", payload.warrantyReference],
        ["Asset tag", payload.assetTag],
        ["Handover notes", payload.handoverNotes]
      ].filter(([, value]) => Boolean(value))
    : [];

  return (
    <div className="rounded-lg border border-green-200 bg-white p-6 shadow-soft sm:p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
        <Icon name="check" className="h-6 w-6" />
      </span>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-green-700">Repair booking created</p>
      <h2 className="mt-2 text-3xl font-semibold text-ink">Save these tracking details.</h2>
      <p className="mt-3 text-sm leading-6 text-muted">Your repair booking has been submitted. Keep the ticket ID and status token for customer-safe tracking.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <SummaryCard label="Ticket ID" value={response.ticketId} />
        <SummaryCard label="Status token" value={response.statusToken} />
        <SummaryCard label="Selected route" value={selectedRoute.label} />
        <SummaryCard label="Initial status" value={formatStatus(response.status)} />
      </div>

      {pickupDetails.length > 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-paper p-4">
          <p className="text-sm font-semibold text-ink">Pickup details</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {pickupDetails.map(([label, value]) => (
              <SummaryCard key={label} label={label ?? ""} value={value ?? "Not recorded"} compact />
            ))}
          </div>
        </div>
      ) : null}

      {dropOffDetails.length > 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-paper p-4">
          <p className="text-sm font-semibold text-ink">Drop-off / handover details</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dropOffDetails.map(([label, value]) => (
              <SummaryCard key={label} label={label ?? ""} value={value ?? "Not recorded"} compact />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-graphite"
        >
          <Icon name="list" className="h-4 w-4" />
          {copied ? "Copied" : "Copy ticket details"}
        </button>
        <ButtonLink href={statusUrl(response)}>Check repair status</ButtonLink>
        <Link
          href="/book-repair"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-flame-300"
        >
          Book another repair
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={cn("rounded-lg border border-line bg-paper p-4", compact && "bg-white p-3")}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 break-words font-semibold text-ink">{value}</p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        className={inputClass}
        type={type}
        value={value}
        min={min}
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
