"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageOnly({ banner }: { banner: SliderBanner }) {
  const { media, title, destUrl, openInNewTab, design } = banner;
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = Boolean(media?.videoUrl);
  const bg = design.bgColor ?? "#000000";

  const content = (
    <div
      className="group relative h-full w-full overflow-hidden select-none"
      style={{ backgroundColor: bg }}
    >
      {isVideo && media?.videoUrl ? (
        <video
          ref={videoRef}
          src={media.videoUrl}
          poster={media.imageUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full pointer-events-none flex items-center justify-center">
          {media?.imageUrl && (
            <Image
              src={media.imageUrl}
              alt={title || "Banner"}
              fill
              className={`h-full w-full ${media.mobileImageUrl ? "max-md:hidden" : ""} ${
                media.objectFit === "contain" ? "object-contain" : "object-cover"
              }`}
              sizes="100vw"
              priority
              unoptimized
            />
          )}

          {media?.mobileImageUrl && (
            <Image
              src={media.mobileImageUrl}
              alt={title || "Banner móvil"}
              fill
              className={`h-full w-full md:hidden ${
                media.objectFit === "contain" ? "object-contain" : "object-cover"
              }`}
              sizes="100vw"
              priority
              unoptimized
            />
          )}
        </div>
      )}
    </div>
  );

  if (!destUrl) return content;

  return (
    <Link
      href={destUrl}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className="relative block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-inset"
      aria-label={title || "Ver promoción"}
    >
      {content}
    </Link>
  );
}