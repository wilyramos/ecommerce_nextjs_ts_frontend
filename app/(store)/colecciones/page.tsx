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
    featured:     "Destacados",
    new_arrivals: "Novedades",
    best_sellers: "Más Vendido",
    on_sale:      "Oferta",
    promotion:    "Promoción",
    theme:        "Temática",
    editorial:    "Editorial",
    seasonal:     "Temporada",
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
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 select-none">
            {col.badgeLabel && (
                <span
                    className="text-[10px] font-bold uppercase px-1.5 py-0.5"
                    style={{ 
                        backgroundColor: "var(--destructive)", 
                        color: "var(--destructive-foreground)" 
                    }}
                >
                    {col.badgeLabel}
                </span>
            )}
            {isLive && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5  bg-success text-primary-foreground shadow-xs">
                    En curso
                </span>
            )}
            {!isLive && startsAt && startsAt > now && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5  bg-warning text-primary-foreground shadow-xs">
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
            className="group relative overflow-hidden"
        >
            {/* Imagen o bloque de color */}
            <div
                className="relative w-full aspect-[4/3] overflow-hidden shrink-0 bg-background-secondary border-b border-border"
                style={{ backgroundColor: col.color ?? "var(--background-secondary)" }}
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
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-200" />
                <PromotionBadge col={col} />
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-grow justify-between bg-card text-card-foreground">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm font-bold text-foreground truncate">
                                {col.name}
                            </span>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 bg-background border border-border px-1 py-0.5  select-none">
                            {COLLECTION_TYPE_LABELS[col.type]}
                        </span>
                    </div>

                    {col.description && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 font-medium">
                            {col.description}
                        </p>
                    )}
                </div>

                {/* Fechas solo para promociones vigentes */}
                {col.type === "promotion" && col.startsAt && col.endsAt && (
                    <p className="text-[10px] font-bold font-mono text-foreground mt-2 pt-2 border-t border-border select-none">
                        {new Date(col.startsAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                        {" → "}
                        {new Date(col.endsAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                )}
            </div>
        </Link>
    );
}

function groupCollections(collections: Collection[]) {
    const now = new Date();
    const publicCollections = collections.filter(c => !c.isSystem);

    const promotionsActive = publicCollections.filter(c =>
        c.type === "promotion" &&
        c.startsAt && c.endsAt &&
        new Date(c.startsAt) <= now &&
        new Date(c.endsAt)   >= now
    );

    const promotionsPending = publicCollections.filter(c =>
        c.type === "promotion" &&
        c.startsAt &&
        new Date(c.startsAt) > now
    );

    const rest = publicCollections.filter(c =>
        !promotionsActive.includes(c) && !promotionsPending.includes(c)
    );

    return { promotionsActive, promotionsPending, rest };
}

export default async function CollectionsIndexPage() {
    const collections = await getActiveCollections();
    const { promotionsActive, promotionsPending, rest } = groupCollections(collections);
    const totalPublicCount = promotionsActive.length + promotionsPending.length + rest.length;

    return (
        <section className="container mx-auto px-4 md:px-6 max-w-[1440px] py-10 space-y-10 bg-background text-foreground">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-1 select-none">Colecciones</h1>
                <p className="text-sm text-muted-foreground select-none">
                    Explora nuestras selecciones temáticas y comerciales
                </p>
            </div>

            {totalPublicCount === 0 ? (
                <p className="text-sm text-muted-foreground font-medium select-none">
                    No hay colecciones disponibles para navegación por el momento.
                </p>
            ) : (
                <>
                    {/* Promociones activas */}
                    {promotionsActive.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1 select-none">
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
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1 select-none">
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
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1 select-none">
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