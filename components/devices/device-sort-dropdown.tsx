"use client";

import type { DeviceSortOption } from "@/types/device";
import { deviceSortOptions } from "@/lib/device-catalogue";

type DeviceSortDropdownProps = {
  value: DeviceSortOption;
  onChange: (value: DeviceSortOption) => void;
};

export function DeviceSortDropdown({ value, onChange }: DeviceSortDropdownProps) {
  return (
    <label className="block">
      <span className="sr-only">Sort devices</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as DeviceSortOption)}
        className="min-h-12 w-full rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm outline-none transition focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
      >
        {deviceSortOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
