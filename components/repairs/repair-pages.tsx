"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { lifecycleStages, repairCentres, repairServices, repairStatuses } from "@/lib/repair-content";
import { publicApi } from "@/lib/api";

const fieldClass = "mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100";

export function RepairsLandingPage() {
  return (
    <>
      <section className="bg-ink px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Repair operations platform</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">Diagnostics, repair, refurbishment and lifecycle recovery.</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/70">
              SIT Digital Access repairs extend device life, support refurbished marketplace quality, keep school labs running and reduce premature recycling.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/book-repair">Book repair</ButtonLink>
              <ButtonLink href="/repair-pricing" variant="secondary">View pricing</ButtonLink>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
              <div className="grid gap-3">
                {repairStatuses.slice(0, 6).map((status, index) => (
                  <div key={status} className="flex items-center justify-between rounded-2xl bg-white/[0.07] px-4 py-3">
                    <span className="text-sm font-semibold">{status}</span>
                    <span className="rounded-full bg-flame-500/20 px-2.5 py-1 text-xs font-semibold text-flame-100">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <RepairServicesSection />
      <RepairLifecycleSection />
    </>
  );
}

export function RepairServicesSection() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Repair services" title="Repair categories built for access, education and reuse." description="From diagnostics to upgrades, each repair path supports device readiness, warranty notes and lifecycle history." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {repairServices.map((service) => (
            <article key={service.title} className="rounded-lg border border-line bg-white p-6 shadow-card">
              <Icon name={service.icon} className="h-5 w-5 text-flame-600" />
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{service.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-paper p-3"><p className="text-muted">Pricing</p><strong>{service.price}</strong></div>
                <div className="rounded-2xl bg-paper p-3"><p className="text-muted">SLA</p><strong>{service.sla}</strong></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RepairLifecycleSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Unified lifecycle" title="Repair is now a first-class device lifecycle stage." description="Every repair can inform diagnostics, refurbishment, inventory readiness, deployment, recovery, recycling and retirement." />
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {lifecycleStages.map((stage, index) => (
            <div key={stage} className="rounded-lg border border-line bg-paper p-4">
              <span className="text-xs font-semibold text-flame-600">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-semibold">{stage}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BookRepairPage() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await publicApi.bookRepair({
        customerName: String(form.get("customerName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        country: String(form.get("country") ?? ""),
        location: String(form.get("location") ?? ""),
        deviceType: String(form.get("deviceType") ?? ""),
        repairCategory: String(form.get("repairCategory") ?? ""),
        serialNumber: String(form.get("serialNumber") ?? ""),
        warrantyReference: String(form.get("warrantyReference") ?? ""),
        issueDescription: String(form.get("message") ?? ""),
        urgency: "STANDARD",
        repairRoute: form.get("route") === "Mail-in repair" ? "MAIL_IN" : form.get("route") === "Pickup request" ? "PICKUP_REQUEST" : "DROP_OFF",
        preferredContactMethod: "EMAIL",
        dataHandlingConsent: true,
        diagnosticAcknowledgement: true,
        mailIn: form.get("route") === "Mail-in repair",
        pickupRequested: form.get("route") === "Pickup request",
        message: String(form.get("message") ?? "")
      });
      setState("success");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to book repair.");
    }
  }

  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Book repair</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Create a repair ticket.</h1>
          <p className="mt-4 text-sm leading-6 text-muted">Bookings create real repair ticket records for diagnostics, technician assignment, SLA tracking and lifecycle history.</p>
        </div>
        <form onSubmit={submit} className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Name<input name="customerName" required className={fieldClass} /></label>
            <label className="text-sm font-semibold">Email<input name="email" type="email" required className={fieldClass} /></label>
            <label className="text-sm font-semibold">Phone<input name="phone" className={fieldClass} /></label>
            <label className="text-sm font-semibold">Country<input name="country" required className={fieldClass} /></label>
            <label className="text-sm font-semibold">Location<input name="location" className={fieldClass} /></label>
            <label className="text-sm font-semibold">Device type<input name="deviceType" required placeholder="Laptop, desktop, mini PC..." className={fieldClass} /></label>
            <label className="text-sm font-semibold">Repair category<select name="repairCategory" required className={fieldClass}>{repairServices.map((service) => <option key={service.title}>{service.title}</option>)}</select></label>
            <label className="text-sm font-semibold">Route<select name="route" className={fieldClass}><option>Drop-off / centre</option><option>Mail-in repair</option><option>Pickup request</option></select></label>
            <label className="text-sm font-semibold">Serial number<input name="serialNumber" className={fieldClass} /></label>
            <label className="text-sm font-semibold">Warranty reference<input name="warrantyReference" className={fieldClass} /></label>
          </div>
          <label className="mt-4 block text-sm font-semibold">Issue description<textarea name="message" required rows={5} className={fieldClass} /></label>
          {state === "success" ? <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-700">Repair booking submitted.</p> : null}
          {state === "error" ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p> : null}
          <button disabled={state === "submitting"} className="mt-5 min-h-12 rounded-full bg-flame-500 px-6 text-sm font-semibold text-white shadow-lg shadow-flame-500/20 transition hover:bg-flame-600 disabled:opacity-60">
            {state === "submitting" ? "Submitting..." : "Submit repair booking"}
          </button>
        </form>
      </div>
    </section>
  );
}

export function RepairStatusPage() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Repair status" title="Track repairs from diagnostics to pickup." description="Repair tickets move through a clear SLA-backed pipeline. Status tracking is designed to connect to the customer portal token created at booking." />
        <div className="mt-10 grid gap-3">
          {repairStatuses.map((status) => <div key={status} className="rounded-2xl border border-line bg-white p-4 font-semibold shadow-sm">{status}</div>)}
        </div>
      </div>
    </section>
  );
}

export function RepairCentresPage() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Repair centres" title="Repair support for refurbished access infrastructure." description="Centres and partner routes support public repairs, school labs, community hubs and Africa deployment maintenance." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {repairCentres.map((centre) => (
            <article key={centre.name} className="rounded-lg border border-line bg-white p-6 shadow-card">
              <Icon name="map" className="h-5 w-5 text-flame-600" />
              <h3 className="mt-5 text-xl font-semibold">{centre.name}</h3>
              <p className="mt-2 text-sm font-semibold text-flame-600">{centre.region}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{centre.focus}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RepairPricingPage() {
  return <RepairServicesSection />;
}

export function TradeInPage() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Trade-in and recycling" title="Value retired devices before reuse, repair or recycling." description="Trade-in valuation sits beside donation and recycling: devices can be repaired, refurbished, redeployed, used for parts or responsibly recycled." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["Estimate value", "Decide repair vs reuse", "Report circular impact"].map((step, index) => (
            <article key={step} className="rounded-lg border border-line bg-white p-6 shadow-card">
              <span className="text-xs font-semibold text-flame-600">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">Capture condition, age, grade, data-wipe route and likely second-life outcome.</p>
            </article>
          ))}
        </div>
        <div className="mt-8"><ButtonLink href="/device-recycling">Start recycling route</ButtonLink></div>
      </div>
    </section>
  );
}
