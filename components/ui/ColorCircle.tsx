// File: frontend/components/ui/ColorCircle.tsx
import { cn } from "@/lib/utils";
import { diccionarioColores } from "@/src/utils/constants/colores";

interface ColorCircleProps {
  color: string;
  size?: number;
  className?: string;
}

export default function ColorCircle({
  color,
  size = 14,
  className,
}: ColorCircleProps) {
  const normalizedColor = color?.trim().toLowerCase();
  
  // Si no hay mapeo, usamos una superficie secundaria neutral
  const bgClass = diccionarioColores[normalizedColor] ?? "bg-surface-secondary";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        className
      )}
    >
      <div
        title={color}
        style={{ width: size, height: size }}
        className={cn(
          "shrink-0 rounded-full border border-black/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] transition-transform duration-300",
          bgClass
        )}
      />
    </div>
  );
}