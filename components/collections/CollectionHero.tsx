// File: frontend/components/collections/CollectionHero.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import type { CatalogResponse } from "@/src/schemas/catalog";

interface Props {
    context: CatalogResponse["context"];
}

function PromotionBadge({ label, color }: { label: string; color?: string | null }) {
    return (
        <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm text-white"
            style={{ backgroundColor: color ?? "#ef4444" }}
        >
            {label}
        </span>
    );
}

function PromotionCountdown({ endsAt }: { endsAt: Date }) {
    const now      = new Date();
    const diff     = endsAt.getTime() - now.getTime();
    if (diff <= 0) return null;

    const days     = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours    = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const parts: string[] = [];
    if (days)    parts.push(`${days}d`);
    if (hours)   parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);

    return (
        <p className="text-xs font-mono text-white/80">
            Termina en <span className="font-bold text-white">{parts.join(" ")}</span>
        </p>
    );
}

export default function CollectionHero({ context }: Props) {
    const {
        collectionName,
        collectionDesc,
        collectionImage,
        collectionBannerImage,
        collectionColor,
        collectionIcon,
        collectionType,
        collectionBadgeLabel,
        collectionBadgeColor,
        collectionStartsAt,
        collectionEndsAt,
    } = context;

    // Banner tiene prioridad sobre imagen destacada
    const heroImage        = collectionBannerImage || collectionImage;
    const hasImage         = Boolean(heroImage);
    const isPromotion      = collectionType === "promotion";

    const textColorClass   = hasImage ? "text-white"           : "text-foreground";
    const subtextColorClass = hasImage ? "text-white/80"       : "text-muted-foreground";
    const breadcrumbClass  = hasImage ? "text-white/70"        : "text-muted-foreground";

    const now      = new Date();
    const endsAt   = collectionEndsAt   ? new Date(collectionEndsAt)   : null;
    const startsAt = collectionStartsAt ? new Date(collectionStartsAt) : null;
    const isLive   = isPromotion && startsAt && endsAt
        && startsAt <= now && endsAt >= now;

    return (
        <div className="relative w-full overflow-hidden" style={{ minHeight: "220px" }}>

            {/* ── FONDO ── */}
            {hasImage ? (
                <Image
                    src={heroImage!}
                    alt={collectionName ?? "Colección"}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                    unoptimized
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: collectionColor || "#f4f4f5" }}
                />
            )}

            {hasImage && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            )}

            {/* ── CONTENIDO ── */}
            <div
                className="relative z-10 container mx-auto px-4 py-12 flex flex-col justify-end gap-2"
                style={{ minHeight: "220px" }}
            >
                {/* Breadcrumb */}
                <nav className={`flex items-center gap-1.5 text-xs ${breadcrumbClass}`}>
                    <Link href="/" className="hover:text-action-cta transition-colors">Inicio</Link> /
                    <Link href="/colecciones" className="hover:text-action-cta transition-colors">Colecciones</Link> /
                    <span className={`font-medium ${textColorClass}`}>{collectionName}</span>
                </nav>

                {/* Badge de promoción */}
                {isPromotion && collectionBadgeLabel && (
                    <div>
                        <PromotionBadge
                            label={collectionBadgeLabel}
                            color={collectionBadgeColor}
                        />
                    </div>
                )}

                {/* Título */}
                <div className="flex items-center gap-3">
                    {collectionIcon && (
                        <span className="text-4xl">{collectionIcon}</span>
                    )}
                    <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${textColorClass}`}>
                        {collectionName}
                    </h1>
                </div>

                {/* Descripción */}
                {collectionDesc && (
                    <p className={`max-w-xl text-sm md:text-base ${subtextColorClass}`}>
                        {collectionDesc}
                    </p>
                )}

                {/* Countdown para promociones activas */}
                {isLive && endsAt && (
                    <PromotionCountdown endsAt={endsAt} />
                )}

                {/* Fechas de vigencia */}
                {isPromotion && startsAt && endsAt && (
                    <p className={`text-[10px] font-mono ${subtextColorClass}`}>
                        {startsAt.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                        {" → "}
                        {endsAt.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                )}
            </div>
        </div>
    );
}