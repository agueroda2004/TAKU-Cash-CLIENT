import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Overlay from "../../../shared/ui/Overlay";
import { notify } from "../../../lib/notify";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../types";

type Props = {
  open: boolean;
  transaction: Transaction | null;
  onCancel: () => void;
};

export default function DeleteTransactionModal({
  open,
  transaction,
  onCancel,
}: Props) {
  const { deleteTransaction, isDeleting } = useTransactions();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!open || !transaction) return null;

  async function handleDelete() {
    setSubmitError(null);
    try {
      await deleteTransaction(transaction!.id);
      notify({ success: true, message: "Transacción eliminada exitosamente" });
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error al eliminar la transacción");
      } else {
        setSubmitError("Error al eliminar la transacción");
      }
    }
  }

  return (
    <Overlay>
      <div
        className="z-50 mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 pb-2 pt-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-duo-red">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-800">
            Eliminar transacción
          </h2>
        </div>

        <div className="space-y-3 px-6 py-4">
          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <p className="text-sm text-zinc-600">
            ¿Estás seguro de que deseas eliminar esta transacción? El dinero
            será devuelto a la cuenta correspondiente.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border-2 border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-duo-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-red/90 disabled:opacity-50"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
