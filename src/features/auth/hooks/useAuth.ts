import { useAuth, useUser } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../service/auth.service";
import type { User } from "../types";

export function useAuthUser() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  const { data: serverUser, isLoading } = useQuery<User | null>({
    queryKey: ["auth.me"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      return authService.me(token);
    },
    enabled: isLoaded && !!isSignedIn,
  });

  return {
    clerkUser,
    serverUser,
    isLoading: !isLoaded || isLoading,
    isSignedIn: !!isSignedIn,
  };
}
