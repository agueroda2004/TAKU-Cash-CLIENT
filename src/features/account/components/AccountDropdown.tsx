import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import AccountOption from "./AccountOption";
import type { AccountDropdownItem } from "../types";

type Props = {
  accounts: AccountDropdownItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
};

export default function AccountDropdown({
  accounts,
  value,
  onChange,
  placeholder = "Seleccionar cuenta",
  error,
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

  const selected = accounts.find((a) => a.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border-2 bg-white px-4 py-1 text-sm outline-none transition ${
          error ? "border-red-400" : "border-zinc-200 focus:border-duo-green"
        }`}
      >
        {selected ? (
          <AccountOption account={selected} />
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
          {accounts.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-zinc-400">
              No hay cuentas disponibles
            </div>
          ) : (
            accounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => {
                  onChange(acc.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-4 py-2.5 text-left transition hover:bg-zinc-50 ${
                  acc.id === value ? "bg-duo-green-light" : ""
                }`}
              >
                <AccountOption account={acc} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
