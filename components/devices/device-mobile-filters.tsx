"use client";

import { Icon } from "@/components/icons";
import { DeviceFilterSidebar } from "@/components/devices/device-filter-sidebar";
import type { DeviceFilterState } from "@/types/device";

type DeviceMobileFiltersProps = {
  open: boolean;
  filters: DeviceFilterState;
  onToggle: (group: keyof DeviceFilterState, value: string) => void;
  onClose: () => void;
  onClear: () => void;
};

export function DeviceMobileFilters({
  open,
  filters,
  onToggle,
  onClose,
  onClear
}: DeviceMobileFiltersProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/45 lg:hidden">
      <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-paper p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">
              Catalogue filters
            </p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Refine devices</h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white"
            onClick={onClose}
            aria-label="Close filters"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <DeviceFilterSidebar filters={filters} onToggle={onToggle} />
        <div className="sticky bottom-0 mt-4 grid grid-cols-2 gap-3 bg-paper py-4">
          <button
            type="button"
            className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink"
            onClick={onClear}
          >
            Clear filters
          </button>
          <button
            type="button"
            className="min-h-11 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white"
            onClick={onClose}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
