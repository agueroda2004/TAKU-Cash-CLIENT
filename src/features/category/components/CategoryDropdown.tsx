import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import CategoryOption from "./CategoryOption";
import type { CategoryDropdownItem } from "../types";

type Props = {
  categories: CategoryDropdownItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export default function CategoryDropdown({
  categories,
  value,
  onChange,
  placeholder = "Seleccionar categoría",
  error,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = categories.find((c) => c.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border-2 bg-white px-4 py-1 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-zinc-100 bg-zinc-50"
            : error
              ? "border-red-400"
              : "border-zinc-200 focus:border-duo-green"
        }`}
      >
        {selected ? (
          <CategoryOption category={selected} />
        ) : (
          <span className="text-zinc-400">{placeholder}</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg">
          {categories.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-zinc-400">
              No hay categorías disponibles
            </div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left transition hover:bg-zinc-50 ${
                  cat.id === value ? "bg-duo-green-light" : ""
                }`}
              >
                <CategoryOption category={cat} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
