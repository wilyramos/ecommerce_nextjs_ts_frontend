// File: frontend/app/(store)/colecciones/page.tsx

import Link from "next/link";
import Image from "next/image";
import { getActiveCollections } from "@/src/services/collection-service";
import type { Metadata } from "next";
import type { Collection, CollectionType } from "@/src/schemas/collection.schema";

export const metadata: Metadata = {
    title: "Colecciones | GoPhone",
    description: "Explora nuestras colecciones temáticas. Encuentra lo que buscas por categoría, temporada u ocasión.",
};

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
    promotion: "Promoción",
    theme:     "Temática",
    editorial: "Editorial",
    seasonal:  "Temporada",
};

function PromotionBadge({ col }: { col: Collection }) {
    if (col.type !== "promotion") return null;

    const now      = new Date();
    const endsAt   = col.endsAt   ? new Date(col.endsAt)   : null;
    const startsAt = col.startsAt ? new Date(col.startsAt) : null;

    const isLive    = startsAt && endsAt && startsAt <= now && endsAt >= now;
    const isExpired = endsAt && endsAt < now;

    if (isExpired) return null;

    return (
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {col.badgeLabel && (
                <span
                    className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm text-white"
                    style={{ backgroundColor: col.badgeColor ?? "#ef4444" }}
                >
                    {col.badgeLabel}
                </span>
            )}
            {isLive && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-emerald-500 text-white">
                    En curso
                </span>
            )}
            {!isLive && startsAt && startsAt > now && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-amber-500 text-white">
                    Próximamente
                </span>
            )}
        </div>
    );
}

function CollectionCard({ col }: { col: Collection }) {
    const heroImage = col.bannerImage || col.image;

    return (
        <Link
            href={`/colecciones/${col.slug}`}
            className="group relative overflow-hidden bg-background-secondary
                       hover:border-foreground/20 transition-all duration-200 hover:shadow-md"
        >
            {/* Imagen o bloque de color */}
            <div
                className="relative w-full aspect-[4/3] overflow-hidden"
                style={{ backgroundColor: col.color ?? "var(--color-background-secondary)" }}
            >
                {heroImage && (
                    <Image
                        src={heroImage}
                        alt={col.name}
                        fill
                        unoptimized
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <PromotionBadge col={col} />
            </div>

            {/* Info */}
            <div className="p-3">
                <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                        {col.icon && (
                            <span className="text-base leading-none shrink-0" aria-hidden="true">
                                {col.icon}
                            </span>
                        )}
                        <span className="text-sm font-semibold text-foreground truncate">
                            {col.name}
                        </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">
                        {COLLECTION_TYPE_LABELS[col.type]}
                    </span>
                </div>

                {col.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {col.description}
                    </p>
                )}

                {/* Fechas solo para promociones vigentes */}
                {col.type === "promotion" && col.startsAt && col.endsAt && (
                    <p className="text-[10px] font-mono text-muted-foreground mt-1.5">
                        {new Date(col.startsAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                        {" → "}
                        {new Date(col.endsAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                )}
            </div>
        </Link>
    );
}

// Agrupa y ordena: promociones activas primero, luego el resto por order
function groupCollections(collections: Collection[]) {
    const now = new Date();

    const promotionsActive = collections.filter(c =>
        c.type === "promotion" &&
        c.startsAt && c.endsAt &&
        new Date(c.startsAt) <= now &&
        new Date(c.endsAt)   >= now
    );

    const promotionsPending = collections.filter(c =>
        c.type === "promotion" &&
        c.startsAt &&
        new Date(c.startsAt) > now
    );

    const rest = collections.filter(c =>
        !promotionsActive.includes(c) && !promotionsPending.includes(c)
    );

    return { promotionsActive, promotionsPending, rest };
}

export default async function CollectionsIndexPage() {
    const collections = await getActiveCollections();
    const { promotionsActive, promotionsPending, rest } = groupCollections(collections);

    return (
        <section className="container mx-auto px-4 md:px-6 max-w-[1440px] py-10 space-y-10">

            <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Colecciones</h1>
                <p className="text-sm text-muted-foreground">
                    Explora nuestras selecciones temáticas
                </p>
            </div>

            {collections.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No hay colecciones disponibles por el momento.
                </p>
            ) : (
                <>
                    {/* Promociones activas */}
                    {promotionsActive.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Promociones activas
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {promotionsActive.map(col => (
                                    <CollectionCard key={col._id} col={col} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Próximas promociones */}
                    {promotionsPending.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Próximamente
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {promotionsPending.map(col => (
                                    <CollectionCard key={col._id} col={col} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resto de colecciones */}
                    {rest.length > 0 && (
                        <div className="space-y-3">
                            {(promotionsActive.length > 0 || promotionsPending.length > 0) && (
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Todas las colecciones
                                </h2>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {rest.map(col => (
                                    <CollectionCard key={col._id} col={col} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}