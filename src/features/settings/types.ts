export type SubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "cancelling"
  | "cancelled"
  | "past_due";

export type CurrentSubscription = {
  status: string;
  isPremium: boolean;
  priceId: string | null;
  planType: string | null;
  paddleSubscriptionId: string | null;
  paddleCustomerId: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
};

export type CancelSubscriptionResult = {
  status: string;
  currentPeriodEnd: string | null;
  cancelsAt: string | null;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
};
