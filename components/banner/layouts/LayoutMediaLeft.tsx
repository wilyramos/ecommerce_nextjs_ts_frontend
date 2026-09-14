// File: frontend/components/banner/layouts/LayoutMediaLeft.tsx
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
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const isDark = design.theme !== "light";
  const bg = design.bgColor ?? (isDark ? "#000000" : "#f5f5f7");
  const titleColor = isDark ? "#ffffff" : "#1d1d1f";
  const textColor = isDark ? "#86868b" : "#515154";
  const accent = design.accentColor ?? "#0071e3";

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0px)" : "translateY(10px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const content = (
    <div
      className="banner-slot group relative h-full w-full overflow-hidden select-none"
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col-reverse md:flex-row">
        {media?.imageUrl && (
          <div
            className="relative h-1/2 w-full flex-1 overflow-hidden pointer-events-none md:h-full md:w-1/2"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={media.imageUrl}
                alt={title || "Dispositivo Apple"}
                fill
                className={`h-full w-full ${media.mobileImageUrl ? "max-md:hidden" : ""} ${
                  media.objectFit === "contain" ? "object-contain" : "object-cover"
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized
              />

              {media.mobileImageUrl && (
                <Image
                  src={media.mobileImageUrl}
                  alt={title || "Dispositivo Apple móvil"}
                  fill
                  className="h-full w-full object-cover md:hidden"
                  sizes="100vw"
                  priority
                  unoptimized
                />
              )}
            </div>
          </div>
        )}

        <div className=" box-border flex w-full shrink-0 flex-col justify-center p-6 sm:p-8 md:w-1/2 md:p-12">
          <div className="flex w-full flex-col gap-1.5 md:gap-2.5">
            {subtitle && (
              <div style={fadeUp(0.1)}>
                <span
                  className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: accent }}
                >
                  {subtitle}
                </span>
              </div>
            )}

            {title && (
              <div style={fadeUp(0.18)}>
                <H2
                  className="line-clamp-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
                  style={{ color: titleColor }}
                >
                  {title}
                </H2>
              </div>
            )}

            {description && (
              <div style={fadeUp(0.26)}>
                <P
                  className="mt-0.5 line-clamp-2 max-w-[38ch] text-xs leading-relaxed sm:text-sm md:line-clamp-3"
                  style={{ color: textColor }}
                >
                  {description}
                </P>
              </div>
            )}

            {price?.current !== undefined && price.current !== null && (
              <div style={fadeUp(0.34)} className="mt-2 md:mt-4">
                <SliderPrice
                  price={price}
                  textColor={textColor}
                  accentColor={accent}
                  isDark={isDark}
                />
              </div>
            )}

            {terms && (
              <div style={fadeUp(0.42)} className="mt-2 hidden sm:block md:mt-4">
                <Small
                  className="block text-[10px] tracking-wide"
                  style={{ color: textColor, opacity: 0.7 }}
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
      className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      aria-label={title || "Ver detalles"}
    >
      {content}
    </Link>
  );
}