// File: frontend/components/banner/ui/SliderPrice.tsx

import type { SliderPrice as TSliderPrice } from "@/src/schemas/slider.schema";
import { Price, BadgeText, Small } from "@/components/ui/TypographyStore";

interface Props {
    price: TSliderPrice;
    textColor: string;
    accentColor: string;
    isDark: boolean;
}

export default function SliderPrice({ price, textColor, accentColor, isDark }: Props) {
    const currencySymbol = "S/";

    return (
        <div
            className="inline-flex flex-col gap-1 w-fit select-none"
            style={{ color: textColor }}
        >
            {price.label && (
                <BadgeText
                    className="w-fit text-white px-2 py-0.5"
                    style={{ backgroundColor: accentColor }}
                >
                    {price.label}
                </BadgeText>
            )}

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {price.current !== undefined && price.current !== null && (
                    <Price className="leading-none text-[clamp(1.4rem,4.5vw,3rem)] font-semibold tracking-tight text-inherit">
                        <span
                            className="mr-1 align-top text-[0.4em] font-medium"
                            style={{ opacity: isDark ? 0.6 : 0.5 }}
                        >
                            {currencySymbol}
                        </span>

                        {price.current.toFixed(2)}

                        {price.suffix && (
                            <Small
                                className="ml-1.5 align-baseline text-[0.35em] uppercase tracking-wider text-inherit"
                                style={{ opacity: isDark ? 0.6 : 0.5 }}
                            >
                                {price.suffix}
                            </Small>
                        )}
                    </Price>
                )}

                {price.compare !== undefined && price.compare !== null && (
                    <Price
                        className="text-xs sm:text-sm md:text-base line-through font-normal text-inherit"
                        style={{ opacity: isDark ? 0.4 : 0.3 }}
                    >
                        {currencySymbol}{price.compare.toFixed(2)}
                    </Price>
                )}
            </div>
        </div>
    );
}