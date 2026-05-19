import type { Programme } from "@/lib/content";
import { Icon } from "@/components/icons";

export function ProgrammeCard({ title, description, icon, outcomes }: Programme) {
  return (
    <article className="rounded-lg border border-line bg-white p-6 shadow-card transition duration-200 hover:border-flame-200 hover:shadow-soft">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      <ul className="mt-5 space-y-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-2 text-sm text-graphite">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
