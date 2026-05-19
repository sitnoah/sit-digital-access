import { Icon } from "@/components/icons";
import { africaDeploymentStrategies, africaOperationalReadiness } from "@/lib/data";

export function DeploymentStrategyGrid() {
  return (
    <section id="strategy" className="relative overflow-hidden bg-[#090909] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(249,115,22,0.2),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(249,115,22,0.14),transparent_26%),linear-gradient(180deg,#111111_0%,#090909_56%,#050505_100%)]" />
      <div className="absolute inset-0 surface-grid opacity-[0.08]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-300">
              Deployment strategy
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Technology access designed around local realities.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/66">
              Africa deployment is not only device supply. It is logistics, power, connectivity,
              support ownership, classroom operations and partner accountability.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-4 sm:grid-cols-5">
            {africaOperationalReadiness.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-black/24 p-3 text-center">
                <Icon name="check" className="mx-auto h-4 w-4 text-flame-300" />
                <p className="mt-2 text-xs font-semibold leading-5 text-white/76">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {africaDeploymentStrategies.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-flame-400/45 hover:bg-white/[0.075]"
            >
              <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-flame-500 to-transparent transition duration-300 group-hover:scale-x-100" />
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white shadow-[0_16px_40px_rgba(249,115,22,0.22)]">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/62">{item.description}</p>
              <div className="mt-5 rounded-lg border border-flame-400/18 bg-flame-500/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-200">
                  Operational insight
                </p>
                <p className="mt-2 text-sm leading-6 text-white/74">{item.insight}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
