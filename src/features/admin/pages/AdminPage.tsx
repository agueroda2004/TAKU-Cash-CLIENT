import { useState } from "react";
import { Search, X } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import PageHeader from "../../../shared/ui/PageHeader";
import Dropdown from "../../../shared/ui/Dropdown";
import type { DropdownOption } from "../../../shared/ui/Dropdown";
import DatePicker from "../../../shared/ui/DatePicker";
import Modal from "../../../shared/ui/Modal";
import Pagination from "../../../shared/ui/Pagination";
import type { AdminUser } from "../service/admin.service";

const SUBSCRIPTION_OPTIONS: readonly DropdownOption<string>[] = [
  { value: "active", label: "Activa" },
  { value: "inactive", label: "Inactiva" },
  { value: "cancelled", label: "Cancelada" },
  { value: "trialing", label: "Prueba" },
  { value: "past_due", label: "Vencida" },
] as const;

const PLAN_OPTIONS: readonly DropdownOption<string>[] = [
  { value: "mensual", label: "Mensual" },
  { value: "semestral", label: "Semestral" },
  { value: "anual", label: "Anual" },
  { value: "ninguno", label: "Sin plan" },
] as const;

export default function AdminPage() {
  const {
    users,
    meta,
    isLoading,
    emailInput,
    nameInput,
    setEmailInput,
    setNameInput,
    applyFilters,
    clearFilters,
    hasFilters,
    setPage,
    setSubscription,
    isSettingSubscription,
  } = useAdmin();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formStatus, setFormStatus] = useState("");
  const [formPlan, setFormPlan] = useState("");
  const [formEndDate, setFormEndDate] = useState("");

  function openModal(user: AdminUser) {
    setSelectedUser(user);
    setFormStatus(user.subscriptionStatus ?? "");
    setFormPlan(user.planType ?? "");
    setFormEndDate(user.currentPeriodEnd ? user.currentPeriodEnd.split("T")[0] : "");
  }

  function closeModal() {
    setSelectedUser(null);
  }

  async function handleConfirm() {
    if (!selectedUser) return;
    const data: import("../service/admin.service").SetSubscriptionInput = {};
    if (formStatus) data.subscriptionStatus = formStatus;
    if (formPlan) data.planType = formPlan;
    if (formEndDate) data.currentPeriodEnd = new Date(`${formEndDate}T12:00:00`).toISOString();
    else data.currentPeriodEnd = null;
    await setSubscription({ userId: selectedUser.id, data });
    closeModal();
  }

  function statusBadge(status: string | null) {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      trialing: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      past_due: "bg-yellow-100 text-yellow-700",
      inactive: "bg-zinc-100 text-zinc-500",
    };
    const labels: Record<string, string> = {
      active: "Activa",
      trialing: "Prueba",
      cancelled: "Cancelada",
      past_due: "Vencida",
      inactive: "Inactiva",
    };
    const s = status ?? "inactive";
    return (
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[s] ?? styles.inactive}`}
      >
        {labels[s] ?? s}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de Administración"
        description="Gestiona usuarios y suscripciones"
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-zinc-500">
            Email
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filtrar por email..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="h-11 w-full rounded-xl border-2 border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-duo-green"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-zinc-500">
            Nombre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filtrar por nombre..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="h-11 w-full rounded-xl border-2 border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-duo-green"
            />
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="flex h-11 items-center gap-2 rounded-xl bg-duo-green px-5 text-sm font-bold text-white transition hover:bg-duo-green-hover"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex h-11 items-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            <X className="h-4 w-4" />
            Limpiar
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border-2 border-zinc-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-500">
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Suscripción</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Premium</th>
              <th className="px-4 py-3 font-semibold">Vence</th>
              <th className="px-4 py-3 font-semibold">Creado</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                  Cargando...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-800">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{u.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(u.subscriptionStatus)}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">
                    {u.planType ? (
                      <span className="capitalize">{u.planType}</span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.isPremium ? (
                      <span className="text-green-600">Sí</span>
                    ) : (
                      <span className="text-zinc-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.currentPeriodEnd ? (
                      <span className={new Date(u.currentPeriodEnd) < new Date() ? "text-red-600 font-semibold" : "text-zinc-600"}>
                        {new Date(u.currentPeriodEnd).toLocaleDateString("es-CR")}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {new Date(u.createdAt).toLocaleDateString("es-CR")}
                  </td>
                  <td className="px-4 py-3">
                    {u.paddleSubscriptionId ? (
                      <button
                        disabled
                        title="Suscripción gestionada por Paddle"
                        className="cursor-not-allowed rounded-lg border-2 border-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-400"
                      >
                        Paddle
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(u)}
                        className="rounded-lg bg-duo-green-light px-3 py-1.5 text-xs font-semibold text-duo-green transition hover:bg-duo-green hover:text-white"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={meta.page}
        totalItems={meta.total}
        pageSize={meta.pageSize}
        hasNext={meta.page < meta.totalPages}
        hasLast={meta.page > 1}
        onPageChange={setPage}
      />

      {selectedUser && (
        <Modal
          title={`Editar suscripción: ${selectedUser.email}`}
          onCancel={closeModal}
          confirmText="Guardar"
          onConfirm={handleConfirm}
          confirmDisabled={!formStatus}
          confirmLoading={isSettingSubscription}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Estado de suscripción
              </label>
              <Dropdown
                options={SUBSCRIPTION_OPTIONS}
                value={formStatus || null}
                onChange={setFormStatus}
                placeholder="Sin cambios"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Plan
              </label>
              <Dropdown
                options={PLAN_OPTIONS}
                value={formPlan || null}
                onChange={setFormPlan}
                placeholder="Sin cambios"
              />
              <p className="mt-1 text-xs text-zinc-400">
                Al seleccionar un plan se asigna el priceId y se calcula la fecha de vencimiento automáticamente
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Fin del período actual
              </label>
              <DatePicker
                value={formEndDate}
                onChange={(date) => setFormEndDate(date)}
                placeholder="Seleccionar fecha"
                minDate={new Date()}
              />
              {formEndDate && (
                <button
                  type="button"
                  onClick={() => setFormEndDate("")}
                  className="mt-1 text-xs font-medium text-duo-green hover:text-duo-green-hover"
                >
                  Limpiar fecha
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
