import { request } from "../../../lib/api";
import type { User } from "../../auth/types";

export type AdminUser = Pick<
  User,
  "id" | "email" | "name" | "role"
> & {
  isActive: boolean;
  isPremium: boolean;
  subscriptionStatus: string | null;
  priceId: string | null;
  paddleSubscriptionId: string | null;
  planType: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
};

export type ListUsersResult = {
  users: AdminUser[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type SetSubscriptionInput = {
  subscriptionStatus?: string;
  currentPeriodEnd?: string | null;
  planType?: string;
};

export const adminService = {
  listUsers: (
    token: string,
    page: number,
    pageSize: number,
    email: string,
    name: string,
  ) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (email) params.set("email", email);
    if (name) params.set("name", name);
    return request<ListUsersResult>(`/admin/users?${params.toString()}`, { token });
  },

  setSubscription: (
    token: string,
    userId: string,
    data: SetSubscriptionInput,
  ) =>
    request<AdminUser>(`/admin/users/${userId}/subscription`, {
      method: "PUT",
      token,
      body: data,
    }),
};
