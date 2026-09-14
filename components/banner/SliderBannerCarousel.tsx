// components/home/SliderBannerCarousel.tsx
"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";
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
  height = { mobile: "460px", desktop: "auto" },
}: Props) {
  if (!banners.length) return null;

  const autoPlaySpeed = 7000;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative z-0 w-full overflow-hidden bg-surface-secondary md:[aspect-ratio:36/9] [transform:translateZ(0)]"
      style={
        {
          "--banner-h-mobile": height.mobile,
        } as React.CSSProperties
      }
    >
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={autoPlaySpeed}
        arrows={banners.length > 1}
        showDots={false}
        containerClass="w-full h-full relative z-0"
        itemClass="h-[var(--banner-h-mobile)] md:h-full [aspect-ratio:36/9] w-full flex"
        sliderClass="h-[var(--banner-h-mobile)] md:h-full"
        customLeftArrow={<CarouselArrow direction="left" />}
        customRightArrow={<CarouselArrow direction="right" />}
      >
        {banners.map((banner, index) => (
          <SliderBannerSlide key={banner._id || index} banner={banner} />
        ))}
      </Carousel>
    </motion.div>
  );
}