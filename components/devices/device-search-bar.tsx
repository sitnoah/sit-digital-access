"use client";

import { Icon } from "@/components/icons";

type DeviceSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DeviceSearchBar({ value, onChange }: DeviceSearchBarProps) {
  return (
    <label className="relative block">
      <span className="sr-only">Search devices</span>
      <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search devices, bundles or specifications..."
        className="min-h-12 w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
      />
    </label>
  );
}
