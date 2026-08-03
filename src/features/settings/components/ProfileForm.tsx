import { useState } from "react";
import { useUser } from "@clerk/react";
import { notify } from "../../../lib/notify";
import { updateProfileSchema } from "../settings.schema";
import type { User } from "../../auth/types";
import type { UpdateProfileInput } from "../types";

type FieldErrors = Partial<Record<"name" | "email", string>>;

type Props = {
  user: User;
  isSaving: boolean;
  onSave: (data: UpdateProfileInput) => Promise<unknown>;
};

export default function ProfileForm({ user, isSaving, onSave }: Props) {
  const { user: clerkUser } = useUser();
  const isEmailLocked =
    clerkUser?.externalAccounts.some(
      (account) => account.emailAddress === user.email,
    ) ?? false;

  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const dirty =
    name.trim() !== (user.name ?? "") || email.trim() !== user.email;

  function handleChange(field: keyof FieldErrors, value: string) {
    if (field === "name") setName(value);
    else setEmail(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  }

  async function handleSave() {
    setSubmitError(null);
    setFieldErrors({});

    const result = updateProfileSchema.safeParse({ name, email });
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
      await onSave({
        name: result.data.name,
        email: result.data.email,
      });
      notify({ success: true, message: "Perfil actualizado" });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al actualizar el perfil",
      );
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
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
            fieldErrors.name
              ? "border-red-400"
              : "border-zinc-200 focus:border-duo-green"
          }`}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isEmailLocked}
          className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
            isEmailLocked
              ? "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-400"
              : fieldErrors.email
                ? "border-red-400"
                : "border-zinc-200 focus:border-duo-green"
          }`}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
        )}
        <p className="mt-1.5 text-xs text-zinc-400">
          {isEmailLocked
            ? "Este correo está vinculado a tu cuenta de Google y no se puede cambiar."
            : "Te enviaremos un correo para verificar el nuevo email."}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!dirty || isSaving}
          className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}