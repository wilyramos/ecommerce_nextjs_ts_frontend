import { cn } from "@/lib/utils";
import { diccionarioColores } from "@/src/utils/constants/colores";

export default function ColorCircle({
    color,
    size = 16,
}: {
    color: string;
    size?: number;
}) {
    const bgClass = diccionarioColores[color?.trim().toLowerCase()] ?? "bg-muted";

    return (
        <div className="border p-0.2 rounded-full border-foreground/20">
            <div
                title={color}
                style={{ width: size, height: size }}
                className={cn(
                    "rounded-full shrink-0",
                    "border border-foreground/10",
                    "shadow-[inset_0_1px_1px_rgba(0,0,0,0.08)]",
                    bgClass
                )}
            />
        </div>
    );
}