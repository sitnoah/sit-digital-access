import type { ImpactStory } from "@/lib/content";

export function TestimonialCard({ title, quote, role }: ImpactStory) {
  return (
    <article className="rounded-lg border border-line bg-white p-6 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">
        {role}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-muted">{quote}</p>
    </article>
  );
}
