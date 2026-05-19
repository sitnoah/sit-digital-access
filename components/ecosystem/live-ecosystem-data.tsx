"use client";

import { useEffect, useMemo, useState } from "react";
import { EcosystemMetricGrid, StoryGrid } from "@/components/ecosystem/ecosystem-sections";
import { publicApi, type ApiRecord } from "@/lib/api";
import type { EcosystemStory } from "@/lib/ecosystem-content";
import { successStories } from "@/lib/ecosystem-content";

function toStory(record: ApiRecord): EcosystemStory {
  return {
    title: String(record.title ?? "Impact story"),
    category: String(record.category ?? "Community") as EcosystemStory["category"],
    region: String(record.region ?? "UK and Africa"),
    summary: String(record.summary ?? record.description ?? "Published SIT Digital Access story."),
    metrics: Array.isArray(record.metrics) ? record.metrics.map(String) : ["Devices reused", "Access enabled"]
  };
}

export function LiveSuccessStories() {
  const [records, setRecords] = useState<ApiRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    publicApi.getSuccessStories()
      .then((stories) => {
        if (!cancelled) setRecords(stories);
      })
      .catch(() => {
        if (!cancelled) setRecords([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stories = records.length ? records.map(toStory) : successStories;
  return <StoryGrid stories={stories} />;
}

export function LiveSustainabilitySummary() {
  const [summary, setSummary] = useState<ApiRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    publicApi.getSustainabilitySummary()
      .then((next) => {
        if (!cancelled) setSummary(next);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => [
    {
      value: String(summary?.devicesReused ?? "Reuse"),
      label: "devices reused",
      detail: "Assets recorded as deployed or reused through the lifecycle platform.",
      icon: "package" as const
    },
    {
      value: String(summary?.devicesDiverted ?? "Circular"),
      label: "devices diverted",
      detail: "Donated, repaired, retired or recycled devices tracked for circular outcomes.",
      icon: "recycle" as const
    },
    {
      value: `${Number(summary?.estimatedCo2SavedKg ?? 0).toLocaleString()}kg`,
      label: "estimated CO2 avoided",
      detail: "Estimated reuse, repair and recycling impact from operational records.",
      icon: "leaf" as const
    },
    {
      value: `${Number(summary?.circularityScore ?? 0)}%`,
      label: "circularity score",
      detail: "Indicative score based on reuse, repair, donation and lifecycle signals.",
      icon: "chart" as const
    }
  ], [summary]);

  return <EcosystemMetricGrid metrics={metrics} />;
}
