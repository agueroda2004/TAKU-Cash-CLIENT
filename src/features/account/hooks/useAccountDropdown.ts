import { useCallback } from "react";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "../service/account.service";

export function useAccountDropdown() {
  const { getToken, isSignedIn } = useAuth();

  const getAuthToken = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  }, [getToken]);

  const query = useQuery({
    queryKey: ["accounts", "dropdown"],
    queryFn: async () => {
      const token = await getAuthToken();
      return accountService.getDropdown(token);
    },
    enabled: isSignedIn,
    placeholderData: (prev) => prev,
  });

  return {
    accounts: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
