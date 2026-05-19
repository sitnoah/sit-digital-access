import { ButtonLink } from "@/components/button-link";
import { cn } from "@/lib/utils";

type PartnerCTAProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function PartnerCTA({
  title = "Let's make digital access affordable, practical and scalable.",
  description = "Request devices, sponsor a learner, or partner with SIT Digital Access to deliver reliable technology where it can unlock learning, work and opportunity.",
  className
}: PartnerCTAProps) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-ink text-white shadow-soft">
        <div className="relative px-6 py-12 sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-orange-mesh opacity-90" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href="/contact">Request Devices</ButtonLink>
              <ButtonLink href="/donate" variant="secondary">
                Become a Partner
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
