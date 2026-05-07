import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";

interface Props {
    price: TSliderPrice;
}

const borderClass: Record<string, string> = {
    none: "",

    // Estilo "Sello": El acento se mantiene en el color de marca, el resto hereda contraste
    simple:
        "relative px-6 py-3 border-[0.5px] border-[var(--color-accent-warm)]/30 rounded-tl-4xl rounded-br-xs " +
        "before:content-[''] before:absolute before:pointer-events-none " +
        "before:-left-1 before:-bottom-1 before:w-full before:h-full " +
        "before:border-l-4 before:border-b-2 before:border-[var(--color-accent-warm)] before:rounded-tl-4xl before:-z-10",

    // Estilo "Hoja de Cristal": Línea desfasada adaptativa (border-current)
    double:
        "relative px-8 py-3 rounded-tr-full rounded-br-none border border-[var(--color-accent-warm)] " +
        "before:content-[''] before:absolute before:pointer-events-none " +
        "before:-left-2 before:bottom-[-6px] before:w-[calc(100%+8px)] before:h-[calc(100%+6px)] " +
        "before:border-l-1 before:border-b-1 before:border-current before:opacity-30 before:rounded-none before:-z-10",

    // Estilo "Ticket Tech": Estética de puntos/guiones que cambian con el tema
    "rounded-all":
        "relative px-8 py-4 border-2 border-dashed border-[var(--color-accent-warm)]/40 rounded-tr-4xl rounded-bl-4xl " +
        "before:content-[''] before:absolute before:pointer-events-none " +
        "before:top-1 before:left-1 before:w-full before:h-full " +
        "before:border-r-2 before:border-t-2 before:border-dashed before:border-current before:opacity-20 before:rounded-tr-4xl before:rounded-bl-4xl before:-z-10",

    // Estilo "Geometría Abstracta": Esquinas marcadas con el color de contraste actual
    dashed:
        "relative px-6 py-3 border-[0.5px] border-[var(--color-accent-warm)]/40 rounded-tl-3xl rounded-br-4xl " +
        "after:content-[''] after:absolute after:top-[-4px] after:right-[-4px] after:w-8 after:h-8 after:border-t-2 after:border-r-2 after:border-current " +
        "before:content-[''] before:absolute before:bottom-[-4px] before:left-[-4px] before:w-8 before:h-8 before:border-b-2 before:border-current",

    // Estilo "Corte de Precisión": Regla superior/inferior industrial
    dotted:
        "relative px-6 py-2 border-x-[0.5px] border-x-[var(--color-accent-warm)]/30 rounded-tl-2xl rounded-br-2xl " +
        "before:content-[''] before:absolute before:top-[-2px] before:left-0 before:w-full before:h-[calc(100%+4px)] " +
        "before:border-y-2 before:border-dotted before:border-current before:opacity-40 before:rounded-tl-2xl before:rounded-br-2xl before:-z-10",

    // Estilo "Cyber Frame": Marco minimalista con offset
    "double-corner":
        "relative px-7 py-4 border border-[var(--color-accent-warm)] rounded-tl-4xl rounded-br-3xl " +
        "before:content-[''] before:absolute before:inset-0 before:translate-x-1 before:translate-y-1 " +
        "before:border before:border-current before:opacity-25 before:rounded-tl-4xl before:rounded-br-3xl before:-z-10",

    // Estilo "Bloque Moderno": El pilar (bg-current) se vuelve blanco en dark y negro en light
    "thick-solid":
        "relative px-7 py-3 border-[0.5px] border-[var(--color-accent-warm)]/30 rounded-tl-4xl " +
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
            style={{ color: 'inherit' }}
        >

            {/* Bloque Principal del Precio */}
            <div className="flex items-end gap-3">
                {price.current !== undefined && (
                    <span className="font-bold tracking-tighter text-[clamp(1.75rem,4.5vw,3.5rem)] leading-none">
                        <span className="text-sm font-bold mr-1.5 opacity-60 align-top">
                            {price.currency}
                        </span>

                        {price.current.toFixed(2)}

                        {price.suffix && (
                            <span className="text-[0.22em] font-bold ml-2 opacity-50 tracking-[0.2em] uppercase">
                                {price.suffix}
                            </span>
                        )}
                    </span>
                )}

                {/* Label encima del precio comparativo, todo alineado al fondo */}
                {price.compare && (
                    <div className="flex flex-col items-start gap-1 pb-0.5">
                        {price.label && (
                            <span className="
                    text-[10px] md:text-xs font-black uppercase text-white
                    bg-[var(--color-accent-warm)] border-[var(--color-accent-warm)]/40 border-2
                    px-2.5 py-0.5
                    -rotate-3 transform origin-left
                ">
                                {price.label}
                            </span>
                        )}
                        <span className="text-xs md:text-sm line-through opacity-30 decoration-current decoration-[1.5px] leading-none">
                            {price.currency}{price.compare.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>
            {/* Nota Inferior */}
            {price.note && (
                <span className="text-[9px] md:text-[10px] font-bold opacity-40 tracking-[0.15em] mt-1.5 uppercase">
                    {price.note}
                </span>
            )}
        </div>
    );
}