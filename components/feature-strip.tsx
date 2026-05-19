import { Icon } from "@/components/icons";
import type { Feature } from "@/types";

type FeatureStripProps = {
  items: Feature[];
};

export function FeatureStrip({ items }: FeatureStripProps) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-white/12 bg-white/[0.07] shadow-soft backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-5">
      {items.map((card) => (
        <article
          key={card.title}
          className="border-b border-white/10 p-5 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0 lg:last:border-r-0"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-flame-500 ring-1 ring-flame-500/45">
              <Icon name={card.icon} className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">{card.title}</h2>
              <p className="mt-1 text-xs leading-5 text-white/62">{card.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
