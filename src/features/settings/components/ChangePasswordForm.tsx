import { useState } from "react";
import { useUser } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { changePasswordSchema } from "../settings.schema";
import PasswordInput from "../../auth/components/PasswordInput";
import { inspectClerkError } from "../../auth/lib/clerk-errors";

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
      const info = inspectClerkError(err);
      setSubmitError(info?.message ?? "Error al actualizar la contraseña");
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
        <PasswordInput
          value={fields.currentPassword}
          onChange={(v) => handleChange("currentPassword", v)}
          placeholder="Contraseña actual"
          autoComplete="current-password"
          error={fieldErrors.currentPassword}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Nueva contraseña
        </label>
        <PasswordInput
          value={fields.newPassword}
          onChange={(v) => handleChange("newPassword", v)}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
          error={fieldErrors.newPassword}
          showStrength
        />
        <p className="mt-1.5 text-xs text-zinc-400">
          Mínimo 8 caracteres.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Confirmar nueva contraseña
        </label>
        <PasswordInput
          value={fields.confirmPassword}
          onChange={(v) => handleChange("confirmPassword", v)}
          placeholder="Confirmar contraseña"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />
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
