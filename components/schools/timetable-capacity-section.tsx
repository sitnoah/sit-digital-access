import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";

const planningCards = [
  "Learner/device ratio",
  "Sessions per week",
  "Class rotation planning",
  "Shared lab booking model",
  "Instructor availability",
  "Maintenance windows"
];

export function TimetableCapacitySection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <AnimatedSection>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
              Timetable and capacity
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Plan device access around real teaching demand.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Lab planning should reflect real course delivery: how many learners need access,
              how often rooms are used, when instructors teach, and when maintenance can happen.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {planningCards.map((card) => (
                <div key={card} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-white">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-white/82">{card}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-soft backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-300">
                  Weekly lab usage
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Capacity planning dashboard</h3>
              </div>
              <span className="rounded-full bg-flame-500 px-3 py-1 text-xs font-semibold">Peak: Wed</span>
            </div>
            <div className="mt-6 grid h-48 grid-cols-7 items-end gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
              {[52, 72, 94, 78, 84, 40, 30].map((height, index) => (
                <div key={index} className="flex h-full flex-col justify-end gap-2">
                  <span
                    className="rounded-t-xl bg-gradient-to-t from-flame-600 to-flame-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-center text-xs font-semibold text-white/45">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Utilisation", "82%", "Healthy"],
                ["Course coverage", "6 pathways", "This term"],
                ["Maintenance", "Friday PM", "Window"]
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-flame-300">{value}</p>
                  <p className="mt-1 text-sm text-white/55">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
