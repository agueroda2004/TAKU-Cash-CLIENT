import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: readonly DropdownOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
};

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Seleccionar",
  disabled = false,
  emptyText,
}: Props<T>) {
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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`flex h-11 w-full items-center justify-between rounded-xl border-2 bg-white px-4 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-zinc-100 text-zinc-300"
            : "border-zinc-200 focus:border-duo-green"
        }`}
      >
        <span className={selected ? "text-zinc-800" : disabled ? "text-zinc-300" : "text-zinc-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition ${open ? "rotate-180" : ""} ${disabled ? "opacity-30" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          {options.length === 0 && emptyText ? (
            <div className="px-4 py-6 text-center text-sm text-zinc-400">
              {emptyText}
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-zinc-50 ${
                  option.value === value ? "font-semibold text-duo-green" : "text-zinc-700"
                }`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
