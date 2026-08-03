import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeftRight, ChevronDown, Wallet } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import { formatCurrency } from "../../../utils/currency";
import { notify } from "../../../lib/notify";
import { useAccount } from "../hooks/useAccount";
import { createTransferSchema } from "../account.schema";
import type { Account } from "../types";
import {
  Wallet as WalletIcon,
  CreditCard,
  Banknote,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet: WalletIcon,
  CreditCard,
  Banknote,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
};

type Props = {
  open: boolean;
  onCancel: () => void;
  fromAccount: Account;
};

function AccountOption({ account }: { account: Account }) {
  const Icon = ICON_MAP[account.icon];

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${account.color}1A`, color: account.color }}
      >
        {Icon ? <Icon className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 truncate">
          {account.name}
        </p>
        <p className="text-xs text-zinc-400">
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>
      <span className="text-xs font-medium text-zinc-500">
        {account.currency}
      </span>
    </div>
  );
}

type FieldErrors = Partial<
  Record<"toAccountId" | "amount" | "exchangeRate" | "description", string>
>;

export default function TransferModal({ open, onCancel, fromAccount }: Props) {
  const { accounts, transfer, isTransferring } = useAccount();
  const [toAccountId, setToAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toAccount = accounts.find((a) => a.id === toAccountId);
  const currenciesDiffer =
    toAccount && toAccount.currency !== fromAccount.currency;
  const availableAccounts = accounts.filter((a) => a.id !== fromAccount.id);
  const transferSchema = useMemo(
    () =>
      createTransferSchema({
        fromAccountId: fromAccount.id,
        fromBalance: fromAccount.balance,
        currenciesDiffer: !!currenciesDiffer,
      }),
    [fromAccount, currenciesDiffer],
  );

  const convertedAmount = useMemo(() => {
    if (!amount || !exchangeRate || !toAccount || !currenciesDiffer)
      return null;
    const numAmount = Number(amount);
    const numRate = Number(exchangeRate);
    if (numAmount <= 0 || numRate <= 0) return null;

    if (fromAccount.currency === "CRC" && toAccount.currency === "USD") {
      return numAmount / numRate;
    }
    if (fromAccount.currency === "USD" && toAccount.currency === "CRC") {
      return numAmount * numRate;
    }
    return numAmount;
  }, [amount, exchangeRate, toAccount, currenciesDiffer, fromAccount.currency]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectAccount(accountId: string) {
    setToAccountId(accountId);
    setExchangeRate("");
    clearFieldError("toAccountId");
    setDropdownOpen(false);
  }

  function autoGrow() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleTransfer() {
    setSubmitError(null);
    setFieldErrors({});

    const result = transferSchema.safeParse({
      toAccountId,
      amount: amount || undefined,
      exchangeRate: exchangeRate || undefined,
      description: description.trim() || undefined,
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
      await transfer({
        fromAccountId: fromAccount.id,
        toAccountId: result.data.toAccountId,
        amount: result.data.amount,
        exchangeRate: result.data.exchangeRate,
        description: result.data.description,
      });
      notify({
        success: true,
        message: "Transferencia realizada exitosamente",
      });
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error al realizar la transferencia");
      } else {
        setSubmitError("Error al realizar la transferencia");
      }
    }
  }

  const isValid = toAccountId && amount && Number(amount) > 0;

  if (!open) return null;

  return (
    <Modal
      title="Transferir fondos"
      onCancel={onCancel}
      confirmText="Transferir"
      onConfirm={handleTransfer}
      confirmDisabled={!isValid || isTransferring}
      confirmLoading={isTransferring}
    >
      <div className="space-y-5">
        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="rounded-xl border-2 border-zinc-100 bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Desde
          </p>
          <AccountOption account={fromAccount} />
        </div>

        <div className="flex justify-center -my-2">
          <div className="rounded-full bg-zinc-100 p-2 text-zinc-400">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </div>

        <div ref={dropdownRef} className="relative">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Para
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex h-auto min-h-11 w-full items-center justify-between rounded-xl border-2 bg-white px-4 py-2.5 text-sm outline-none transition ${
              fieldErrors.toAccountId
                ? "border-red-400"
                : "border-zinc-200 focus:border-duo-green"
            }`}
          >
            {toAccount ? (
              <AccountOption account={toAccount} />
            ) : (
              <span className="text-zinc-400">Seleccionar cuenta</span>
            )}
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-zinc-400 transition ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {fieldErrors.toAccountId && (
            <p className="mt-1 text-xs text-red-500">
              {fieldErrors.toAccountId}
            </p>
          )}

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg">
              {availableAccounts.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-zinc-400">
                  No hay otras cuentas disponibles
                </div>
              ) : (
                availableAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => selectAccount(acc.id)}
                    className={`flex w-full items-center px-4 py-2.5 text-left transition hover:bg-zinc-50 ${
                      acc.id === toAccountId ? "bg-duo-green-light" : ""
                    }`}
                  >
                    <AccountOption account={acc} />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Monto a transferir
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
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
          {amount && Number(amount) > 0 && (
            <p className="mt-1.5 text-xs text-zinc-500">
              {formatCurrency(Number(amount), fromAccount.currency)}
            </p>
          )}

          {fieldErrors.amount && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>
          )}
        </div>

        {currenciesDiffer && (
          <div>
            <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
              <p className="font-semibold">Tipo de cambio requerido</p>
              <p className="mt-1">
                Estás transfiriendo entre cuentas con monedas diferentes (
                {fromAccount.currency} → {toAccount?.currency}). Ingresa el tipo
                de cambio (cuántos colones equivale un 1 dólar ).
              </p>
            </div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tipo de cambio
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 500.00"
              value={exchangeRate}
              onChange={(e) => {
                setExchangeRate(e.target.value);
                clearFieldError("exchangeRate");
              }}
              className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
                fieldErrors.exchangeRate
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-duo-green"
              }`}
            />
            {convertedAmount !== null && toAccount && (
              <p className="mt-0.5 text-xs text-zinc-400">
                Llegarán {formatCurrency(convertedAmount, toAccount.currency)} a
                tu cuenta
              </p>
            )}
            {fieldErrors.exchangeRate && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.exchangeRate}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Descripción (opcional)
          </label>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Agrega una descripción"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              autoGrow();
            }}
            className="w-full resize-none rounded-xl border-2 border-zinc-200 px-4 py-2.5 text-sm outline-none transition focus:border-duo-green"
          />
        </div>
      </div>
    </Modal>
  );
}
