import { Icon } from "@/components/icons";
import type { Feature, ProcessStep } from "@/types";

type QualityTimelineProps = {
  steps: ProcessStep[];
  badges: Feature[];
};

export function QualityTimeline({ steps, badges }: QualityTimelineProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.36fr] lg:items-start">
      <div className="relative">
        <div className="absolute left-5 top-6 hidden h-[calc(100%-48px)] w-px bg-line md:block" />
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="relative rounded-lg border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white ring-4 ring-white">
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-flame-600">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="rounded-lg border border-line bg-ink p-5 text-white shadow-soft">
        <p className="text-sm font-semibold text-flame-300">Trust workflow</p>
        <div className="mt-5 grid gap-3">
          {badges.map((badge) => (
            <div key={badge.title} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
                <Icon name={badge.icon} className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-sm font-semibold">{badge.title}</h4>
                <p className="mt-1 text-xs leading-5 text-white/64">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
