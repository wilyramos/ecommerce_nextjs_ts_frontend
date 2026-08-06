// File: frontend/components/ui/NoImagePlaceholder.tsx
import { ImageOff, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoImagePlaceholderProps {
    /** Texto opcional a mostrar debajo del icono. */
    text?: string;
    /** Permite cambiar el icono predeterminado. */
    icon?: LucideIcon;
    /** Tamaño del icono en px. Por defecto 32. */
    iconSize?: number;
    /** Clases CSS adicionales para adaptar el tamaño o estilo. */
    className?: string;
    /** Aspect ratio del contenedor. Por defecto 'aspect-square'. Setear a 'false' para desactivar. */
    aspectRatio?: "aspect-square" | "aspect-video" | "aspect-auto" | false;
}

export default function NoImagePlaceholder({
    icon: Icon = ImageOff,
    iconSize = 32,
    className,
    aspectRatio = "aspect-square",
}: NoImagePlaceholderProps) {
    return (
        <div
            className={cn(
                "w-full border border-border bg-background-secondary/10 flex flex-col items-center justify-center text-[var(--color-text-tertiary)] select-none p-4",
                aspectRatio && aspectRatio,
                className
            )}
        >
            <Icon size={iconSize} strokeWidth={1.2} className="shrink-0" />
           
        </div>
    );
}