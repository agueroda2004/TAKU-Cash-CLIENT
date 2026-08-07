const CURRENCY_CONFIG: Record<string, { symbol: string; decimals: number }> = {
  USD: { symbol: "$", decimals: 2 },
  CRC: { symbol: "₡", decimals: 2 },
};

/**
 * Upper bound (inclusive) that `formatCurrency` will render with full precision.
 *
 * Mirrors the `max(1_000_000_000_000)` constraint declared in the Zod schemas
 * (`createAccountSchema.balance`, `transferSchema.amount`,
 * `createTransferSchema.amount`). Values above this are returned as `${symbol}—`
 * to avoid broken output (e.g. `"$1e+46.undefined"` when `toFixed` switches to
 * scientific notation for very large numbers).
 */
export const MAX_FORMAT_AMOUNT = 1_000_000_000_000;

/**
 * Formats a numeric amount as a currency string.
 *
 * Returns `${symbol}—` (em dash placeholder) when the amount is non-finite
 * (`NaN`/`Infinity`) or exceeds {@link MAX_FORMAT_AMOUNT}.
 *
 * @param amount - The numeric amount to format.
 * @param currency - ISO-like currency code (currently `USD` or `CRC`).
 * @returns The formatted currency string, or a placeholder for out-of-range values.
 */
export function formatCurrency(amount: number, currency: string): string {
  const config = CURRENCY_CONFIG[currency] ?? { symbol: "$", decimals: 2 };

  if (!Number.isFinite(amount) || Math.abs(amount) > MAX_FORMAT_AMOUNT) {
    return `${config.symbol}—`;
  }

  const negative = amount < 0;
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(config.decimals);
  const [int, dec] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${negative ? "-" : ""}${config.symbol}${withCommas}.${dec}`;
}
