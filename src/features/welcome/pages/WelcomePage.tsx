import { useNavigate } from "react-router-dom";
import { Wallet, CheckCircle, Music2 } from "lucide-react";

const STEPS = [
  "Registra tus ingresos y gastos diarios",
  "Categoriza cada transacción para ver dónde gastas",
  "Revisa reportes y gráficos para tomar mejores decisiones",
  "Administra cuentas en CRC y USD desde un solo lugar",
];

const SOCIALS = [
  { icon: Music2, href: "#", label: "YouTube" },
  { icon: Music2, href: "#", label: "Instagram" },
  { icon: Music2, href: "#", label: "Facebook" },
  { icon: Music2, href: "#", label: "TikTok" },
];

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-duo-green-light/30 to-white px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-duo-green shadow-lg">
          <Wallet className="h-8 w-8 text-white" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
          ¡Bienvenido a <span className="text-duo-green">TAKU-Cash</span>!
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          Tu prueba gratuita de 7 días ha comenzado.{" "}
          <span className="font-semibold text-zinc-800">
            Disfruta de todas las funcionalidades sin restricciones.
          </span>
        </p>

        <div className="mt-10 text-left">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Esto es lo que puedes hacer ahora:
          </h2>
          <ul className="mt-4 space-y-3">
            {STEPS.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-duo-green" />
                <span className="text-sm text-zinc-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Aprende más:
          </h2>
          <div className="mt-4 flex items-center justify-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-duo-green-light hover:text-duo-green"
                aria-label={s.label}
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/app")}
          className="mt-10 w-full rounded-xl bg-duo-green px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-duo-green-hover"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
}
