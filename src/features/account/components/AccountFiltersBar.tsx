import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import Dropdown from "../../../shared/ui/Dropdown";
import { ACCOUNT_TYPES, ACCOUNT_STATUSES } from "./constants";
import { CURRENCIES } from "../../../constants/data";
import { notify } from "../../../lib/notify";
import { accountDraftSchema } from "../account.schema";
import type { CurrencyCode } from "../../../constants/data";
import type { AccountStatus } from "./constants";
import type { AccountFilters, AccountType } from "../types";

type Props = {
  filters: AccountFilters;
  onApply: (filters: AccountFilters) => void;
};

const VALID_TYPES = new Set(ACCOUNT_TYPES.map((t) => t.value));

type DraftFilters = {
  name: string;
  type: AccountType | null;
  currency: CurrencyCode | null;
  status: AccountStatus;
};

function buildDraft(filters: AccountFilters): DraftFilters {
  return {
    name: filters.name ?? "",
    type: filters.type && VALID_TYPES.has(filters.type) ? filters.type : null,
    currency: filters.currency ?? null,
    status: filters.isActive === false ? "inactive" : "active",
  };
}

function draftToFilters(draft: DraftFilters, pageSize: number): AccountFilters {
  return {
    name: draft.name.trim() || undefined,
    type: draft.type ?? undefined,
    currency: draft.currency ?? undefined,
    isActive: draft.status === "active",
    page: 1,
    pageSize,
  };
}

export default function AccountFiltersBar({ filters, onApply }: Props) {
  const [draft, setDraft] = useState<DraftFilters>(() => buildDraft(filters));

  const appliedDraft = buildDraft(filters);
  const draftDiffers =
    draft.name.trim() !== appliedDraft.name ||
    draft.type !== appliedDraft.type ||
    draft.currency !== appliedDraft.currency ||
    draft.status !== appliedDraft.status;

  const hasAppliedFilters =
    !!filters.name ||
    !!filters.type ||
    !!filters.currency ||
    filters.isActive === false;

  function handleApply() {
    const result = accountDraftSchema.safeParse(draft);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      if (firstError) notify({ success: false, message: firstError });
      return;
    }
    onApply(draftToFilters(draft, filters.pageSize));
  }

  function handleClear() {
    const empty: DraftFilters = {
      name: "",
      type: null,
      currency: null,
      status: "active",
    };
    setDraft(empty);
    onApply({ page: 1, pageSize: filters.pageSize, isActive: true });
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
          placeholder="Buscar por nombre..."
          className="h-11 w-full rounded-xl border-2 border-zinc-200 bg-white pl-11 pr-4 text-base outline-none transition placeholder:text-zinc-400 focus:border-duo-green md:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Dropdown
          options={ACCOUNT_TYPES}
          value={draft.type}
          onChange={(v) => setDraft((d) => ({ ...d, type: v }))}
          placeholder="Todos los tipos"
        />
        <Dropdown
          options={CURRENCIES}
          value={draft.currency}
          onChange={(v) => setDraft((d) => ({ ...d, currency: v }))}
          placeholder="Todas las monedas"
        />
        <Dropdown
          options={ACCOUNT_STATUSES}
          value={draft.status}
          onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleApply}
          disabled={!draftDiffers}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-duo-green px-4 text-sm font-bold text-white transition hover:bg-duo-green/90 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          <Filter className="h-4 w-4" />
          Filtrar
        </button>

        {hasAppliedFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-10 items-center gap-2 rounded-xl border-2 border-zinc-200 px-4 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
