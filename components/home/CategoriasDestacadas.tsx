// components/home/CategoriasDestacadas.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

import type { CategoryListResponse } from "@/src/schemas/category.schema";
import { routes } from "@/lib/routes";

export default function CategoriasDestacadas({
  categorias,
}: {
  categorias: CategoryListResponse;
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const categoriasVisibles = categorias.slice(0, 12);

  return (
    <section className="w-full select-none">
      {/* Contenedor viewport de Embla */}
      <div className="overflow-hidden py-2" ref={emblaRef}>
        {/* Contenedor de slides de Embla */}
        <div className="flex -ml-4">
          {categoriasVisibles.map((c, index) => (
            <motion.div
              key={c._id}
              className="min-w-0 shrink-0 pl-4 basis-1/5 sm:basis-[14.28%] md:basis-[12.5%] xl:basis-[11.11%]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={routes.catalog({ category: c.slug })}
                className="group flex flex-col items-center w-full outline-none focus-visible:ring-2 focus-visible:ring-border-strong rounded-xl p-1"
              >
                <div className="relative flex aspect-square w-[72px] sm:w-[90px] md:w-[110px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-secondary transition-all duration-300 ease-out group-hover:bg-surface-tertiary group-hover:scale-[1.02]">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.nombre}
                      fill
                      className="object-contain p-3 sm:p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      unoptimized
                      sizes="(max-width: 640px) 72px, (max-width: 1024px) 90px, 110px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-tertiary transition-colors duration-300 group-hover:text-text-secondary">
                      <ImageOff size={24} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <span className="mt-3 line-clamp-2 w-full text-center text-[10px] sm:text-xs font-medium tracking-tight text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
                  {c.nombre}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}