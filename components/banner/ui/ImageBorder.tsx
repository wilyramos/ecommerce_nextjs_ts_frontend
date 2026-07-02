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

// Estructura de tamaños reducida y limpia para un look puramente ecommerce premium
const FRAME_OUTER = "before:w-[32%] before:h-[32%]";
const FRAME_INNER = "after:w-[24%] after:h-[24%]";

const borderClasses: Record<string, string> = {
    none: "",

    "curved-frame":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-1/2 before:left-1/2
        before:-translate-x-1/2 before:-translate-y-[45%]
        before:border before:border-[var(--color-action-cta)]/30
        before:rounded-xs before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:top-1/2 after:left-1/2
        after:-translate-x-1/2 after:translate-y-[10%]
        after:border after:border-[var(--color-border)]/50
        after:rounded-xs after:-z-10`,

    simple:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:bottom-0.5 before:left-0.5
        before:border before:border-[var(--color-action-cta)]/30 before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-1.5 after:left-1.5
        after:border after:border-[var(--color-border)]/50 after:-z-10`,

    double:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:bottom-0.5 before:right-0.5
        before:border before:border-[var(--color-action-cta)]/30 before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-1.5 after:right-1.5
        after:border after:border-[var(--color-border)]/50 after:-z-10`,

    "rounded-top":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:right-0.5
        before:border before:border-[var(--color-action-cta)]/30
        before:rounded-t-xs before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:top-1.5 after:right-1.5
        after:border after:border-[var(--color-border)]/50
        after:rounded-t-xs after:-z-10`,

    "rounded-all":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-1/2 before:left-1/2
        before:-translate-x-1/2 before:-translate-y-1/2
        before:border before:border-[var(--color-action-cta)]/30
        before:rounded-full before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:top-1/2 after:left-1/2
        after:-translate-x-1/2 after:-translate-y-1/2
        after:border after:border-[var(--color-border)]/50
        after:rounded-full after:-z-10`,

    dashed:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:right-0.5
        before:border before:border-dashed before:border-[var(--color-action-cta)]/20
        before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-0.5 after:left-0.5
        after:border after:border-dashed after:border-[var(--color-border)]/40
        after:-z-10`,

    dotted:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:left-0.5
        before:border before:border-dotted before:border-[var(--color-action-cta)]/30
        before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-0.5 after:right-0.5
        after:border after:border-dotted after:border-[var(--color-border)]/40
        after:-z-10`,

    "double-corner":
        `relative
        before:content-[''] before:absolute before:w-3 before:h-3
        before:top-0 before:left-0
        before:border-l before:border-t
        before:border-[var(--color-action-cta)]/40 before:-z-10

        after:content-[''] after:absolute after:w-3 after:h-3
        after:bottom-0 after:right-0
        after:border-r before:border-b
        after:border-[var(--color-border)] after:-z-10`,
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
                unoptimized
            />
        </div>
    );
}