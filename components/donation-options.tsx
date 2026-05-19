import type { Feature } from "@/lib/content";
import { Icon } from "@/components/icons";

type DonationOptionsProps = {
  options: Feature[];
};

export function DonationOptions({ options }: DonationOptionsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <article key={option.title} className="rounded-lg border border-line bg-white p-6 shadow-card">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
            <Icon name={option.icon} className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{option.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{option.description}</p>
        </article>
      ))}
    </div>
  );
}
