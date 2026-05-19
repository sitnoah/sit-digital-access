"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AfricaDeploymentMap } from "@/components/africa/africa-deployment-map";
import { Icon } from "@/components/icons";
import { africaCountryProfiles } from "@/lib/data";
import { cn } from "@/lib/utils";

function ReadinessMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}/100</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-flame-500 to-flame-300"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function CountryDeploymentSelector() {
  const [selectedCountry, setSelectedCountry] = useState(africaCountryProfiles[0].country);
  const selected = useMemo(
    () =>
      africaCountryProfiles.find((country) => country.country === selectedCountry) ??
      africaCountryProfiles[0],
    [selectedCountry]
  );

  return (
    <section id="country-readiness" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
              Country deployment intelligence
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Deployment models change by power, bandwidth, logistics and local support.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Select a country to view a practical readiness profile for the type of lab,
              device mix, infrastructure assumptions and support model SIT Digital Access
              would plan around.
            </p>

            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Africa deployment countries">
              {africaCountryProfiles.map((country) => {
                const active = country.country === selected.country;
                return (
                  <button
                    key={country.country}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-flame-400",
                      active
                        ? "border-flame-500 bg-flame-500 text-white shadow-card"
                        : "border-line bg-white text-muted hover:border-flame-300 hover:text-ink"
                    )}
                    onClick={() => setSelectedCountry(country.country)}
                  >
                    {country.country}
                  </button>
                );
              })}
            </div>

            <motion.article
              key={selected.country}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-8 rounded-lg border border-line bg-white p-6 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
                    {selected.country}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">{selected.typicalDeploymentType}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{selected.summary}</p>
                </div>
                <span className="hidden rounded-lg bg-ink p-3 text-flame-300 sm:inline-flex">
                  <Icon name="map" className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ["Power realities", selected.powerRealities],
                  ["Connectivity profile", selected.connectivityProfile],
                  ["Suggested device strategy", selected.suggestedDeviceStrategy],
                  ["Example lab configuration", selected.exampleLabConfiguration],
                  ["Recommended support model", selected.recommendedSupportModel],
                  ["Deployment location", `${selected.country} and partner-led local sites`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-line bg-paper p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 rounded-lg border border-line bg-white p-4 md:grid-cols-3">
                <ReadinessMeter label="Deployment readiness" value={selected.readiness} />
                <ReadinessMeter label="Logistics complexity" value={selected.logisticsComplexity} />
                <ReadinessMeter label="Offline support" value={selected.offlineSupport} />
              </div>
            </motion.article>
          </div>

          <AfricaDeploymentMap activeCountry={selected.country} />
        </div>
      </div>
    </section>
  );
}
