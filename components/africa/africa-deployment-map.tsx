"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import type { IconKey } from "@/components/icons";
import { africaCountryProfiles, africaMapOverlayMetrics } from "@/lib/data";
import { cn } from "@/lib/utils";

type AfricaDeploymentMapProps = {
  activeCountry?: string;
  variant?: "hero" | "network";
  className?: string;
};

const routeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 }
};

export function AfricaDeploymentMap({
  activeCountry = "Ghana",
  variant = "network",
  className
}: AfricaDeploymentMapProps) {
  const active = africaCountryProfiles.find((country) => country.country === activeCountry);
  const featuredCountries =
    variant === "hero" ? africaCountryProfiles.slice(0, 4) : africaCountryProfiles;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.05] shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl",
        variant === "hero" ? "min-h-[430px] p-5" : "min-h-[560px] p-5 lg:p-8",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(249,115,22,0.26),transparent_34%),radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.1),transparent_22%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
      <div className="absolute inset-0 surface-grid opacity-[0.1]" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flame-200">
            Deployment network
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Africa technology rollout view
          </h3>
        </div>
        <span className="rounded-full border border-flame-400/35 bg-flame-500/12 px-3 py-1 text-xs font-semibold text-flame-100">
          Live model
        </span>
      </div>

      <div className="relative z-10 mt-6 min-h-[300px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Animated Africa deployment map"
        >
          <defs>
            <filter id={`africa-glow-${variant}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0.98 0 0.45 0 0 0.35 0 0 0.08 0 0 0 0 0 0.72 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M48 8 C57 9 64 15 65 24 C74 28 75 38 70 45 C78 54 72 65 64 69 C63 78 56 91 49 94 C43 87 39 78 35 70 C27 65 24 55 29 48 C22 42 24 30 33 27 C35 17 40 10 48 8 Z"
            fill="rgba(255,255,255,0.07)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.7"
          />
          <path
            d="M18 20 C28 23 34 34 42 52 C48 66 56 70 68 78"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="0.6"
            strokeDasharray="1.5 2"
          />
          {featuredCountries.map((country, index) => (
            <motion.path
              key={country.country}
              d={`M18 18 C32 ${18 + index * 4} 38 ${country.marker.y - 14} ${country.marker.x} ${country.marker.y}`}
              fill="none"
              stroke={country.country === activeCountry ? "rgba(249,115,22,0.95)" : "rgba(249,115,22,0.4)"}
              strokeWidth={country.country === activeCountry ? 1.2 : 0.75}
              strokeLinecap="round"
              variants={routeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1.2, delay: index * 0.12, ease: "easeOut" }}
              filter={`url(#africa-glow-${variant})`}
            />
          ))}
        </svg>

        <div className="absolute left-[13%] top-[11%]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-flame-300 shadow-card">
            <Icon name="map" className="h-4 w-4" />
          </span>
          <span className="mt-2 block rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white/80">
            UK hub
          </span>
        </div>

        {featuredCountries.map((country) => {
          const isActive = country.country === activeCountry;
          return (
            <button
              key={country.country}
              type="button"
              className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"
              style={{ left: `${country.marker.x}%`, top: `${country.marker.y}%` }}
              aria-label={`${country.country} deployment marker`}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-45",
                    isActive ? "bg-flame-300" : "bg-white"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex h-4 w-4 rounded-full border-2 shadow-[0_0_28px_rgba(249,115,22,0.65)]",
                    isActive ? "border-white bg-flame-500" : "border-flame-200 bg-black"
                  )}
                />
              </span>
              <span
                className={cn(
                  "mt-2 hidden whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold shadow-card sm:block",
                  isActive
                    ? "border-flame-300/40 bg-flame-500 text-white"
                    : "border-white/12 bg-black/60 text-white/74 group-hover:text-white"
                )}
              >
                {country.country}
              </span>
            </button>
          );
        })}
      </div>

      {variant === "hero" ? (
        <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: "24 devices shipped", detail: "Pilot lab bundle", icon: "package" },
            { title: "Lab deployment", detail: active?.country ?? "Africa", icon: "school" },
            { title: "Technician trained", detail: "Local support route", icon: "wrench" },
            { title: "Offline-ready learning", detail: "Content-first setup", icon: "offline" }
          ].map((card) => (
            <div key={card.title} className="rounded-lg border border-white/10 bg-black/28 p-4">
              <Icon name={card.icon as IconKey} className="h-4 w-4 text-flame-300" />
              <p className="mt-3 text-sm font-semibold text-white">{card.title}</p>
              <p className="mt-1 text-xs leading-5 text-white/56">{card.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {africaMapOverlayMetrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-white/10 bg-black/30 p-4">
              <p className="text-2xl font-semibold text-white">{metric.value}</p>
              <p className="mt-1 text-xs leading-5 text-white/56">{metric.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
