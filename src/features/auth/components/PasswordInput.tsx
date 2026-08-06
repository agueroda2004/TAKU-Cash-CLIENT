import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PasswordStrengthBar from "./PasswordStrengthBar";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  showStrength?: boolean;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Contraseña",
  error,
  autoComplete = "current-password",
  showStrength = false,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`h-12 w-full rounded-xl border-2 px-4 pr-12 text-sm outline-none transition ${
            error
              ? "border-red-400"
              : "border-duo-border focus:border-duo-green"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          tabIndex={-1}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-duo-gray transition hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-duo-green"
        >
          {show ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {showStrength && <PasswordStrengthBar value={value} />}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
