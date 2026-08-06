export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Muy débil" | "Débil" | "Regular" | "Fuerte" | "Muy fuerte";
  color: string;
};

const STRENGTH_BY_SCORE: Record<PasswordStrength["score"], Omit<PasswordStrength, "score">> = {
  0: { label: "Muy débil", color: "bg-zinc-200" },
  1: { label: "Débil", color: "bg-duo-red" },
  2: { label: "Regular", color: "bg-amber-500" },
  3: { label: "Fuerte", color: "bg-lime-500" },
  4: { label: "Muy fuerte", color: "bg-duo-green" },
};

export function scorePassword(value: string): PasswordStrength {
  if (!value) {
    return { score: 0, ...STRENGTH_BY_SCORE[0] };
  }

  let points = 0;
  if (value.length >= 8) points += 1;
  if (value.length >= 12) points += 1;
  if (/[a-z]/.test(value)) points += 1;
  if (/[A-Z]/.test(value)) points += 1;
  if (/[0-9]/.test(value)) points += 1;
  if (/[^A-Za-z0-9]/.test(value)) points += 1;

  const score = Math.min(4, points) as PasswordStrength["score"];
  return { score, ...STRENGTH_BY_SCORE[score] };
}
