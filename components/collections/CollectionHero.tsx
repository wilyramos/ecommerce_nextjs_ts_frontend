// File: frontend/components/collections/CollectionHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CatalogResponse } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";

interface Props {
    context: CatalogResponse["context"];
}

function PromotionBadge({ label, color }: { label: string; color?: string | null }) {
    return (
        <span
            className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-inverse shadow-sm backdrop-blur-md rounded-full opacity-90"
            style={{ backgroundColor: color ? color : "var(--status-error)" }}
        >
            {label}
        </span>
    );
}

function PromotionCountdown({ endsAt }: { endsAt: Date }) {
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const parts: string[] = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-inverse/20 bg-surface-inverse/30 px-3 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-warning opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-warning"></span>
            </span>
            <p className="text-xs font-medium text-text-inverse/90">
                Termina en <span className="font-bold text-text-inverse tracking-wide">{parts.join(" ")}</span>
            </p>
        </div>
    );
}

export default function CollectionHero({ context }: Props) {
    const {
        collectionName, collectionDesc, collectionImage, collectionBannerImage,
        collectionColor, collectionIcon, collectionType, collectionBadgeLabel,
        collectionBadgeColor, collectionStartsAt, collectionEndsAt,
    } = context;

    const heroImage = collectionBannerImage || collectionImage;
    const hasImage = Boolean(heroImage);
    const isPromotion = collectionType === "promotion";

    const textColorClass = hasImage ? "text-text-inverse" : "text-text-primary";
    const subtextColorClass = hasImage ? "text-text-inverse/80" : "text-text-secondary";
    const breadcrumbClass = hasImage ? "text-text-inverse/60 hover:text-text-inverse/90" : "text-text-tertiary hover:text-text-primary";

    const now = new Date();
    const endsAt = collectionEndsAt ? new Date(collectionEndsAt) : null;
    const startsAt = collectionStartsAt ? new Date(collectionStartsAt) : null;
    const isLive = isPromotion && startsAt && endsAt && startsAt <= now && endsAt >= now;

    return (
        <div className="w-full px-0 md:px-6 md:pt-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full overflow-hidden rounded-none md:rounded-[2rem] shadow-sm" 
                style={{ minHeight: "320px", backgroundColor: collectionColor || "var(--surface-secondary)" }}
            >
                {/* ── FONDO ── */}
                {hasImage && (
                    <motion.div 
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={heroImage!}
                            alt={collectionName ?? "Colección"}
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="100vw"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-inverse/80 via-surface-inverse/30 to-surface-inverse/10 mix-blend-multiply" />
                    </motion.div>
                )}

                {/* ── CONTENIDO ── */}
                <div className="relative z-10 mx-auto flex min-h-[320px] max-w-7xl flex-col justify-end gap-4 px-5 py-10 md:px-10 md:py-12">
                    
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
                        <Link href="/" className={cn("transition-colors duration-fast", breadcrumbClass)}>Inicio</Link> 
                        <span className="text-current/50">/</span>
                        <Link href="/colecciones" className={cn("transition-colors duration-fast", breadcrumbClass)}>Colecciones</Link> 
                        <span className="text-current/50">/</span>
                        <span className={textColorClass}>{collectionName}</span>
                    </nav>

                    <div className="flex flex-col gap-3">
                        {/* Badges & Countdown */}
                        <div className="flex flex-wrap items-center gap-3">
                            {isPromotion && collectionBadgeLabel && (
                                <PromotionBadge label={collectionBadgeLabel} color={collectionBadgeColor} />
                            )}
                            {isLive && endsAt && <PromotionCountdown endsAt={endsAt} />}
                        </div>

                        {/* Título */}
                        <div className="flex items-center gap-3">
                            {collectionIcon && (
                                <span className="text-4xl md:text-5xl drop-shadow-sm">{collectionIcon}</span>
                            )}
                            <h1 className={cn("text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance drop-shadow-sm", textColorClass)}>
                                {collectionName}
                            </h1>
                        </div>

                        {/* Descripción */}
                        {collectionDesc && (
                            <p className={cn("max-w-2xl text-sm leading-relaxed md:text-base text-balance drop-shadow-sm", subtextColorClass)}>
                                {collectionDesc}
                            </p>
                        )}

                        {/* Fechas */}
                        {isPromotion && startsAt && endsAt && (
                            <p className={cn("mt-2 text-[11px] font-medium uppercase tracking-wider opacity-80", subtextColorClass)}>
                                Válido del {startsAt.toLocaleDateString("es-PE", { day: "2-digit", month: "short" })} al {endsAt.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}