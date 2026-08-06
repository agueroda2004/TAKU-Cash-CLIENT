import { useState } from "react";
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
  const [name, setName] = useState(user.name ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const dirty = name.trim() !== (user.name ?? "");

  function handleChange(value: string) {
    setName(value);
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
    if (submitError) setSubmitError(null);
  }

  async function handleSave() {
    setSubmitError(null);
    setFieldErrors({});

    const result = updateProfileSchema.safeParse({
      name,
      email: user.email,
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
          onChange={(e) => handleChange(e.target.value)}
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
          value={user.email}
          disabled
          readOnly
          className="h-11 w-full cursor-not-allowed rounded-xl border-2 border-zinc-100 bg-zinc-50 px-4 text-sm text-zinc-400 outline-none"
        />
        <p className="mt-1.5 text-xs text-zinc-400">
          El correo no se puede cambiar desde aquí. Si deseas modificar tu
          correo, por favor comunícate con soporte.
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