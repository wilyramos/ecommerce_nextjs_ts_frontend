import clsx from "clsx";

export function CustomDot({
    onClick,
    active,
    index,
    duration = 7000, // Tiempo por defecto igual a tu autoPlaySpeed
}: {
    onClick?: () => void;
    active?: boolean;
    index?: number;
    duration?: number;
}) {
    return (
        <li
            className="inline-block mx-1 py-2 cursor-pointer group"
            onClick={onClick}
            role="button"
            aria-label={`Ir al slide ${index}`}
        >
            {/* Contenedor: Define la forma y el fondo inactivo */}
            <div
                className={clsx(
                    "relative h-1.5 rounded-full overflow-hidden transition-[width] duration-300 ease-out",
                    active
                        ? "w-8 bg-gray-200" // Fondo gris claro cuando está activo (para ver la carga oscura)
                        : "w-2 bg-gray-300 group-hover:bg-gray-400" // Punto pequeño gris cuando inactivo
                )}
            >
                {/* Barra de progreso interna */}
                <span
                    className={clsx(
                        "absolute top-0 left-0 h-full bg-gray-800 block rounded-full",
                        active 
                            ? "w-full transition-all ease-linear" // Se llena linealmente
                            : "w-0 duration-0 opacity-0" // Se resetea instantáneamente
                    )}
                    style={{ 
                        // Usamos style en línea para sincronizar exactamente los ms
                        transitionDuration: active ? `${duration}ms` : '0ms' 
                    }}
                />
            </div>
        </li>
    );
}