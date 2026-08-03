import { request } from "../../../lib/api";
import type { CreateTransactionInput, UpdateTransactionInput, Transaction, TransactionFilters, TransactionListResult } from "../types";

function buildQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.accountId) params.set("accountId", filters.accountId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.subcategoryId) params.set("subcategoryId", filters.subcategoryId);
  if (filters.type) params.set("type", filters.type);
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));
  return params.toString();
}

export const transactionService = {
  create: (token: string, data: CreateTransactionInput) =>
    request<Transaction>("/transactions", {
      method: "POST",
      body: data,
      token,
    }),

  list: (token: string, filters: TransactionFilters) =>
    request<TransactionListResult>(`/transactions?${buildQuery(filters)}`, { token }),

  update: (token: string, id: string, data: UpdateTransactionInput) =>
    request<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  remove: (token: string, id: string) =>
    request<void>(`/transactions/${id}`, {
      method: "DELETE",
      token,
    }),
};