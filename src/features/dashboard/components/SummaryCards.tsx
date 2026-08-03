import InfoTooltip from "../../../shared/ui/InfoTooltip";
import { conversionTooltip } from "../conversion";

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "₡";
  return `${symbol} ${new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

type Props = {
  income: number;
  expense: number;
  currency: string;
};

export default function SummaryCards({ income, expense, currency }: Props) {
  const net = income - expense;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-1 sm:justify-start">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Resumen</p>
        <InfoTooltip text={conversionTooltip(currency)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Ingresos</p>
          <p className="mt-1 text-lg font-bold text-emerald-600">
            {income > 0 ? `+${formatCurrency(income, currency)}` : `${formatCurrency(0, currency)}`}
          </p>
        </div>
        <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Gastos</p>
          <p className="mt-1 text-lg font-bold text-rose-600">
            {expense > 0 ? `-${formatCurrency(expense, currency)}` : `${formatCurrency(0, currency)}`}
          </p>
        </div>
        <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Balance</p>
          <p className={`mt-1 text-lg font-bold ${net >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatCurrency(net, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
