import { Icon } from "@/components/icons";

const dashboardMetrics = [
  ["Devices Deployed", "2,543", "+18% this month"],
  ["Learners Reached", "12,840", "+24% this month"],
  ["Countries Supported", "5", "+1 this quarter"]
];

export function HeroDashboardMockup() {
  return (
    <div className="relative mx-auto min-h-[450px] w-full max-w-[620px] sm:min-h-[520px] lg:min-h-[560px]">
      <div className="absolute right-0 top-0 w-[92%] rounded-lg border border-white/14 bg-[#151515]/88 p-4 shadow-soft backdrop-blur-xl sm:w-[88%]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-flame-500 text-[10px] font-bold">
              SIT
            </span>
            <span className="text-xs font-semibold text-white">SIT Digital Access Impact</span>
          </div>
          <div className="flex gap-2 text-white/45">
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="h-1 w-1 rounded-full bg-current" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {dashboardMetrics.map(([label, value, note]) => (
            <div key={label} className="rounded bg-white/[0.055] p-3">
              <p className="text-[10px] text-white/58">{label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-[10px] text-emerald-400">{note}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs font-semibold text-white">Impact Overview</p>
        <div className="relative mt-4 h-28 overflow-hidden rounded bg-gradient-to-b from-white/[0.04] to-flame-500/10">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 480 120" preserveAspectRatio="none">
            <path
              d="M0 82 C45 78 72 70 115 72 C166 76 178 55 228 58 C270 61 286 80 328 70 C365 61 382 35 420 30 C444 27 460 27 480 22"
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
            />
            <path
              d="M0 101 C72 99 124 94 190 91 C275 87 338 89 480 88"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2"
            />
            <path
              d="M0 82 C45 78 72 70 115 72 C166 76 178 55 228 58 C270 61 286 80 328 70 C365 61 382 35 420 30 C444 27 460 27 480 22 L480 120 L0 120 Z"
              fill="rgba(249,115,22,0.18)"
            />
          </svg>
          <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-white/38">
            {["Jan", "Apr", "May", "Jun", "Jul"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 w-[64%] rounded-lg border border-white/25 bg-[#121212] p-3 shadow-soft sm:w-[58%]">
        <div className="aspect-[16/10] rounded border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
          <svg className="h-full w-full p-5" viewBox="0 0 280 160" preserveAspectRatio="none">
            <path d="M0 108 C36 98 54 118 92 100 C132 82 150 68 190 70 C228 71 244 42 280 34" fill="none" stroke="#f97316" strokeWidth="3" />
            <path d="M0 82 C38 70 60 88 96 79 C141 67 158 88 198 98 C232 107 248 86 280 78" fill="none" stroke="#f97316" strokeOpacity=".75" strokeWidth="2" />
            <path d="M0 120 C44 88 86 124 130 112 C176 100 210 104 280 101" fill="none" stroke="#f97316" strokeOpacity=".55" strokeWidth="2" />
          </svg>
        </div>
        <div className="mx-auto h-2 w-[78%] rounded-b-lg bg-zinc-500" />
      </div>

      <div className="absolute bottom-20 right-[18%] hidden w-28 rounded-lg border border-white/15 bg-gradient-to-br from-zinc-700 to-zinc-950 p-4 shadow-soft sm:block">
        <div className="mb-6 h-16 rounded bg-black/25" />
        <div className="space-y-2">
          <span className="block h-2 rounded bg-white/25" />
          <span className="block h-2 w-2/3 rounded bg-white/15" />
          <span className="block h-2 w-1/2 rounded bg-white/15" />
        </div>
        <p className="mt-8 text-xs font-semibold text-white/50">DELL</p>
      </div>

      <div className="absolute bottom-8 right-0 max-w-[210px] rounded-lg border border-white/18 bg-white/[0.08] p-4 shadow-card backdrop-blur sm:bottom-16 sm:p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-flame-400/60 text-flame-400 sm:h-14 sm:w-14">
            <Icon name="shield" className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <p className="text-sm font-semibold leading-5 text-white">
            100% Tested, Configured & Secure
          </p>
        </div>
      </div>
    </div>
  );
}
