import { useNavigate } from "react-router-dom";
import { Wallet, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex items-center gap-2">
        <Wallet className="h-8 w-8 text-duo-green" />
        <span className="text-2xl font-extrabold tracking-tight text-duo-green">
          TAKU-Cash
        </span>
      </div>

      <h1 className="mt-8 text-6xl font-extrabold text-zinc-900 sm:text-8xl">
        404
      </h1>
      <p className="mt-4 text-lg text-zinc-600 sm:text-xl">
        Página no encontrada
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        La página que buscas no existe o fue movida.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border-2 border-zinc-300 px-5 py-2.5 text-sm font-bold text-zinc-700 transition hover:border-duo-green hover:text-duo-green"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-duo-green-hover"
        >
          <Home className="h-4 w-4" />
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
