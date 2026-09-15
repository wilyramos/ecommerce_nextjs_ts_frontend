"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";
import { SliderBannerSlide } from "./SliderBannerSlide";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { CarouselArrow } from "./CarouselArrow";

interface Props {
  banners: SliderBanner[];
}

const responsive = {
  all: { breakpoint: { max: 4000, min: 0 }, items: 1 },
};

// Puntos de paginación idénticos a iOS


export default function SliderBannerCarousel({ banners }: Props) {
  if (!banners.length) return null;

  const autoPlaySpeed = 7000;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      // 1. Usamos TU clase .banner-slot para el tamaño exacto (1x1 en móvil, 36/9 en desktop)
      // 2. Usamos w-[100vw] para romper los márgenes y pegar el banner a los bordes
      className="banner-slot group relative z-0 w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden  md:rounded-3xl "
    >
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={autoPlaySpeed}
        arrows={banners.length > 1}
        showDots={banners.length > 1}
        renderDotsOutside={false}
        containerClass="w-full h-full relative z-0"
        itemClass="h-full w-full flex"
        sliderClass="h-full"
        customLeftArrow={<CarouselArrow direction="left" />}
        customRightArrow={<CarouselArrow direction="right" />}
        dotListClass="absolute bottom-6 md:bottom-10 flex justify-center w-full z-20"
      >
        {banners.map((banner, index) => (
          <SliderBannerSlide key={banner._id || index} banner={banner} />
        ))}
      </Carousel>
    </motion.div>
  );
}