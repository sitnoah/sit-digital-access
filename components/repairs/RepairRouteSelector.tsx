"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { repairRoutes, type RepairRouteOption, type RepairRouteSlug } from "@/lib/repair-routes";
import { cn } from "@/lib/utils";

type RepairRouteSelectorProps = {
  selectedRoute: RepairRouteOption;
  onSelect: (slug: RepairRouteSlug) => void;
};

export function RepairRouteSelector({ selectedRoute, onSelect }: RepairRouteSelectorProps) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {repairRoutes.map((route, index) => {
          const selected = selectedRoute.slug === route.slug;

          return (
            <motion.button
              key={route.slug}
              type="button"
              onClick={() => onSelect(route.slug)}
              aria-pressed={selected}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: index * 0.025 }}
              className={cn(
                "relative min-h-[250px] overflow-hidden rounded-lg border p-5 text-left shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-500",
                selected
                  ? "border-flame-400 bg-flame-50 shadow-[0_20px_60px_rgba(249,115,22,0.18)]"
                  : "border-line bg-white hover:-translate-y-1 hover:border-flame-200 hover:bg-paper"
              )}
            >
              <span className={cn("absolute inset-x-0 top-0 h-1 transition", selected ? "bg-flame-500" : "bg-transparent")} />
              <div className="flex items-start justify-between gap-4">
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", selected ? "bg-flame-500 text-white" : "bg-paper text-flame-600")}>
                  <Icon name={route.icon} className="h-5 w-5" />
                </span>
                {selected ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-white">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{route.label}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{route.description}</p>
              <div className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-muted shadow-sm">
                {route.bestFor}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-card">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                <Icon name={selectedRoute.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-flame-600">Selected route</p>
                <h3 className="text-xl font-semibold text-ink">{selectedRoute.label}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{selectedRoute.guidanceMessage}</p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-4">
            <p className="text-sm font-semibold text-ink">Route requirements</p>
            {Array.isArray(selectedRoute.requirements) ? (
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
                {selectedRoute.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-2">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">{selectedRoute.requirements}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
