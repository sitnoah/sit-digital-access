import type { Feature } from "@/lib/content";
import { Icon } from "@/components/icons";

export function ServiceCard({ title, description, icon }: Feature) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-card transition duration-200 hover:border-flame-200 hover:shadow-soft">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
