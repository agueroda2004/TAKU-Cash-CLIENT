import { useState } from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import Pagination from "../../../shared/ui/Pagination";
import AccountCard from "../components/AccountCard";
import CreateAccountModal from "../components/CreateAccountModal";
import TransferModal from "../components/TransferModal";
import UpdateAccountModal from "../components/UpdateAccountModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import AccountFiltersBar from "../components/AccountFiltersBar";
import { useAccount } from "../hooks/useAccount";
import { notify } from "../../../lib/notify";
import type { Account } from "../types";

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border-2 border-zinc-100 bg-white p-5"
        >
          <div className="h-11 w-11 rounded-xl bg-zinc-100 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-zinc-100 animate-pulse" />
            <div className="h-3 w-20 rounded bg-zinc-100 animate-pulse" />
          </div>
          <div className="h-4 w-24 rounded bg-zinc-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function AccountPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferFrom, setTransferFrom] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const {
    accounts,
    totalItems,
    hasNext,
    hasLast,
    page,
    pageSize,
    filters,
    setFilters,
    setPage,
    isLoading,
    isFetching,
    error,
    refetch,
    updateAccount,
  } = useAccount();

  const showEmpty = !isLoading && !error && totalItems === 0;

  async function handleReactivate(account: Account) {
    try {
      await updateAccount({ id: account.id, data: { isActive: true } });
      notify({ success: true, message: "Cuenta reactivada" });
    } catch (err) {
      notify({
        success: false,
        message: err instanceof Error ? err.message : "Error al reactivar la cuenta",
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis cuentas"
        description="Administra tus cuentas bancarias"
        buttonText="Crear cuenta"
        onClick={() => setCreateModalOpen(true)}
      />

      <AccountFiltersBar filters={filters} onApply={setFilters} />

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          Error al cargar las cuentas.{" "}
          <button onClick={() => refetch()} className="underline font-semibold">
            Intentar de nuevo
          </button>
        </div>
      )}

      {isLoading && <LoadingSkeleton />}

      {!isLoading && !error && accounts.length === 0 && !showEmpty && (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-400">
          No hay cuentas en esta página
        </div>
      )}

      {showEmpty && (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center">
          <p className="text-zinc-400">No tienes cuentas todavía</p>
          <p className="mt-1 text-sm text-zinc-300">
            Crea tu primera cuenta para empezar
          </p>
        </div>
      )}

      {!isLoading && accounts.length > 0 && (
        <div className="relative space-y-3">
          <div
            className={`grid grid-cols-1 gap-2 transition-opacity ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onTransfer={() => setTransferFrom(account)}
                onEdit={() => setEditingAccount(account)}
                onDelete={() => setDeletingAccount(account)}
                onReactivate={() => handleReactivate(account)}
              />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            hasNext={hasNext}
            hasLast={hasLast}
            onPageChange={setPage}
          />
        </div>
      )}

      <CreateAccountModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
      />

      <UpdateAccountModal
        key={editingAccount?.id ?? "closed"}
        open={editingAccount !== null}
        account={editingAccount}
        onCancel={() => setEditingAccount(null)}
      />

      <DeleteAccountModal
        open={deletingAccount !== null}
        account={deletingAccount}
        onCancel={() => setDeletingAccount(null)}
      />

      {transferFrom && (
        <TransferModal
          open={!!transferFrom}
          onCancel={() => setTransferFrom(null)}
          fromAccount={transferFrom}
        />
      )}
    </div>
  );
}
