import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInForceRedirectUrl="/app"
        signUpForceRedirectUrl="/app"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </QueryClientProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          margin: 0,
        },
      }}
      gutter={12}
    />
  </StrictMode>,
);
