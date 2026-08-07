import Overlay from "./Overlay";

type Props = {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
};

export default function Modal({
  title,
  children,
  onCancel,
  cancelText = "Cancelar",
  confirmText,
  onConfirm,
  confirmDisabled,
  confirmLoading,
}: Props) {
  return (
    <Overlay>
      <div
        className="z-50 mx-4 flex max-h-[95vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="shrink-0 border-b border-zinc-100 px-6 py-4">
          <h2 className="text-lg font-bold text-zinc-800">{title}</h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-xl border-2 border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            {cancelText}
          </button>
          {confirmText && onConfirm && (
            <button
              onClick={onConfirm}
              disabled={confirmDisabled || confirmLoading}
              className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-duo-green-hover disabled:opacity-50"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </Overlay>
  );
}
