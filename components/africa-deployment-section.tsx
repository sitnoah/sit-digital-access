import { Icon } from "@/components/icons";
import { africaCountries, africaFocus } from "@/lib/data";

export function AfricaDeploymentSection() {
  return (
    <section className="relative overflow-hidden bg-[#101010] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_26%,rgba(249,115,22,0.28),transparent_32%),linear-gradient(145deg,#101010_0%,#171717_55%,#321603_100%)]" />
      <div className="absolute inset-0 surface-grid opacity-[0.16]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Africa deployment</p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Technology access designed around local realities.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              From Liberia, Ghana, Sierra Leone and Nigeria to wider Africa, SIT Digital Access
              focuses on practical deployment models that can be shipped, maintained and taught locally.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {africaCountries.map((country) => (
                <span key={country} className="rounded-full border border-flame-400/30 bg-flame-500/10 px-4 py-2 text-sm font-semibold text-flame-100">
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] rounded-lg border border-white/12 bg-white/[0.05] p-5 shadow-soft backdrop-blur">
            <div className="absolute inset-5 rounded-lg border border-white/10 bg-[linear-gradient(120deg,transparent_0%,rgba(249,115,22,0.08)_45%,transparent_100%)]" />
            <svg className="absolute inset-0 h-full w-full p-8 opacity-75" viewBox="0 0 600 360" preserveAspectRatio="none">
              <path d="M80 250 C140 180 190 230 250 150 C315 64 372 120 432 86 C496 48 525 110 560 72" fill="none" stroke="rgba(249,115,22,.55)" strokeWidth="2" strokeDasharray="8 8" />
              <path d="M110 292 C188 248 220 285 284 214 C338 154 402 188 492 136" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />
            </svg>
            {[
              ["Liberia", "left-[18%] top-[58%]"],
              ["Ghana", "left-[36%] top-[52%]"],
              ["Sierra Leone", "left-[24%] top-[66%]"],
              ["Nigeria", "left-[58%] top-[45%]"],
              ["Wider Africa", "left-[70%] top-[24%]"]
            ].map(([label, position]) => (
              <div key={label} className={`absolute ${position}`}>
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-400 opacity-50" />
                  <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-flame-500" />
                </span>
                <span className="mt-2 block whitespace-nowrap rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white shadow-card">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {africaFocus.map((item) => (
            <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-flame-400/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame-500 text-white">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/64">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
