"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { publicApi, type EnquiryPayload } from "@/lib/api";
import { cn } from "@/lib/utils";

type FormState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/34 focus:border-flame-300 focus:ring-4 focus:ring-flame-500/15";

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

export function AfricaEnquiryForm() {
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });
  const isLoading = formState.status === "loading";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ status: "loading", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const deviceCategories = formData.getAll("deviceCategories").map(String);

    const deploymentScale = formString(formData, "deploymentScale");
    const powerAvailability = formString(formData, "powerAvailability");
    const connectivityProfile = formString(formData, "connectivityProfile");
    const supportModelRequired = formString(formData, "supportModelRequired");
    const timeline = formString(formData, "timeline");
    const deploymentLocation = formString(formData, "deploymentLocation");
    const learnerCount = optionalNumber(formData, "estimatedLearnerCount");
    const message = formString(formData, "message");

    const summary = [
      `Deployment scale: ${deploymentScale}`,
      `Estimated learners: ${learnerCount ?? "Not provided"}`,
      `Power availability: ${powerAvailability}`,
      `Connectivity profile: ${connectivityProfile}`,
      `Timeline: ${timeline}`,
      `Device categories: ${deviceCategories.join(", ") || "Not selected"}`,
      `Support model required: ${supportModelRequired}`,
      `Deployment location: ${deploymentLocation}`,
      "",
      message
    ].join("\n");

    const payload: EnquiryPayload = {
      fullName: formString(formData, "fullName"),
      organisation: optionalString(formData, "organisation"),
      email: formString(formData, "email"),
      phone: optionalString(formData, "phone"),
      country: formString(formData, "country"),
      enquiryType: "AFRICA_DEPLOYMENT",
      organisationType: formString(formData, "organisationType"),
      deploymentScale,
      estimatedLearnerCount: learnerCount,
      powerAvailability,
      connectivityProfile,
      timeline,
      deviceCategories,
      supportModelRequired,
      deploymentLocation,
      message: summary,
      priority: "HIGH"
    };

    try {
      await publicApi.createEnquiry(payload);
      form.reset();
      setFormState({
        status: "success",
        message: "Thanks. Your Africa deployment enquiry has been submitted."
      });
    } catch (error) {
      setFormState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again."
      });
    }
  }

  return (
    <section id="africa-enquiry" className="relative overflow-hidden bg-[#090909] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_84%_34%,rgba(249,115,22,0.14),transparent_28%),linear-gradient(180deg,#111111_0%,#090909_62%,#050505_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-300">
            Africa enquiry
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Start a deployment conversation.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/66">
            Tell us about the country, organisation, deployment scale, power conditions,
            connectivity and support model. The team will use this to prepare a practical
            first conversation.
          </p>

          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.055] p-5">
            <p className="text-sm font-semibold text-white">What happens after enquiry?</p>
            <div className="mt-5 grid gap-4">
              {[
                "Discovery call",
                "Deployment planning",
                "Device preparation",
                "Logistics coordination",
                "Installation & enablement"
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-white/72">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          className="rounded-lg border border-white/12 bg-white/[0.065] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-7"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame-500 text-white">
              <Icon name="map" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold">Deployment readiness form</p>
              <p className="text-sm text-white/54">Structured for logistics, infrastructure and support planning.</p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-white/82">
              Name
              <input className={fieldClass} name="fullName" placeholder="Your name" required minLength={2} />
            </label>
            <label className="text-sm font-semibold text-white/82">
              Organisation
              <input className={fieldClass} name="organisation" placeholder="School, NGO or partner" />
            </label>
            <label className="text-sm font-semibold text-white/82">
              Email
              <input className={fieldClass} name="email" type="email" placeholder="name@example.com" required />
            </label>
            <label className="text-sm font-semibold text-white/82">
              Phone
              <input className={fieldClass} name="phone" type="tel" placeholder="+44 ..." />
            </label>
            <label className="text-sm font-semibold text-white/82">
              Country
              <select className={fieldClass} name="country" required defaultValue="">
                <option value="" disabled>Select country</option>
                <option>Liberia</option>
                <option>Ghana</option>
                <option>Sierra Leone</option>
                <option>Nigeria</option>
                <option>Wider Africa</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82">
              Organisation type
              <select className={fieldClass} name="organisationType" required defaultValue="">
                <option value="" disabled>Select type</option>
                <option>School or training centre</option>
                <option>NGO or community organisation</option>
                <option>Government or ministry</option>
                <option>Donor or sponsor</option>
                <option>Business or workforce partner</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82">
              Deployment scale
              <select className={fieldClass} name="deploymentScale" required defaultValue="">
                <option value="" disabled>Select scale</option>
                <option>Single pilot lab</option>
                <option>School network</option>
                <option>Community hub</option>
                <option>Multi-country programme</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82">
              Estimated learner count
              <input className={fieldClass} name="estimatedLearnerCount" type="number" min="1" placeholder="e.g. 250" />
            </label>
            <label className="text-sm font-semibold text-white/82">
              Power availability
              <select className={fieldClass} name="powerAvailability" required defaultValue="">
                <option value="" disabled>Select power profile</option>
                <option>Stable grid</option>
                <option>Unstable grid</option>
                <option>Generator supported</option>
                <option>Solar supported</option>
                <option>Unknown / needs assessment</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82">
              Connectivity profile
              <select className={fieldClass} name="connectivityProfile" required defaultValue="">
                <option value="" disabled>Select connectivity</option>
                <option>Reliable broadband</option>
                <option>Mobile data dependent</option>
                <option>Low-bandwidth</option>
                <option>Intermittent connectivity</option>
                <option>Offline-first required</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82">
              Timeline
              <select className={fieldClass} name="timeline" required defaultValue="">
                <option value="" disabled>Select timeline</option>
                <option>0-3 months</option>
                <option>3-6 months</option>
                <option>6-12 months</option>
                <option>Planning for next year</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82">
              Support model required
              <select className={fieldClass} name="supportModelRequired" required defaultValue="">
                <option value="" disabled>Select support model</option>
                <option>Remote support only</option>
                <option>Local technician training</option>
                <option>Deployment partner support</option>
                <option>Full setup and maintenance model</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-white/82 sm:col-span-2">
              Deployment location
              <input className={fieldClass} name="deploymentLocation" placeholder="City, district, school or partner location" required />
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-semibold text-white/82">Device categories</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {["Student laptops", "Business laptops", "Mini PCs", "Desktop PCs", "Computer lab bundles", "Accessories"].map((item) => (
                  <label key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/72">
                    <input className="h-4 w-4 rounded border-white/20 text-flame-500" type="checkbox" name="deviceCategories" value={item} />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="text-sm font-semibold text-white/82 sm:col-span-2">
              Message
              <textarea
                className={cn(fieldClass, "min-h-32 resize-y")}
                name="message"
                placeholder="Share learner group, partner context, device needs, logistics timeline or support requirements."
                required
                minLength={10}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-white/20"
          >
            {isLoading ? "Submitting deployment enquiry..." : "Submit deployment enquiry"}
          </button>

          {formState.status === "success" ? (
            <p className="mt-4 rounded-lg border border-green-400/25 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-100">
              {formState.message}
            </p>
          ) : null}
          {formState.status === "error" ? (
            <p className="mt-4 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-100">
              {formState.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
