export function conversionTooltip(reportCurrency: string): string {
  const from = reportCurrency === "USD" ? "CRC" : "USD";
  return `Los montos en ${from} se convierten a ${reportCurrency} usando el tipo de cambio del reporte. Reflejan el valor al momento del reporte, no el tipo de cambio de cada transacción.`;
}
