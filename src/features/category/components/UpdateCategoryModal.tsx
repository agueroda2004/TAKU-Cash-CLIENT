import { useMemo, useState } from "react";
import {
  CircleHelp,
  EyeOff,
  Plus,
  RotateCcw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import { notify } from "../../../lib/notify";
import { ErrorCode, isApiErrorCode } from "../../../lib/error-codes";
import { useCategory } from "../hooks/useCategory";
import {
  updateCategorySchema,
  MAX_SUBCATEGORY_NAME_LENGTH,
} from "../category.schema";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "./constants";
import type { Category } from "../types";

type Props = {
  open: boolean;
  category: Category | null;
  onCancel: () => void;
};

type ExistingDraft = {
  kind: "existing";
  id: string;
  name: string;
  originalName: string;
  isActive: boolean;
  originalIsActive: boolean;
  pendingDelete: boolean;
};

type NewDraft = {
  kind: "new";
  clientId: string;
  name: string;
};

type Draft = ExistingDraft | NewDraft;

type SubcategoryFilter = "active" | "inactive";

function buildInitialDrafts(subcategories: Category["subcategories"]): Draft[] {
  return subcategories.map((sub) => ({
    kind: "existing" as const,
    id: sub.id,
    name: sub.name,
    originalName: sub.name,
    isActive: sub.isActive,
    originalIsActive: sub.isActive,
    pendingDelete: false,
  }));
}

function generateClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function UpdateCategoryModal({
  open,
  category,
  onCancel,
}: Props) {
  const { updateCategory, isUpdating } = useCategory();

  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState<string | null>(category?.color ?? null);
  const [icon, setIcon] = useState<string | null>(category?.icon ?? null);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [drafts, setDrafts] = useState<Draft[]>(() =>
    category ? buildInitialDrafts(category.subcategories) : [],
  );
  const [filter, setFilter] = useState<SubcategoryFilter>("active");
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const visibleDrafts = useMemo(
    () => drafts.filter((d) => !(d.kind === "existing" && d.pendingDelete)),
    [drafts],
  );

  const visibleActive = visibleDrafts.filter(
    (d) => d.kind === "new" || (d.kind === "existing" && d.isActive),
  );

  const visibleInactive = visibleDrafts.filter(
    (d) => d.kind === "existing" && !d.isActive,
  );

  const displayedDrafts = filter === "active" ? visibleActive : visibleInactive;

  const pendingDeletes = useMemo(
    () =>
      drafts.filter(
        (d): d is ExistingDraft => d.kind === "existing" && d.pendingDelete,
      ),
    [drafts],
  );

  const hasNewSubcategories = drafts.some((d) => d.kind === "new");
  const hasPendingDeletes = pendingDeletes.length > 0;
  const hasRenamed = drafts.some(
    (d) =>
      d.kind === "existing" &&
      !d.pendingDelete &&
      d.name.trim() !== d.originalName,
  );
  const hasStatusChanged = drafts.some(
    (d) =>
      d.kind === "existing" &&
      !d.pendingDelete &&
      d.isActive !== d.originalIsActive,
  );

  const nameDirty = name.trim() !== (category?.name ?? "");
  const colorDirty = color !== (category?.color ?? null);
  const iconDirty = icon !== (category?.icon ?? null);
  const isActiveDirty = isActive !== (category?.isActive ?? true);
  const dirty =
    nameDirty ||
    colorDirty ||
    iconDirty ||
    isActiveDirty ||
    hasNewSubcategories ||
    hasRenamed ||
    hasStatusChanged ||
    hasPendingDeletes;

  const trimmedNames = visibleDrafts.map((d) => d.name.trim());
  const hasDuplicateNames = new Set(trimmedNames).size !== trimmedNames.length;
  const hasEmptyName = trimmedNames.some((n) => n.length === 0);
  const hasTooLongName = visibleDrafts.some(
    (d) => d.name.length > MAX_SUBCATEGORY_NAME_LENGTH,
  );

  const isValid =
    name.trim().length > 0 &&
    color !== null &&
    icon !== null &&
    !hasDuplicateNames &&
    !hasEmptyName &&
    !hasTooLongName;

  if (!open || !category) return null;
  const currentCategory = category;

  function addSubcategory() {
    setFilter("active");
    setDrafts((prev) => [
      ...prev,
      { kind: "new", clientId: generateClientId(), name: "" },
    ]);
  }

  function updateDraftName(id: string, value: string) {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.kind === "existing" && d.id === id) return { ...d, name: value };
        if (d.kind === "new" && d.clientId === id) return { ...d, name: value };
        return d;
      }),
    );
  }

  function toggleDraftActive(id: string) {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.kind === "existing" && d.id === id) {
          return { ...d, isActive: !d.isActive };
        }
        return d;
      }),
    );
  }

  function markForDelete(id: string) {
    setDrafts((prev) =>
      prev.map((d) =>
        d.kind === "existing" && d.id === id
          ? { ...d, pendingDelete: true }
          : d,
      ),
    );
  }

  function restoreDeleted(id: string) {
    setDrafts((prev) =>
      prev.map((d) =>
        d.kind === "existing" && d.id === id
          ? { ...d, pendingDelete: false }
          : d,
      ),
    );
  }

  function removeNew(clientId: string) {
    setDrafts((prev) =>
      prev.filter((d) => !(d.kind === "new" && d.clientId === clientId)),
    );
  }

  async function handleSave() {
    setSubmitError(null);
    setNameError(null);

    const result = updateCategorySchema.safeParse({
      name: name.trim(),
      color: color!,
      icon: icon!,
    });
    if (!result.success) {
      const field = result.error.issues[0]?.path[0];
      const message = result.error.issues[0]?.message ?? "Error de validación";
      if (field === "name") setNameError(message);
      else setSubmitError(message);
      return;
    }

    const createPayload = drafts
      .filter((d): d is NewDraft => d.kind === "new")
      .map((d) => ({ name: d.name.trim() }))
      .filter((d) => d.name.length > 0);

    const updatePayload = drafts
      .filter(
        (d): d is ExistingDraft =>
          d.kind === "existing" &&
          !d.pendingDelete &&
          (d.name.trim() !== d.originalName ||
            d.isActive !== d.originalIsActive),
      )
      .map((d) => ({
        id: d.id,
        name: d.name.trim(),
        ...(d.isActive !== d.originalIsActive ? { isActive: d.isActive } : {}),
      }));

    const deletePayload = drafts
      .filter(
        (d): d is ExistingDraft => d.kind === "existing" && d.pendingDelete,
      )
      .map((d) => d.id);

    const subcategoriesPayload: {
      create?: { name: string }[];
      update?: { id: string; name: string; isActive?: boolean }[];
      delete?: string[];
    } = {};
    if (createPayload.length > 0) subcategoriesPayload.create = createPayload;
    if (updatePayload.length > 0) subcategoriesPayload.update = updatePayload;
    if (deletePayload.length > 0) subcategoriesPayload.delete = deletePayload;

    try {
      await updateCategory({
        id: currentCategory.id,
        data: {
          name: name.trim(),
          color: color!,
          icon: icon!,
          ...(isActiveDirty ? { isActive } : {}),
          subcategories:
            Object.keys(subcategoriesPayload).length > 0
              ? subcategoriesPayload
              : undefined,
        },
      });
      notify({ success: true, message: "Categoría actualizada" });
      onCancel();
    } catch (err: unknown) {
      if (isApiErrorCode(err, ErrorCode.Conflict)) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Algunas subcategorías tienen transacciones asociadas",
        );
      } else {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Error al actualizar la categoría",
        );
      }
    }
  }

  return (
    <Modal
      title="Editar categoría"
      onCancel={onCancel}
      confirmText={isUpdating ? "Guardando..." : "Guardar cambios"}
      onConfirm={handleSave}
      confirmDisabled={!isValid || !dirty || isUpdating}
      confirmLoading={isUpdating}
    >
      <div className="space-y-4">
        <p className="text-xs text-zinc-500">
          El tipo no se puede cambiar porque rompería las transacciones
        </p>

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
            {CATEGORY_COLORS.map((c) => (
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
            {CATEGORY_ICONS.map((ic) => {
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

        <div>
          <div className="mb-3 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Las subcategorías te permiten dividir una categoría para tener un
              mejor control y reportes de gastos e ingresos.
            </p>
          </div>

          <div className="mb-3 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
            <EyeOff className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Si desactivas una subcategoría no se mostrará en el sistema, pero
              los datos históricos se conservan. Puedes reactivarla después.
            </p>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-700">
              Subcategorías
            </label>
            <button
              type="button"
              onClick={addSubcategory}
              className="flex items-center gap-1 rounded-lg border-2 border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-600 transition hover:border-duo-green hover:text-duo-green"
            >
              <Plus className="h-3.5 w-3.5" />
              Añadir
            </button>
          </div>

          <div className="mb-3 flex gap-1 rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "active"
                  ? "bg-white text-zinc-800 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Activas
            </button>
            <button
              type="button"
              onClick={() => setFilter("inactive")}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === "inactive"
                  ? "bg-white text-zinc-800 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Inactivas
            </button>
          </div>

          {displayedDrafts.length === 0 && !hasPendingDeletes && (
            <p className="rounded-xl border-2 border-dashed border-zinc-200 px-4 py-6 text-center text-xs text-zinc-500">
              {filter === "active"
                ? "No hay subcategorías activas. Añade una para empezar."
                : "No hay subcategorías inactivas."}
            </p>
          )}

          {displayedDrafts.length > 0 && (
            <div className="space-y-2">
              {displayedDrafts.map((d) => {
                const key = d.kind === "existing" ? d.id : d.clientId;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d.name}
                      maxLength={MAX_SUBCATEGORY_NAME_LENGTH}
                      onChange={(e) => updateDraftName(key, e.target.value)}
                      placeholder="Nombre"
                      className="h-10 flex-1 rounded-xl border-2 border-zinc-200 px-3 text-base outline-none transition focus:border-duo-green md:text-sm"
                    />
                    {d.kind === "existing" && (
                      <button
                        type="button"
                        onClick={() => toggleDraftActive(d.id)}
                        className={`flex h-10 items-center gap-1.5 rounded-xl border-2 px-3 text-xs font-semibold transition ${
                          d.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                            : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-zinc-300"
                        }`}
                        title={d.isActive ? "Desactivar" : "Reactivar"}
                      >
                        {d.isActive ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reactivar
                          </>
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        d.kind === "existing"
                          ? markForDelete(d.id)
                          : removeNew(d.clientId)
                      }
                      title="Eliminar"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-duo-red hover:text-duo-red"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {hasPendingDeletes && (
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Si una subcategoría tiene transacciones asociadas no se podrá
                  eliminar. En ese caso, puedes desactivarla para ocultarla del
                  sistema.
                </p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Marcadas para eliminar
              </p>
              {pendingDeletes.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 rounded-xl border-2 border-dashed border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  <span className="flex-1 line-through">
                    {d.originalName}
                  </span>
                  <button
                    type="button"
                    onClick={() => restoreDeleted(d.id)}
                    title="Restaurar"
                    className="flex items-center gap-1 rounded-lg border-2 border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restaurar
                  </button>
                </div>
              ))}
            </div>
          )}

          {hasDuplicateNames && (
            <p className="mt-2 text-xs text-red-500">
              Hay subcategorías con el mismo nombre.
            </p>
          )}
          {!hasDuplicateNames && hasEmptyName && (
            <p className="mt-2 text-xs text-red-500">
              Todas las subcategorías deben tener nombre.
            </p>
          )}
          {!hasDuplicateNames && !hasEmptyName && hasTooLongName && (
            <p className="mt-2 text-xs text-red-500">
              Alguna subcategoría supera los {MAX_SUBCATEGORY_NAME_LENGTH}{" "}
              caracteres.
            </p>
          )}
        </div>

        <div className="rounded-xl border-2 border-zinc-100 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-700">
                Categoría activa
              </p>
              <p className="text-xs text-zinc-500">
                Las categorías inactivas no aparecen en selecciones ni reportes
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-label="Categoría activa"
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
    </Modal>
  );
}
