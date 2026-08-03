export type CurrencyCode = "USD" | "CRC";

export const CURRENCIES: readonly { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "USD - Dólar estadounidense" },
  { value: "CRC", label: "CRC - Colón costarricense" },
];

export type ColorOption = {
  value: string;
  label: string;
  class: string;
};

export const COLORS: readonly ColorOption[] = [
  { value: "#10b981", label: "Verde", class: "bg-emerald-500" },
  { value: "#3b82f6", label: "Azul", class: "bg-blue-500" },
  { value: "#8b5cf6", label: "Violeta", class: "bg-violet-500" },
  { value: "#f59e0b", label: "Ámbar", class: "bg-amber-500" },
  { value: "#f43f5e", label: "Rosa", class: "bg-rose-500" },
  { value: "#06b6d4", label: "Cian", class: "bg-cyan-500" },
  { value: "#6366f1", label: "Índigo", class: "bg-indigo-500" },
  { value: "#14b8a6", label: "Teal", class: "bg-teal-500" },
];

export const IMAGES: readonly { value: string; label: string }[] = [
  {
    value: "https://ik.imagekit.io/5zi86k8wt/Projects/TAKU-Cash/Foto1.png",
    label: "Foto 1",
  },
  {
    value: "https://ik.imagekit.io/5zi86k8wt/Projects/TAKU-Cash/Foto2.png",
    label: "Foto 2",
  },
];
