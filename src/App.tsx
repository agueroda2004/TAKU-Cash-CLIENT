import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "./shared/ui/DashboardLayout";
import FullPageLoader from "./shared/ui/FullPageLoader";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import SsoCallbackPage from "./features/auth/pages/SsoCallbackPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import AccountPage from "./features/account/pages/AccountPage";
import CategoryPage from "./features/category/pages/CategoryPage";
import TransactionPage from "./features/transaction/pages/TransactionPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import LandingPage from "./features/landing/pages/LandingPage";
import WelcomePage from "./features/welcome/pages/WelcomePage";
import PaymentPage from "./features/payment/pages/PaymentPage";
import AdminPage from "./features/admin/pages/AdminPage";
import NotFoundPage from "./features/notfound/pages/NotFoundPage";
import { request } from "./lib/api";

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to="/app" replace />;
  return children;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["auth.me"],
    queryFn: async () => {
      const token = await getToken();
      const result = await request<{ role: string }>("/auth/me", {
        token: token ?? undefined,
      });
      return result;
    },
    enabled: authLoaded && !!isSignedIn,
    retry: false,
  });

  if (!authLoaded || userLoading) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (!user || user.role !== "admin") {
    return <Navigate to="/app" replace />;
  }
  return children;
}

function SubscriptionRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const { data: sub, isLoading: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const token = await getToken();
      const result = await request<{ status: string }>("/subscriptions/current", {
        token: token ?? undefined,
      });
      return result;
    },
    enabled: authLoaded && !!isSignedIn,
    retry: false,
  });

  if (!authLoaded || subLoading) return <FullPageLoader />;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (!sub || sub.status === "inactive" || sub.status === "cancelled") {
    return <Navigate to="/app/payment" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        }
      />
      <Route
        path="/sso-callback"
        element={<SsoCallbackPage />}
      />

      <Route
        path="/app"
        element={
          <SubscriptionRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </SubscriptionRoute>
        }
      />
      <Route
        path="/app/accounts"
        element={
          <SubscriptionRoute>
            <DashboardLayout>
              <AccountPage />
            </DashboardLayout>
          </SubscriptionRoute>
        }
      />
      <Route
        path="/app/categories"
        element={
          <SubscriptionRoute>
            <DashboardLayout>
              <CategoryPage />
            </DashboardLayout>
          </SubscriptionRoute>
        }
      />
      <Route
        path="/app/transactions"
        element={
          <SubscriptionRoute>
            <DashboardLayout>
              <TransactionPage />
            </DashboardLayout>
          </SubscriptionRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <SubscriptionRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </SubscriptionRoute>
        }
      />
      <Route
        path="/app/admin/users"
        element={
          <SubscriptionRoute>
            <AdminRoute>
              <DashboardLayout>
                <AdminPage />
              </DashboardLayout>
            </AdminRoute>
          </SubscriptionRoute>
        }
      />
      <Route path="/app/welcome" element={<WelcomePage />} />
      <Route path="/app/payment" element={<PaymentPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
