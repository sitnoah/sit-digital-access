import { cn } from "@/lib/utils";

const toneByStatus: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-200",
  REVIEWING: "bg-amber-50 text-amber-700 ring-amber-200",
  CONTACTED: "bg-purple-50 text-purple-700 ring-purple-200",
  QUALIFIED: "bg-green-50 text-green-700 ring-green-200",
  QUOTED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  RESERVED: "bg-orange-50 text-orange-700 ring-orange-200",
  FULFILLED: "bg-green-50 text-green-700 ring-green-200",
  COLLECTION_NEEDED: "bg-orange-50 text-orange-700 ring-orange-200",
  COLLECTION_ARRANGED: "bg-orange-50 text-orange-700 ring-orange-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  RECEIVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  COMPLETED: "bg-green-50 text-green-700 ring-green-200",
  AVAILABLE: "bg-green-50 text-green-700 ring-green-200",
  DEPLOYED: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  REPAIR: "bg-amber-50 text-amber-700 ring-amber-200",
  RETIRED: "bg-red-50 text-red-700 ring-red-200",
  CLOSED: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  HIGH: "bg-red-50 text-red-700 ring-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
  LOW: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  A: "bg-green-50 text-green-700 ring-green-200",
  B: "bg-blue-50 text-blue-700 ring-blue-200",
  C: "bg-amber-50 text-amber-700 ring-amber-200",
  PARTS_REPAIR: "bg-red-50 text-red-700 ring-red-200"
};

export function StatusBadge({ value, className }: { value?: string; className?: string }) {
  if (!value) return null;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        toneByStatus[value] ?? "bg-zinc-100 text-zinc-700 ring-zinc-200",
        className
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
