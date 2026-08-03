import { useState } from "react";
import { useUser } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { changePasswordSchema } from "../settings.schema";

type FieldErrors = Partial<Record<"currentPassword" | "newPassword" | "confirmPassword", string>>;

const EMPTY_FIELDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
} as const;

export default function ChangePasswordForm() {
  const { user } = useUser();
  const [fields, setFields] = useState({ ...EMPTY_FIELDS });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user?.passwordEnabled) return null;
  const currentUser = user;

  const dirty = Object.values(fields).some((value) => value !== "");

  function handleChange(field: keyof typeof EMPTY_FIELDS, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  }

  async function handleSave() {
    setSubmitError(null);
    setFieldErrors({});

    const result = changePasswordSchema.safeParse(fields);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await currentUser.updatePassword({
        newPassword: result.data.newPassword,
        currentPassword: result.data.currentPassword,
        signOutOfOtherSessions: true,
      });
      setFields({ ...EMPTY_FIELDS });
      notify({ success: true, message: "Contraseña actualizada" });
    } catch (err) {
      const clerkError = err as {
        errors?: { code?: string; longMessage?: string }[];
        message?: string;
      };
      const code = clerkError?.errors?.[0]?.code ?? "";
      if (code.toLowerCase().includes("pass")) {
        setSubmitError("La contraseña actual es incorrecta");
      } else {
        setSubmitError(
          clerkError?.errors?.[0]?.longMessage ??
            clerkError?.message ??
            "Error al actualizar la contraseña",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5 space-y-4">
      {submitError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Contraseña actual
        </label>
        <input
          type="password"
          value={fields.currentPassword}
          onChange={(e) => handleChange("currentPassword", e.target.value)}
          className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
            fieldErrors.currentPassword
              ? "border-red-400"
              : "border-zinc-200 focus:border-duo-green"
          }`}
        />
        {fieldErrors.currentPassword && (
          <p className="mt-1 text-xs text-red-500">
            {fieldErrors.currentPassword}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Nueva contraseña
        </label>
        <input
          type="password"
          value={fields.newPassword}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
            fieldErrors.newPassword
              ? "border-red-400"
              : "border-zinc-200 focus:border-duo-green"
          }`}
        />
        {fieldErrors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.newPassword}</p>
        )}
        <p className="mt-1.5 text-xs text-zinc-400">
          Mínimo 8 caracteres.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Confirmar nueva contraseña
        </label>
        <input
          type="password"
          value={fields.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
            fieldErrors.confirmPassword
              ? "border-red-400"
              : "border-zinc-200 focus:border-duo-green"
          }`}
        />
        {fieldErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!dirty || isSubmitting}
          className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </div>
    </div>
  );
}
