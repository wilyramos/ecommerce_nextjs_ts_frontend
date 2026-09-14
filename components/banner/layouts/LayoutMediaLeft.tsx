"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { H2, P, Small } from "@/components/ui/TypographyV3";

export default function LayoutMediaLeft({ banner }: { banner: SliderBanner }) {
  const { design, media, title, subtitle, description, terms, price, destUrl, openInNewTab } = banner;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const isDark = design.theme !== "light";
  const bg = design.bgColor ?? (isDark ? "#000000" : "#fbfbfd");
  const titleColor = isDark ? "#ffffff" : "#1d1d1f";
  const textColor = isDark ? "#86868b" : "#515154";
  const accent = design.accentColor ?? "#0071e3";

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0px)" : "translateY(15px)",
    transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const content = (
    <div
      className="group relative h-full w-full overflow-hidden select-none"
      style={{ backgroundColor: bg }}
    >
      {/* 
        Móvil (1x1): flex-col-reverse -> El texto queda abajo (h-1/2) y la imagen arriba (h-1/2)
        Desktop (36/9): flex-row -> Imagen a la izquierda (w-1/2), texto derecha (w-1/2)
      */}
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col-reverse md:flex-row items-center justify-between">
        
        {/* Lado Imagen */}
        {media?.imageUrl && (
          <div
            className="relative h-1/2 w-full flex-1 overflow-hidden pointer-events-none md:h-full md:w-1/2 flex items-center justify-center pt-8 md:pt-0"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            <div className="absolute inset-0 h-full w-full">
              {/* Imagen Desktop */}
              <Image
                src={media.imageUrl}
                alt={title || "Dispositivo"}
                fill
                className={`h-full w-full ${media.mobileImageUrl ? "max-md:hidden" : ""} ${
                  media.objectFit === "contain" ? "object-contain md:scale-90" : "object-cover"
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />

              {/* Imagen Móvil */}
              {media.mobileImageUrl && (
                <Image
                  src={media.mobileImageUrl}
                  alt={title || "Dispositivo móvil"}
                  fill
                  className={`h-full w-full md:hidden ${
                    media.objectFit === "contain" ? "object-contain scale-90" : "object-cover"
                  }`}
                  sizes="100vw"
                  priority
                  unoptimized
                />
              )}
            </div>
          </div>
        )}

        {/* Lado Texto */}
        <div className="box-border flex h-1/2 w-full shrink-0 flex-col justify-center items-center text-center px-6 pb-12 md:pb-0 md:h-full md:items-start md:text-left md:w-1/2 md:px-16 lg:px-24">
          <div className="flex w-full flex-col gap-1.5 md:gap-4 max-w-xl">
            {subtitle && (
              <div style={fadeUp(0.1)}>
                <span
                  className="inline-block text-[11px] md:text-[13px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: accent }}
                >
                  {subtitle}
                </span>
              </div>
            )}

            {title && (
              <div style={fadeUp(0.15)}>
                <H2
                  className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ color: titleColor }}
                >
                  {title}
                </H2>
              </div>
            )}

            {description && (
              <div style={fadeUp(0.2)}>
                <P
                  className="mt-1 text-sm leading-relaxed md:text-lg lg:text-xl md:leading-relaxed text-balance line-clamp-2 md:line-clamp-3"
                  style={{ color: textColor }}
                >
                  {description}
                </P>
              </div>
            )}

            {price?.current !== undefined && price.current !== null && (
              <div style={fadeUp(0.25)} className="mt-3 md:mt-4 flex justify-center md:justify-start">
                <SliderPrice
                  price={price}
                  textColor={textColor}
                  accentColor={accent}
                  isDark={isDark}
                />
              </div>
            )}

            {terms && (
              <div style={fadeUp(0.3)} className="mt-4 hidden sm:block md:mt-8">
                <Small
                  className="block text-[10px] md:text-[12px] tracking-wide"
                  style={{ color: textColor, opacity: 0.6 }}
                >
                  {terms}
                </Small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!destUrl) return content;

  return (
    <Link
      href={destUrl}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-inset"
      aria-label={title || "Ver detalles"}
    >
      {content}
    </Link>
  );
}