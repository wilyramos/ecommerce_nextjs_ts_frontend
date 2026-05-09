import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";

interface Props {
    price: TSliderPrice;
}

const borderClass: Record<string, string> = {
    none: "",

    // "Sello": Línea fina izquierda y superior, sutil
    simple:
        "relative pl-4 pt-2 border-l-1 border-t-1 border-[var(--color-accent-warm)]/30 rounded-tl-md",

    // "Hoja de Cristal": Borde superior y derecho muy limpio
    double:
        "relative pr-5 pt-2 border-r-1 border-t-1 border-[var(--color-accent-warm)]/30 rounded-tr-md",

    // "Ticket Tech": Borde completo redondeado con opacidad mínima
    "rounded-all":
        "relative px-5 py-3 border-1 border-[var(--color-accent-warm)]/20 rounded-lg bg-[var(--color-accent-warm)]/[0.02]",

    // "Geometría Abstracta": Subrayado minimalista a trazos
    dashed:
        "relative pb-2 border-b-1 border-dashed border-[var(--color-accent-warm)]/40",

    // "Corte de Precisión": Borde punteado delicado alrededor
    dotted:
        "relative px-4 py-2 border-1 border-dotted border-[var(--color-accent-warm)]/40 rounded-sm",

    // "Cyber Frame": Acento de esquina mínimo (solo dos líneas cortas top-left)
    "double-corner":
        "relative pl-3 pt-3 before:content-[''] before:absolute before:top-0 before:left-0 before:w-3 before:h-3 before:border-t-[1px] before:border-l-[1px] before:border-[var(--color-accent-warm)]/50",

    // "Bloque Moderno": Línea única a la izquierda, limpia y sin sombras
    "thick-solid":
        "relative pl-4 py-1 border-l-2 border-[var(--color-accent-warm)]/60",
};

export default function SliderPrice({ price }: Props) {
    const borderStyle = borderClass[price.border ?? "none"] ?? "";

    return (
        <div
            className={`
                inline-flex flex-col gap-1 w-fit
                transition-all duration-500 ease-in-out
                ${borderStyle}
            `}
            style={{ color: "inherit" }}
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
                                mr-1 align-top font-medium opacity-50
                                text-[0.28em]
                            "
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
                                    opacity-40
                                "
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
                                    text-[9px] sm:text-[11px]
                                    font-bold uppercase
                                    tracking-widest leading-none
                                    text-[var(--color-accent-warm)]/80
                                "
                            >
                                {price.label}
                            </span>
                        )}

                        <span
                            className="
                                text-xs sm:text-sm md:text-lg
                                font-light leading-none
                                tracking-tight opacity-30
                                line-through
                                decoration-current
                                decoration-[1px]
                            "
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
                        opacity-40
                    "
                >
                    {price.note}
                </span>
            )}
        </div>
    );
}