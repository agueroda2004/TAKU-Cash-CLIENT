import { Wallet, CreditCard, Banknote, PiggyBank, Landmark, Building2, Coins } from "lucide-react";
import InfoTooltip from "../../../shared/ui/InfoTooltip";
import { conversionTooltip } from "../conversion";
import type { AccountDropdownItem } from "../../account/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet, CreditCard, Banknote, PiggyBank, Landmark, Building2, Coins,
};

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "₡";
  return `${symbol} ${new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function convertBalance(balance: number, from: string, to: string, rate: number | null): number {
  if (!rate || from === to) return balance;
  if (from === "USD") return balance * rate;
  return balance / rate;
}

type Props = {
  accounts: AccountDropdownItem[];
  currency: string;
  exchangeRate: number | null;
};

export default function AccountBalance({ accounts, currency, exchangeRate }: Props) {
  if (accounts.length === 0) return null;

  const totalBalance = accounts.reduce((sum, a) => sum + convertBalance(a.balance, a.currency, currency, exchangeRate), 0);

  return (
    <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
      <div className="mb-3 flex items-center gap-1">
        <p className="text-sm font-semibold text-zinc-800">Balance de cuentas</p>
        <InfoTooltip text={conversionTooltip(currency)} />
      </div>
      <div className="space-y-2">
        {accounts.map((acc) => {
          const Icon = ICON_MAP[acc.icon] || Wallet;
          const converted = convertBalance(acc.balance, acc.currency, currency, exchangeRate);
          return (
            <div key={acc.id} className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${acc.color}1A`, color: acc.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-zinc-800">{acc.name}</p>
                {acc.currency !== currency && (
                  <p className="text-xs text-zinc-400">
                    {formatCurrency(acc.balance, acc.currency)}
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold text-zinc-700">
                {formatCurrency(converted, currency)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
        <p className="text-sm font-semibold text-zinc-800">Total</p>
        <span className="text-sm font-bold text-zinc-800">
          {formatCurrency(totalBalance, currency)}
        </span>
      </div>
    </div>
  );
}
