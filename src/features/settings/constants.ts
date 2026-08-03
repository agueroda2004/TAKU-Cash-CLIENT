export const PLAN_LABELS: Record<string, string> = {
  mensual: "Mensual",
  semestral: "Semestral",
  anual: "Anual",
};

export const STATUS_LABELS: Record<string, string> = {
  inactive: "Inactiva",
  trialing: "Prueba gratuita",
  active: "Activa",
  cancelling: "Cancelación programada",
  cancelled: "Cancelada",
  past_due: "Pago vencido",
};

export function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
