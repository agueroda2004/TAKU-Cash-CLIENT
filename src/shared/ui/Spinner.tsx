import { Loader2 } from "lucide-react";

type SpinnerSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

type Props = {
  size?: SpinnerSize;
  className?: string;
};

export default function Spinner({ size = "md", className = "" }: Props) {
  return (
    <Loader2
      className={`animate-spin text-duo-green ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
    />
  );
}
