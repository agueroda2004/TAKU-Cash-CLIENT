import { useCallback } from "react";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../service/settings.service";
import type { UpdateProfileInput } from "../types";

export function useSettings() {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const getAuthToken = useCallback(async () => {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    return token;
  }, [getToken]);

  const profileQuery = useQuery({
    queryKey: ["auth.me"],
    queryFn: async () => {
      const token = await getAuthToken();
      return settingsService.getProfile(token);
    },
    enabled: isSignedIn,
    retry: false,
  });

  const subscriptionQuery = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const token = await getAuthToken();
      return settingsService.getSubscription(token);
    },
    enabled: isSignedIn,
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const token = await getAuthToken();
      return settingsService.updateProfile(token, data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth.me"], user);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const token = await getAuthToken();
      return settingsService.cancelSubscription(token);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(["subscription"], (prev: unknown) => {
        const current = (prev ?? {}) as Record<string, unknown>;
        return { ...current, status: result.status };
      });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  return {
    user: profileQuery.data ?? null,
    isProfileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch,

    subscription: subscriptionQuery.data ?? null,
    isSubscriptionLoading: subscriptionQuery.isLoading,
    subscriptionError: subscriptionQuery.error,
    refetchSubscription: subscriptionQuery.refetch,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    cancelSubscription: cancelSubscriptionMutation.mutateAsync,
    isCancelling: cancelSubscriptionMutation.isPending,
    cancelError: cancelSubscriptionMutation.error,
  };
}
