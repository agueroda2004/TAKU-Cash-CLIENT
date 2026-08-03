import { useCallback } from "react";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../service/category.service";

export function useCategoryDropdown() {
  const { getToken, isSignedIn } = useAuth();

  const getAuthToken = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  }, [getToken]);

  const query = useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: async () => {
      const token = await getAuthToken();
      return categoryService.getDropdown(token);
    },
    enabled: isSignedIn,
    placeholderData: (prev) => prev,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
