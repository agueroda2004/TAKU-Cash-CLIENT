import type { CurrencyCode } from "../../constants/data";

export type AccountType = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "SAVINGS";

export type Account = {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAccountInput = {
  name: string;
  type: AccountType;
  currency: string;
  color: string;
  icon: string;
  balance?: number;
};

export type UpdateAccountInput = {
  name?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
};

export type TransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  exchangeRate?: number;
  description?: string;
};

export type AccountFilters = {
  name?: string;
  type?: AccountType;
  currency?: CurrencyCode;
  isActive?: boolean;
  page: number;
  pageSize: number;
};

export type AccountListResult = {
  items: Account[];
  totalItems: number;
  hasNext: boolean;
  hasLast: boolean;
};

export type AccountDropdownItem = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
};
