import { useState } from "react";
// import { request } from "../../../lib/api";
// import { getPaddle } from "../../../lib/paddle";
import { PLANS } from "../../landing/data/landingData";
import type { Plan } from "../../landing/data/landingData";
import Modal from "../../../shared/ui/Modal";
import {
  CheckCircle,
  ArrowRight,
  Wallet,
  X,
  CreditCard,
  Banknote,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@clerk/react";
import { notify } from "../../../lib/notify";

const CONTACT_EMAIL = "agueroda2004@gmail.com";
const WHATSAPP_NUMBER = "87236301";
const WHATSAPP_LINK = `https://wa.me/506${WHATSAPP_NUMBER}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.24-1.37a9.87 9.87 0 0 0 4.8 1.22h.01c5.45 0 9.89-4.44 9.89-9.9a9.9 9.9 0 0 0-9.9-9.9Zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.23 8.24-8.23 4.53 0 8.22 3.69 8.22 8.23 0 4.54-3.69 8.23-8.23 8.23Zm4.5-6.16c-.25-.12-1.46-.72-1.68-.81-.22-.08-.39-.12-.55.13-.17.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  // const { getToken } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCashMethod, setIsCashMethod] = useState(false);

  // Paddle en validación de dominio: pagos con tarjeta temporalmente deshabilitados.
  // Cuando Paddle apruebe el dominio, descomenta los imports de request/getPaddle/useAuth,
  // este handleSelect y llama a handleSelect(selectedPlan.planType) en el botón "Pagar con tarjeta".
  // async function handleSelect(planType: string) {
  //   console.log("[PaymentPage] handleSelect planType:", planType);
  //   if (!planType || !["mensual", "semestral", "anual"].includes(planType)) {
  //     console.error("[PaymentPage] Invalid planType:", planType);
  //     return;
  //   }
  //   try {
  //     const token = await getToken();
  //     console.log("[PaymentPage] token:", token ? "present" : "missing");
  //     const { checkoutId } = await request<{ checkoutId: string }>(
  //       "/subscriptions/checkout",
  //       {
  //         method: "POST",
  //         body: {
  //           plan: planType,
  //           successUrl: `${window.location.origin}/app/welcome`,
  //         },
  //         token: token ?? undefined,
  //       },
  //     );
  //     console.log("[PaymentPage] checkoutId:", checkoutId);
  //     const paddle = await getPaddle();
  //     console.log("[PaymentPage] paddle instance:", paddle);
  //     paddle?.Checkout.open({ transactionId: checkoutId });
  //   } catch (err) {
  //     console.error("[PaymentPage] checkout error:", err);
  //   }
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-duo-green-light/30 to-white px-4 py-12">
      <div className="mx-auto max-w-5xl text-center">
        <button
          onClick={() => navigate("/")}
          className="mb-8 ml-auto flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-700"
        >
          <X className="h-4 w-4" />
          Volver
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-duo-green shadow-lg">
          <Wallet className="h-7 w-7 text-white" />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
          Elige tu plan
        </h1>
        <p className="mt-2 text-zinc-600">
          Suscríbete para seguir usando <span className="font-semibold text-duo-green">TAKU-Cash</span>.
          Cancela cuando quieras.
        </p>

        <div className="mt-12 mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 transition ${
                plan.highlighted
                  ? "scale-105 border-duo-green shadow-xl py-10 px-8"
                  : "border-zinc-200 shadow-sm hover:shadow-md p-8"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-duo-green px-4 py-1 text-xs font-bold uppercase tracking-wide text-white whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-duo-green" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setIsCashMethod(false);
                }}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
                  plan.highlighted
                    ? "bg-duo-green text-white shadow-md hover:bg-duo-green-hover"
                    : "border-2 border-zinc-300 text-zinc-700 hover:border-duo-green hover:text-duo-green"
                }`}
              >
                {plan.badge ? "Comenzar gratis" : "Suscribirse"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <Modal
          title={isCashMethod ? "Pagar en efectivo" : "¿Cómo quieres pagar?"}
          onCancel={() => setSelectedPlan(null)}
          cancelText={isCashMethod ? "Cerrar" : "Cancelar"}
        >
          {!isCashMethod ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-zinc-600">
                Selecciona la forma de pago para el plan{" "}
                <span className="font-semibold text-zinc-800">
                  {selectedPlan.name}
                </span>
                .
              </p>

              <button
                onClick={() =>
                  notify({ success: false, message: "Actualmente no disponible" })
                }
                className="flex items-center gap-4 rounded-2xl border-2 border-zinc-200 p-4 text-left transition hover:border-duo-green hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-duo-green-light text-duo-green">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Pagar con tarjeta</p>
                  <p className="text-sm text-zinc-500">
                    Procesado por Paddle de forma segura
                  </p>
                </div>
              </button>

              <button
                onClick={() => setIsCashMethod(true)}
                className="flex items-center gap-4 rounded-2xl border-2 border-zinc-200 p-4 text-left transition hover:border-duo-green hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">
                    Efectivo / Simpe Móvil
                    <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                      -4%
                    </span>
                  </p>
                  <p className="text-sm text-zinc-500">
                    Costa Rica &mdash; coordina el pago con nosotros
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Paga en efectivo o por Simpe Móvil y obtén un{" "}
                <span className="font-bold">4% de descuento</span> en todos los
                planes.
              </div>
              <p className="text-sm leading-relaxed text-zinc-600">
                Elige cómo quieres coordinar el pago en efectivo o por Simpe
                Móvil. Nos pondremos en contacto para activar tu cuenta.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Pago TAKU-Cash - plan ${selectedPlan.name}`)}`}
                className="flex items-center gap-4 rounded-2xl border-2 border-zinc-200 p-4 text-left transition hover:border-duo-green hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-duo-green-light text-duo-green">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-zinc-900">Escríbenos por correo</p>
                  <p className="truncate text-sm text-zinc-500">
                    {CONTACT_EMAIL}
                  </p>
                </div>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border-2 border-zinc-200 p-4 text-left transition hover:border-duo-green hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">
                    Escríbenos por WhatsApp
                  </p>
                  <p className="text-sm text-zinc-500">{WHATSAPP_NUMBER}</p>
                </div>
              </a>

              <button
                onClick={() => setIsCashMethod(false)}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a métodos de pago
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
