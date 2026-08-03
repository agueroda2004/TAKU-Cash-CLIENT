import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Overlay from "../../../shared/ui/Overlay";
import { notify } from "../../../lib/notify";
import { ErrorCode, isApiErrorCode } from "../../../lib/error-codes";
import { useAccount } from "../hooks/useAccount";
import type { Account } from "../types";

type Props = {
  open: boolean;
  account: Account | null;
  onCancel: () => void;
};

export default function DeleteAccountModal({ open, account, onCancel }: Props) {
  const { deleteAccount, deactivateAccount, isDeleting, isDeactivating } =
    useAccount();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  if (!open || !account) return null;

  const busy = isDeleting || isDeactivating;

  function reset() {
    setSubmitError(null);
    setBlocked(false);
  }

  async function handleHardDelete() {
    setSubmitError(null);
    try {
      await deleteAccount(account!.id);
      notify({ success: true, message: "Cuenta eliminada" });
      reset();
      onCancel();
    } catch (err) {
      if (isApiErrorCode(err, ErrorCode.Conflict)) {
        setBlocked(true);
        setSubmitError(
          "Esta cuenta tiene transacciones asociadas, no se puede eliminar.",
        );
      } else {
        setSubmitError(
          err instanceof Error ? err.message : "Error al eliminar la cuenta",
        );
      }
    }
  }

  async function handleDeactivate() {
    setSubmitError(null);
    try {
      await deactivateAccount(account!.id);
      notify({ success: true, message: "Cuenta desactivada" });
      reset();
      onCancel();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al desactivar la cuenta",
      );
    }
  }

  return (
    <Overlay>
      <div
        className="z-50 mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 pb-2 pt-6">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-duo-red">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-800">
            {blocked ? "No se puede eliminar" : "Eliminar cuenta"}
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            <span className="font-semibold">{account.name}</span>
          </p>
        </div>

        <div className="space-y-3 px-6 py-4">
          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          {!blocked ? (
            <p className="text-sm text-zinc-600">
              Esta acción no se puede deshacer. Si la cuenta tiene
              transacciones, no se eliminará y la tendras que inactivar.
            </p>
          ) : (
            <p className="text-sm text-zinc-600">
              Puedes <span className="font-semibold">desactivarla</span> para
              que no aparezca en nuevas operaciones, manteniendo el historial
              intacto.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              reset();
              onCancel();
            }}
            disabled={busy}
            className="rounded-xl border-2 border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          {blocked ? (
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={busy}
              className="rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:opacity-50"
            >
              {isDeactivating ? "Desactivando..." : "Desactivar cuenta"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={busy}
                className="rounded-xl border-2 border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
              >
                {isDeactivating ? "Desactivando..." : "Solo desactivar"}
              </button>
              <button
                type="button"
                onClick={handleHardDelete}
                disabled={busy}
                className="rounded-xl bg-duo-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-red/90 disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Eliminar permanentemente"}
              </button>
            </>
          )}
        </div>
      </div>
    </Overlay>
  );
}
