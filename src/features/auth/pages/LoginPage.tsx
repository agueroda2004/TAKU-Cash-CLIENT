import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useSignIn } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { loginSchema } from "../auth.schema";
import {
  inspectClerkError,
  parseClerkApiError,
} from "../lib/clerk-errors";
import AuthLayout from "../components/AuthLayout";
import OAuthButtons from "../components/OAuthButtons";
import Divider from "../components/Divider";
import PasswordInput from "../components/PasswordInput";
import AuthErrorBanner from "../components/AuthErrorBanner";

type FieldErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    signIn.reset();
  }, [signIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/app", { replace: true });
  }, [isLoaded, isSignedIn, navigate]);

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "email") setEmail(value);
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
        const info = parseClerkApiError(createResult.error);
        if (info) {
          setClerkError({ code: info.code, message: info.message });
        } else {
          setClerkError({
            code: "unknown",
            message: "Error al iniciar sesión",
          });
        }
        return;
      }

      await signIn.finalize();
      notify({ success: true, message: "Inicio de sesión exitoso" });
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
      await signIn.sso({
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
    <AuthLayout title="Inicia sesión" subtitle="Bienvenido de nuevo">
      <OAuthButtons
        onGoogle={handleGoogleSignIn}
        isGoogleLoading={isGoogleLoading}
      />

      <div className="my-6">
        <Divider />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <AuthErrorBanner messages={bannerMessages} />

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
          autoComplete="current-password"
        />

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
