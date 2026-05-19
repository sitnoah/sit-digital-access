import Link from "next/link";
import type { DeviceCategory } from "@/types";
import { Icon } from "@/components/icons";

export function DeviceCategoryCard({
  title,
  icon,
  bestFor,
  specification,
  price,
  warranty,
  conditionGrade = "A/B grade",
  supportIncluded,
  tags = []
}: DeviceCategory) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft">
      <div className="mb-5 overflow-hidden rounded-lg border border-line bg-gradient-to-br from-[#181818] via-[#2B2B2B] to-[#0D0D0D] p-4">
        <div className="flex min-h-28 items-center justify-center">
          <div className="relative flex h-20 w-28 items-end justify-center">
            <div className="absolute top-0 h-16 w-24 rounded border border-white/18 bg-gradient-to-br from-zinc-950 to-zinc-700 shadow-soft">
              <div className="m-2 h-10 rounded bg-flame-500/15">
                <svg className="h-full w-full p-2" viewBox="0 0 120 60" preserveAspectRatio="none">
                  <path d="M0 42 C22 36 32 48 52 36 C78 20 86 34 120 15" fill="none" stroke="#f97316" strokeWidth="3" />
                </svg>
              </div>
            </div>
            <div className="h-2 w-28 rounded bg-zinc-500" />
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-sm text-muted">Best for: {bestFor}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white transition group-hover:bg-ink">
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>
      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-ink">Typical specification</dt>
          <dd className="mt-1 leading-6 text-muted">{specification}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Condition grade</dt>
          <dd className="mt-1 leading-6 text-muted">{conditionGrade}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Example price range</dt>
          <dd className="mt-1 leading-6 text-muted">{price}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Support included</dt>
          <dd className="mt-1 leading-6 text-muted">{supportIncluded ?? warranty}</dd>
        </div>
      </dl>
      <Link
        href="/devices#device-request"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-flame-600"
      >
        Enquire
      </Link>
    </article>
  );
}
