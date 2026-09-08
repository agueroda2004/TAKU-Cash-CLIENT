import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  Settings,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/app", label: "Inicio", icon: LayoutDashboard, end: true },
  { to: "/app/accounts", label: "Cuentas", icon: Landmark, end: true },
  { to: "/app/transactions", label: "Movimientos", icon: ArrowLeftRight, end: true },
  { to: "/app/settings", label: "Config", icon: Settings, end: true },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-5">
        {NAV_ITEMS.slice(0, 2).map((item) => (
          <BottomNavLink key={item.to} {...item} />
        ))}

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/app/transactions?new=1")}
            aria-label="Nueva transacción"
            className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-duo-green text-white shadow-lg shadow-duo-green/30 transition hover:bg-duo-green-hover"
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>

        {NAV_ITEMS.slice(2).map((item) => (
          <BottomNavLink key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function BottomNavLink({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition ${
          isActive ? "text-duo-green" : "text-zinc-500 hover:text-zinc-800"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
}