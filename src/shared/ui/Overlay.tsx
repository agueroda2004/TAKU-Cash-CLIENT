type Props = {
  children: React.ReactNode;
};

export default function Overlay({ children }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      {children}
    </div>
  );
}
