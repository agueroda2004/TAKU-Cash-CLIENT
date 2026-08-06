import Spinner from "./Spinner";

type Props = {
  children?: React.ReactNode;
};

export default function FullPageLoader({ children }: Props) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white"
    >
      <Spinner size="lg" />
      {children}
    </div>
  );
}
