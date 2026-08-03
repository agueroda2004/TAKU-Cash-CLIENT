import { useState } from "react";
import type { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSignUp, useAuth } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { request } from "../../../lib/api";
import { getPaddle } from "../../../lib/paddle";
import { registerSchema } from "../auth.schema";
import AuthLayout from "../components/AuthLayout";
import OAuthButtons from "../components/OAuthButtons";
import Divider from "../components/Divider";

type FieldErrors = Partial<
  Record<keyof z.infer<typeof registerSchema>, string>
>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { getToken } = useAuth();
  const planParam = searchParams.get("plan");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else setPassword(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const result = registerSchema.safeParse({ name, email, password });

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
        setSubmitError(
          createResult.error.message ||
            createResult.error.longMessage ||
            "Error al registrarse",
        );
        return;
      }

      if ((signUp as unknown as { status: string }).status !== "complete") {
        setSubmitError(
          `Registro incompleto (${(signUp as unknown as { status: string }).status}). Revisa la configuración de Clerk Dashboard.`,
        );
        return;
      }

      await signUp.finalize();
      notify({ success: true, message: "Cuenta creada exitosamente" });

      if (planParam && ["mensual", "semestral", "anual"].includes(planParam)) {
        try {
          const token = await getToken();
          const { checkoutId } = await request<{ checkoutId: string }>(
            "/subscriptions/checkout",
            {
              method: "POST",
              body: {
                plan: planParam,
                successUrl: `${window.location.origin}/app/welcome`,
              },
              token: token ?? undefined,
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
      if (err instanceof Error) {
        setSubmitError(err.message || "Error inesperado");
      } else {
        setSubmitError("Error inesperado");
      }
    }
  }

  const clerkError =
    errors?.global?.[0]?.message || errors?.global?.[0]?.longMessage;

  async function handleGoogleSignIn() {
    await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: `${window.location.origin}/sso-callback`,
      redirectUrl: `${window.location.origin}/app`,
    });
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a controlar tus finanzas"
    >
      <OAuthButtons onGoogle={handleGoogleSignIn} />

      <div className="my-6">
        <Divider />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`h-12 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
              fieldErrors.password
                ? "border-red-400"
                : "border-duo-border focus:border-duo-green"
            }`}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        {(submitError || clerkError) && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError || clerkError}
          </div>
        )}

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
