import { useState } from "react";
import PageHeader from "../../../shared/ui/PageHeader";
import Pagination from "../../../shared/ui/Pagination";
import CreateCategoryModal from "../components/CreateCategoryModal";
import CategoryCard from "../components/CategoryCard";
import CategoryFiltersBar from "../components/CategoryFiltersBar";
import UpdateCategoryModal from "../components/UpdateCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import { useCategory } from "../hooks/useCategory";
import type { Category } from "../types";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border-2 border-zinc-100 bg-white p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-zinc-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-zinc-100" />
              <div className="h-3 w-20 rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-200 py-14 text-center text-sm text-zinc-400">
      {hasFilters
        ? "No se encontraron categorías con los filtros actuales."
        : "Aún no tienes categorías. Crea una para empezar."}
    </div>
  );
}

export default function CategoryPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const {
    categories,
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
  } = useCategory();

  const hasFilters = !!filters.name || !!filters.type;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        description="Organiza tus ingresos y gastos"
        buttonText="Crear categoría"
        onClick={() => setCreateModalOpen(true)}
      />

      <CategoryFiltersBar filters={filters} onApply={setFilters} />

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          Error al cargar las categorías.{" "}
          <button onClick={() => refetch()} className="underline font-semibold">
            Intentar de nuevo
          </button>
        </div>
      )}

      {isLoading && <LoadingSkeleton />}

      {!isLoading && !error && (
        <>
          {categories.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => setEditingCategory(category)}
                  onDelete={() => setDeletingCategory(category)}
                />
              ))}
            </div>
          )}

          {!isFetching && totalItems > 0 && (
            <Pagination
            page={page}
            totalItems={totalItems}
            pageSize={pageSize}
            hasNext={hasNext}
            hasLast={hasLast}
            onPageChange={setPage}
          />
          )}
        </>
      )}

      <CreateCategoryModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
      />

      <UpdateCategoryModal
        key={editingCategory?.id ?? "closed"}
        open={editingCategory !== null}
        category={editingCategory}
        onCancel={() => setEditingCategory(null)}
      />

      <DeleteCategoryModal
        open={deletingCategory !== null}
        category={deletingCategory}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
}