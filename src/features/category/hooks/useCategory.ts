import { useState } from "react";
import { useAuth } from "@clerk/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../service/category.service";
import type {
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

const DEFAULT_PAGE_SIZE = 10;

export function useCategory({
  pageSize = DEFAULT_PAGE_SIZE,
}: { pageSize?: number } = {}) {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const [filters, setFiltersState] = useState<CategoryFilters>({
    page: 1,
    pageSize,
  });

  const getAuthToken = async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  };

  const listQuery = useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const token = await getAuthToken();
      return categoryService.list(token, filters);
    },
    enabled: isSignedIn,
    placeholderData: (prev) => prev,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const token = await getAuthToken();
      return categoryService.create(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryInput;
    }) => {
      const token = await getAuthToken();
      return categoryService.update(token, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAuthToken();
      return categoryService.delete(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deactivateCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAuthToken();
      return categoryService.deactivate(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function setFilters(f: CategoryFilters) {
    setFiltersState(f);
  }

  function setPage(page: number) {
    setFiltersState((prev) => ({ ...prev, page }));
  }

  const result = listQuery.data ?? {
    items: [],
    totalItems: 0,
    hasNext: false,
    hasLast: false,
  };

  return {
    categories: result.items,
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
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,
    updateCategory: updateCategoryMutation.mutateAsync,
    isUpdating: updateCategoryMutation.isPending,
    updateError: updateCategoryMutation.error,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isPending,
    deleteError: deleteCategoryMutation.error,
    deactivateCategory: deactivateCategoryMutation.mutateAsync,
    isDeactivating: deactivateCategoryMutation.isPending,
    deactivateError: deactivateCategoryMutation.error,
  };
}
