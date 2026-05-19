import type { Metric } from "@/types";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

type MetricsBarProps = {
  metrics: Metric[];
  className?: string;
};

export function MetricsBar({ metrics, className }: MetricsBarProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl overflow-hidden rounded-lg border border-white/75 bg-white shadow-soft ring-1 ring-ink/5",
        className
      )}
    >
      <div className="grid bg-[linear-gradient(135deg,rgba(249,115,22,0.08),rgba(255,255,255,0)_42%),linear-gradient(180deg,#ffffff,#fbfaf8)] sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="group relative min-h-[132px] border-b border-line/80 px-5 py-5 transition duration-300 hover:bg-white sm:border-r lg:border-b-0 lg:last:border-r-0"
          >
            <div className="flex h-full items-start gap-4 lg:flex-col lg:gap-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-flame-400 shadow-[0_14px_34px_rgba(17,17,17,0.12)] ring-1 ring-white/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-flame-500 group-hover:text-white">
                <Icon name={metric.icon ?? "badge"} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-semibold leading-6 text-ink sm:text-lg">
                  {metric.value}
                </span>
                <span className="mt-1 block text-sm font-medium leading-5 text-muted">
                  {metric.label}
                </span>
              </span>
            </div>
            <span className="pointer-events-none absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-flame-500 transition duration-300 group-hover:scale-x-100" />
          </article>
        ))}
      </div>
    </div>
  );
}
