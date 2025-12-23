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
    duration = 7000,
}: CustomDotProps) {
    return (
        <li
            className="inline-flex items-center justify-center px-1.5 py-4 cursor-pointer group"
            onClick={onClick}
            role="button"
            aria-label={`Ir al slide ${index}`}
        >
            <div
                className={clsx(
                    "relative h-[3px] overflow-hidden transition-all duration-500 ease-out",
                    active
                        ? "w-12 bg-neutral-200"
                        : "w-3 bg-neutral-400 group-hover:bg-neutral-600 group-hover:w-5"
                )}
            >
                {/* Barra de progreso con gradiente sutil para profundidad */}
                <span
                    className={clsx(
                        "absolute top-0 left-0 h-full bg-neutral-900 block transition-all ease-linear",
                        active ? "opacity-100" : "w-0 opacity-0"
                    )}
                    style={{
                        width: active ? "100%" : "0%",
                        transitionDuration: active ? `${duration}ms` : "0ms",
                    }}
                />
            </div>
        </li>
    );
}