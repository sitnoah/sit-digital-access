import { Icon } from "@/components/icons";
import { africaDeploymentMetrics } from "@/lib/data";

export function ImpactDashboard() {
  return (
    <section id="impact" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
              Impact and trust
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              A deployment dashboard for access, reuse and learning outcomes.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Impact reporting should connect device reuse with learner access, school readiness,
              partner accountability and local support capacity.
            </p>

            <div className="mt-8 rounded-lg border border-line bg-paper p-5">
              <p className="text-sm font-semibold text-ink">Impact stories tracked</p>
              <div className="mt-4 grid gap-3">
                {[
                  "Student success story",
                  "School lab transformation",
                  "NGO field office upgrade"
                ].map((story) => (
                  <div key={story} className="flex items-center gap-3 rounded-lg bg-white p-3">
                    <Icon name="check" className="h-4 w-4 text-flame-600" />
                    <p className="text-sm font-semibold text-ink">{story}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-ink p-5 text-white shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {africaDeploymentMetrics.map((metric) => (
                <article key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame-500 text-white">
                    <Icon name={metric.icon ?? "chart"} className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-3xl font-semibold">{metric.value}</p>
                  <p className="mt-1 text-sm font-semibold text-white/88">{metric.label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/52">{metric.detail}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/24 p-5">
                <p className="text-sm font-semibold text-white">Deployment trend</p>
                <svg className="mt-5 h-32 w-full" viewBox="0 0 420 140" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 105 C58 82 90 112 142 80 C205 40 248 72 300 42 C350 14 380 24 420 10" fill="none" stroke="rgba(249,115,22,.95)" strokeWidth="4" />
                  <path d="M0 122 C80 110 128 116 180 92 C248 60 310 68 420 42" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2" />
                </svg>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/24 p-5">
                <p className="text-sm font-semibold text-white">Reporting model</p>
                <div className="mt-5 space-y-3">
                  {["Asset registers", "Support incidents", "Training hours", "Partner updates"].map((item) => (
                    <div key={item} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-white/68">{item}</span>
                      <span className="rounded-full bg-flame-500/15 px-2.5 py-1 text-xs font-semibold text-flame-200">
                        tracked
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
