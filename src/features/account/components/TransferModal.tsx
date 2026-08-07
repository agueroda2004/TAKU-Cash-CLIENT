import { useState, useRef, useMemo } from "react";
import { ArrowLeftRight, Wallet } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import { formatCurrency, MAX_FORMAT_AMOUNT } from "../../../utils/currency";
import { notify } from "../../../lib/notify";
import { useAccount } from "../hooks/useAccount";
import { useAccountDropdown } from "../hooks/useAccountDropdown";
import { createTransferSchema } from "../account.schema";
import AccountDropdown from "./AccountDropdown";
import type { Account } from "../types";

type Props = {
  open: boolean;
  onCancel: () => void;
  fromAccount: Account;
};

type FieldErrors = Partial<
  Record<"toAccountId" | "amount" | "exchangeRate" | "description", string>
>;

export default function TransferModal({ open, onCancel, fromAccount }: Props) {
  const { transfer, isTransferring } = useAccount();
  const { accounts: allActiveAccounts } = useAccountDropdown();
  const [toAccountId, setToAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableAccounts = useMemo(
    () => allActiveAccounts.filter((a) => a.id !== fromAccount.id),
    [allActiveAccounts, fromAccount.id],
  );

  const toAccount = availableAccounts.find((a) => a.id === toAccountId);
  const currenciesDiffer =
    !!toAccount && toAccount.currency !== fromAccount.currency;

  const transferSchema = useMemo(
    () =>
      createTransferSchema({
        fromAccountId: fromAccount.id,
        fromBalance: fromAccount.balance,
        currenciesDiffer,
      }),
    [fromAccount, currenciesDiffer],
  );

  const convertedAmount = useMemo(() => {
    if (!amount || !exchangeRate || !toAccount || !currenciesDiffer) return null;
    const numAmount = Number(amount);
    const numRate = Number(exchangeRate);
    if (numAmount <= 0 || numRate <= 0) return null;
    return numAmount * numRate;
  }, [amount, exchangeRate, toAccount, currenciesDiffer]);

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function autoGrow() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
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

  const isValid = !!toAccountId && !!amount && Number(amount) > 0;

  if (!open) return null;

  return (
    <Modal
      title="Transferir fondos"
      onCancel={onCancel}
      confirmText={isTransferring ? "Transfiriendo..." : "Transferir"}
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
          <p className="mb-2 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Desde
          </p>
          <FromAccountRow account={fromAccount} />
        </div>

        <div className="flex justify-center -my-2">
          <div className="rounded-full bg-zinc-100 p-2 text-zinc-400">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Para
          </label>
          <AccountDropdown
            accounts={availableAccounts}
            value={toAccountId}
            onChange={(v) => {
              setToAccountId(v);
              clearFieldError("toAccountId");
            }}
            placeholder="Seleccionar cuenta"
            error={fieldErrors.toAccountId}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Monto a transferir
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
            className={`h-11 w-full rounded-xl border-2 px-4 text-base outline-none transition md:text-sm ${
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

        {currenciesDiffer && toAccount && (
          <div>
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <p className="font-semibold">Tipo de cambio requerido</p>
              <p className="mt-1">
                Estás transfiriendo entre cuentas con monedas diferentes (
                {fromAccount.currency} → {toAccount.currency}). Ingresa cuántos{" "}
                {toAccount.currency} equivale 1 {fromAccount.currency}.
              </p>
            </div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tipo de cambio
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              placeholder={`1 ${fromAccount.currency} = ? ${toAccount.currency}`}
              value={exchangeRate}
              onChange={(e) => {
                setExchangeRate(e.target.value);
                clearFieldError("exchangeRate");
              }}
              className={`h-11 w-full rounded-xl border-2 px-4 text-base outline-none transition md:text-sm ${
                fieldErrors.exchangeRate
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-duo-green"
              }`}
            />
            {convertedAmount !== null && (
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
            maxLength={200}
            placeholder="Agrega una descripción"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearFieldError("description");
              autoGrow();
            }}
            className={`w-full resize-none rounded-xl border-2 px-4 py-2.5 text-base outline-none transition md:text-sm ${
              fieldErrors.description
                ? "border-red-400 focus:border-red-400"
                : "border-zinc-200 focus:border-duo-green"
            }`}
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            {fieldErrors.description ? (
              <p className="text-xs text-red-500">{fieldErrors.description}</p>
            ) : (
              <span />
            )}
            <p
              className={`text-xs ${
                description.length >= 200
                  ? "text-red-500"
                  : description.length >= 160
                    ? "text-amber-500"
                    : "text-zinc-400"
              }`}
            >
              {description.length}/200
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FromAccountRow({ account }: { account: Account }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${account.color}1A`, color: account.color }}
      >
        <Wallet className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-800">
          {account.name}
        </p>
        <p className="text-xs text-zinc-400">
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>
      <span className="shrink-0 text-xs font-medium text-zinc-500">
        {account.currency}
      </span>
    </div>
  );
}
