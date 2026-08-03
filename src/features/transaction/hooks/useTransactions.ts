import { useState } from "react";
import { useAuth } from "@clerk/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../service/transaction.service";
import type { CreateTransactionInput, UpdateTransactionInput, TransactionFilters } from "../types";

const DEFAULT_PAGE_SIZE = 30;

const EMPTY_FILTERS: TransactionFilters = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export function useTransactions() {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);

  const getAuthToken = async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  };

  const listQuery = useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const token = await getAuthToken();
      return transactionService.list(token, filters);
    },
    enabled: isSignedIn,
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      const token = await getAuthToken();
      return transactionService.create(token, data);
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["accounts"] }),
      ]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransactionInput }) => {
      const token = await getAuthToken();
      return transactionService.update(token, id, data);
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["accounts"] }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAuthToken();
      return transactionService.remove(token, id);
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["accounts"] }),
      ]);
    },
  });

  function setPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  const result = listQuery.data ?? { items: [], totalItems: 0, hasNext: false, hasLast: false };

  return {
    transactions: result.items,
    totalItems: result.totalItems,
    hasNext: result.hasNext,
    hasLast: result.hasLast,
    page: filters.page,
    pageSize: filters.pageSize,
    filters,
    setFilters,
    setPage,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    refetch: listQuery.refetch,
    createTransaction: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}