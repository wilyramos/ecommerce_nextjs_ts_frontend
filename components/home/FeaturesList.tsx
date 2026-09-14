// components/home/FeaturesList.tsx
"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

type Feature = {
  title: ReactNode;
  subtitle?: string;
  imageSrc?: string;
  icon?: ReactNode;
};

const features: Feature[] = [
  {
    title: "100% Originales",
    imageSrc: "/features/original.png",
  },
  {
    title: (
      <>
        Envío <span className="font-semibold text-text-primary">GRATIS*</span>
      </>
    ),
    imageSrc: "/features/envio-gratis.png",
  },
  {
    title: "Todo el Perú",
    subtitle: "Envíos asegurados",
    imageSrc: "/features/envio-a-todo-el-peru.png",
  },
  {
    title: "Pagos Seguros",
    subtitle: "Yape, Plin y Tarjetas",
    imageSrc: "/payments/culqi.png",
  },
  {
    title: "Garantía Oficial",
    imageSrc: "/features/garantia.png",
  },
  {
    title: "Entrega Inmediata",
    subtitle: "Todo Cañete",
    icon: <Zap size={18} className="text-brand-accent" />,
  },
];



export default function FeaturesList() {
  return (
    <div className="mx-auto w-full max-w-7xl select-none">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10px" }}
        className="grid grid-cols-2 gap-3 rounded-[1.25rem] border border-border-primary/50 bg-surface-primary/70 p-1 backdrop-blur-xl xs:grid-cols-3 md:flex md:items-center md:justify-between md:gap-4 md:px-4 md:py-1"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 transition-colors duration-300 ease-out hover:bg-surface-secondary/80 md:justify-center"
          >
            {/* Contenedor del ícono: Fondo neutro, sin bordes duros, escalado suave en hover */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-secondary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 sm:h-10 sm:w-10">
              {feature.imageSrc ? (
                <Image
                  src={feature.imageSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="h-4 w-4 object-contain sm:h-5 sm:w-5"
                  unoptimized
                />
              ) : (
                feature.icon
              )}
            </div>

            {/* Tipografía: Tracking ajustado, transición de color suave */}
            <div className="flex min-w-0 flex-col justify-center">
              <span className="truncate text-[11px] font-medium leading-tight tracking-tight text-text-secondary transition-colors duration-300 group-hover:text-text-primary sm:text-xs">
                {feature.title}
              </span>
              {feature.subtitle && (
                <span className="mt-0.5 truncate text-[10px] font-normal leading-none tracking-tight text-text-tertiary sm:text-[11px]">
                  {feature.subtitle}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}