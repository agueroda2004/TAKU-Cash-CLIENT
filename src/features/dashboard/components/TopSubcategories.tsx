import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data: { name: string; total: number }[];
  currency: string;
  variant?: "expense" | "income";
};

const LABELS = { expense: "Top subcategorías de gasto", income: "Top subcategorías de ingreso" };
const FILLS = { expense: "#f43f5e", income: "#10b981" };

export default function TopSubcategories({ data, currency, variant = "expense" }: Props) {
  const top = [...data].sort((a, b) => b.total - a.total).slice(0, 10);

  if (top.length === 0) {
    return (
      <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
        <p className="text-sm font-semibold text-zinc-800 mb-1">{LABELS[variant]}</p>
        <p className="text-xs text-zinc-400">Sin datos</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-800 mb-3">{LABELS[variant]}</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: unknown) => {
              const value = typeof v === "number" ? v : Number(v ?? 0);
              return `${currency === "USD" ? "$" : "₡"} ${value.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }}
          />
          <Bar dataKey="total" fill={FILLS[variant]} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
