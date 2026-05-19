import { ButtonLink } from "@/components/button-link";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden bg-ink text-white", className)}>
      <div className="absolute inset-0 bg-orange-mesh opacity-95" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-flame-200">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl">
            {description}
          </p>
          {(primary || secondary) ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primary ? <ButtonLink href={primary.href}>{primary.label}</ButtonLink> : null}
              {secondary ? (
                <ButtonLink href={secondary.href} variant="secondary">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
