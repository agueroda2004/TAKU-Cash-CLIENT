import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Props = {
  data: { name: string; income: number; expense: number }[];
  currency: string;
};

export default function ByAccount({ data, currency }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
        <p className="text-sm font-semibold text-zinc-800 mb-1">Transacciones por cuenta</p>
        <p className="text-xs text-zinc-400">Sin datos</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-800 mb-3">Transacciones por cuenta</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: unknown) => {
              const value = typeof v === "number" ? v : Number(v ?? 0);
              return `${currency === "USD" ? "$" : "₡"} ${value.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }}
          />
          <Legend />
          <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
