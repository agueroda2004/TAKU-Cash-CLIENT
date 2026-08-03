import { useCallback, useState } from "react";
import { useAuth } from "@clerk/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "../service/account.service";
import type {
  AccountFilters,
  CreateAccountInput,
  TransferInput,
  UpdateAccountInput,
} from "../types";

const DEFAULT_PAGE_SIZE = 10;

const EMPTY_FILTERS: AccountFilters = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  isActive: true,
};

export function useAccount() {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AccountFilters>(EMPTY_FILTERS);

  const getAuthToken = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  }, [getToken]);

  const listQuery = useQuery({
    queryKey: ["accounts", filters],
    queryFn: async () => {
      const token = await getAuthToken();
      return accountService.list(token, filters);
    },
    enabled: isSignedIn,
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateAccountInput) => {
      const token = await getAuthToken();
      return accountService.create(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAccountInput;
    }) => {
      const token = await getAuthToken();
      return accountService.update(token, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAuthToken();
      return accountService.delete(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAuthToken();
      return accountService.deactivate(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: TransferInput) => {
      const token = await getAuthToken();
      return accountService.transfer(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  function setPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return {
    accounts: listQuery.data?.items ?? [],
    totalItems: listQuery.data?.totalItems ?? 0,
    hasNext: listQuery.data?.hasNext ?? false,
    hasLast: listQuery.data?.hasLast ?? false,
    page: filters.page,
    pageSize: filters.pageSize,
    filters,
    setFilters,
    setPage,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error,
    refetch: listQuery.refetch,
    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAccount: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAccount: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deactivateAccount: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
    transfer: transferMutation.mutateAsync,
    isTransferring: transferMutation.isPending,
  };
}