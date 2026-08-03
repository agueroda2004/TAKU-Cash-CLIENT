import { useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import {
  Wallet,
  LayoutDashboard,
  Landmark,
  Tags,
  ArrowLeftRight,
  Settings,
  Shield,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/accounts", label: "Cuentas", icon: Landmark },
  { to: "/app/categories", label: "Categorías", icon: Tags },
  { to: "/app/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { to: "/app/settings", label: "Configuración", icon: Settings },
];

export default function DashboardLayout({ children }: Props) {
  const { signOut, getToken, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: serverUser } = useQuery({
    queryKey: ["auth.me"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return res.json().then((r) => r.data);
    },
    enabled: isSignedIn,
    retry: false,
  });

  const isAdmin = serverUser?.role === "admin";

  const name =
    clerkUser?.firstName ||
    clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "Usuario";
  const email = clerkUser?.emailAddresses[0]?.emailAddress || "";

  function navLinkClasses({ isActive }: { isActive: boolean }) {
    return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-duo-green-light text-duo-green"
        : "text-zinc-600 hover:bg-zinc-100"
    }`;
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white lg:flex">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-6 py-5">
          <Wallet className="h-6 w-6 text-duo-green" />
          <span className="text-lg font-extrabold tracking-tight text-duo-green">
            TAKU-Cash
          </span>
        </div>

        <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-duo-green-light text-duo-green">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-800">
              {name}
            </p>
            <p className="truncate text-xs text-zinc-500">{email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/app"} className={navLinkClasses}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/app/admin/users" className={navLinkClasses}>
              <Shield className="h-5 w-5" />
              Administración
            </NavLink>
          )}
        </nav>

        <div className="border-t border-zinc-100 px-3 py-4">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-duo-green" />
            <span className="text-lg font-extrabold tracking-tight text-duo-green">
              TAKU-Cash
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </header>

        {menuOpen && (
          <div className="border-b border-zinc-200 bg-white lg:hidden">
            <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-duo-green-light text-duo-green">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-800">
                  {name}
                </p>
                <p className="truncate text-xs text-zinc-500">{email}</p>
              </div>
            </div>

            <nav className="space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app"}
                  className={navLinkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/app/admin/users"
                  className={navLinkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  <Shield className="h-5 w-5" />
                  Administración
                </NavLink>
              )}
            </nav>

            <div className="border-t border-zinc-100 px-3 py-4">
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
