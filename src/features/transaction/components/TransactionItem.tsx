import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency } from "../../../utils/currency";

type Props = {
  transaction: Transaction;
  accountName: string;
  accountCurrency: string;
  category: { id: string; name: string; color: string };
  subcategory?: { id: string; name: string };
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionItem({
  transaction,
  accountName,
  accountCurrency,
  category,
  subcategory,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isIncome = transaction.type === "INCOME";
  const accentColor = isIncome ? "#10b981" : "#f43f5e";
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="group flex items-center gap-4 rounded-xl border-2 border-zinc-100 bg-white p-4 transition hover:border-zinc-200">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-zinc-800 truncate">
          {transaction.description || category.name}
        </p>
        <p className="text-xs text-zinc-500">
          {accountName} • {transaction.transferId ? "Transferencia" : subcategory ? `${category.name} • ${subcategory.name}` : category.name} • {formatDate(transaction.date)}
        </p>
      </div>

      {!transaction.transferId && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            title="Más acciones"
            aria-label="Más acciones"
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onEdit(transaction); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                >
                  <Pencil className="h-4 w-4 text-zinc-500" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onDelete(transaction); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-duo-red transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="text-right shrink-0">
        <p
          className={`font-bold ${
            isIncome ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount, accountCurrency)}
        </p>
      </div>
    </div>
  );
}