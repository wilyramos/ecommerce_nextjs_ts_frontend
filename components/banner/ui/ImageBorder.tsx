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

const FRAME_OUTER = "before:w-[44%] before:h-[44%]";
const FRAME_INNER = "after:w-[36%] after:h-[36%]";

const borderClasses: Record<string, string> = {
    none: "",

    "curved-frame":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-1/2 before:left-1/2
        before:-translate-x-1/2 before:-translate-y-[42%]
        before:border before:border-[var(--color-accent-warm)]
        before:rounded-xs before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:top-1/2 after:left-1/2
        after:-translate-x-1/2 after:translate-y-[14%]
        after:border after:border-[var(--color-text-secondary)]/40
        after:rounded-xs after:-z-10`,

    simple:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:bottom-0.5 before:left-0.5
        before:border before:border-[var(--color-accent-warm)] before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-2 after:left-2
        after:border after:border-[var(--color-text-secondary)]/40 after:-z-10`,

    double:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:bottom-0.5 before:right-0.5
        before:border before:border-[var(--color-accent-warm)] before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-2 after:right-2
        after:border after:border-[var(--color-text-secondary)]/40 after:-z-10`,

    "rounded-top":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:right-0.5
        before:border before:border-[var(--color-accent-warm)]
        before:rounded-t-xs before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:top-2 after:right-2
        after:border after:border-[var(--color-text-secondary)]/40
        after:rounded-t-xs after:-z-10`,

    "rounded-all":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-1/2 before:left-1/2
        before:-translate-x-1/2 before:-translate-y-1/2
        before:border before:border-[var(--color-accent-warm)]
        before:rounded-full before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:top-1/2 after:left-1/2
        after:-translate-x-1/2 after:-translate-y-1/2
        after:border after:border-[var(--color-text-secondary)]/30
        after:rounded-full after:-z-10`,

    dashed:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:right-0.5
        before:border before:border-dashed before:border-[var(--color-accent-warm)]
        before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-0.5 after:left-0.5
        after:border after:border-dashed after:border-[var(--color-text-secondary)]/50
        after:-z-10`,

    dotted:
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:left-0.5
        before:border before:border-dotted before:border-[var(--color-accent-warm)]
        before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-0.5 after:right-0.5
        after:border after:border-dotted after:border-[var(--color-text-secondary)]/40
        after:-z-10`,

    "double-corner":
        `relative
        before:content-[''] before:absolute ${FRAME_OUTER}
        before:top-0.5 before:left-0.5
        before:border-l-2 before:border-t-2
        before:border-[var(--color-accent-warm)] before:-z-10

        after:content-[''] after:absolute ${FRAME_INNER}
        after:bottom-0.5 after:right-0.5
        after:border-r-2 after:border-b-2
        after:border-[var(--color-text-secondary)]/40 after:-z-10`,
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