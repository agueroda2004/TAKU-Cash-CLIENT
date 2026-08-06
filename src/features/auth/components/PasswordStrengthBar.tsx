import { scorePassword } from "../lib/password-strength";

type Props = {
  value: string;
};

export default function PasswordStrengthBar({ value }: Props) {
  if (!value) return null;

  const { score, label, color } = scorePassword(value);
  const total = 4;

  return (
    <div
      className="mt-2 flex items-center gap-2"
      role="status"
      aria-label={`Seguridad de la contraseña: ${label}`}
    >
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? color : "bg-zinc-200"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${textColorFor(color)}`}>
        {label}
      </span>
    </div>
  );
}

function textColorFor(bgClass: string): string {
  if (bgClass === "bg-duo-red") return "text-duo-red";
  if (bgClass === "bg-amber-500") return "text-amber-600";
  if (bgClass === "bg-lime-500") return "text-lime-600";
  if (bgClass === "bg-duo-green") return "text-duo-green";
  return "text-zinc-500";
}
