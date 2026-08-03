import { COLORS } from "../../../constants/data";
import {
  Utensils,
  Car,
  Home,
  Tv,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Repeat,
  Briefcase,
  Laptop,
  TrendingUp,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export { COLORS as CATEGORY_COLORS };

export const CATEGORY_ICONS: { value: string; icon: LucideIcon; label: string }[] = [
  { value: "Utensils", icon: Utensils, label: "Alimentación" },
  { value: "Car", icon: Car, label: "Transporte" },
  { value: "Home", icon: Home, label: "Vivienda" },
  { value: "Tv", icon: Tv, label: "Entretenimiento" },
  { value: "HeartPulse", icon: HeartPulse, label: "Salud" },
  { value: "GraduationCap", icon: GraduationCap, label: "Educación" },
  { value: "ShoppingBag", icon: ShoppingBag, label: "Compras" },
  { value: "Repeat", icon: Repeat, label: "Suscripciones" },
  { value: "Briefcase", icon: Briefcase, label: "Trabajo" },
  { value: "Laptop", icon: Laptop, label: "Freelance" },
  { value: "TrendingUp", icon: TrendingUp, label: "Inversiones" },
  { value: "Plus", icon: Plus, label: "Otros" },
  { value: "Wallet", icon: Wallet, label: "Cartera" },
];