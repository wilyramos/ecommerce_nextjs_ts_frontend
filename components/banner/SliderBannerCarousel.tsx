"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselArrow } from "./CarouselArrow";

interface Props {
    banners: SliderBanner[];
    height?: {
        mobile?: string;
        desktop?: string;
    };
}

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

export default function SliderBannerCarousel({
    banners,
    height = { mobile: "420px", desktop: "auto" },
}: Props) {
    if (!banners.length) return null;

    const autoPlaySpeed = 8000;

    return (
        <div
            className="relative w-full overflow-hidden md:[aspect-ratio:36/9]"
            style={{
                "--banner-h-mobile": height.mobile,
            } as React.CSSProperties}
        >
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={autoPlaySpeed}
                arrows={banners.length > 1}
                showDots={false}
                containerClass="w-full h-full"
                itemClass="h-[var(--banner-h-mobile)] md:h-full [aspect-ratio:36/9] w-full flex"
                sliderClass="h-[var(--banner-h-mobile)] md:h-full"
                customLeftArrow={<CarouselArrow direction="left" />}
                customRightArrow={<CarouselArrow direction="right" />}
            >
                {banners.map((banner, index) => (
                    <SliderBannerSlide key={banner._id || index} banner={banner} />
                ))}
            </Carousel>

            {/* Capa de degradado en la parte inferior para suavizar el corte */}
            <div 
                className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none z-[1]" 
                aria-hidden="true"
            />
        </div>
    );
}