import { useState } from "react";
import Overlay from "../../../shared/ui/Overlay";
import { notify } from "../../../lib/notify";
import { useAccount } from "../hooks/useAccount";
import { updateAccountSchema } from "../account.schema";
import { COLORS, ICONS } from "./constants";
import type { Account } from "../types";

type Props = {
  open: boolean;
  account: Account | null;
  onCancel: () => void;
};

export default function UpdateAccountModal({ open, account, onCancel }: Props) {
  const { updateAccount, isUpdating } = useAccount();
  const [name, setName] = useState(account?.name ?? "");
  const [color, setColor] = useState<string | null>(account?.color ?? null);
  const [icon, setIcon] = useState<string | null>(account?.icon ?? null);
  const [isActive, setIsActive] = useState(account?.isActive ?? true);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!open || !account) return null;
  const currentAccount = account;

  const isValid = name.trim().length > 0 && color !== null && icon !== null;
  const dirty =
    name.trim() !== currentAccount.name ||
    color !== currentAccount.color ||
    icon !== currentAccount.icon ||
    isActive !== currentAccount.isActive;

  function handleCancel() {
    setName(currentAccount.name);
    setColor(currentAccount.color);
    setIcon(currentAccount.icon);
    setIsActive(currentAccount.isActive);
    setNameError(null);
    setSubmitError(null);
    onCancel();
  }

  async function handleSave() {
    setSubmitError(null);
    setNameError(null);

    const result = updateAccountSchema.safeParse({
      name: name.trim(),
      color: color!,
      icon: icon!,
      isActive,
    });
    if (!result.success) {
      const field = result.error.issues[0]?.path[0];
      const message = result.error.issues[0]?.message ?? "Error de validación";
      if (field === "name") setNameError(message);
      else setSubmitError(message);
      return;
    }

    try {
      await updateAccount({
        id: currentAccount.id,
        data: result.data,
      });
      notify({ success: true, message: "Cuenta actualizada" });
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error al actualizar la cuenta");
      } else {
        setSubmitError("Error al actualizar la cuenta");
      }
    }
  }

  return (
    <Overlay>
      <div
        className="z-50 mx-4 flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="shrink-0 border-b border-zinc-100 px-6 py-4">
          <h2 className="text-lg font-bold text-zinc-800">Editar cuenta</h2>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
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
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              className={`h-11 w-full rounded-xl border-2 px-4 text-sm outline-none transition ${
                nameError
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-duo-green"
              }`}
            />
            {nameError && (
              <p className="mt-1 text-xs text-red-500">{nameError}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className={`h-8 w-8 rounded-full transition hover:scale-110 ${c.class} ${
                    color === c.value
                      ? "ring-2 ring-zinc-800 ring-offset-2"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Icono
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => {
                const Icon = ic.icon;
                return (
                  <button
                    key={ic.value}
                    type="button"
                    onClick={() => setIcon(ic.value)}
                    title={ic.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition ${
                      icon === ic.value
                        ? "border-duo-green bg-duo-green-light text-duo-green"
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border-2 border-zinc-100 px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-700">
                  Cuenta activa
                </p>
                <p className="text-xs text-zinc-500">
                  Las cuentas inactivas no aparecen en selecciones ni
                  transferencias
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label="Cuenta activa"
                onClick={() => setIsActive((v) => !v)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  isActive ? "bg-duo-green" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                    isActive ? "left-5.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            onClick={handleCancel}
            className="rounded-xl border-2 border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || !dirty || isUpdating}
            className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
          >
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
