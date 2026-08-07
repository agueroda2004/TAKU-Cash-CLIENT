type Props = {
  children: React.ReactNode;
};

export default function Overlay({ children }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 py-10 px-2">
      {children}
    </div>
  );
}
