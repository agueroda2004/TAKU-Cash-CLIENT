import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, X } from "lucide-react";
import PageHeader from "../../../shared/ui/PageHeader";
import Dropdown from "../../../shared/ui/Dropdown";
import DatePicker from "../../../shared/ui/DatePicker";
import Pagination from "../../../shared/ui/Pagination";

import TransactionItem from "../components/TransactionItem";
import CreateTransactionModal from "../components/CreateTransactionModal";
import UpdateTransactionModal from "../components/UpdateTransactionModal";
import DeleteTransactionModal from "../components/DeleteTransactionModal";
import AccountDropdown from "../../account/components/AccountDropdown";
import CategoryDropdown from "../../category/components/CategoryDropdown";
import { useAccountDropdown } from "../../account/hooks/useAccountDropdown";
import { useCategory } from "../../category/hooks/useCategory";
import { useTransactions } from "../hooks/useTransactions";

import { notify } from "../../../lib/notify";
import { transactionFiltersSchema } from "../transaction.schema";
import type { Transaction, TransactionType } from "../types";

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "EXPENSE", label: "Gasto" },
  { value: "INCOME", label: "Ingreso" },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border-2 border-zinc-100 bg-white p-4"
        >
          <div className="h-10 w-10 rounded-xl bg-zinc-100 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-zinc-100 animate-pulse" />
            <div className="h-3 w-24 rounded bg-zinc-100 animate-pulse" />
          </div>
          <div className="h-4 w-24 rounded bg-zinc-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function TransactionPage() {
  const navigate = useNavigate();
  const { accounts, isLoading: accountsLoading } = useAccountDropdown();
  const { categories } = useCategory({ pageSize: 50 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const [filterType, setFilterType] = useState<TransactionType | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterAccountId, setFilterAccountId] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [filterSubcategoryId, setFilterSubcategoryId] = useState<string | null>(
    null,
  );

  const {
    transactions,
    totalItems,
    hasNext,
    hasLast,
    page,
    setPage,
    isLoading,
    isFetching,
    error,
    refetch,
    setFilters,
    pageSize,
  } = useTransactions();

  const applyFilters = useCallback(() => {
    const parsed = transactionFiltersSchema.safeParse({
      dateFrom: filterDateFrom || undefined,
      dateTo: filterDateTo || undefined,
      accountId: filterAccountId,
      categoryId: filterCategoryId,
      subcategoryId: filterSubcategoryId,
      type: filterType,
    });

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Error de validación";
      notify({ success: false, message: firstError });
      return;
    }

    setFilters({
      ...(filterDateFrom
        ? { dateFrom: new Date(`${filterDateFrom}T00:00:00`).toISOString() }
        : {}),
      ...(filterDateTo
        ? { dateTo: new Date(`${filterDateTo}T23:59:59`).toISOString() }
        : {}),
      ...(filterAccountId ? { accountId: filterAccountId } : {}),
      ...(filterCategoryId ? { categoryId: filterCategoryId } : {}),
      ...(filterSubcategoryId ? { subcategoryId: filterSubcategoryId } : {}),
      ...(filterType ? { type: filterType } : {}),
      page: 1,
      pageSize: 30,
    });
  }, [
    filterDateFrom,
    filterDateTo,
    filterAccountId,
    filterCategoryId,
    filterSubcategoryId,
    filterType,
    setFilters,
  ]);

  const filteredCategories = useMemo(() => {
    if (!filterType) return categories;
    return categories.filter((c) => c.type === filterType);
  }, [categories, filterType]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === filterCategoryId),
    [categories, filterCategoryId],
  );

  const availableSubcategories = useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory],
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string }>();
    for (const cat of categories) {
      map.set(cat.id, { id: cat.id, name: cat.name, color: cat.color });
    }
    return map;
  }, [categories]);

  const subcategoryMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const cat of categories) {
      for (const sub of cat.subcategories) {
        map.set(sub.id, { id: sub.id, name: sub.name });
      }
    }
    return map;
  }, [categories]);

  const accountMap = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; currency: string }
    >();
    for (const acc of accounts) {
      map.set(acc.id, { id: acc.id, name: acc.name, currency: acc.currency });
    }
    return map;
  }, [accounts]);

  const hasActiveFilters = useMemo(
    () =>
      !!filterType ||
      !!filterDateFrom ||
      !!filterDateTo ||
      !!filterAccountId ||
      !!filterCategoryId ||
      !!filterSubcategoryId,
    [
      filterType,
      filterDateFrom,
      filterDateTo,
      filterAccountId,
      filterCategoryId,
      filterSubcategoryId,
    ],
  );

  function handleClearFilters() {
    setFilterType(null);
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterAccountId(null);
    setFilterCategoryId(null);
    setFilterSubcategoryId(null);
    setFilters({ page: 1, pageSize: 30 });
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
  }

  function handleDelete(transaction: Transaction) {
    setDeletingTransaction(transaction);
  }

  if (!accountsLoading && accounts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Transacciones"
          description="Registra tus ingresos y gastos"
        />
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center">
          <p className="text-zinc-400">Necesitas al menos una cuenta</p>
          <button
            onClick={() => navigate("/app/accounts")}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-duo-green px-4 py-2 text-sm font-bold text-white transition hover:bg-duo-green-hover"
          >
            <Plus className="h-4 w-4" />
            Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transacciones"
        description="Registra tus ingresos y gastos"
        buttonText="Nueva transacción"
        onClick={() => setModalOpen(true)}
      />

      <div className="space-y-3 rounded-xl border-2 border-zinc-100 bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Tipo
            </label>
            <div className="flex gap-2">
              {TRANSACTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setFilterType(filterType === t.value ? null : t.value);
                    setFilterCategoryId(null);
                    setFilterSubcategoryId(null);
                  }}
                  className={`h-11 flex-1 rounded-xl border-2 text-sm font-semibold transition ${
                    filterType === t.value
                      ? t.value === "INCOME"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Desde
            </label>
            <DatePicker
              value={filterDateFrom}
              onChange={setFilterDateFrom}
              placeholder="Fecha desde"
              maxDate={new Date()}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Hasta
            </label>
            <DatePicker
              value={filterDateTo}
              onChange={setFilterDateTo}
              placeholder="Fecha hasta"
              maxDate={new Date()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Cuenta
            </label>
            <AccountDropdown
              accounts={accounts}
              value={filterAccountId}
              onChange={(id) => {
                setFilterAccountId(id);
                setPage(1);
              }}
              placeholder="Todas las cuentas"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Categoría
            </label>
            <CategoryDropdown
              categories={filteredCategories}
              value={filterCategoryId}
              onChange={(v) => {
                setFilterCategoryId(v);
                setFilterSubcategoryId(null);
              }}
              placeholder="Todas las categorías"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              Subcategoría
            </label>
            <Dropdown
              options={availableSubcategories.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              value={filterSubcategoryId}
              onChange={setFilterSubcategoryId}
              placeholder="Todas las subcategorías"
              disabled={
                !filterCategoryId || availableSubcategories.length === 0
              }
              emptyText={
                filterCategoryId && availableSubcategories.length === 0
                  ? "Sin subcategorías"
                  : undefined
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-duo-green px-5 text-sm font-bold text-white transition hover:bg-duo-green-hover"
          >
            <Filter className="h-4 w-4" />
            Filtrar
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-zinc-200 px-5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          Error al cargar las transacciones.{" "}
          <button onClick={() => refetch()} className="underline font-semibold">
            Intentar de nuevo
          </button>
        </div>
      )}

      {isLoading && <LoadingSkeleton />}

      {!isLoading && !error && transactions.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center">
          <p className="text-zinc-400">No hay transacciones</p>
          <p className="mt-1 text-sm text-zinc-300">
            Ajusta los filtros o crea una nueva transacciÃ³n
          </p>
        </div>
      )}

      {!isLoading && transactions.length > 0 && (
        <div className="space-y-3">
          <div
            className={`space-y-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            {transactions.map((t) => {
              const cat = categoryMap.get(t.categoryId);
              const sub = t.subcategoryId
                ? subcategoryMap.get(t.subcategoryId)
                : undefined;
              return (
                <TransactionItem
                  key={t.id}
                  transaction={t}
                  accountName={accountMap.get(t.accountId)?.name ?? "Cuenta"}
                  accountCurrency={
                    accountMap.get(t.accountId)?.currency ?? "USD"
                  }
                  category={
                    cat ?? { id: "", name: "Sin categorÃ­a", color: "#71717a" }
                  }
                  subcategory={sub}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            hasNext={hasNext}
            hasLast={hasLast}
            onPageChange={setPage}
          />
        </div>
      )}

      <CreateTransactionModal
        key={String(modalOpen)}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
      />

      <UpdateTransactionModal
        key={editingTransaction?.id ?? "closed"}
        transaction={editingTransaction}
        onCancel={() => setEditingTransaction(null)}
      />

      <DeleteTransactionModal
        open={!!deletingTransaction}
        transaction={deletingTransaction}
        onCancel={() => setDeletingTransaction(null)}
      />
    </div>
  );
}
