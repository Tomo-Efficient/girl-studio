import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  color?: string | null;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function TagBadge({ name, color, selected, onClick, className, size = "sm" }: TagBadgeProps) {
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full text-white font-light whitespace-nowrap transition-all cursor-pointer border-none",
        sizeClasses,
        selected ? "ring-2 ring-offset-1 ring-[#c4736e] scale-105" : "hover:opacity-80",
        className
      )}
      style={{ backgroundColor: color || "#c4736e" }}
    >
      {name}
    </button>
  );
}
