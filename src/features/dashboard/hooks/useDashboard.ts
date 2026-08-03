import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { useAccountDropdown } from "../../account/hooks/useAccountDropdown";
import { useCategoryDropdown } from "../../category/hooks/useCategoryDropdown";
import { transactionService } from "../../transaction/service/transaction.service";
import type { Transaction } from "../../transaction/types";
import type { AccountDropdownItem } from "../../account/types";
import type { CategoryDropdownItem } from "../../category/types";
import type { AppliedFilters } from "../types";

const DEFAULT_FILTERS: AppliedFilters = {
  dateFrom: "",
  dateTo: "",
  accountId: null,
  categoryId: null,
  subcategoryId: null,
  reportCurrency: "CRC",
  exchangeRate: null,
};

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  }
  return map;
}

function useAggregatedData(
  transactions: Transaction[],
  accounts: AccountDropdownItem[],
  categories: CategoryDropdownItem[],
  reportCurrency: string,
  exchangeRate: number | null,
) {
  return useMemo(() => {
    const catMap = new Map(categories.map((c) => [c.id, c]));
    const accMap = new Map(accounts.map((a) => [a.id, a]));

    const convertAmount = (amount: number, txAccountId: string): number => {
      if (!exchangeRate) return amount;
      const acc = accMap.get(txAccountId);
      if (!acc || acc.currency === reportCurrency) return amount;
      if (acc.currency === "USD") return amount * exchangeRate;
      return amount / exchangeRate;
    };

    const subcatMap = new Map<string, { name: string; categoryName: string }>();
    for (const cat of categories) {
      for (const sub of cat.subcategories) {
        subcatMap.set(sub.id, { name: sub.name, categoryName: cat.name });
      }
    }

    const income = transactions.filter((t) => t.type === "INCOME");
    const expense = transactions.filter((t) => t.type === "EXPENSE");

    const totalIncome = income.reduce(
      (s, t) => s + convertAmount(t.amount, t.accountId),
      0,
    );
    const totalExpense = expense.reduce(
      (s, t) => s + convertAmount(t.amount, t.accountId),
      0,
    );

    const expenseByCat = Object.entries(groupBy(expense, (t) => t.categoryId))
      .map(([catId, items]) => {
        const cat = catMap.get(catId);
        return {
          name: cat?.name ?? "Sin categoría",
          total: items.reduce(
            (s, t) => s + convertAmount(t.amount, t.accountId),
            0,
          ),
          color: cat?.color ?? "#71717a",
        };
      })
      .sort((a, b) => b.total - a.total);

    const incomeByCat = Object.entries(groupBy(income, (t) => t.categoryId))
      .map(([catId, items]) => {
        const cat = catMap.get(catId);
        return {
          name: cat?.name ?? "Sin categoría",
          total: items.reduce(
            (s, t) => s + convertAmount(t.amount, t.accountId),
            0,
          ),
          color: cat?.color ?? "#10b981",
        };
      })
      .sort((a, b) => b.total - a.total);

    const expenseBySubcat = Object.entries(
      groupBy(expense, (t) => t.subcategoryId ?? "null"),
    )
      .map(([subId, items]) => {
        const sub = subcatMap.get(subId);
        return {
          name: sub ? `${sub.categoryName} • ${sub.name}` : "Sin subcategoría",
          total: items.reduce(
            (s, t) => s + convertAmount(t.amount, t.accountId),
            0,
          ),
        };
      })
      .sort((a, b) => b.total - a.total);

    const incomeBySubcat = Object.entries(
      groupBy(income, (t) => t.subcategoryId ?? "null"),
    )
      .map(([subId, items]) => {
        const sub = subcatMap.get(subId);
        return {
          name: sub ? `${sub.categoryName} • ${sub.name}` : "Sin subcategoría",
          total: items.reduce(
            (s, t) => s + convertAmount(t.amount, t.accountId),
            0,
          ),
        };
      })
      .sort((a, b) => b.total - a.total);

    const byAccount = accounts
      .map((acc) => {
        const accTx = transactions.filter((t) => t.accountId === acc.id);
        return {
          name: acc.name,
          income: accTx
            .filter((t) => t.type === "INCOME")
            .reduce((s, t) => s + convertAmount(t.amount, t.accountId), 0),
          expense: accTx
            .filter((t) => t.type === "EXPENSE")
            .reduce((s, t) => s + convertAmount(t.amount, t.accountId), 0),
        };
      })
      .filter((a) => a.income > 0 || a.expense > 0);

    const byMonth = Object.entries(
      groupBy(transactions, (t) => t.date.slice(0, 7)),
    )
      .map(([month, items]) => ({
        month,
        income: items
          .filter((t) => t.type === "INCOME")
          .reduce((s, t) => s + convertAmount(t.amount, t.accountId), 0),
        expense: items
          .filter((t) => t.type === "EXPENSE")
          .reduce((s, t) => s + convertAmount(t.amount, t.accountId), 0),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalIncome,
      totalExpense,
      expenseByCat,
      incomeByCat,
      expenseBySubcat,
      incomeBySubcat,
      byAccount,
      byMonth,
    };
  }, [transactions, accounts, categories, reportCurrency, exchangeRate]);
}

export function useDashboard() {
  const { getToken, isSignedIn } = useAuth();
  const { accounts } = useAccountDropdown();
  const { categories } = useCategoryDropdown();

  const [appliedFilters, setAppliedFilters] =
    useState<AppliedFilters>(DEFAULT_FILTERS);

  const getAuthToken = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  }, [getToken]);

  const hasFilters =
    appliedFilters.dateFrom ||
    appliedFilters.dateTo ||
    appliedFilters.accountId ||
    appliedFilters.categoryId ||
    appliedFilters.subcategoryId;

  const transactionsQuery = useQuery({
    queryKey: ["dashboard-transactions", appliedFilters],
    queryFn: async () => {
      const token = await getAuthToken();
      return transactionService.list(token, {
        ...(appliedFilters.dateFrom
          ? {
              dateFrom: new Date(
                `${appliedFilters.dateFrom}T00:00:00`,
              ).toISOString(),
            }
          : {}),
        ...(appliedFilters.dateTo
          ? {
              dateTo: new Date(
                `${appliedFilters.dateTo}T23:59:59`,
              ).toISOString(),
            }
          : {}),
        ...(appliedFilters.accountId
          ? { accountId: appliedFilters.accountId }
          : {}),
        ...(appliedFilters.categoryId
          ? { categoryId: appliedFilters.categoryId }
          : {}),
        ...(appliedFilters.subcategoryId
          ? { subcategoryId: appliedFilters.subcategoryId }
          : {}),
        page: 1,
        pageSize: 9999,
      });
    },
    enabled: !!isSignedIn,
    placeholderData: (prev) => prev,
  });

  const transactions = transactionsQuery.data?.items ?? [];

  const currencies = useMemo(
    () => [...new Set(accounts.map((a) => a.currency))],
    [accounts],
  );
  const reportCurrency =
    currencies.length === 1
      ? currencies[0]
      : appliedFilters.reportCurrency;

  const aggregated = useAggregatedData(
    transactions,
    accounts,
    categories,
    reportCurrency,
    appliedFilters.exchangeRate,
  );

  return {
    accounts,
    categories,
    appliedFilters,
    setAppliedFilters,
    hasFilters,
    isFetching: transactionsQuery.isFetching,
    reportCurrency,
    ...aggregated,
  };
}
