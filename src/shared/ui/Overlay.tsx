type Props = {
  children: React.ReactNode;
  variant?: "center" | "sheet";
};

export default function Overlay({ children, variant = "center" }: Props) {
  return (
    <div
      className={
        variant === "sheet"
          ? "fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:py-10 sm:px-2"
          : "fixed inset-0 z-50 flex items-center justify-center bg-black/40 py-10 px-2"
      }
    >
      {children}
    </div>
  );
}
