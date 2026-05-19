import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Programme } from "@/types/programme";

type ProgrammeCardProps = {
  programme: Programme;
  selected: boolean;
  onToggleCompare: (slug: string) => void;
};

export function ProgrammeCard({ programme, selected, onToggleCompare }: ProgrammeCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-flame-500 via-flame-300 to-transparent transition duration-300 group-hover:scale-x-100" />
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        <Image
          src={programme.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-8 transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
          {programme.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
            <Icon name={programme.icon} className="h-5 w-5" />
          </span>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleCompare(programme.slug)}
              className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-400"
            />
            Compare
          </label>
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{programme.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{programme.shortDescription}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
            {programme.deploymentReadiness} readiness
          </span>
          {programme.trainingIncluded ? (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Training included
            </span>
          ) : null}
          {programme.sponsorReady ? (
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
              Sponsor-ready
            </span>
          ) : null}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-line bg-paper p-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Devices</dt>
            <dd className="mt-1 font-semibold text-ink">{programme.deviceRange}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Cohort</dt>
            <dd className="mt-1 font-semibold text-ink">{programme.cohortRange}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Support</dt>
            <dd className="mt-1 font-semibold text-ink">{programme.supportLevel}</dd>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Impact</dt>
            <dd className="mt-1 font-semibold text-ink">{programme.impactModel.split(",")[0]}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
          <Link href={`/programmes/${programme.slug}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600">
            View programme
          </Link>
          <Link href="#programme-enquiry" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line px-4 text-sm font-semibold text-ink transition hover:border-flame-300 hover:text-flame-600">
            Discuss programme
          </Link>
        </div>
      </div>
    </article>
  );
}
