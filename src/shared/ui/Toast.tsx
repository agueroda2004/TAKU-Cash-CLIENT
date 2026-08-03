import { CheckCircle2, XCircle } from "lucide-react";
import type { Toast as HotToast } from "react-hot-toast";
import toast from "react-hot-toast";

type ToastProps = {
  variant: "success" | "error";
  message: string;
  t: HotToast;
};

const VARIANT_STYLES: Record<
  "success" | "error",
  { border: string; icon: string; iconColor: string }
> = {
  success: {
    border: "border-l-4 border-duo-green",
    icon: "bg-duo-green-light",
    iconColor: "text-duo-green",
  },
  error: {
    border: "border-l-4 border-duo-red",
    icon: "bg-red-50",
    iconColor: "text-duo-red",
  },
};

export default function Toast({ variant, message, t }: ToastProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = variant === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      className={[
        "pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-center gap-3",
        "rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5",
        "transition-all duration-300 ease-out",
        t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        styles.border,
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${styles.icon}`}
        aria-hidden="true"
      >
        <Icon className={`h-5 w-5 ${styles.iconColor}`} />
      </span>
      <p className="flex-1 text-sm font-medium text-neutral-800">{message}</p>
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <XCircle className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
