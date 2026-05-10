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
        none: {},

        simple: {
            borderLeft: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTop: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTopLeftRadius: "0.375rem",
            paddingLeft: "1rem",
            paddingTop: "0.5rem",
        },

        double: {
            borderRight: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTop: `1px solid ${accentColor}${isDark ? "55" : "35"}`,
            borderTopRightRadius: "0.375rem",
            paddingRight: "1.25rem",
            paddingTop: "0.5rem",
        },

        "rounded-all": {
            border: `1px solid ${accentColor}${isDark ? "33" : "22"}`,
            background: `${accentColor}${isDark ? "08" : "05"}`,
            borderRadius: "0.5rem",
            padding: "0.75rem 1.25rem",
        },

        dashed: {
            paddingBottom: "0.7rem",
            backgroundImage: `
        linear-gradient(
            to right,
            ${accentColor}${isDark ? "88" : "66"} 0%,
            ${accentColor}${isDark ? "88" : "66"} 55%,
            transparent 55%,
            transparent 100%
        )
    `,
            backgroundSize: "14px 1px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "left bottom",
        },

        dotted: {
            border: `1px dotted ${accentColor}${isDark ? "66" : "44"}`,
            borderRadius: "0.125rem",
            padding: "0.5rem 1rem",
        },

        "thick-solid": {
            borderLeft: `2px solid ${accentColor}${isDark ? "aa" : "88"}`,
            paddingLeft: "1rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
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