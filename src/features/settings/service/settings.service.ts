import { request } from "../../../lib/api";
import type { User } from "../../auth/types";
import type {
  CancelSubscriptionResult,
  CurrentSubscription,
  UpdateProfileInput,
} from "../types";

export const settingsService = {
  getProfile: (token: string) => request<User>("/auth/me", { token }),

  getSubscription: (token: string) =>
    request<CurrentSubscription>("/subscriptions/current", { token }),

  cancelSubscription: (token: string) =>
    request<CancelSubscriptionResult>("/subscriptions/cancel", {
      method: "POST",
      body: {},
      token,
    }),

  updateProfile: (token: string, data: UpdateProfileInput) =>
    request<User>("/auth/me", { method: "PATCH", body: data, token }),
};
