import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSignUp, useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { notify } from "../../../lib/notify";
import { request } from "../../../lib/api";
import { getPaddle } from "../../../lib/paddle";
import { registerSchema } from "../auth.schema";
import {
  inspectClerkError,
  parseClerkApiError,
} from "../lib/clerk-errors";
import AuthLayout from "../components/AuthLayout";
import OAuthButtons from "../components/OAuthButtons";
import Divider from "../components/Divider";
import PasswordInput from "../components/PasswordInput";
import AuthErrorBanner from "../components/AuthErrorBanner";

type FieldErrors = Partial<
  Record<keyof z.infer<typeof registerSchema>, string>
>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, fetchStatus } = useSignUp();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const planParam = searchParams.get("plan");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [clerkError, setClerkError] = useState<{
    code: string;
    message: string;
  } | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isLoading = fetchStatus === "fetching" || isGoogleLoading;

  const hasResetRef = useRef(false);
  useEffect(() => {
    if (hasResetRef.current) return;
    hasResetRef.current = true;
    signUp.reset();
  }, [signUp]);

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else setPassword(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (clerkError) setClerkError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClerkError(null);
    setFieldErrors({});

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      termsAccepted,
      privacyAccepted,
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
      const [firstName, ...lastParts] = name.trim().split(" ");
      const lastName = lastParts.join(" ") || undefined;

      const createResult = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      if (createResult.error) {
        const info = parseClerkApiError(createResult.error);
        if (info) {
          setClerkError({ code: info.code, message: info.message });
        } else {
          setClerkError({
            code: "unknown",
            message: "Error al registrarse",
          });
        }
        return;
      }

      if ((signUp as unknown as { status: string }).status !== "complete") {
        setClerkError({
          code: "incomplete_signup",
          message: `Registro incompleto (${(signUp as unknown as { status: string }).status}). Revisa la configuración de Clerk Dashboard.`,
        });
        return;
      }

      await signUp.finalize();
      const token = await getToken();
      const consent = await request<{
        termsAccepted: boolean;
        privacyAccepted: boolean;
        versions: { terms: string; privacy: string };
      }>("/auth/consents", {
        method: "POST",
        body: { source: "email_password" },
        token: token ?? undefined,
      });
      await queryClient.cancelQueries({ queryKey: ["auth.consents.status"] });
      queryClient.setQueryData(["auth.consents.status"], consent);
      notify({ success: true, message: "Cuenta creada exitosamente" });

      if (planParam && ["mensual", "semestral", "anual"].includes(planParam)) {
        try {
          const checkoutToken = await getToken();
          const { checkoutId } = await request<{ checkoutId: string }>(
            "/subscriptions/checkout",
            {
              method: "POST",
              body: {
                plan: planParam,
                successUrl: `${window.location.origin}/app/welcome`,
              },
              token: checkoutToken ?? undefined,
            },
          );
          const paddle = await getPaddle();
          paddle?.Checkout.open({ transactionId: checkoutId });
          return;
        } catch (err) {
          console.error("[RegisterPage] checkout error:", err);
          // fallback: go to dashboard
        }
      }

      navigate("/app");
    } catch (err: unknown) {
      const info = inspectClerkError(err);
      if (info) {
        setClerkError({ code: info.code, message: info.message });
        return;
      }
      if (err instanceof Error) {
        setClerkError({
          code: "unknown",
          message: err.message || "Error inesperado",
        });
      } else {
        setClerkError({ code: "unknown", message: "Error inesperado" });
      }
    }
  }

  const bannerMessages = clerkError ? [clerkError.message] : [];

  async function handleGoogleSignIn() {
    setClerkError(null);
    setIsGoogleLoading(true);
    try {
      await signUp.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: `${window.location.origin}/sso-callback`,
        redirectUrl: `${window.location.origin}/app`,
      });
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      const info = inspectClerkError(err);
      if (info) {
        setClerkError({ code: info.code, message: info.message });
        return;
      }
      if (err instanceof Error) {
        setClerkError({
          code: "unknown",
          message: err.message || "Error al iniciar con Google",
        });
      } else {
        setClerkError({
          code: "unknown",
          message: "Error al iniciar con Google",
        });
      }
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a controlar tus finanzas"
    >
      <OAuthButtons onGoogle={handleGoogleSignIn} isGoogleLoading={isGoogleLoading} />

      <div className="my-6">
        <Divider />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <AuthErrorBanner messages={bannerMessages} />

        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`h-12 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
              fieldErrors.name
                ? "border-red-400"
                : "border-duo-border focus:border-duo-green"
            }`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`h-12 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
              fieldErrors.email
                ? "border-red-400"
                : "border-duo-border focus:border-duo-green"
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <PasswordInput
          value={password}
          onChange={(v) => handleChange("password", v)}
          placeholder="Contraseña"
          error={fieldErrors.password}
          autoComplete="new-password"
          showStrength
        />

        <div className="space-y-3 text-sm text-zinc-700">
          <label className="flex items-start gap-3">
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
          {fieldErrors.termsAccepted && (
            <p className="text-xs text-red-500">{fieldErrors.termsAccepted}</p>
          )}

          <label className="flex items-start gap-3">
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
          {fieldErrors.privacyAccepted && (
            <p className="text-xs text-red-500">{fieldErrors.privacyAccepted}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
        >
          {isLoading ? "Cargando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-duo-gray">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-bold text-duo-green underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
