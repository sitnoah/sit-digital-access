import type { Feature } from "@/types";
import { IconBadge } from "@/components/icons";
import { cn } from "@/lib/utils";

type FeatureCardProps = Feature & {
  className?: string;
};

export function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group rounded-lg border border-line bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft",
        className
      )}
    >
      <IconBadge name={icon} className="mb-5 transition duration-200 group-hover:scale-105" />
      <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
