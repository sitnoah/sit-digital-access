"use client";

import { useEffect, useState } from "react";
import { ImpactStats } from "@/components/impact-stats";
import { publicApi, type ImpactStats as ImpactStatsData } from "@/lib/api";
import type { Metric } from "@/lib/content";

type LiveImpactStatsProps = {
  fallback: Metric[];
};

function toMetrics(stats: ImpactStatsData): Metric[] {
  return [
    { value: stats.devicesDeployed.toLocaleString(), label: "devices deployed" },
    { value: stats.learnersReached.toLocaleString(), label: "learners reached" },
    { value: stats.schoolsSupported.toLocaleString(), label: "schools supported" },
    { value: stats.businessesSupported.toLocaleString(), label: "businesses supported" },
    { value: stats.countriesServed.toLocaleString(), label: "countries served" },
    { value: `${stats.co2SavedKg.toLocaleString()}kg`, label: "CO2 saved through reuse" },
    { value: `£${stats.costSavingsGenerated.toLocaleString()}`, label: "cost savings generated" },
    { value: stats.trainingHoursDelivered.toLocaleString(), label: "training hours delivered" }
  ];
}

export function LiveImpactStats({ fallback }: LiveImpactStatsProps) {
  const [metrics, setMetrics] = useState<Metric[]>(fallback);

  useEffect(() => {
    async function loadImpact() {
      try {
        const liveStats = await publicApi.getImpact();
        setMetrics(toMetrics(liveStats));
      } catch {
        setMetrics(fallback);
      }
    }

    void loadImpact();
  }, [fallback]);

  return <ImpactStats stats={metrics} />;
}
