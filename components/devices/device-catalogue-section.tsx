"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { DeviceCompareDrawer } from "@/components/devices/device-compare-drawer";
import { DeviceFilterSidebar } from "@/components/devices/device-filter-sidebar";
import { DeviceListItem } from "@/components/devices/device-list-item";
import { DeviceMobileFilters } from "@/components/devices/device-mobile-filters";
import { DeviceProductCard } from "@/components/devices/device-product-card";
import { DeviceSearchBar } from "@/components/devices/device-search-bar";
import { DeviceSortDropdown } from "@/components/devices/device-sort-dropdown";
import { deviceFilterGroups, deviceProducts, emptyDeviceFilters } from "@/lib/device-catalogue";
import { cn } from "@/lib/utils";
import type { DeviceFilterState, DeviceProduct, DeviceSortOption, DeviceViewMode } from "@/types/device";

function hasActiveFilters(filters: DeviceFilterState) {
  return Object.values(filters).some((values) => values.length > 0);
}

function selectedFilterLabels(filters: DeviceFilterState) {
  return Object.values(filters).flat();
}

function toggleFilterValue(filters: DeviceFilterState, group: keyof DeviceFilterState, value: string): DeviceFilterState {
  const active = filters[group];
  return {
    ...filters,
    [group]: active.includes(value)
      ? active.filter((item) => item !== value)
      : [...active, value]
  };
}

function matchesAny(selected: string[], values: string[]) {
  return selected.length === 0 || selected.some((item) => values.includes(item));
}

function matchesPriceRange(product: DeviceProduct, ranges: string[]) {
  if (ranges.length === 0) return true;
  return ranges.some((range) => {
    if (range === "Custom quote") return !product.fromPrice || product.priceLabel.toLowerCase().includes("quote");
    if (!product.fromPrice) return false;
    if (range === "Under £150") return product.fromPrice < 150;
    if (range === "£150-£250") return product.fromPrice >= 150 && product.fromPrice <= 250;
    if (range === "£250-£400") return product.fromPrice > 250 && product.fromPrice <= 400;
    if (range === "£400+") return product.fromPrice > 400;
    return true;
  });
}

function filterProducts(products: DeviceProduct[], filters: DeviceFilterState, search: string) {
  const query = search.trim().toLowerCase();
  return products.filter((product) => {
    const searchable = [
      product.name,
      product.category,
      product.shortDescription,
      product.longDescription,
      product.bestFor,
      product.tags.join(" "),
      product.useCases.join(" "),
      product.processorOptions.join(" "),
      product.ramOptions.join(" "),
      product.storageOptions.join(" "),
      product.supportIncluded.join(" "),
      product.deploymentTypes.join(" "),
      product.specifications.map((spec) => `${spec.label} ${spec.value}`).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      matchesAny(filters.categories, [product.category]) &&
      matchesAny(filters.useCases, product.useCases) &&
      matchesAny(filters.processors, product.processorOptions) &&
      matchesAny(filters.ram, product.ramOptions) &&
      matchesAny(filters.storage, product.storageOptions) &&
      matchesAny(filters.conditionGrades, product.conditionGrades) &&
      matchesPriceRange(product, filters.priceRanges) &&
      matchesAny(filters.deploymentTypes, product.deploymentTypes) &&
      matchesAny(filters.supportIncluded, product.supportIncluded) &&
      matchesAny(filters.availability, [product.availability])
    );
  });
}

