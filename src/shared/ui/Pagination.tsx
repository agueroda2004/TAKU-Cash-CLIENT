import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasLast: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalItems,
  pageSize,
  hasNext,
  hasLast,
  onPageChange,
}: Props) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3">
      <p className="text-sm text-zinc-500">
        {totalItems === 0 ? (
          "Sin resultados"
        ) : (
          <>
            Mostrando <span className="font-semibold text-zinc-700">{start}</span>–
            <span className="font-semibold text-zinc-700">{end}</span> de{" "}
            <span className="font-semibold text-zinc-700">{totalItems}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasLast}
          className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-3 text-sm font-semibold text-zinc-700">{page}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}