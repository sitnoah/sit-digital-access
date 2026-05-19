"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import {
  adminApi,
  type ApiRecord,
  type DeviceRequestStatus,
  type DonationStatus,
  type EnquiryPriority,
  type EnquiryStatus,
  type InventoryStatus
} from "@/lib/api";
import { cn } from "@/lib/utils";

type ResourceKind = "enquiries" | "deviceRequests" | "donations" | "inventory";

type ResourceConfig = {
  title: string;
  description: string;
  resourceType: string;
  searchPlaceholder: string;
  primaryFields: string[];
  secondaryFields: string[];
  statusOptions: string[];
  list: (token: string) => Promise<ApiRecord[]>;
  get: (token: string, id: string) => Promise<ApiRecord>;
  updateStatus: (token: string, id: string, status: string, item: ApiRecord) => Promise<ApiRecord>;
};

const configs: Record<ResourceKind, ResourceConfig> = {
  enquiries: {
    title: "Enquiries",
    description: "Contact, partnership, school lab, SME/NGO and Africa deployment enquiries.",
    resourceType: "enquiries",
    searchPlaceholder: "Search enquiries...",
    primaryFields: ["fullName", "organisation", "email", "country", "enquiryType", "organisationType"],
    secondaryFields: [
      "phone",
      "deploymentLocation",
      "deploymentScale",
      "estimatedLearnerCount",
      "powerAvailability",
      "connectivityProfile",
      "timeline",
      "deviceCategories",
      "supportModelRequired",
      "message",
      "createdAt",
      "updatedAt"
    ],
    statusOptions: ["NEW", "REVIEWING", "CONTACTED", "QUALIFIED", "CLOSED"],
    list: adminApi.listEnquiries,
    get: adminApi.getEnquiry,
    updateStatus: (token, id, status, item) =>
      adminApi.updateEnquiryStatus(token, id, {
        status: status as EnquiryStatus,
        priority: item.priority as EnquiryPriority | undefined
      })
  },
  deviceRequests: {
    title: "Device Requests",
    description: "Structured requests for laptops, desktops, mini PCs, labs and accessories.",
    resourceType: "deviceRequests",
    searchPlaceholder: "Search device requests...",
    primaryFields: ["requesterName", "organisation", "email", "deviceCategory", "productSlug", "quantity"],
    secondaryFields: ["country", "budgetRange", "intendedUse", "deploymentLocation", "requiredBy", "notes"],
    statusOptions: ["NEW", "REVIEWING", "QUOTED", "RESERVED", "FULFILLED", "CLOSED"],
    list: adminApi.listDeviceRequests,
    get: adminApi.getDeviceRequest,
    updateStatus: (token, id, status) =>
      adminApi.updateDeviceRequestStatus(token, id, { status: status as DeviceRequestStatus })
  },
  donations: {
    title: "Donations",
    description: "Device donations, sponsorships and corporate recycling partnership offers.",
    resourceType: "donations",
    searchPlaceholder: "Search donations...",
    primaryFields: ["donorName", "donorType", "email", "donationType", "deviceCount"],
    secondaryFields: ["country", "deviceCondition", "pickupLocation", "sponsorshipAmount", "message"],
    statusOptions: ["NEW", "REVIEWING", "CONTACTED", "COLLECTION_ARRANGED", "RECEIVED", "CLOSED"],
    list: adminApi.listDonations,
    get: adminApi.getDonation,
    updateStatus: (token, id, status) =>
      adminApi.updateDonationStatus(token, id, { status: status as DonationStatus })
  },
  inventory: {
    title: "Inventory",
    description: "Admin-only refurbished device inventory and lifecycle tracking.",
    resourceType: "inventory",
    searchPlaceholder: "Search inventory...",
    primaryFields: ["assetTag", "deviceType", "brand", "model", "conditionGrade"],
    secondaryFields: ["processor", "ram", "storage", "location", "assignedTo", "costPrice", "suggestedPrice", "warrantyMonths", "notes"],
    statusOptions: ["AVAILABLE", "RESERVED", "DEPLOYED", "REPAIR", "RETIRED"],
    list: adminApi.listInventory,
    get: adminApi.getInventoryItem,
    updateStatus: (token, id, status) =>
      adminApi.updateInventoryItem(token, id, { status: status as InventoryStatus })
  }
};

function formatLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()).trim();
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (Array.isArray(value)) {
    return value.length ? value.map((item) => String(item).replaceAll("_", " ")).join(", ") : "Not provided";
  }
  if (typeof value === "number") return value.toLocaleString();
  return String(value).replaceAll("_", " ");
}

