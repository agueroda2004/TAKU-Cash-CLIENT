import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Overlay from "../../../shared/ui/Overlay";
import { notify } from "../../../lib/notify";
import { useSettings } from "../hooks/useSettings";

type Props = {
  open: boolean;
  planLabel: string;
  onCancel: () => void;
};

export default function CancelSubscriptionModal({ open, planLabel, onCancel }: Props) {
  const { cancelSubscription, isCancelling } = useSettings();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!open) return null;

  async function handleConfirm() {
    setSubmitError(null);
    try {
      const result = await cancelSubscription();
      if (result.status === "cancelled") {
        notify({ success: true, message: "Suscripción cancelada" });
      } else {
        notify({
          success: true,
          message: "Cancelación programada. Seguirás con acceso hasta el final del periodo.",
        });
      }
      onCancel();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al cancelar la suscripción",
      );
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
            Cancelar suscripción
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Plan <span className="font-semibold">{planLabel}</span>
          </p>
        </div>

        <div className="space-y-3 px-6 py-4">
          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <p className="text-sm text-zinc-600">
            Tu suscripción se cancelará al final del periodo de facturación
            actual. Conservarás acceso hasta esa fecha y podrás volver a
            suscribirte cuando quieras.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelling}
            className="rounded-xl border-2 border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isCancelling}
            className="rounded-xl bg-duo-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-red/90 disabled:opacity-50"
          >
            {isCancelling ? "Cancelando..." : "Cancelar suscripción"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
