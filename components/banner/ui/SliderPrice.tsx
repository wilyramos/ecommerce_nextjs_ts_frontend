import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";

interface Props {
    price: TSliderPrice;
    color: string;
    accentColor: string;
    isDark: boolean;
}

export default function SliderPrice({
    price,
    color,
    accentColor,
    isDark,
}: Props) {
    const borderStyles: Record<string, React.CSSProperties> = {
        // Sin decoración
        none: {},

        // Marco curvado: bordes redondeados con fondo sutil
        "curved-frame": {
            border: `1px solid ${accentColor}${isDark ? "44" : "33"}`,
            borderRadius: "0.5rem",
            background: `${accentColor}${isDark ? "08" : "04"}`,
            padding: "0.75rem 1rem",
            boxShadow: `inset 0 0 8px ${accentColor}${isDark ? "08" : "04"}`,
        },

        // Marco simple: bordes izquierdo y superior
        simple: {
            borderLeft: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTop: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTopLeftRadius: "0.375rem",
            paddingLeft: "1rem",
            paddingTop: "0.5rem",
        },

        // Marco doble: bordes derecho y superior con grosor variable
        double: {
            borderRight: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTop: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTopRightRadius: "0.375rem",
            paddingRight: "1.25rem",
            paddingTop: "0.5rem",
        },

        // Marco redondeado superior: solo redondeado arriba
        "rounded-top": {
            borderTop: `1px solid ${accentColor}${isDark ? "44" : "33"}`,
            borderLeft: `1px solid ${accentColor}${isDark ? "44" : "33"}`,
            borderRight: `1px solid ${accentColor}${isDark ? "44" : "33"}`,
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            paddingTop: "0.75rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
        },

        // Marco completamente redondeado: círculo/óvalo
        "rounded-all": {
            border: `1px solid ${accentColor}${isDark ? "33" : "22"}`,
            background: `${accentColor}${isDark ? "08" : "05"}`,
            borderRadius: "0.5rem",
            padding: "0.75rem 1.25rem",
        },

        // Líneas punteadas: bordes discontinuos
        dashed: {
            borderLeft: `2px dashed ${accentColor}${isDark ? "66" : "44"}`,
            borderBottom: `1px dashed ${accentColor}${isDark ? "55" : "33"}`,
            paddingLeft: "1rem",
            paddingBottom: "0.5rem",
        },

        // Puntos: bordes punteados
        dotted: {
            border: `1px dotted ${accentColor}${isDark ? "66" : "44"}`,
            borderRadius: "0.125rem",
            padding: "0.5rem 1rem",
        },

        // Esquinas dobles: solo esquinas
        "double-corner": {
            borderTop: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderRight: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderBottomLeftRadius: "0.375rem",
            padding: "0.75rem 1rem",
        },

        // Efecto flotante: sombra sutil sin bordes
        floating: {
            background: `${accentColor}${isDark ? "06" : "03"}`,
            borderRadius: "0.5rem",
            padding: "0.75rem 1.25rem",
            boxShadow: `0 4px 12px ${accentColor}${isDark ? "15" : "08"}`,
        },

        // Marco de película: fondo sólido con múltiples capas
        "film-frame": {
            background: `${accentColor}${isDark ? "12" : "08"}`,
            border: `1px solid ${accentColor}${isDark ? "44" : "33"}`,
            borderRadius: "0.375rem",
            padding: "1rem 1.25rem",
            boxShadow: `
                inset 0 0 0 1px ${accentColor}${isDark ? "22" : "11"},
                0 2px 8px ${accentColor}${isDark ? "12" : "06"}
            `,
        },

        // Asimétrico: bordes en esquinas opuestas
        asymmetric: {
            borderLeft: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderBottom: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderBottomLeftRadius: "0.5rem",
            padding: "0.75rem 1rem 1rem 1.25rem",
        },

        // Efecto vidrio: bordes con desenfoque de fondo
        "glass-effect": {
            border: `1px solid ${accentColor}${isDark ? "44" : "33"}`,
            background: `${accentColor}${isDark ? "06" : "03"}`,
            backdropFilter: "blur(4px)",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.25rem",
        },

        // Brillo neón: bordes con resplandor
        "neon-glow": {
            border: `1px solid ${accentColor}${isDark ? "66" : "44"}`,
            borderRadius: "0.375rem",
            padding: "0.75rem 1.25rem",
            boxShadow: `
                0 0 8px ${accentColor}${isDark ? "33" : "22"},
                inset 0 0 8px ${accentColor}${isDark ? "11" : "08"}
            `,
        },

        // Marco minimalista: línea muy sutil
        "minimal-frame": {
            borderBottom: `1px solid ${accentColor}${isDark ? "22" : "11"}`,
            paddingBottom: "0.5rem",
        },

        // Corte diagonal: bordes en diagonal
        "diagonal-cut": {
            borderTop: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderLeft: `2px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderRadius: "0.375rem",
            padding: "0.75rem 1rem",
            transform: "skewX(-5deg)",
        },
    };

    return (
        <div
            className="
                inline-flex flex-col gap-1 w-fit
                transition-all duration-500 ease-in-out
                relative
            "
            style={{
                color,
                ...borderStyles[price.border ?? "none"],
            }}
        >
            <div className="flex items-end gap-2 sm:gap-3">
                {price.current !== undefined && (
                    <span
                        className="
                            font-bold tracking-tighter leading-none
                            text-[clamp(1.4rem,6vw,3.5rem)]
                        "
                    >
                        <span
                            className="
                                mr-1 align-top font-medium
                                text-[0.28em]
                            "
                            style={{
                                opacity: isDark ? 0.55 : 0.45,
                            }}
                        >
                            {price.currency}
                        </span>

                        {price.current.toFixed(2)}

                        {price.suffix && (
                            <span
                                className="
                                    ml-1.5 sm:ml-2
                                    text-[0.22em]
                                    font-medium uppercase
                                    tracking-[0.18em]
                                "
                                style={{
                                    opacity: isDark ? 0.5 : 0.4,
                                }}
                            >
                                {price.suffix}
                            </span>
                        )}
                    </span>
                )}

                {price.compare && (
                    <div className="flex flex-col items-start gap-0.5 pb-1">
                        {price.label && (
                            <span
                                className="
            text-[10px] sm:text-[14px]
            font-bold uppercase
            tracking-widest leading-none
            rounded-3xl px-2 py-0.5
        "
                                style={{
                                    backgroundColor: isDark ? "#ffffff" : "#000000",
                                    color: isDark ? "#000000" : "#ffffff",
                                    opacity: isDark ? 0.9 : 0.85,
                                }}
                            >
                                {price.label}
                            </span>
                        )}

                        <span
                            className="
                                text-xs sm:text-sm md:text-lg
                                font-light leading-none
                                tracking-tight line-through
                                decoration-current
                                decoration-[1px]
                            "
                            style={{
                                opacity: isDark ? 0.35 : 0.28,
                            }}
                        >
                            {price.currency}
                            {price.compare.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {price.note && (
                <span
                    className="
                        mt-1
                        text-[8px] sm:text-[10px]
                        font-medium uppercase
                        tracking-[0.15em]
                    "
                    style={{
                        opacity: isDark ? 0.45 : 0.35,
                    }}
                >
                    {price.note}
                </span>
            )}
        </div>
    );
}