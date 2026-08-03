import { useEffect, useState } from "react";
import type { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useSignIn, useSignUp } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { loginSchema } from "../auth.schema";
import AuthLayout from "../components/AuthLayout";
import OAuthButtons from "../components/OAuthButtons";
import Divider from "../components/Divider";

type FieldErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/app", { replace: true });
  }, [isLoaded, isSignedIn, navigate]);

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "email") setEmail(value);
    else setPassword(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });

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
      const createResult = await signIn.create({
        identifier: email,
        password,
      });

      if (createResult.error) {
        setSubmitError(
          createResult.error.message ||
            createResult.error.longMessage ||
            "Error al iniciar sesión",
        );
        return;
      }

      await signIn.finalize();
      notify({ success: true, message: "Inicio de sesión exitoso" });
      navigate("/app");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error inesperado");
      } else {
        setSubmitError("Error inesperado");
      }
    }
  }

  const clerkMessage =
    errors?.global?.[0]?.message || errors?.global?.[0]?.longMessage;

  async function handleGoogleSignIn() {
    await signUp.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: `${window.location.origin}/sso-callback`,
      redirectUrl: `${window.location.origin}/app`,
    });
  }

  return (
    <AuthLayout title="Inicia sesión" subtitle="Bienvenido de nuevo">
      <OAuthButtons onGoogle={handleGoogleSignIn} />

      <div className="my-6">
        <Divider />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {(submitError || clerkMessage) && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError || clerkMessage}
          </div>
        )}

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

        <Link
          to="/forgot-password"
          className="-mt-1 text-right text-sm text-duo-gray underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
        >
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-duo-gray">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="font-bold text-duo-green underline">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}
