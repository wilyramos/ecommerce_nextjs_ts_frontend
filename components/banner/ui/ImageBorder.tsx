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

const borderClasses: Record<string, string> = {
    none: "",

    "curved-frame":
        "relative " +
        "before:content-[''] before:absolute before:w-[85%] before:h-[85%] before:-top-4 before:-right-4 before:border-[2px] before:border-[var(--color-accent-warm)]  before:-z-10 " +
        "after:content-[''] after:absolute after:w-[75%] after:h-[75%] after:-top-8 after:-right-8 after:border-[2px] after:border-[var(--color-accent-warm)]/50  after:-z-20",

    simple:
        "relative " +
        "before:content-[''] before:absolute before:w-[90%] before:h-[90%] before:-bottom-4 before:-left-4 before:border-[2px] before:border-[var(--color-accent-warm)] before:bg-[var(--color-accent-warm)]/10 before:-z-10 " +
        "after:content-[''] after:absolute after:w-[80%] after:h-[80%] before:-bottom-8 before:-left-8 after:border-[2px] after:border-[var(--color-accent-warm)]/50  after:-z-20",

    double:
        "relative " +
        "before:content-[''] before:absolute before:w-[92%] before:h-[92%] before:-bottom-3 before:-right-3 before:border-[2px] before:border-[var(--color-accent-warm)] before:bg-[var(--color-accent-warm)]/10 before:-z-10 " +
        "after:content-[''] after:absolute after:w-[85%] after:h-[85%] after:-bottom-6 after:-right-6 after:border-[2px] after:border-[var(--color-accent-warm)]/40  after:-z-20",

    "rounded-top":
        "relative " +
        "before:content-[''] before:absolute before:w-[85%] before:h-[85%] before:-top-4 before:-right-4 before:border-[2px] before: before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[75%] after:h-[75%] after:-top-8 after:-right-8 after:border-[2px] after: after:border-[var(--color-accent-warm)]/40 after:-z-20",

    "rounded-all":
        "relative " +
        "before:content-[''] before:absolute before:w-[85%] before:h-[85%] before:-top-4 before:-left-4 before:border-[2px] before:border-[var(--color-text-primary)]  before:-z-10 " +
        "after:content-[''] after:absolute after:w-[85%] after:h-[85%] after:-bottom-4 after:-right-4 after:border-[2px] after:border-[var(--color-accent-warm)]/40  after:-z-20",

    dashed:
        "relative " +
        "before:content-[''] before:absolute before:w-[90%] before:h-[90%] before:-top-4 before:-right-4 before:border-[2px] before: before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[85%] after:h-[85%] after:-bottom-4 after:-left-4 after:border-[2px] after: after:border-[var(--color-accent-warm)]/50 after:-z-20",

    dotted:
        "relative " +
        "before:content-[''] before:absolute before:w-[90%] before:h-[90%] before:translate-x-4 before:translate-y-4 before:border-[3px] before:border-dotted before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[80%] after:h-[80%] after:translate-x-8 after:translate-y-8 after:border-[3px] after:border-dotted after:border-[var(--color-accent-warm)]/50 after:-z-20",

    "double-corner":
        "relative " +
        "before:content-[''] before:absolute before:w-[90%] before:h-[90%] before:-top-4 before:-left-4 before:border-l-[4px] before:border-b-[4px] before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[80%] after:h-[80%] after:-top-8 after:-left-8 after:border-l-[4px] after:border-b-[4px] after:border-[var(--color-accent-warm)]/40 after:-z-20",

    floating:
        "relative " +
        "before:content-[''] before:absolute before:w-[90%] before:h-[90%] before:-bottom-4 before:-right-4 before:bg-[var(--color-accent-warm)]/20 before:backdrop-blur-sm before:-z-10 " +
        "after:content-[''] after:absolute after:w-[80%] after:h-[80%] after:-bottom-8 after:-right-8 after:bg-[var(--color-accent-warm)]/10 after:-z-20",

    "film-frame":
        "relative " +
        "before:content-[''] before:absolute before:w-[95%] before:h-[95%] before:translate-x-3 before:translate-y-3 before:bg-[var(--color-accent-warm)]/90 before:-z-10 " +
        "after:content-[''] after:absolute after:w-[90%] after:h-[90%] after:translate-x-6 after:translate-y-6 after:bg-[var(--color-accent-warm)]/40 after:-z-20",

    asymmetric:
        "relative " +
        "before:content-[''] before:absolute before:w-[85%] before:h-[85%] before:-top-4 before:-right-4 before:bg-[var(--color-accent-warm)]/10 before:border-t-[4px] before:border-r-[4px] before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[85%] after:h-[85%] after:-bottom-4 after:-left-4  after:border-b-[4px] after:border-l-[4px] after:border-[var(--color-accent-warm)]/60 after:-z-20",

    "glass-effect":
        "relative " +
        "before:content-[''] before:absolute before:w-[90%] before:h-[90%] before:-top-4 before:-left-4 before:border-[2px] before:border-[var(--color-accent-warm)]/80 before:bg-[var(--color-accent-warm)]/10 before:backdrop-blur-md before:-z-10 " +
        "after:content-[''] after:absolute after:w-[80%] after:h-[80%] after:-top-8 after:-left-8 after:border-[2px] after:border-[var(--color-accent-warm)]/30  after:-z-20",

    "neon-glow":
        "relative " +
        "before:content-[''] before:absolute before:w-[92%] before:h-[92%] before:translate-x-3 before:translate-y-3 before:border-[2px] before:border-[var(--color-accent-warm)] before:shadow-[0_0_20px_var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[85%] after:h-[85%] after:translate-x-6 after:translate-y-6 after:border-[2px] after:border-[var(--color-accent-warm)]/40 after:shadow-[0_0_30px_var(--color-accent-warm)] after:-z-20",

    "minimal-frame":
        "relative " +
        "before:content-[''] before:absolute before:w-[88%] before:h-[88%] before:-bottom-3 before:-right-3 before:bg-[var(--color-accent-warm)]/10 before:-z-10 " +
        "after:content-[''] after:absolute after:w-[78%] after:h-[78%] after:-bottom-6 after:-right-6  after:-z-20",

    "diagonal-cut":
        "relative " +
        "before:content-[''] before:absolute before:w-[85%] before:h-[85%] before:-top-4 before:-right-4 before:bg-[var(--color-accent-warm)]/10 before:border-[2px] before:border-[var(--color-accent-warm)] before:-z-10 " +
        "after:content-[''] after:absolute after:w-[85%] after:h-[85%] after:-bottom-4 after:-left-4  after:border-[2px] after:border-[var(--color-accent-warm)]/60 after:-z-20",
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