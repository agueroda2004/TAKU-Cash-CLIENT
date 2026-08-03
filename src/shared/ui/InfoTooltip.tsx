import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

type Props = {
  text: string;
  className?: string;
};

export default function InfoTooltip({ text, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <span ref={ref} className={`relative inline-flex ${className ?? ""}`}>
      <button
        type="button"
        aria-label="Más información"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {isOpen && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-40 mt-1.5 w-64 -translate-x-1/2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium leading-relaxed text-white shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}
