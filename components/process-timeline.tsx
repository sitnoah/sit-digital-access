import type { ProcessStep } from "@/lib/content";
import { Icon } from "@/components/icons";

type ProcessTimelineProps = {
  steps: ProcessStep[];
};

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <article key={step.title} className="relative rounded-lg border border-line bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
              <Icon name={step.icon} className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="text-base font-semibold text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
        </article>
      ))}
    </div>
  );
}