function sortProducts(products: DeviceProduct[], sort: DeviceSortOption) {
  return [...products].sort((a, b) => {
    if (sort === "Lowest price") return (a.fromPrice ?? 999999) - (b.fromPrice ?? 999999);
    if (sort === "Highest specification") return (b.performanceScore ?? 0) - (a.performanceScore ?? 0);
    if (sort === "Best for education") return (b.educationFit ?? 0) - (a.educationFit ?? 0);
    if (sort === "Best for Africa deployment") return (b.africaFit ?? 0) - (a.africaFit ?? 0);
    if (sort === "Low power first") return (b.lowPowerScore ?? 0) - (a.lowPowerScore ?? 0);
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

function valuesFromParam(value: string | null, allowed: string[]) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => allowed.includes(item));
}

function filtersFromSearchParams(params: { get: (key: string) => string | null }): DeviceFilterState {
  const next: DeviceFilterState = { ...emptyDeviceFilters };

  deviceFilterGroups.forEach((group) => {
    next[group.id] = valuesFromParam(params.get(group.id), group.options);
  });

  return next;
}

export function DeviceCatalogueSection() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<DeviceFilterState>(emptyDeviceFilters);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<DeviceSortOption>("Recommended");
  const [viewMode, setViewMode] = useState<DeviceViewMode>("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams));

    const compare = searchParams.get("compare");
    if (!compare) {
      setCompareSlugs([]);
      setCompareOpen(false);
      return;
    }

    const slugs = compare
      .split(",")
      .map((slug) => slug.trim())
      .filter((slug) => deviceProducts.some((product) => product.slug === slug))
      .slice(0, 3);

    if (slugs.length > 0) {
      setCompareSlugs(slugs);
      setCompareOpen(true);
    } else {
      setCompareSlugs([]);
      setCompareOpen(false);
    }
  }, [searchParams]);

  const results = useMemo(
    () => sortProducts(filterProducts(deviceProducts, filters, search), sort),
    [filters, search, sort]
  );

  const compareProducts = useMemo(
    () => compareSlugs.map((slug) => deviceProducts.find((product) => product.slug === slug)).filter(Boolean) as DeviceProduct[],
    [compareSlugs]
  );

  function handleToggleFilter(group: keyof DeviceFilterState, value: string) {
    setFilters((current) => toggleFilterValue(current, group, value));
  }

  function handleToggleCompare(product: DeviceProduct) {
    setCompareSlugs((current) => {
      if (current.includes(product.slug)) return current.filter((slug) => slug !== product.slug);
      if (current.length >= 3) return current;
      return [...current, product.slug];
    });
  }

  function clearFilters() {
    setFilters(emptyDeviceFilters);
    setSearch("");
  }

  const activeFilters = selectedFilterLabels(filters);

  return (
    <section id="device-catalogue" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
              Device catalogue
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Refurbished devices prepared for classrooms, teams and communities.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              Browse learner laptops, business devices, mini PCs, desktops and full computer
              lab bundles prepared for practical deployment, supportability and long-term value.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-paper p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <DeviceSearchBar value={search} onChange={setSearch} />
              <DeviceSortDropdown value={sort} onChange={setSort} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {(["grid", "list"] as DeviceViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                      viewMode === mode
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-muted hover:text-ink"
                    )}
                  >
                    <Icon name={mode === "grid" ? "grid" : "list"} className="h-4 w-4" />
                    {mode === "grid" ? "Grid view" : "Compact list"}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <Icon name="sliders" className="h-4 w-4" />
                  Filters
                </button>
                <DeviceCompareDrawer
                  products={compareProducts}
                  open={compareOpen}
                  onOpen={() => setCompareOpen(true)}
                  onClose={() => setCompareOpen(false)}
                  onRemove={(slug) => setCompareSlugs((current) => current.filter((item) => item !== slug))}
                />
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-muted transition hover:text-ink"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeFilters.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span key={filter} className="rounded-full border border-flame-200 bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                {filter}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
          <DeviceFilterSidebar
            filters={filters}
            onToggle={handleToggleFilter}
            className="sticky top-36 hidden max-h-[calc(100vh-160px)] overflow-y-auto lg:block"
          />

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ink">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              {hasActiveFilters(filters) || search ? (
                <p className="text-sm text-muted">Filtered catalogue view</p>
              ) : (
                <p className="text-sm text-muted">Recommended deployment-ready products</p>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-lg border border-line bg-paper p-10 text-center">
                <Icon name="package" className="mx-auto h-8 w-8 text-muted" />
                <p className="mt-4 text-sm font-semibold text-ink">No devices match those filters</p>
                <p className="mt-2 text-sm text-muted">Try clearing filters or searching for a broader device type.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 min-h-10 rounded-full bg-flame-500 px-5 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {results.map((product, index) => (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: index * 0.025 }}
                  >
                    <DeviceProductCard
                      product={product}
                      selected={compareSlugs.includes(product.slug)}
                      compareDisabled={compareSlugs.length >= 3}
                      onToggleCompare={handleToggleCompare}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((product) => (
                  <DeviceListItem
                    key={product.slug}
                    product={product}
                    selected={compareSlugs.includes(product.slug)}
                    compareDisabled={compareSlugs.length >= 3}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <DeviceMobileFilters
          open={mobileFiltersOpen}
          filters={filters}
          onToggle={handleToggleFilter}
          onClose={() => setMobileFiltersOpen(false)}
          onClear={clearFilters}
        />
      </div>
    </section>
  );
}
