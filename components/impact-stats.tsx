import type { Metric } from "@/lib/content";
import { Icon } from "@/components/icons";

const statIcons = ["laptop", "graduation", "school", "business", "globe", "leaf", "cost", "book"] as const;

type ImpactStatsProps = {
  stats: Metric[];
};

export function ImpactStats({ stats }: ImpactStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <article key={stat.label} className="rounded-lg border border-line bg-white p-6 shadow-card">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
            <Icon name={statIcons[index % statIcons.length]} className="h-5 w-5" />
          </div>
          <p className="text-3xl font-semibold tracking-tight text-ink">{stat.value}</p>
          <p className="mt-2 text-sm leading-5 text-muted">{stat.label}</p>
        </article>
      ))}
    </div>
  );
}
