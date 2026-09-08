import { useRegisterSW } from "virtual:pwa-register/react";

export function usePwaUpdate() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (import.meta.env.DEV) {
        console.log("Service worker registrado:", registration);
      }
    },
    onRegisterError(error) {
      console.error("Error al registrar el service worker:", error);
    },
  });

  function dismissUpdate() {
    setNeedRefresh(false);
  }

  function dismissOfflineReady() {
    setOfflineReady(false);
  }

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    dismissUpdate,
    dismissOfflineReady,
  };
}