const CURRENCY_CONFIG: Record<string, { symbol: string; decimals: number }> = {
  USD: { symbol: "$", decimals: 2 },
  CRC: { symbol: "₡", decimals: 2 },
};

export function formatCurrency(amount: number, currency: string): string {
  const config = CURRENCY_CONFIG[currency] ?? { symbol: "$", decimals: 2 };

  const negative = amount < 0;
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(config.decimals);
  const [int, dec] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${negative ? "-" : ""}${config.symbol}${withCommas}.${dec}`;
}
