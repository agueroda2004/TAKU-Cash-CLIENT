import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Crown, Lock, UserRound } from "lucide-react";
import PageHeader from "../../../shared/ui/PageHeader";
import { useSettings } from "../hooks/useSettings";
import { PLAN_LABELS, STATUS_LABELS, formatDate } from "../constants";
import ProfileForm from "../components/ProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import CancelSubscriptionModal from "../components/CancelSubscriptionModal";
import type { SubscriptionStatus } from "../types";

const WHATSAPP_NUMBER = "87236301";
const WHATSAPP_LINK = `https://wa.me/506${WHATSAPP_NUMBER}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.24-1.37a9.87 9.87 0 0 0 4.8 1.22h.01c5.45 0 9.89-4.44 9.89-9.9a9.9 9.9 0 0 0-9.9-9.9Zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.23 8.24-8.23 4.53 0 8.22 3.69 8.22 8.23 0 4.54-3.69 8.23-8.23 8.23Zm4.5-6.16c-.25-.12-1.46-.72-1.68-.81-.22-.08-.39-.12-.55.13-.17.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-2xl border-2 border-zinc-100 bg-white p-6">
      <div className="h-5 w-40 rounded bg-zinc-100 animate-pulse" />
      <div className="mt-4 h-11 rounded-xl bg-zinc-100 animate-pulse" />
      <div className="mt-4 h-11 rounded-xl bg-zinc-100 animate-pulse" />
    </div>
  );
}

export default function SettingsPage() {
  const {
    user,
    isProfileLoading,
    subscription,
    isSubscriptionLoading,
    subscriptionError,
    refetchSubscription,
    updateProfile,
    isUpdatingProfile,
  } = useSettings();

  const [cancelOpen, setCancelOpen] = useState(false);

  const status = (subscription?.status ?? "inactive") as SubscriptionStatus;
  const planLabel = subscription?.planType
    ? (PLAN_LABELS[subscription.planType] ?? subscription.planType)
    : null;
  const hasActiveSubscription =
    !!subscription?.paddleSubscriptionId &&
    (status === "active" || status === "trialing");
  const isCashSubscriber =
    !!subscription?.isPremium && !subscription?.paddleSubscriptionId;
  const showCancelInfo = status === "cancelling";
  const renewalDate = formatDate(
    status === "trialing"
      ? subscription?.trialEndsAt ?? null
      : subscription?.currentPeriodEnd ?? null,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Administra tu perfil y tu suscripción"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border-2 border-zinc-100 bg-white p-6">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-duo-green" />
            <h2 className="text-lg font-bold text-zinc-800">Mi perfil</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Actualiza tu nombre y tu correo electrónico
          </p>

          {isProfileLoading ? (
            <LoadingCard />
          ) : user ? (
            <ProfileForm
              key={user.id}
              user={user}
              isSaving={isUpdatingProfile}
              onSave={updateProfile}
            />
          ) : (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              Error al cargar tu perfil.
            </div>
          )}
        </section>

        <section className="rounded-2xl border-2 border-zinc-100 bg-white p-6">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-duo-green" />
            <h2 className="text-lg font-bold text-zinc-800">Mi suscripción</h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Consulta el estado de tu plan
          </p>

          {isSubscriptionLoading ? (
            <LoadingCard />
          ) : subscriptionError ? (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              Error al cargar la suscripción.{" "}
              <button
                onClick={() => refetchSubscription()}
                className="font-semibold underline"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-zinc-100 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-700">Plan</p>
                  <p className="text-lg font-extrabold text-zinc-900">
                    {planLabel ?? "Sin plan"}
                  </p>
                </div>
                <CreditCard className="h-6 w-6 text-zinc-300" />
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-zinc-100 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-700">Estado</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {STATUS_LABELS[status] ?? status}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    status === "active" || status === "trialing"
                      ? "bg-emerald-100 text-emerald-700"
                      : status === "cancelling"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {subscription?.isPremium ? "Premium" : "Gratis"}
                </span>
              </div>

              {renewalDate && (
                <div className="flex items-center justify-between rounded-xl border-2 border-zinc-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-700">
                      {showCancelInfo || status === "active"
                        ? "Renovación"
                        : "La prueba termina"}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {renewalDate}
                    </p>
                  </div>
                </div>
              )}

              {showCancelInfo && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Tu suscripción está programada para cancelarse al final del
                  periodo actual.
                </p>
              )}

              {isCashSubscriber ? (
                <div className="space-y-3 rounded-xl bg-zinc-50 px-4 py-4">
                  <p className="text-sm font-medium text-zinc-700">
                    Cancelación por correo o WhatsApp
                  </p>
                  <p className="text-sm text-zinc-600">
                    Para cancelar tu suscripción, escribe un correo a{" "}
                    <a
                      href="mailto:agueroda2004@gmail.com"
                      className="font-semibold text-duo-green underline"
                    >
                      agueroda2004@gmail.com
                    </a>{" "}
                    o escríbenos por WhatsApp.
                  </p>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-100 px-4 py-2.5 text-sm font-bold text-green-600 transition hover:bg-green-200"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Cancelar por WhatsApp
                  </a>
                </div>
              ) : hasActiveSubscription ? (
                <button
                  onClick={() => setCancelOpen(true)}
                  className="w-full rounded-xl border-2 border-duo-red/40 py-2.5 text-sm font-bold text-duo-red transition hover:border-duo-red hover:bg-red-50"
                >
                  Cancelar suscripción
                </button>
              ) : null}

              {!hasActiveSubscription && !showCancelInfo && !isCashSubscriber && (
                <div className="rounded-xl border-2 border-dashed border-zinc-200 px-4 py-5 text-center">
                  <p className="text-sm text-zinc-500">
                    No tienes una suscripción activa
                  </p>
                  <Link
                    to="/app/payment"
                    className="mt-3 inline-block rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-green-hover"
                  >
                    Suscribirse
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
        <section className="rounded-2xl border-2 border-zinc-100 bg-white p-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-duo-green" />
            <h2 className="text-lg font-bold text-zinc-800">
              Cambiar contraseña
            </h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Solo disponible para cuentas con correo y contraseña
          </p>
          <ChangePasswordForm />
        </section>
      </div>

      <CancelSubscriptionModal
        open={cancelOpen}
        planLabel={planLabel ?? "Mensual"}
        onCancel={() => setCancelOpen(false)}
      />
    </div>
  );
}