import { useState } from "react";
import {
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
  ArrowLeftRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "../../../utils/currency";
import { ACCOUNT_TYPES } from "./constants";
import type { Account } from "../types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
};

const TYPE_LABEL_MAP = Object.fromEntries(
  ACCOUNT_TYPES.map((t) => [t.value, t.label]),
);

type Props = {
  account: Account;
  onTransfer: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AccountCard({
  account,
  onTransfer,
  onEdit,
  onDelete,
}: Props) {
  const Icon = ICON_MAP[account.icon];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="rounded-xl border-2 border-zinc-100 bg-white p-5 transition hover:border-zinc-200"
      style={{ borderLeftColor: account.color, borderLeftWidth: 4 }}
    >
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${account.color}1A`,
              color: account.color,
            }}
          >
            {Icon ? (
              <Icon className="h-5 w-5" />
            ) : (
              <Wallet className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-zinc-800 truncate">
                {account.name}
              </p>
              {!account.isActive && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Inactiva
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">
              {TYPE_LABEL_MAP[account.type] || account.type}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
          <p className="text-2xl font-semibold text-zinc-800">
            {formatCurrency(account.balance, account.currency)}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTransfer}
              title="Transferir"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-duo-green hover:text-duo-green"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                title="Más acciones"
                aria-label="Más acciones"
                aria-expanded={menuOpen}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
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
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                    >
                      <Pencil className="h-4 w-4 text-zinc-500" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete();
                      }}
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
        </div>
      </div>

      <div className="hidden sm:flex sm:items-center sm:gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${account.color}1A`,
            color: account.color,
          }}
        >
          {Icon ? <Icon className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-zinc-800 truncate">
              {account.name}
            </p>
            {!account.isActive && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Inactiva
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            {TYPE_LABEL_MAP[account.type] || account.type}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="font-bold text-zinc-800">
            {formatCurrency(account.balance, account.currency)}
          </p>
          <button
            type="button"
            onClick={onTransfer}
            title="Transferir"
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-200 text-zinc-400 transition hover:border-duo-green hover:text-duo-green"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

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
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <Pencil className="h-4 w-4 text-zinc-500" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
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
      </div>
    </div>
  );
}
