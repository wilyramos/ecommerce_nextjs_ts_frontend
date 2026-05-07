// File: src/components/banner/SliderBannerCarousel.tsx
"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselDot } from "./CarouselDot";
import { CarouselArrow } from "./CarouselArrow";

interface Props {
    banners: SliderBanner[];
}

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

export default function SliderBannerCarousel({ banners }: Props) {
    if (!banners.length) return null;

    const autoPlaySpeed = 5000;

    return (
        <div className="relative w-full max-w-screen-2xl mx-auto">
            <Carousel
                responsive={responsive}
                infinite
                autoPlay
                autoPlaySpeed={autoPlaySpeed}
                arrows={banners.length > 1}
                showDots={banners.length > 1}
                containerClass="w-full"
                dotListClass="!bottom-4 md:!bottom-6"
                customDot={<CarouselDot autoPlaySpeed={autoPlaySpeed} />}
                customLeftArrow={<CarouselArrow direction="left" />}
                customRightArrow={<CarouselArrow direction="right" />}
            >
                {banners.map((banner) => (
                    <SliderBannerSlide key={banner._id} banner={banner} />
                ))}
            </Carousel>
        </div>
    );
}