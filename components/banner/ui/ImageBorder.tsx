import Image from "next/image";

interface Props {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    objectFit?: "contain" | "cover" | "fill";
    borderStyle?: string;
    sizes?: string;
    priority?: boolean;
}

/**
 * Border styles: decoraciones visuales posicionadas detrás de la imagen
 * Utilizan pseudo-elementos before/after para crear efectos de marco
 * - before: elemento decorativo principal (más visible)
 * - after: elemento decorativo secundario (más sutil)
 * Todos posicionados con z-index negativo (-z-10) para estar detrás de la imagen (z-10)
 */
const borderClasses: Record<string, string> = {
    none: "",

    "curved-frame":
        "relative " +
        "before:content-[''] before:absolute before:w-[58%] before:h-[58%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-[40%] before:border-2 before:border-[var(--color-accent-warm)] " +
        "before:rounded-lg before:-z-10 " +
        "after:content-[''] after:absolute after:w-[48%] after:h-[48%] after:top-1/2 after:left-1/2 " +
        "after:-translate-x-1/2 after:translate-y-[20%] after:border-2 after:border-[var(--color-text-secondary)]/50 " +
        "after:rounded-lg after:-z-10",

    simple:
        "relative " +
        "before:content-[''] before:absolute before:w-[55%] before:h-[55%] before:bottom-1 before:left-1 " +
        "before:border-2 before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[45%] after:h-[45%] after:bottom-3 after:left-3 " +
        "after:border-2 after:border-[var(--color-text-secondary)]/50 after:-z-10",

    double:
        "relative " +
        "before:content-[''] before:absolute before:w-[56%] before:h-[56%] before:bottom-1 before:right-1 " +
        "before:border-2 before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[46%] after:h-[46%] after:bottom-3 after:right-3 " +
        "after:border before:border-[var(--color-text-secondary)]/50 after:-z-10",

    "rounded-top":
        "relative " +
        "before:content-[''] before:absolute before:w-[58%] before:h-[48%] before:top-1 before:right-1 " +
        "before:border-2 before:border-[var(--color-accent-warm)] before:rounded-t-3xl before:-z-10 " +
        "after:content-[''] after:absolute after:w-[48%] after:h-[38%] after:top-3 after:right-3 " +
        "after:border-2 after:border-[var(--color-text-secondary)]/50 after:rounded-t-3xl after:-z-10",

    "rounded-all":
        "relative " +
        "before:content-[''] before:absolute before:w-[58%] before:h-[58%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-1/2 before:border-2 before:border-[var(--color-accent-warm)] " +
        "before:rounded-full before:-z-10 " +
        "after:content-[''] after:absolute after:w-[48%] after:h-[48%] after:top-1/2 after:left-1/2 " +
        "after:-translate-x-1/2 after:-translate-y-1/2 after:border-2 after:border-[var(--color-text-secondary)]/40 " +
        "after:rounded-full after:-z-10",

    dashed:
        "relative " +
        "before:content-[''] before:absolute before:w-[56%] before:h-[56%] before:top-1 before:right-1 " +
        "before:border-2 before:border-dashed before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[46%] after:h-[46%] after:bottom-1 after:left-1 " +
        "after:border-2 after:border-dashed after:border-[var(--color-text-secondary)]/60 after:-z-10",

    dotted:
        "relative " +
        "before:content-[''] before:absolute before:w-[60%] before:h-[60%] before:top-1 before:left-1 " +
        "before:border before:border-dotted before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[36%] after:h-[42%] after:bottom-1 after:right-1 " +
        "after:border-2 after:border-dotted after:border-[var(--color-text-secondary)]/50 after:-z-10",

    "double-corner":
        "relative " +
        "before:content-[''] before:absolute before:w-[52%] before:h-[52%] before:top-1 before:left-1 " +
        "before:border-l-4 before:border-t-4 before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[42%] after:h-[42%] after:bottom-1 after:right-1 " +
        "after:border-r-4 after:border-b-4 after:border-[var(--color-text-secondary)]/50 after:-z-10",

    floating:
        "relative " +
        "before:content-[''] before:absolute before:w-[56%] before:h-[56%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-1/2 before:translate-y-1 before:translate-x-1 " +
        "before:bg-[var(--color-accent-warm)]/20 before:rounded-lg before:blur-md before:-z-10 " +
        "after:content-[''] after:absolute after:w-[46%] after:h-[46%] after:top-1/2 after:left-1/2 " +
        "after:-translate-x-1/2 after:-translate-y-1/2 after:translate-y-2 after:translate-x-2 " +
        "after:bg-[var(--color-text-secondary)]/15 after:rounded-lg after:blur-lg after:-z-10",

    "film-frame":
        "relative " +
        "before:content-[''] before:absolute before:w-[58%] before:h-[58%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-1/2 before:translate-x-1 before:translate-y-1 " +
        "before:bg-[var(--color-accent-warm)]/85 before:rounded-md before:-z-10 " +
        "after:content-[''] after:absolute after:w-[48%] after:h-[48%] after:top-1/2 after:left-1/2 " +
        "after:-translate-x-1/2 after:-translate-y-1/2 after:translate-x-2 after:translate-y-2 " +
        "after:bg-[var(--color-text-secondary)]/25 after:rounded-md after:-z-10",

    asymmetric:
        "relative " +
        "before:content-[''] before:absolute before:w-[54%] before:h-[54%] before:top-1 before:right-1 " +
        "before:border-t-4 before:border-r-4 before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[44%] after:h-[44%] after:bottom-1 after:left-1 " +
        "after:border-b-4 after:border-l-4 after:border-[var(--color-text-secondary)]/60 after:-z-10",

    "glass-effect":
        "relative " +
        "before:content-[''] before:absolute before:w-[56%] before:h-[56%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-[40%] before:border-2 before:border-[var(--color-accent-warm)]/80 " +
        "before:rounded-xl before:backdrop-blur-sm before:-z-10 " +
        "after:content-[''] after:absolute after:w-[46%] after:h-[46%] after:top-1/2 before:left-1/2 " +
        "after:-translate-x-1/2 after:translate-y-[20%] after:border-2 after:border-[var(--color-text-secondary)]/40 " +
        "after:rounded-xl after:-z-10",

    "neon-glow":
        "relative " +
        "before:content-[''] before:absolute before:w-[55%] before:h-[55%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-1/2 before:translate-x-1 before:translate-y-1 " +
        "before:border-2 before:border-[var(--color-accent-warm)] before:rounded-lg " +
        "before:shadow-[0_0_12px_var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[45%] after:h-[45%] after:top-1/2 after:left-1/2 " +
        "after:-translate-x-1/2 after:-translate-y-1/2 after:translate-x-2 after:translate-y-2 " +
        "after:border-2 after:border-[var(--color-text-secondary)]/40 after:rounded-lg " +
        "after:shadow-[0_0_14px_var(--color-text-secondary)]/30 after:-z-10",

    "minimal-frame":
        "relative " +
        "before:content-[''] before:absolute before:w-[50%] before:h-[50%] before:top-1/2 before:left-1/2 " +
        "before:-translate-x-1/2 before:-translate-y-1/2 before:border before:border-[var(--color-accent-warm)]/40 " +
        "before:-z-10 " +
        "after:content-[''] after:absolute after:w-[42%] after:h-[42%] after:top-1/2 after:left-1/2 " +
        "after:-translate-x-1/2 after:-translate-y-1/2 after:border after:border-[var(--color-text-secondary)]/20 " +
        "after:-z-10",

    "diagonal-cut":
        "relative " +
        "before:content-[''] before:absolute before:w-[54%] before:h-[54%] before:top-1 before:right-1 " +
        "before:border-2 before:border-[var(--color-accent-warm)] before:rounded-tr-3xl before:-z-10 " +
        "after:content-[''] after:absolute after:w-[44%] after:h-[44%] after:bottom-1 after:left-1 " +
        "after:border-2 after:border-[var(--color-text-secondary)]/60 after:rounded-bl-3xl after:-z-10",
};

export default function ImageBorder({
    src,
    alt,
    fill = false,
    width,
    height,
    className = "",
    objectFit = "cover",
    borderStyle = "none",
    sizes,
    priority = false,
}: Props) {
    const borderClass = borderClasses[borderStyle] ?? "";

    const wrapperClasses = `
        ${borderClass}
        ${fill ? "relative w-full h-full" : "relative"}
        aspect-square
        transition-transform duration-300 ease-out
        hover:scale-[1.02]
        group-hover:scale-[1.03]
        z-0
    `.trim();

    return (
        <div className={wrapperClasses} style={{ color: "inherit" }}>
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                className={`
                    relative z-10 
                    ${fill ? `object-${objectFit} object-center` : ""}
                    ${className}
                `.trim()}
                sizes={sizes}
                priority={priority}
            />
        </div>
    );
}