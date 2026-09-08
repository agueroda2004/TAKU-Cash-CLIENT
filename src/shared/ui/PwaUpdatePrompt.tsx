import { RefreshCw, WifiOff } from "lucide-react";
import { usePwaUpdate } from "../../lib/usePwaUpdate";

export default function PwaUpdatePrompt() {
  const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    dismissUpdate,
    dismissOfflineReady,
  } = usePwaUpdate();

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] animate-slide-down">
      {needRefresh ? (
        <div className="mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-md items-center gap-3 rounded-2xl border border-duo-green/30 bg-white p-3 shadow-lg sm:max-w-lg">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-duo-green-light text-duo-green">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-zinc-800">
              Nueva versión disponible
            </p>
            <p className="text-xs text-zinc-500">
              Actualiza la aplicación para tener los últimos cambios
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={dismissUpdate}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100"
            >
              Más tarde
            </button>
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="rounded-xl bg-duo-green px-4 py-2 text-xs font-bold text-white transition hover:bg-duo-green-hover"
            >
              Actualizar
            </button>
          </div>
        </div>
      ) : (
        offlineReady && (
          <div className="mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-md items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-duo-green-light text-duo-green">
              <WifiOff className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-zinc-800">
                Lista para usarse sin conexión
              </p>
              <p className="text-xs text-zinc-500">
                La app ya puede funcionar offline
              </p>
            </div>
            <button
              type="button"
              onClick={dismissOfflineReady}
              className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100"
            >
              Ok
            </button>
          </div>
        )
      )}
    </div>
  );
}