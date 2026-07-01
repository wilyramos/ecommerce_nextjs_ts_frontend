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
            className="banner-slot group relative w-full h-full overflow-hidden"
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
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 w-full h-full">
                    {/* Imagen Desktop */}
                    {media?.imageUrl && (
                        <Image
                            src={media.imageUrl}
                            alt={title || "Slider Banner Image"}
                            fill
                            className={`w-full h-full ${media.mobileImageUrl ? "max-md:hidden" : ""} ${
                                media.objectFit === "contain" ? "object-contain" : "object-cover"
                            }`}
                            sizes="100vw"
                            priority
                            unoptimized
                        />
                    )}

                    {/* Imagen Mobile 1x1 */}
                    {media?.mobileImageUrl && (
                        <Image
                            src={media.mobileImageUrl}
                            alt={title || "Slider Banner Mobile Image"}
                            fill
                            className="md:hidden w-full h-full object-cover"
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
            className="w-full block"
            aria-label={title || "Slider Banner Link"}
        >
            {content}
        </Link>
    );
}