import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

type Props = {
  data: { month: string; income: number; expense: number }[];
  currency: string;
};

export default function MonthlyTrend({ data, currency }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
        <p className="text-sm font-semibold text-zinc-800 mb-1">
          Tendencia mensual
        </p>
        <p className="text-xs text-zinc-400">Sin datos</p>
      </div>
    );
  }

  const chartData = data.map((d) => {
    const [y, m] = d.month.split("-");
    const label = `${MONTHS[parseInt(m) - 1]} ${y}`;
    return { label, income: d.income, expense: d.expense };
  });

  return (
    <div className="rounded-xl border-2 border-zinc-100 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-800 mb-3">
        Tendencia mensual
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
        >
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: unknown) => {
              const value = typeof v === "number" ? v : Number(v ?? 0);
              return `${currency === "USD" ? "$" : "₡"} ${value.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Ingresos"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Gastos"
            stroke="#f43f5e"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
