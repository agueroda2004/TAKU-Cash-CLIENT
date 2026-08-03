import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Wallet className="mx-auto mb-2 h-12 w-12 text-duo-green" />
          <h1 className="text-3xl font-extrabold tracking-tight text-duo-green">TAKU-Cash</h1>
          <h2 className="mt-1 text-xl font-bold text-zinc-800">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-duo-gray">{subtitle}</p>}
        </div>

        <div id="clerk-captcha" />

        {children}

        <p className="mt-10 text-center text-xs text-duo-gray">
          Al continuar, aceptas nuestros{" "}
          <Link to="/terms" className="text-duo-blue underline">
            Términos
          </Link>{" "}
          y{" "}
          <Link to="/privacy" className="text-duo-blue underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
