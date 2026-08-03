export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string;
  subcategoryId: string | null;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: string;
  transferId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionInput = {
  accountId: string;
  categoryId: string;
  subcategoryId?: string | null;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
};

export type TransactionFilters = {
  dateFrom?: string;
  dateTo?: string;
  accountId?: string;
  categoryId?: string;
  subcategoryId?: string;
  type?: TransactionType;
  page: number;
  pageSize: number;
};

export type UpdateTransactionInput = {
  description?: string;
};

export type TransactionListResult = {
  items: Transaction[];
  totalItems: number;
  hasNext: boolean;
  hasLast: boolean;
};