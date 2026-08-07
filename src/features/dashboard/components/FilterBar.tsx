import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import DatePicker from "../../../shared/ui/DatePicker";
import Dropdown from "../../../shared/ui/Dropdown";
import InfoTooltip from "../../../shared/ui/InfoTooltip";
import AccountDropdown from "../../account/components/AccountDropdown";
import CategoryDropdown from "../../category/components/CategoryDropdown";
import { notify } from "../../../lib/notify";
import { dashboardFiltersSchema } from "../schemas/dashboard.schema";
import { conversionTooltip } from "../conversion";
import type { AppliedFilters } from "../types";
import type { AccountDropdownItem } from "../../account/types";
import type { CategoryDropdownItem } from "../../category/types";

type Props = {
  accounts: AccountDropdownItem[];
  categories: CategoryDropdownItem[];
  onApply: (filters: AppliedFilters) => void;
};

export default function FilterBar({ accounts, categories, onApply }: Props) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [reportCurrency, setReportCurrency] = useState("CRC");
  const [exchangeRate, setExchangeRate] = useState("");

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const availableSubcategories = selectedCategory?.subcategories ?? [];

  const currencies = useMemo(() => [...new Set(accounts.map((a) => a.currency))], [accounts]);
  const hasMultipleCurrencies = currencies.length > 1;

  const hasFilters = dateFrom || dateTo || accountId || categoryId || subcategoryId;

  function handleApply() {
    if (!dateFrom && !dateTo) {
      notify({
        success: false,
        message: "Selecciona al menos una fecha de rango para generar el reporte",
      });
      return;
    }

    const parsed = dashboardFiltersSchema.safeParse({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      accountId,
      categoryId,
      subcategoryId,
      reportCurrency,
      exchangeRate: exchangeRate ? parseFloat(exchangeRate) : null,
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Error de validación";
      notify({ success: false, message: firstError });
      return;
    }

    if (hasMultipleCurrencies && parsed.data.exchangeRate === null) {
      notify({ success: false, message: "Debes ingresar un tipo de cambio cuando hay cuentas en múltiples monedas" });
      return;
    }

    onApply(parsed.data as AppliedFilters);
  }

  function handleClear() {
    setDateFrom("");
    setDateTo("");
    setAccountId(null);
    setCategoryId(null);
    setSubcategoryId(null);
    setReportCurrency("CRC");
    setExchangeRate("");
    onApply({
      dateFrom: "", dateTo: "", accountId: null, categoryId: null, subcategoryId: null,
      reportCurrency: "CRC", exchangeRate: null,
    });
  }

  return (
    <div className="space-y-3 rounded-xl border-2 border-zinc-100 bg-white p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">Desde</label>
          <DatePicker value={dateFrom} onChange={setDateFrom} placeholder="Fecha desde" maxDate={new Date()} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">Hasta</label>
          <DatePicker value={dateTo} onChange={setDateTo} placeholder="Fecha hasta" maxDate={new Date()} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">Cuenta</label>
          <AccountDropdown
            accounts={accounts}
            value={accountId}
            onChange={setAccountId}
            placeholder="Todas las cuentas"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">Categoría</label>
          <CategoryDropdown
            categories={categories}
            value={categoryId}
            onChange={(v) => { setCategoryId(v); setSubcategoryId(null); }}
            placeholder="Todas las categorías"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500">Subcategoría</label>
          <Dropdown
            options={availableSubcategories.map((s) => ({ value: s.id, label: s.name }))}
            value={subcategoryId}
            onChange={setSubcategoryId}
            placeholder="Todas las subcategorías"
            disabled={!categoryId || availableSubcategories.length === 0}
            emptyText={categoryId && availableSubcategories.length === 0 ? "Sin subcategorías" : undefined}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {hasMultipleCurrencies && (
          <>
            <div className="w-full min-w-0 sm:w-auto sm:min-w-[160px]">
              <div className="mb-1.5 flex items-center gap-1">
                <label className="block text-xs font-medium text-zinc-500">Moneda del reporte</label>
                <InfoTooltip text="La moneda en la que se mostrarán todos los montos del reporte." />
              </div>
              <Dropdown
                options={[
                  { value: "CRC", label: "₡ CRC" },
                  { value: "USD", label: "$ USD" },
                ]}
                value={reportCurrency}
                onChange={setReportCurrency}
              />
            </div>
            <div className="w-full min-w-0 sm:w-auto sm:min-w-[200px]">
              <div className="mb-1.5 flex items-center gap-1">
                <label className="block text-xs font-medium text-zinc-500">Tipo de cambio (1 USD = ? CRC)</label>
                <InfoTooltip text={conversionTooltip(reportCurrency)} />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                placeholder="Ej: 500"
                className="h-11 w-full rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm font-medium placeholder:text-zinc-300 focus:border-duo-green focus:outline-none"
              />
            </div>
          </>
        )}
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-duo-green px-5 text-sm font-bold text-white transition hover:bg-duo-green-hover"
        >
          <Filter className="h-4 w-4" />
          Aplicar
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-zinc-200 px-5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
