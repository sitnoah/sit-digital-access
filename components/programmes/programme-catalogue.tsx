"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { ProgrammeCard } from "@/components/programmes/programme-card";
import { ProgrammeComparisonDrawer } from "@/components/programmes/programme-comparison-drawer";
import {
  programmeFilters,
  programmeSortOptions,
  programmes,
  sortProgrammes
} from "@/lib/programmes";
import { cn } from "@/lib/utils";
import type { ProgrammeFilter, ProgrammeSort } from "@/types/programme";

export function ProgrammeCatalogue() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<ProgrammeFilter>("All programmes");
  const [sort, setSort] = useState<ProgrammeSort>("Recommended");
  const [query, setQuery] = useState("");
  const [compareOpen, setCompareOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const nextFilter = searchParams.get("filter");
    if (nextFilter && programmeFilters.includes(nextFilter as ProgrammeFilter)) {
      setFilter(nextFilter as ProgrammeFilter);
    } else {
      setFilter("All programmes");
    }
  }, [searchParams]);

  const visibleProgrammes = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();
    const filtered = programmes.filter((programme) => {
      const matchesFilter = filter === "All programmes" || programme.category === filter;
      const searchText = [
        programme.title,
        programme.category,
        programme.shortDescription,
        programme.bestFor.join(" "),
        programme.useCases.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      return matchesFilter && (!normalisedQuery || searchText.includes(normalisedQuery));
    });

    return sortProgrammes(filtered, sort);
  }, [filter, query, sort]);

  const selectedProgrammes = programmes.filter((programme) => selected.includes(programme.slug));

  function toggleCompare(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  }

  return (
    <section id="programme-catalogue" className="scroll-mt-36 bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f5_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Programme pathways
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Choose the access, training and deployment model that matches the people you need to serve.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Explore learner access, school labs, community hubs, SME upgrades, sponsored cohorts
              and Africa-ready deployment models.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <label className="relative block">
              <Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search programmes..."
                className="min-h-12 w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as ProgrammeSort)}
                className="min-h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              >
                {programmeSortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ProgrammeComparisonDrawer
                programmes={selectedProgrammes}
                open={compareOpen}
                onOpen={() => setCompareOpen(true)}
                onClose={() => setCompareOpen(false)}
                onRemove={(slug) => setSelected((current) => current.filter((item) => item !== slug))}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setFilter("All programmes");
                setSort("Recommended");
                setQuery("");
              }}
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-line text-sm font-semibold text-muted transition hover:border-flame-300 hover:text-ink"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-card"
            aria-expanded={mobileFiltersOpen}
            aria-controls="programme-mobile-filters"
          >
            <Icon name="sliders" className="h-4 w-4" />
            Filters
          </button>
          <span className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted">
            {filter}
          </span>
        </div>

        <div className="sticky top-32 z-20 mt-8 hidden overflow-x-auto border-y border-line bg-paper/90 py-3 backdrop-blur lg:block">
          <div className="flex gap-2">
            {programmeFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-flame-400",
                  filter === item
                    ? "border-ink bg-ink text-white shadow-card"
                    : "border-line bg-white text-muted hover:border-flame-300 hover:text-ink"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-muted">{visibleProgrammes.length} programmes shown</p>
          {selected.length >= 3 ? (
            <p className="text-sm font-semibold text-flame-600">Compare limit reached</p>
          ) : null}
        </div>

        {visibleProgrammes.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-line bg-white p-10 text-center shadow-card">
            <p className="text-lg font-semibold text-ink">No programmes found</p>
            <p className="mt-2 text-sm text-muted">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProgrammes.map((programme) => (
              <ProgrammeCard
                key={programme.slug}
                programme={programme}
                selected={selected.includes(programme.slug)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" id="programme-mobile-filters">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">
                  Filters
                </p>
                <h3 className="mt-1 text-xl font-semibold text-ink">Programme discovery</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink"
                aria-label="Close programme filters"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <label className="relative mt-5 block">
              <Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search programmes..."
                className="min-h-12 w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
              />
            </label>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as ProgrammeSort)}
              className="mt-4 min-h-12 w-full rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-flame-300 focus:ring-4 focus:ring-flame-100"
            >
              {programmeSortOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {programmeFilters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    filter === item
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-paper text-muted"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setFilter("All programmes");
                  setSort("Recommended");
                  setQuery("");
                }}
                className="min-h-12 rounded-full border border-line text-sm font-semibold text-ink"
              >
                Clear filters
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="min-h-12 rounded-full bg-flame-500 text-sm font-semibold text-white"
              >
                Show {visibleProgrammes.length} programmes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
