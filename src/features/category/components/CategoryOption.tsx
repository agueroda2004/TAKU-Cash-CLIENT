import {
  Utensils, Car, Home, Tv, HeartPulse, GraduationCap, ShoppingBag, Repeat,
  Briefcase, Laptop, TrendingUp, Plus, Wallet,
} from "lucide-react";
import type { CategoryDropdownItem } from "../types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils, Car, Home, Tv, HeartPulse, GraduationCap, ShoppingBag, Repeat,
  Briefcase, Laptop, TrendingUp, Plus, Wallet,
};

type Props = {
  category: CategoryDropdownItem;
};

export default function CategoryOption({ category }: Props) {
  const Icon = ICON_MAP[category.icon] || Wallet;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${category.color}1A`, color: category.color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="truncate text-sm font-medium text-zinc-800">
          {category.name}
        </p>
        <span className="shrink-0 text-xs text-zinc-400">
          {category.type === "INCOME" ? "Ingreso" : "Gasto"}
        </span>
      </div>
    </div>
  );
}
