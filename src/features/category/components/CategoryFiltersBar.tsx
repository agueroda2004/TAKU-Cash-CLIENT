import { useState } from "react";
import { Filter, Search, X, ChevronDown } from "lucide-react";
import Dropdown from "../../../shared/ui/Dropdown";
import { notify } from "../../../lib/notify";
import { categoryFiltersSchema } from "../category.schema";
import type { CategoryFilters, CategoryType } from "../types";

type Props = {
  filters: CategoryFilters;
  onApply: (filters: CategoryFilters) => void;
};

const TYPE_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: "EXPENSE", label: "Gasto" },
  { value: "INCOME", label: "Ingreso" },
];

type DraftFilters = {
  name: string;
  type: CategoryType | null;
  isActive: string | null;
};

function buildDraft(filters: CategoryFilters): DraftFilters {
  return {
    name: filters.name ?? "",
    type: filters.type ?? null,
    isActive:
      filters.isActive === undefined
        ? null
        : filters.isActive
          ? "active"
          : "inactive",
  };
}

function draftToFilters(
  draft: DraftFilters,
  pageSize: number,
): CategoryFilters {
  return {
    name: draft.name.trim() || undefined,
    type: draft.type ?? undefined,
    isActive: draft.isActive === null ? undefined : draft.isActive === "active",
    page: 1,
    pageSize,
  };
}

export default function CategoryFiltersBar({ filters, onApply }: Props) {
  const [draft, setDraft] = useState<DraftFilters>(() => buildDraft(filters));
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasDraftFilters =
    !!draft.name.trim() || !!draft.type || draft.isActive !== null;

  const appliedFilterCount =
    (filters.name ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (filters.isActive !== undefined ? 1 : 0);

  function handleApply() {
    const result = categoryFiltersSchema.safeParse(draft);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      if (firstError) notify({ success: false, message: firstError });
      return;
    }
    onApply(draftToFilters(draft, filters.pageSize));
  }

  function handleClear() {
    const empty: DraftFilters = { name: "", type: null, isActive: null };
    setDraft(empty);
    onApply({ page: 1, pageSize: filters.pageSize });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="category-filters-panel"
          className="inline-flex h-11 flex-1 items-center justify-between gap-2 rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400" />
            Filtros
            {appliedFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-duo-green px-1.5 text-xs font-bold text-white">
                {appliedFilterCount}
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition ${mobileOpen ? "rotate-180" : ""}`}
          />
        </button>

        {hasDraftFilters && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar filtros"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        id="category-filters-panel"
        className={mobileOpen ? "block" : "hidden sm:block"}
      >
        <div className="space-y-3 sm:flex sm:flex-row sm:items-center sm:gap-3 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              placeholder="Buscar por nombre..."
              className="h-11 w-full rounded-xl border-2 border-zinc-200 bg-white pl-11 pr-4 text-base outline-none transition placeholder:text-zinc-400 focus:border-duo-green md:text-sm"
            />
          </div>

          <div className="sm:w-48">
            <Dropdown
              options={TYPE_OPTIONS}
              value={draft.type}
              onChange={(v) => setDraft((d) => ({ ...d, type: v }))}
              placeholder="Todos los tipos"
            />
          </div>

          <div className="sm:w-44">
            <Dropdown
              options={[
                { value: "active", label: "Activas" },
                { value: "inactive", label: "Inactivas" },
              ]}
              value={draft.isActive ?? "active"}
              onChange={(v) => setDraft((d) => ({ ...d, isActive: v }))}
              placeholder="Estado"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApply}
              disabled={!hasDraftFilters}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-duo-green px-4 text-sm font-bold text-white transition hover:bg-duo-green/90 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              <Filter className="h-4 w-4" />
              Filtrar
            </button>

            {hasDraftFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-zinc-200 px-4 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
