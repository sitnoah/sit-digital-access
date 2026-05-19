"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Programme } from "@/types/programme";

type ProgrammeComparisonDrawerProps = {
  programmes: Programme[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRemove: (slug: string) => void;
};

export function ProgrammeComparisonDrawer({
  programmes,
  open,
  onOpen,
  onClose,
  onRemove
}: ProgrammeComparisonDrawerProps) {
  if (!open) {
    return (
      <button
        type="button"
        disabled={programmes.length === 0}
        onClick={onOpen}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted"
      >
        Compare selected ({programmes.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/45">
      <aside className="absolute inset-y-0 right-0 w-full max-w-5xl overflow-y-auto bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">Comparison</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Compare selected programmes</h2>
            <p className="mt-2 text-sm text-muted">Select up to 3 programmes to compare readiness, support and sponsorship fit.</p>
          </div>
          <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close comparison">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {programmes.length === 0 ? (
          <div className="mt-10 rounded-lg border border-line bg-paper p-8 text-center">
            <p className="text-sm font-semibold text-ink">No programmes selected</p>
            <p className="mt-2 text-sm text-muted">Use the compare checkboxes in the catalogue.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-line text-left text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="p-4 font-semibold">Criteria</th>
                  {programmes.map((programme) => (
                    <th key={programme.slug} className="p-4 font-semibold">
                      <div className="flex items-start justify-between gap-3">
                        <span>{programme.title}</span>
                        <button type="button" onClick={() => onRemove(programme.slug)} aria-label={`Remove ${programme.title}`}>
                          <Icon name="close" className="h-4 w-4 text-white/70" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Best for", (p: Programme) => p.bestFor.join(", ")],
                  ["Device model", (p: Programme) => p.deviceModel],
                  ["Training", (p: Programme) => (p.trainingIncluded ? "Included or available" : "Optional")],
                  ["Support level", (p: Programme) => p.supportLevel],
                  ["Africa readiness", (p: Programme) => p.africaReadiness],
                  ["Sponsorship", (p: Programme) => (p.sponsorReady ? "Sponsor-ready" : "Partnership-based")],
                  ["Cohort size", (p: Programme) => p.cohortRange],
                  ["Complexity", (p: Programme) => p.deploymentComplexity]
                ].map(([label, getter]) => (
                  <tr key={label as string} className="odd:bg-white even:bg-paper">
                    <td className="border-t border-line p-4 font-semibold text-ink">{label as string}</td>
                    {programmes.map((programme) => (
                      <td key={programme.slug} className="border-t border-line p-4 text-muted">
                        {(getter as (programme: Programme) => string)(programme)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="min-h-11 rounded-full border border-line px-5 text-sm font-semibold" onClick={onClose}>
            Continue browsing
          </button>
          <Link href="#programme-enquiry" onClick={onClose} className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
            Ask about these programmes
          </Link>
        </div>
      </aside>
    </div>
  );
}
