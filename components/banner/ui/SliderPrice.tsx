import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";

interface Props {
    price: TSliderPrice;
}

const borderClass: Record<string, string> = {
    none: "",

    // "Sello": solo esquina top-left
    simple:
        "relative px-6 py-3 border-[0.5px] border-[var(--color-accent-warm)]/30 rounded-tl-4xl " +
        "before:content-[''] before:absolute before:pointer-events-none " +
        "before:-left-1 before:-bottom-1 before:w-full before:h-full " +
        "before:border-l-4 before:border-b-2 before:border-[var(--color-accent-warm)] before:rounded-tl-4xl before:-z-10",

    // "Hoja de Cristal": solo esquina top-right
    double:
        "relative px-8 py-3 rounded-tr-full border border-[var(--color-accent-warm)] " +
        "before:content-[''] before:absolute before:pointer-events-none " +
        "before:-left-2 before:bottom-[-6px] before:w-[calc(100%+8px)] before:h-[calc(100%+6px)] " +
        "before:border-l-1 before:border-b-1 before:border-current before:opacity-30 before:-z-10",

    // "Ticket Tech": solo esquina top-right
    "rounded-all":
        "relative px-8 py-4 border-2 border-dashed border-[var(--color-accent-warm)]/40 rounded-tr-4xl " +
        "before:content-[''] before:absolute before:pointer-events-none " +
        "before:top-1 before:left-1 before:w-full before:h-full " +
        "before:border-r-2 before:border-t-2 before:border-dashed before:border-current before:opacity-20 before:rounded-tr-4xl before:-z-10",

    // "Geometría Abstracta": solo esquina top-left
    dashed:
        "relative px-6 py-3 border-[0.5px] border-[var(--color-accent-warm)]/40 rounded-tl-3xl " +
        "after:content-[''] after:absolute after:top-[-4px] after:right-[-4px] after:w-8 after:h-8 after:border-t-2 after:border-r-2 after:border-current " +
        "before:content-[''] before:absolute before:bottom-[-4px] before:left-[-4px] before:w-8 before:h-8 before:border-b-2 before:border-current",

    // "Corte de Precisión": solo esquina top-left
    dotted:
        "relative px-6 py-2 border-x-[0.5px] border-x-[var(--color-accent-warm)]/30 rounded-tl-2xl " +
        "before:content-[''] before:absolute before:top-[-2px] before:left-0 before:w-full before:h-[calc(100%+4px)] " +
        "before:border-y-2 before:border-dotted before:border-current before:opacity-40 before:rounded-tl-2xl before:-z-10",

    // "Cyber Frame": solo esquina top-left
    "double-corner":
        "relative px-2 py-4 border border-[var(--color-accent-warm)] rounded-tl-xl " +
        "before:content-[''] before:absolute before:inset-0 before:translate-x-1 before:translate-y-1 " +
        "before:border before:border-current before:opacity-25 before:rounded-tl-xl before:-z-10",

    // "Bloque Moderno": solo esquina top-left
    "thick-solid":
        "relative px-7 py-3 border-[0.5px] border-[var(--color-accent-warm)]/30 rounded-tl-2xl " +
        "before:content-[''] before:absolute before:top-0 before:left-[-12px] before:w-[12px] before:h-full " +
        "before:bg-current before:opacity-100 before:rounded-l-sm " +
        "after:content-[''] after:absolute after:inset-0 after:shadow-[6px_6px_0px_0px_var(--color-accent-warm-light)] after:-z-20",
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
            {/* Bloque Principal del Precio */}
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
                                mr-1 align-top font-bold opacity-60
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
                                    font-bold uppercase
                                    tracking-[0.18em]
                                    opacity-50
                                "
                            >
                                {price.suffix}
                            </span>
                        )}
                    </span>
                )}

                {/* Comparativo */}
                {price.compare && (
                    <div className="flex flex-col items-start gap-0.5 pb-1">
                        {price.label && (
                            <span
                                className="
                                    text-[9px] sm:text-[11px]
                                    font-black uppercase
                                    tracking-wider leading-none
                                    text-[var(--color-accent-warm)]
                                "
                            >
                                {price.label}
                            </span>
                        )}

                        <span
                            className="
                                text-xs sm:text-sm md:text-lg
                                font-medium leading-none
                                tracking-tight opacity-25
                                line-through
                                decoration-current
                                decoration-[1.5px]
                            "
                        >
                            {price.currency}
                            {price.compare.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            {/* Nota */}
            {price.note && (
                <span
                    className="
                        mt-1
                        text-[8px] sm:text-[10px]
                        font-bold uppercase
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