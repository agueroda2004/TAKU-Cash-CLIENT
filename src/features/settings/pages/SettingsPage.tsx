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
                <div className="rounded-xl bg-zinc-50 px-4 py-4">
                  <p className="text-sm font-medium text-zinc-700">
                    Cancelación por correo
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Para cancelar tu suscripción, escribe un correo a{" "}
                    <a
                      href="mailto:agueroda2004@gmail.com"
                      className="font-semibold text-duo-green underline"
                    >
                      agueroda2004@gmail.com
                    </a>
                    .
                  </p>
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