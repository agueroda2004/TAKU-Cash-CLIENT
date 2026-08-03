import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import { notify } from "../../../lib/notify";
import { useTransactions } from "../hooks/useTransactions";
import { updateTransactionSchema } from "../transaction.schema";
import type { Transaction } from "../types";

type Props = {
  transaction: Transaction | null;
  onCancel: () => void;
};

export default function UpdateTransactionModal({
  transaction,
  onCancel,
}: Props) {
  const { updateTransaction, isUpdating } = useTransactions();
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  if (!transaction) return null;

  async function handleSave() {
    setError(null);

    const result = updateTransactionSchema.safeParse({
      description: description.trim() || undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Error de validación");
      return;
    }

    try {
      await updateTransaction({
        id: transaction!.id,
        data: result.data,
      });
      notify({
        success: true,
        message: "Transacción actualizada exitosamente",
      });
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al actualizar la transacción");
      } else {
        setError("Error al actualizar la transacción");
      }
    }
  }

  return (
    <Modal
      title="Editar transacción"
      onCancel={onCancel}
      confirmText="Guardar"
      onConfirm={handleSave}
      confirmDisabled={isUpdating}
      confirmLoading={isUpdating}
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Descripción
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
