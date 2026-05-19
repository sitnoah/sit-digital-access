"use client";

import type { DeviceFilterState } from "@/types/device";
import { deviceFilterGroups } from "@/lib/device-catalogue";
import { cn } from "@/lib/utils";

type DeviceFilterSidebarProps = {
  filters: DeviceFilterState;
  onToggle: (group: keyof DeviceFilterState, value: string) => void;
  className?: string;
};

export function DeviceFilterSidebar({ filters, onToggle, className }: DeviceFilterSidebarProps) {
  return (
    <aside className={cn("rounded-lg border border-line bg-white p-5 shadow-card", className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink">Filters</h3>
        <span className="rounded-full bg-flame-50 px-2.5 py-1 text-xs font-semibold text-flame-700">
          Advanced
        </span>
      </div>

      <div className="mt-5 space-y-6">
        {deviceFilterGroups.map((group) => (
          <fieldset key={group.id} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
            <legend className="text-sm font-semibold text-ink">{group.label}</legend>
            <div className="mt-3 grid gap-2">
              {group.options.map((option) => {
                const checked = filters[group.id].includes(option);
                return (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted transition hover:bg-paper hover:text-ink"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(group.id, option)}
                      className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-400"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </aside>
  );
}
