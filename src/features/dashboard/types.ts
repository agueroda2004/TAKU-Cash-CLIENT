export type AppliedFilters = {
  dateFrom: string;
  dateTo: string;
  accountId: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  reportCurrency: string;
  exchangeRate: number | null;
};