import { useState } from "react";
import type { z } from "zod";
import { Link } from "react-router-dom";
import { useSignIn } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { forgotPasswordSchema, resetPasswordSchema } from "../auth.schema";
import AuthLayout from "../components/AuthLayout";

type ForgotErrors = Partial<
  Record<keyof z.infer<typeof forgotPasswordSchema>, string>
>;
type ResetErrors = Partial<
  Record<keyof z.infer<typeof resetPasswordSchema>, string>
>;

export default function ForgotPasswordPage() {
  const { signIn, fetchStatus } = useSignIn();
  const isLoading = fetchStatus === "fetching";

  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  function clearFieldError(field: string) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      const errors: ForgotErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForgotErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      const createResult = await signIn.create({ identifier: email });

      if (createResult.error) {
        setSubmitError(
          createResult.error.message ||
            createResult.error.longMessage ||
            "Error al enviar el código",
        );
        return;
      }

      const sendResult = await signIn.resetPasswordEmailCode.sendCode();

      if (sendResult.error) {
        setSubmitError(
          sendResult.error.message ||
            sendResult.error.longMessage ||
            "Error al enviar el código",
        );
        return;
      }

      setStep("reset");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error inesperado");
      } else {
        setSubmitError("Error inesperado");
      }
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const result = resetPasswordSchema.safeParse({ code, password });
    if (!result.success) {
      const errors: ResetErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ResetErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({
        code,
      });

      if (verifyResult.error) {
        setSubmitError(
          verifyResult.error.message ||
            verifyResult.error.longMessage ||
            "Error al restablecer la contraseña",
        );
        return;
      }

      const submitResult =
        await signIn.resetPasswordEmailCode.submitPassword({
          password,
          signOutOfOtherSessions: true,
        });

      if (submitResult.error) {
        setSubmitError(
          submitResult.error.message ||
            submitResult.error.longMessage ||
            "Error al restablecer la contraseña",
        );
        return;
      }

      notify({
        success: true,
        message: "Contraseña restablecida exitosamente",
      });
      setStep("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error inesperado");
      } else {
        setSubmitError("Error inesperado");
      }
    }
  }

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle={
        step === "email"
          ? "Te enviaremos un código a tu correo"
          : step === "reset"
            ? "Ingresa el código y tu nueva contraseña"
            : undefined
      }
    >
      {step === "email" && (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={`h-12 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
                fieldErrors.email
                  ? "border-red-400"
                  : "border-duo-border focus:border-duo-green"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar código"}
          </button>

          <Link
            to="/login"
            className="text-center text-sm text-duo-gray underline"
          >
            Volver al inicio de sesión
          </Link>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Código de 6 dígitos"
              value={code}
              maxLength={6}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ""));
                clearFieldError("code");
              }}
              className={`h-12 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
                fieldErrors.code
                  ? "border-red-400"
                  : "border-duo-border focus:border-duo-green"
              }`}
            />
            {fieldErrors.code && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.code}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              className={`h-12 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
                fieldErrors.password
                  ? "border-red-400"
                  : "border-duo-border focus:border-duo-green"
              }`}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
          >
            {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-zinc-600">
            Tu contraseña se ha restablecido correctamente.
          </p>
          <Link
            to="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover"
          >
            Iniciar sesión
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
