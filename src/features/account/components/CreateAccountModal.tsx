import { useState } from "react";
import type { z } from "zod";
import Modal from "../../../shared/ui/Modal";
import Dropdown from "../../../shared/ui/Dropdown";
import { formatCurrency } from "../../../utils/currency";
import { notify } from "../../../lib/notify";
import { useAccount } from "../hooks/useAccount";
import { createAccountSchema } from "../account.schema";
import type { CurrencyCode } from "../../../constants/data";
import type { CreateAccountInput } from "../types";
import {
  ACCOUNT_TYPES,
  CURRENCIES,
  COLORS,
  ICONS,
  type AccountTypeValue,
} from "./constants";

type FieldErrors = Partial<
  Record<keyof z.infer<typeof createAccountSchema>, string>
>;

type Props = {
  open: boolean;
  onCancel: () => void;
};

export default function CreateAccountModal({ open, onCancel }: Props) {
  const { createAccount, isCreating } = useAccount();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountTypeValue | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [balance, setBalance] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!open) return null;

  const isValid = name.trim() && type && currency && color && icon;

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function resetForm() {
    setName("");
    setType(null);
    setCurrency(null);
    setColor(null);
    setIcon(null);
    setBalance("");
    setFieldErrors({});
    setSubmitError(null);
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  async function handleCreate() {
    setSubmitError(null);
    setFieldErrors({});

    const result = createAccountSchema.safeParse({
      name: name.trim(),
      type,
      currency,
      color,
      icon,
      balance: balance || undefined,
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
      await createAccount(result.data as CreateAccountInput);
      notify({ success: true, message: "Cuenta creada exitosamente" });
      resetForm();
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error al crear la cuenta");
      } else {
        setSubmitError("Error al crear la cuenta");
      }
    }
  }

  return (
    <Modal
      title="Crear cuenta"
      onCancel={handleCancel}
      confirmText="Crear"
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
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Mi cuenta principal"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
              fieldErrors.name
                ? "border-red-400"
                : "border-zinc-200 focus:border-duo-green"
            }`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Tipo
          </label>
          <Dropdown
            options={ACCOUNT_TYPES}
            value={type}
            onChange={(v) => {
              setType(v);
              clearFieldError("type");
            }}
            placeholder="Seleccionar tipo"
          />
          {fieldErrors.type && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.type}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Moneda
          </label>
          <Dropdown
            options={CURRENCIES}
            value={currency}
            onChange={(v) => {
              setCurrency(v);
              clearFieldError("currency");
            }}
            placeholder="Seleccionar moneda"
          />
          {fieldErrors.currency && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.currency}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Saldo inicial
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
              clearFieldError("balance");
            }}
            className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
              fieldErrors.balance
                ? "border-red-400"
                : "border-zinc-200 focus:border-duo-green"
            }`}
          />
          {currency && balance && (
            <p className="mt-1.5 text-xs text-zinc-500">
              {formatCurrency(Number(balance), currency)}
            </p>
          )}
          {fieldErrors.balance && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.balance}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setColor(c.value);
                  clearFieldError("color");
                }}
                title={c.label}
                className={`h-8 w-8 rounded-full transition hover:scale-110 ${
                  c.class
                } ${color === c.value ? "ring-2 ring-zinc-800 ring-offset-2" : ""}`}
              />
            ))}
          </div>
          {fieldErrors.color && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.color}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Icono
          </label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((ic) => {
              const Icon = ic.icon;
              return (
                <button
                  key={ic.value}
                  type="button"
                  onClick={() => {
                    setIcon(ic.value);
                    clearFieldError("icon");
                  }}
                  title={ic.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition ${
                    icon === ic.value
                      ? "border-duo-green bg-duo-green-light text-duo-green"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
          {fieldErrors.icon && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.icon}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
