"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";
import { ChevronRight } from "lucide-react";

interface TopBarAdProps {
  ads: TAdvertisement[];
}

export default function TopBarAd({ ads }: TopBarAdProps) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!ads || ads.length === 0) return null;

  const repeated = [...ads, ...ads, ...ads];
  const duration = `${Math.max(ads.length * 9, 18)}s`;

  return (
    <div
      role="region"
      aria-label="Anuncios y promociones de la tienda"
      className="relative flex h-10 w-full select-none items-center overflow-hidden bg-surface-inverse text-text-inverse transition-colors"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
      `}</style>

      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface-inverse to-transparent" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface-inverse to-transparent" 
      />

      <div
        ref={trackRef}
        className="flex h-full w-max flex-nowrap whitespace-nowrap items-center will-change-transform"
        style={{
          animation: `marquee ${duration} linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {repeated.map((ad, i) => {
          const content = (
            <span
              className={`group flex h-full flex-nowrap whitespace-nowrap items-center gap-2 px-6 text-[12px] tracking-tight transition-opacity duration-normal ${
                ad.linkTo ? "cursor-pointer hover:opacity-80" : "cursor-default"
              }`}
            >
              <span className="font-semibold tracking-wide whitespace-nowrap text-text-inverse">
                {ad.title}
              </span>

              {ad.subtitle && (
                <>
                  <span className="select-none whitespace-nowrap text-text-tertiary">·</span>
                  <span className="font-medium whitespace-nowrap text-text-disabled">
                    {ad.subtitle}
                  </span>
                </>
              )}

              {ad.linkTo && (
                <span className="inline-flex items-center whitespace-nowrap text-text-disabled transition-all duration-normal group-hover:translate-x-1 group-hover:text-text-inverse">
                  <span className="sr-only">Ver más detalles</span>
                  <ChevronRight size={14} strokeWidth={2.5} className="ml-0.5" />
                </span>
              )}

              <span 
                aria-hidden="true" 
                className="ml-6 h-3.5 w-[1px] bg-brand-primary-lighter" 
              />
            </span>
          );

          return ad.linkTo ? (
            <Link
              key={`${ad._id || i}-${i}`}
              href={ad.linkTo}
              prefetch={false}
              className="inline-flex h-full flex-nowrap whitespace-nowrap items-center rounded-radius-sm outline-none focus-visible:ring-2 focus-visible:ring-surface-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-inverse"
            >
              {content}
            </Link>
          ) : (
            <div key={`${ad._id || i}-${i}`} className="inline-flex h-full flex-nowrap whitespace-nowrap items-center">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}