import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Props = {
  data: { name: string; total: number; color: string }[];
  currency: string;
};

export default function ExpensesByCategory({ data, currency }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
        <p className="text-sm font-semibold text-zinc-800 mb-1">Gastos por categoría</p>
        <p className="text-xs text-zinc-400">Sin datos</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-800 mb-3">Gastos por categoría</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: unknown) => {
              const value = typeof v === "number" ? v : Number(v ?? 0);
              return `${currency === "USD" ? "$" : "₡"} ${value.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
