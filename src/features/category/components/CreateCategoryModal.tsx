import { useState } from "react";
import type { z } from "zod";
import { CircleHelp, Plus, Trash2 } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import Dropdown from "../../../shared/ui/Dropdown";
import { notify } from "../../../lib/notify";
import { useCategory } from "../hooks/useCategory";
import {
  createCategorySchema,
  MAX_SUBCATEGORY_NAME_LENGTH,
} from "../category.schema";
import type { CategoryType } from "../types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "./constants";

type FieldErrors = Partial<Record<keyof z.infer<typeof createCategorySchema>, string>>;

type SubcategoryDraft = {
  clientId: string;
  name: string;
};

function generateClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type Props = {
  open: boolean;
  onCancel: () => void;
};

const CATEGORY_TYPES: { value: CategoryType; label: string }[] = [
  { value: "EXPENSE", label: "Gasto" },
  { value: "INCOME", label: "Ingreso" },
];

export default function CreateCategoryModal({ open, onCancel }: Props) {
  const { createCategory, isCreating } = useCategory();
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [subcategoryDrafts, setSubcategoryDrafts] = useState<
    SubcategoryDraft[]
  >([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const trimmedNames = subcategoryDrafts.map((d) => d.name.trim());
  const hasDuplicateNames = new Set(trimmedNames).size !== trimmedNames.length;
  const hasEmptyName = trimmedNames.some((n) => n.length === 0);
  const hasTooLongName = subcategoryDrafts.some(
    (d) => d.name.length > MAX_SUBCATEGORY_NAME_LENGTH,
  );

  const isValid =
    name.trim().length > 0 &&
    type !== null &&
    color !== null &&
    icon !== null &&
    !hasDuplicateNames &&
    !hasEmptyName &&
    !hasTooLongName;

  if (!open) return null;

  function resetForm() {
    setName("");
    setType(null);
    setColor(null);
    setIcon(null);
    setSubcategoryDrafts([]);
    setFieldErrors({});
    setSubmitError(null);
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  function clearFieldError(field: keyof FieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function addSubcategory() {
    setSubcategoryDrafts((prev) => [
      ...prev,
      { clientId: generateClientId(), name: "" },
    ]);
  }

  function updateSubcategoryName(clientId: string, value: string) {
    setSubcategoryDrafts((prev) =>
      prev.map((d) => (d.clientId === clientId ? { ...d, name: value } : d)),
    );
  }

  function removeSubcategory(clientId: string) {
    setSubcategoryDrafts((prev) => prev.filter((d) => d.clientId !== clientId));
  }

  async function handleCreate() {
    setSubmitError(null);
    setFieldErrors({});

    const result = createCategorySchema.safeParse({
      name: name.trim(),
      type,
      color,
      icon,
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

    const subcategories = subcategoryDrafts
      .map((d) => d.name.trim())
      .filter((n) => n.length > 0)
      .map((n) => ({ name: n }));

    try {
      await createCategory({
        ...result.data,
        ...(subcategories.length > 0 ? { subcategories } : {}),
      });
      notify({ success: true, message: "Categoría creada exitosamente" });
      resetForm();
      onCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message || "Error al crear la categoría");
      } else {
        setSubmitError("Error al crear la categoría");
      }
    }
  }

  return (
    <Modal
      title="Crear categoría"
      onCancel={handleCancel}
      confirmText={isCreating ? "Creando..." : "Crear"}
      onConfirm={handleCreate}
      confirmDisabled={!isValid || isCreating}
      confirmLoading={isCreating}
    >
      <div className="space-y-4">
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
            placeholder="Ej: Alimentación"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
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
            Tipo
          </label>
          <Dropdown
            options={CATEGORY_TYPES}
            value={type}
            onChange={(v) => {
              setType(v);
              clearFieldError("type");
            }}
            placeholder="Seleccionar tipo"
          />
          {fieldErrors.type && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.type}</p>
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
                onClick={() => {
                  setColor(c.value);
                  clearFieldError("color");
                }}
                title={c.label}
                className={`h-8 w-8 rounded-full transition hover:scale-110 ${
                  c.class
                } ${color === c.value ? "ring-2 ring-zinc-800 ring-offset-2" : ""}`}
              />
            ))}
          </div>
          {fieldErrors.color && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.color}</p>
          )}
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
                  onClick={() => {
                    setIcon(ic.value);
                    clearFieldError("icon");
                  }}
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
          {fieldErrors.icon && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.icon}</p>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Las subcategorías te permiten dividir una categoría para tener un
              mejor control y reportes de gastos e ingresos.
            </p>
          </div>

          <div className="mb-1.5 flex items-center justify-between">
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

          {subcategoryDrafts.length === 0 && (
            <p className="rounded-xl border-2 border-dashed border-zinc-200 px-4 py-6 text-center text-xs text-zinc-500">
              Aún no tienes subcategorías. Añade una para empezar.
            </p>
          )}

          <div className="space-y-2">
            {subcategoryDrafts.map((d) => (
              <div key={d.clientId} className="flex items-center gap-2">
                <input
                  type="text"
                  value={d.name}
                  maxLength={MAX_SUBCATEGORY_NAME_LENGTH}
                  onChange={(e) =>
                    updateSubcategoryName(d.clientId, e.target.value)
                  }
                  placeholder="Nombre de la subcategoría"
                  className="h-10 flex-1 rounded-xl border-2 border-zinc-200 px-3 text-base outline-none transition focus:border-duo-green md:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSubcategory(d.clientId)}
                  title="Eliminar"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-duo-red hover:text-duo-red"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

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
      </div>
    </Modal>
  );
}
