"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DeliveryProcessStrip } from "@/components/delivery/delivery-process-strip";
import { DeliveryServiceCard } from "@/components/delivery/delivery-service-card";
import { ServiceTabs } from "@/components/delivery/service-tabs";
import { TrustIndicators } from "@/components/delivery/trust-indicators";
import { Icon } from "@/components/icons";
import type { DeliveryServiceCategory } from "@/lib/delivery-services";
import { deliveryModelStats, deliveryProcessSteps, deliveryServices } from "@/lib/delivery-services";

export function WhatWeDeliverSection() {
  const [activeTab, setActiveTab] = useState<DeliveryServiceCategory>("All");
  const visibleServices = useMemo(
    () =>
      activeTab === "All"
        ? deliveryServices
        : deliveryServices.filter((service) => service.category === activeTab),
    [activeTab]
  );

  return (
    <section
      id="what-we-deliver"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f5_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute left-[-14rem] top-10 h-96 w-96 rounded-full bg-flame-500/10 blur-3xl" />
      <div className="absolute right-[-12rem] top-24 h-[28rem] w-[28rem] rounded-full bg-ink/5 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/35 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_30px_100px_rgba(17,17,17,0.10)]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative bg-[radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.08),transparent_34%),linear-gradient(135deg,#ffffff_0%,#fffaf5_100%)] p-6 sm:p-8 lg:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-flame-500 via-flame-300 to-transparent" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-600">
                WHAT WE DELIVER
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[44px]">
                Practical technology access, deployment and skills support in one joined-up model.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                We combine affordable refurbished technology with professional setup, support,
                training and deployment planning so schools, SMEs, NGOs and communities can use
                technology with confidence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#device-catalogue"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600"
                >
                  Explore Devices
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-flame-300 hover:text-flame-600"
                >
                  Request Support
                </Link>
              </div>
            </div>

            <div className="relative min-h-[360px] border-t border-line bg-[linear-gradient(135deg,#111111_0%,#151515_56%,#3a1804_100%)] p-6 text-white lg:min-h-[420px] lg:border-l lg:border-t-0 sm:p-8 lg:p-10">
              <div className="absolute inset-0 surface-grid opacity-[0.09]" />
              <div className="absolute right-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-flame-500/30 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame-300">
                      Delivery operating model
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">Access that keeps working</h3>
                  </div>
                  <span className="hidden rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold text-white/70 sm:inline-flex">
                    SIT ecosystem
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                  {deliveryModelStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur sm:p-4"
                    >
                      <p className="text-2xl font-semibold text-white sm:text-3xl">{stat.value}</p>
                      <p className="mt-1 text-xs font-semibold leading-4 text-flame-200 sm:text-sm">
                        {stat.label}
                      </p>
                      <p className="mt-2 hidden text-xs leading-5 text-white/50 sm:block">{stat.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/24 p-4">
                  <div className="grid gap-3 min-[420px]:grid-cols-2">
                    {deliveryProcessSteps.slice(0, 4).map((step, index) => (
                      <div key={step.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flame-500 text-white">
                          <Icon name={step.icon} className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/42">
                            0{index + 1}
                          </span>
                          <span className="block text-sm font-semibold text-white">{step.label}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-flame-400/20 bg-flame-500/10 p-4">
                    <p className="text-sm font-semibold text-flame-100">
                      From refurbished supply to classroom handover, every track is planned around use, support and measurable access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-line bg-[linear-gradient(135deg,#fff,#fbfaf8)] p-4 sm:p-5 lg:col-span-2">
              <TrustIndicators />
            </div>
          </div>
        </motion.div>

        <div className="mt-10">
          <ServiceTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
            >
              <DeliveryServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <DeliveryProcessStrip />
        </div>
      </div>
    </section>
  );
}
