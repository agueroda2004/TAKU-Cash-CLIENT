import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import AuthLayout from "../components/AuthLayout";
import { request } from "../../../lib/api";
import { notify } from "../../../lib/notify";

export default function LegalConsentPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!termsAccepted || !privacyAccepted) {
      setError("Debes aceptar ambos documentos para continuar.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const consent = await request<{
        termsAccepted: boolean;
        privacyAccepted: boolean;
        versions: { terms: string; privacy: string };
      }>("/auth/consents", {
        method: "POST",
        body: { source: "google" },
        token: token ?? undefined,
      });
      await queryClient.cancelQueries({ queryKey: ["auth.consents.status"] });
      queryClient.setQueryData(["auth.consents.status"], consent);
      notify({ success: true, message: "Preferencias legales guardadas" });
      navigate("/app", { replace: true });
    } catch {
      setError("No pudimos guardar tu aceptación. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Revisa los documentos"
      subtitle="Necesitamos tu aceptación para continuar usando TAKU-Cash"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600">
          Revisa los documentos antes de continuar. Puedes volver a consultarlos
          en cualquier momento desde el pie de página.
        </div>

        <label className="flex items-start gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-duo-green"
          />
          <span>
            Acepto los{" "}
            <Link to="/terms" target="_blank" className="text-duo-blue underline">
              Términos de Servicio
            </Link>
            .
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-duo-green"
          />
          <span>
            He leído el{" "}
            <Link to="/privacy" target="_blank" className="text-duo-blue underline">
              Aviso de Privacidad
            </Link>
            .
          </span>
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Continuar"}
        </button>
      </form>
    </AuthLayout>
  );
}
