import { Icon } from "@/components/icons";
import type { Feature } from "@/types";

export function DeliverCard({ title, description, icon }: Feature) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white shadow-card transition duration-300 group-hover:bg-ink">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-6 text-lg font-semibold leading-6 text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
