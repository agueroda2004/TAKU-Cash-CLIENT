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

type FieldErrors = {
  description?: string;
};

export default function UpdateTransactionModal({
  transaction,
  onCancel,
}: Props) {
  const { updateTransaction, isUpdating } = useTransactions();
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!transaction) return null;

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSave() {
    setSubmitError(null);
    setFieldErrors({});

    const result = updateTransactionSchema.safeParse({
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
        setSubmitError(err.message || "Error al actualizar la transacción");
      } else {
        setSubmitError("Error al actualizar la transacción");
      }
    }
  }

  return (
    <Modal
      title="Editar transacción"
      onCancel={onCancel}
      confirmText={isUpdating ? "Guardando..." : "Guardar"}
      onConfirm={handleSave}
      confirmDisabled={isUpdating}
      confirmLoading={isUpdating}
    >
      <div className="space-y-4">
        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Descripción
          </label>
          <input
            type="text"
            maxLength={200}
            placeholder="Ej: Almuerzo con amigos"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              clearFieldError("description");
            }}
            className={`h-11 w-full rounded-xl border-2 px-4 text-base outline-none transition md:text-sm ${
              fieldErrors.description
                ? "border-red-400"
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
