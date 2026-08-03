import {
  Wallet,
  CreditCard,
  Banknote,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
  type LucideIcon,
} from "lucide-react";
import { CURRENCIES, COLORS } from "../../../constants/data";

export { CURRENCIES, COLORS };

export type AccountTypeValue = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "SAVINGS";

export const ACCOUNT_TYPES: { value: AccountTypeValue; label: string }[] = [
  { value: "CREDIT_CARD", label: "Tarjeta de crédito" },
  { value: "DEBIT_CARD", label: "Tarjeta de débito" },
  { value: "CASH", label: "Efectivo" },
  { value: "SAVINGS", label: "Ahorro" },
];

export const ACCOUNT_STATUSES = [
  { value: "active", label: "Activas" },
  { value: "inactive", label: "Inactivas" },
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]["value"];

export const ICONS: { value: string; icon: LucideIcon; label: string }[] = [
  { value: "Wallet", icon: Wallet, label: "Cartera" },
  { value: "CreditCard", icon: CreditCard, label: "Tarjeta" },
  { value: "Banknote", icon: Banknote, label: "Efectivo" },
  { value: "PiggyBank", icon: PiggyBank, label: "Alcancía" },
  { value: "Landmark", icon: Landmark, label: "Banco" },
  { value: "Building2", icon: Building2, label: "Edificio" },
  { value: "Coins", icon: Coins, label: "Monedas" },
];
