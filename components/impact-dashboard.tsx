import { Icon } from "@/components/icons";
import { impactStats, impactStories } from "@/lib/data";

export function ImpactDashboard() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-flame-600">Impact dashboard</p>
            <h2 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
              Measurable access, reuse and skills outcomes.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
              SIT Digital Access is built to report practical outcomes across device deployment,
              learner reach, training, cost savings and circular technology reuse.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Deployment momentum</p>
                <Icon name="chart" className="h-5 w-5 text-flame-600" />
              </div>
              <div className="mt-5 h-36 rounded-lg bg-white p-4 shadow-card">
                <svg className="h-full w-full" viewBox="0 0 320 140" preserveAspectRatio="none">
                  <path d="M0 110 C42 96 50 118 92 86 C142 48 160 82 204 58 C248 34 270 46 320 20" fill="none" stroke="#f97316" strokeWidth="5" />
                  <path d="M0 110 C42 96 50 118 92 86 C142 48 160 82 204 58 C248 34 270 46 320 20 L320 140 L0 140 Z" fill="rgba(249,115,22,.16)" />
                </svg>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-ink p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Reuse value</p>
                <Icon name="leaf" className="h-5 w-5 text-flame-300" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[36, 62, 84, 58, 92, 70].map((height, index) => (
                  <span
                    key={height + index}
                    className="self-end rounded bg-flame-500/80"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/68">
                Placeholder reporting for CO2 savings, avoided cost and training hours.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <article key={stat.label} className="rounded-lg border border-line bg-white p-5 shadow-card">
              <p className="text-3xl font-semibold text-flame-500">{stat.value}</p>
              <h3 className="mt-2 text-sm font-semibold text-ink">{stat.label}</h3>
              {stat.detail ? <p className="mt-2 text-sm leading-6 text-muted">{stat.detail}</p> : null}
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {impactStories.map((story) => (
            <article key={story.title} className="rounded-lg border border-line bg-paper p-5">
              <p className="text-xs font-semibold uppercase text-flame-600">{story.role}</p>
              <h3 className="mt-3 text-lg font-semibold text-ink">{story.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{story.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
