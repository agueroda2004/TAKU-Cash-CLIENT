import { useMemo, useState } from "react";
import {
  Wallet,
  MoreVertical,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { CATEGORY_ICONS } from "./constants";
import type { Category } from "../types";

type Props = {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  onReactivate: () => void;
};

const ICON_MAP = Object.fromEntries(
  CATEGORY_ICONS.map((i) => [i.value, i.icon]),
);

function activeSubs(category: Category) {
  return category.subcategories.filter((s) => s.isActive);
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onReactivate,
}: Props) {
  const Icon = ICON_MAP[category.icon];
  const [showAll, setShowAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isInactive = !category.isActive;

  const activeSubcategories = useMemo(() => activeSubs(category), [category]);

  const visibleSubs = useMemo(() => {
    if (showAll || activeSubcategories.length <= 5) return activeSubcategories;
    return activeSubcategories.slice(0, 5);
  }, [activeSubcategories, showAll]);

  const hiddenCount = activeSubcategories.length - visibleSubs.length;

  function triggerEdit() {
    setMenuOpen(false);
    onEdit();
  }

  function triggerDelete() {
    setMenuOpen(false);
    onDelete();
  }

  function triggerReactivate() {
    setMenuOpen(false);
    onReactivate();
  }

  return (
    <div
      className="rounded-xl border-2 border-zinc-100 bg-white p-5 transition hover:border-zinc-200"
      style={{ borderLeftColor: category.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${category.color}1A`, color: category.color }}
        >
          {Icon ? <Icon className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 flex-1 truncate font-semibold text-zinc-800">
              {category.name}
            </p>
            {category.type === "EXPENSE" ? (
              <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                Gasto
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                Ingreso
              </span>
            )}
            {isInactive && (
              <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Inactiva
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            {activeSubcategories.length} subcategoría
            {activeSubcategories.length === 1 ? "" : "s"}
          </p>
        </div>

        {isInactive && (
          <button
            type="button"
            onClick={onReactivate}
            title="Reactivar"
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-duo-green hover:text-duo-green"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            title="Más acciones"
            aria-label="Más acciones"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                {isInactive && (
                  <button
                    type="button"
                    onClick={triggerReactivate}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <RotateCcw className="h-4 w-4 text-zinc-500" />
                    Reactivar
                  </button>
                )}
                <button
                  type="button"
                  onClick={triggerEdit}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                >
                  <Pencil className="h-4 w-4 text-zinc-500" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={triggerDelete}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-duo-red transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {activeSubcategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {visibleSubs.map((sub) => (
            <span
              key={sub.id}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
            >
              {sub.name}
            </span>
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-200"
            >
              +{hiddenCount} más
            </button>
          )}
          {showAll && activeSubcategories.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-200"
            >
              Ver menos
            </button>
          )}
        </div>
      )}
    </div>
  );
}
