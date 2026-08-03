import { request } from "../../../lib/api";
import type { User } from "../types";

export const authService = {
  me: (token: string) => request<User>("/auth/me", { token }),
};
