import { Wallet, CreditCard, Banknote, PiggyBank, Landmark, Building2, Coins } from "lucide-react";
import { formatCurrency } from "../../../utils/currency";
import type { AccountDropdownItem, Account } from "../types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
};

type Props = {
  account: AccountDropdownItem | Account;
};

export default function AccountOption({ account }: Props) {
  const Icon = ICON_MAP[account.icon] || Wallet;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${account.color}1A`, color: account.color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="truncate text-sm font-medium text-zinc-800">
          {account.name}
        </p>
        <span className="shrink-0 text-xs text-zinc-400">
          {formatCurrency(account.balance, account.currency)}
        </span>
        <span className="shrink-0 text-xs font-medium text-zinc-500">
          {account.currency}
        </span>
      </div>
    </div>
  );
}