function exportCsv(filename: string, rows: ApiRecord[]) {
  if (!rows.length) return;
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row)))).slice(0, 40);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const serialised = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
          return `"${serialised.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function InventoryCreateForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const { token } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);
    try {
      await adminApi.createInventoryItem(token, {
        assetTag: String(data.get("assetTag")),
        deviceType: String(data.get("deviceType")),
        brand: String(data.get("brand")),
        model: String(data.get("model")),
        processor: String(data.get("processor") || ""),
        ram: String(data.get("ram") || ""),
        storage: String(data.get("storage") || ""),
        conditionGrade: String(data.get("conditionGrade")) as "A" | "B" | "C" | "PARTS_REPAIR",
        status: String(data.get("status")) as InventoryStatus,
        location: String(data.get("location")),
        warrantyMonths: data.get("warrantyMonths") ? Number(data.get("warrantyMonths")) : undefined,
        notes: String(data.get("notes") || "")
      });
      event.currentTarget.reset();
      setMessage("Inventory item added.");
      await onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to add inventory item.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-card">
      <button
        className="flex w-full items-center justify-between text-left text-sm font-semibold"
        onClick={() => setOpen((value) => !value)}
      >
        Add inventory item
        <Icon name="chevron" className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <form className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
          {["assetTag", "deviceType", "brand", "model", "processor", "ram", "storage", "location"].map((field) => (
            <label key={field} className="text-xs font-semibold text-muted">
              {formatLabel(field)}
              <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink" name={field} required={["assetTag", "deviceType", "brand", "model", "location"].includes(field)} />
            </label>
          ))}
          <label className="text-xs font-semibold text-muted">
            Grade
            <select className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink" name="conditionGrade" defaultValue="A">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="PARTS_REPAIR">Parts / repair</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-muted">
            Status
            <select className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink" name="status" defaultValue="AVAILABLE">
              {configs.inventory.statusOptions.map((status) => (
                <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-muted">
            Warranty months
            <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink" name="warrantyMonths" type="number" min="0" />
          </label>
          <label className="text-xs font-semibold text-muted sm:col-span-2">
            Notes
            <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink" name="notes" />
          </label>
          <div className="flex items-end">
            <button className="min-h-10 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white disabled:bg-muted" disabled={loading}>
              {loading ? "Saving..." : "Save item"}
            </button>
          </div>
          {message ? <p className="text-sm text-muted sm:col-span-2 lg:col-span-4">{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}

export function AdminResourcePage({ resource }: { resource: ResourceKind }) {
  const config = configs[resource];
  const { token } = useAdminAuth();
  const [items, setItems] = useState<ApiRecord[]>([]);
  const [selected, setSelected] = useState<ApiRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<ApiRecord[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setItems(await config.list(token));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }, [config, token]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "ALL" || item.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  async function openDetail(item: ApiRecord) {
    if (!token) return;
    setError(null);
    try {
      const detail = await config.get(token, item.id);
      setSelected(detail);
      try {
        setAuditLogs(await adminApi.listAuditLogs(token, config.resourceType, item.id));
      } catch {
        setAuditLogs([]);
      }
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Unable to load record detail.");
    }
  }

  async function updateStatus(status: string) {
    if (!token || !selected) return;
    setError(null);
    try {
      const updated = await config.updateStatus(token, selected.id, status, selected);
      setSelected(updated);
      await loadItems();
      try {
        setAuditLogs(await adminApi.listAuditLogs(token, config.resourceType, selected.id));
      } catch {
        setAuditLogs([]);
      }
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update record status.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-600">{config.title}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{config.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{config.description}</p>
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold shadow-card transition hover:border-flame-300"
          onClick={() => exportCsv(`sit-digital-access-${resource}.csv`, filteredItems)}
        >
          Export CSV
        </button>
      </div>

      {resource === "inventory" ? <InventoryCreateForm onCreated={loadItems} /> : null}

      <div className="grid gap-3 rounded-lg border border-line bg-white p-4 shadow-card md:grid-cols-[1fr_220px]">
        <input
          className="rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-flame-400 focus:ring-4 focus:ring-flame-100"
          placeholder={config.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-flame-400 focus:ring-4 focus:ring-flame-100"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="ALL">All statuses</option>
          {config.statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading records...</p>
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center">
            <Icon name="database" className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-4 text-sm font-semibold text-ink">No records yet</p>
            <p className="mt-2 text-sm text-muted">Firestore is connected; records will appear here as forms are submitted.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                className="grid w-full gap-3 px-4 py-4 text-left transition hover:bg-paper md:grid-cols-[1.1fr_0.8fr_auto]"
                onClick={() => void openDetail(item)}
              >
                <div>
                  <p className="font-semibold text-ink">
                    {formatValue(item.fullName ?? item.requesterName ?? item.donorName ?? item.assetTag ?? item.id)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{formatValue(item.organisation ?? item.brand ?? item.email)}</p>
                </div>
                <div className="text-sm text-muted">
                  <p>{formatValue(item.enquiryType ?? item.deviceCategory ?? item.donationType ?? item.deviceType)}</p>
                  <p className="mt-1">{formatValue(item.country ?? item.location ?? item.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <StatusBadge value={item.priority as string | undefined} />
                  <StatusBadge value={item.status as string | undefined} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected ? (
        <aside className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-line bg-white p-5 shadow-soft sm:w-[520px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-600">Detail</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {formatValue(selected.fullName ?? selected.requesterName ?? selected.donorName ?? selected.assetTag ?? selected.id)}
              </h3>
            </div>
            <button className="rounded-full border border-line p-2" onClick={() => setSelected(null)}>
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-line p-4">
            <label className="text-sm font-semibold text-ink">
              Update status
              <select
                className="mt-2 w-full rounded-lg border border-line px-4 py-3 text-sm"
                value={(selected.status as string | undefined) ?? ""}
                onChange={(event) => void updateStatus(event.target.value)}
              >
                {config.statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-3">
            {[...config.primaryFields, ...config.secondaryFields].map((field) => (
              <div key={field} className="rounded-lg bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{formatLabel(field)}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{formatValue(selected[field])}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-line p-4">
            <h4 className="text-sm font-semibold text-ink">Notes</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
              {formatValue(selected.notes ?? selected.message)}
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-line p-4">
            <h4 className="text-sm font-semibold text-ink">Audit trail</h4>
            <div className="mt-4 space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-sm text-muted">No audit events for this record yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="rounded-lg bg-paper p-3">
                    <p className="text-sm font-semibold text-ink">{formatValue(log.action)}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatValue(log.actorEmail)} • {formatValue(log.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
