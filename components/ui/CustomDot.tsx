import clsx from "clsx";

interface CustomDotProps {
    onClick?: () => void;
    active?: boolean;
    index?: number;
    duration?: number;
}

export function CustomDot({
    onClick,
    active,
    index,
    duration = 8000, // Ajustado a la velocidad del autoPlaySpeed del carrusel
}: CustomDotProps) {
    return (
        <li
            className="inline-flex items-center justify-center px-1 py-6 cursor-pointer group"
            onClick={onClick}
            role="button"
            aria-label={`Ir al slide ${index}`}
        >
            <div
                className={clsx(
                    "relative h-[2px] rounded-full overflow-hidden transition-all duration-500 ease-out",
                    active
                        ? "w-14 bg-[var(--store-border)]"
                        : "w-8 bg-gray-300/50 group-hover:bg-gray-400 group-hover:w-10"
                )}
            >
                {/* Barra de progreso (Solo visible cuando está activo) */}
                <span
                    className={clsx(
                        "absolute top-0 left-0 h-full bg-[var(--store-text)] block",
                        active ? "opacity-100" : "w-0 opacity-0"
                    )}
                    style={{
                        width: active ? "100%" : "0%",
                        transition: active
                            ? `width ${duration}ms linear, opacity 300ms ease`
                            : "none",
                    }}
                />
            </div>
        </li>
    );
}