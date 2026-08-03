import { request } from "../../../lib/api";
import type {
  Account,
  AccountDropdownItem,
  AccountFilters,
  AccountListResult,
  CreateAccountInput,
  TransferInput,
  UpdateAccountInput,
} from "../types";

function buildQuery(filters: AccountFilters): string {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.type) params.set("type", filters.type);
  if (filters.currency) params.set("currency", filters.currency);
  if (filters.isActive !== undefined) {
    params.set("isActive", String(filters.isActive));
  }
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));
  return params.toString();
}

export const accountService = {
  list: (token: string, filters: AccountFilters) =>
    request<AccountListResult>(`/accounts?${buildQuery(filters)}`, { token }),

  create: (token: string, data: CreateAccountInput) =>
    request<Account>("/accounts", { method: "POST", body: data, token }),

  update: (token: string, id: string, data: UpdateAccountInput) =>
    request<Account>(`/accounts/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  delete: (token: string, id: string) =>
    request(`/accounts/${id}`, { method: "DELETE", token }),

  deactivate: (token: string, id: string) =>
    request(`/accounts/${id}/deactivate`, { method: "PATCH", token }),

  getDropdown: (token: string) =>
    request<AccountDropdownItem[]>("/accounts/dropdown", { token }),

  transfer: (token: string, data: TransferInput) =>
    request<{ success: boolean }>("/accounts/transfer", {
      method: "POST",
      body: data,
      token,
    }),
};
