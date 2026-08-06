import { useState } from "react";
import type { z } from "zod";
import { Link, NavLink } from "react-router-dom";
import { useSignIn } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { forgotPasswordSchema, resetPasswordSchema } from "../auth.schema";
import { parseClerkApiError } from "../lib/clerk-errors";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

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
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);

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
        const info = parseClerkApiError(createResult.error);
        if (
          info?.code === "form_identifier_not_found" ||
          info?.code === "form_email_address_not_found"
        ) {
          setStep("reset");
          return;
        }
        setSubmitError(info?.message ?? "Error al enviar el código");
        return;
      }

      const sendResult = await signIn.resetPasswordEmailCode.sendCode();

      if (sendResult.error) {
        const info = parseClerkApiError(sendResult.error);
        setSubmitError(info?.message ?? "Error al enviar el código");
        return;
      }

      setVerifiedCode(null);
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
      if (verifiedCode !== code) {
        const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({
          code,
        });

        if (verifyResult.error) {
          const info = parseClerkApiError(verifyResult.error);
          setSubmitError(info?.message ?? "Error al restablecer la contraseña");
          return;
        }

        setVerifiedCode(code);
      }

      const submitResult = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });

      if (submitResult.error) {
        const info = parseClerkApiError(submitResult.error);
        setSubmitError(info?.message ?? "Error al restablecer la contraseña");
        return;
      }

      const finalizeResult = await signIn.finalize();

      if (finalizeResult.error) {
        const info = parseClerkApiError(finalizeResult.error);
        setSubmitError(info?.message ?? "Error al restablecer la contraseña");
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
        <form
          onSubmit={handleSendCode}
          noValidate
          className="flex flex-col gap-4"
        >
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
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
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
        <form onSubmit={handleReset} noValidate className="flex flex-col gap-4">
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
              <p className="mt-1 text-xs text-red-500">{fieldErrors.code}</p>
            )}
          </div>

          <PasswordInput
            value={password}
            onChange={(v) => {
              setPassword(v);
              clearFieldError("password");
            }}
            placeholder="Nueva contraseña"
            error={fieldErrors.password}
            autoComplete="new-password"
            showStrength
          />

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
          <NavLink
            to="/app"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-duo-green font-bold text-white transition hover:bg-duo-green-hover"
          >
            Continuar
          </NavLink>
        </div>
      )}
    </AuthLayout>
  );
}
