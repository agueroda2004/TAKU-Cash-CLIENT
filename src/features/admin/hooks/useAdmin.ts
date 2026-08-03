import { useCallback, useState } from "react";
import { useAuth } from "@clerk/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../service/admin.service";

const DEFAULT_PAGE_SIZE = 20;

export function useAdmin() {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const getAuthToken = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  }, [getToken]);

  const listQuery = useQuery({
    queryKey: ["admin.users", page, emailFilter, nameFilter],
    queryFn: async () => {
      const token = await getAuthToken();
      return adminService.listUsers(token, page, DEFAULT_PAGE_SIZE, emailFilter, nameFilter);
    },
    enabled: isSignedIn,
    placeholderData: (prev) => prev,
  });

  const setSubscriptionMutation = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Parameters<typeof adminService.setSubscription>[2];
    }) => {
      const token = await getAuthToken();
      return adminService.setSubscription(token, userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin.users"] });
    },
  });

  function applyFilters() {
    setEmailFilter(emailInput);
    setNameFilter(nameInput);
    setPage(1);
  }

  function clearFilters() {
    setEmailInput("");
    setNameInput("");
    setEmailFilter("");
    setNameFilter("");
    setPage(1);
  }

  return {
    users: listQuery.data?.users ?? [],
    meta: listQuery.data?.meta ?? {
      total: 0,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      totalPages: 0,
    },
    isLoading: listQuery.isLoading,
    page,
    emailInput,
    nameInput,
    setEmailInput,
    setNameInput,
    applyFilters,
    clearFilters,
    hasFilters: !!emailFilter || !!nameFilter,
    setPage,
    setSubscription: setSubscriptionMutation.mutateAsync,
    isSettingSubscription: setSubscriptionMutation.isPending,
  };
}
