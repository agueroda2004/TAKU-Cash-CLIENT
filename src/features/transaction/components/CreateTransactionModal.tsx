import { useState, useMemo } from "react";
import type { z } from "zod";
import Modal from "../../../shared/ui/Modal";
import Dropdown from "../../../shared/ui/Dropdown";
import DatePicker from "../../../shared/ui/DatePicker";
import { formatCurrency, MAX_FORMAT_AMOUNT } from "../../../utils/currency";
import { notify } from "../../../lib/notify";
import AccountDropdown from "../../account/components/AccountDropdown";
import CategoryDropdown from "../../category/components/CategoryDropdown";
import { useAccountDropdown } from "../../account/hooks/useAccountDropdown";
import { useCategory } from "../../category/hooks/useCategory";
import { useTransactions } from "../hooks/useTransactions";
import { createTransactionSchema } from "../transaction.schema";
import type { TransactionType } from "../types";

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "EXPENSE", label: "Gasto" },
  { value: "INCOME", label: "Ingreso" },
];

type FieldErrors = Partial<
  Record<keyof z.infer<typeof createTransactionSchema>, string>
>;

type Props = {
  open: boolean;
  onCancel: () => void;
};

function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateTransactionModal({ open, onCancel }: Props) {
  const { accounts } = useAccountDropdown();
  const { categories } = useCategory();
  const { createTransaction, isCreating } = useTransactions();

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!type) return [];
    return categories.filter((c) => c.type === type);
  }, [categories, type]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId],
  );

  const availableSubcategories = useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory],
  );

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === accountId),
    [accounts, accountId],
  );

  function resetForm() {
    setType("EXPENSE");
    setAccountId(null);
    setCategoryId(null);
    setSubcategoryId(null);
    setAmount("");
    setDescription("");
    setDate(todayISO());
    setFieldErrors({});
    setSubmitError(null);
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleCreate() {
    setSubmitError(null);
    setFieldErrors({});

    const result = createTransactionSchema.safeParse({
      accountId,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      type,
      amount: amount || undefined,
      description: description.trim() || undefined,
      date,
    });

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await createTransaction({
        accountId: result.data.accountId,
        categoryId: result.data.categoryId,
        subcategoryId: result.data.subcategoryId ?? null,
        type: result.data.type,
        amount: result.data.amount,
        description: result.data.description,
        date: new Date(`${result.data.date}T12:00:00`).toISOString(),
      });
      notify({ success: true, message: "Transacción creada exitosamente" });
      resetForm();
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error al crear la transacción");
      } else {
        setSubmitError("Error al crear la transacción");
      }
    }
  }

  if (!open) return null;

  const isValid = accountId && categoryId && amount && Number(amount) > 0;

  return (
    <Modal
      title="Nueva transacción"
      onCancel={handleCancel}
      confirmText={isCreating ? "Creando..." : "Crear"}
      onConfirm={handleCreate}
      confirmDisabled={!isValid || isCreating}
      confirmLoading={isCreating}
    >
      <div className="space-y-4">
        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TRANSACTION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setType(t.value);
                  setCategoryId(null);
                  setSubcategoryId(null);
                  clearFieldError("type");
                }}
                className={`h-11 rounded-xl border-2 text-sm font-semibold transition ${
                  type === t.value
                    ? t.value === "INCOME"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {fieldErrors.type && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.type}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Cuenta
          </label>
          <AccountDropdown
            accounts={accounts}
            value={accountId}
            onChange={(id) => {
              setAccountId(id);
              clearFieldError("accountId");
            }}
            placeholder="Seleccionar cuenta"
            error={fieldErrors.accountId}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Categoría
          </label>
          <CategoryDropdown
            categories={filteredCategories}
            value={categoryId}
            onChange={(v) => {
              setCategoryId(v);
              setSubcategoryId(null);
              clearFieldError("categoryId");
            }}
            placeholder={
              type ? "Seleccionar categoría" : "Selecciona un tipo primero"
            }
            disabled={!type}
            error={fieldErrors.categoryId}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Subcategoría
          </label>
          <Dropdown
            options={availableSubcategories.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
            value={subcategoryId}
            onChange={(v) => {
              setSubcategoryId(v);
              clearFieldError("subcategoryId");
            }}
            placeholder={
              categoryId
                ? availableSubcategories.length === 0
                  ? "Sin subcategorías"
                  : "Seleccionar subcategoría"
                : "Selecciona una categoría primero"
            }
            disabled={!categoryId || availableSubcategories.length === 0}
            emptyText={
              categoryId && availableSubcategories.length === 0
                ? "No hay subcategorías disponibles"
                : undefined
            }
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={MAX_FORMAT_AMOUNT}
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearFieldError("amount");
            }}
            className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
              fieldErrors.amount
                ? "border-red-400"
                : "border-zinc-200 focus:border-duo-green"
            }`}
          />
          {amount && Number(amount) > 0 && selectedAccount && (
            <p className="mt-1.5 text-xs text-zinc-500">
              {formatCurrency(Number(amount), selectedAccount.currency)}
            </p>
          )}
          {fieldErrors.amount && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Fecha
          </label>
          <DatePicker
            value={date}
            onChange={(d) => {
              setDate(d);
              clearFieldError("date");
            }}
            inline
            maxDate={new Date()}
          />
          {fieldErrors.date && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.date}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Descripción (opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Almuerzo con amigos"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-11 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm outline-none transition focus:border-duo-green"
          />
        </div>
      </div>
    </Modal>
  );
}
