// File: frontend/app/(store)/colecciones/page.tsx

import Link from "next/link";
import Image from "next/image";
import { getActiveCollections } from "@/src/services/collection-service";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Colecciones | GoPhone",
    description: "Explora nuestras colecciones temáticas. Encuentra lo que buscas por categoría, temporada u ocasión.",
};

export default async function CollectionsIndexPage() {
    const collections = await getActiveCollections();

    return (
        <section className="container mx-auto px-4 md:px-6 max-w-[1440px] py-10">
            <h1 className="text-2xl font-bold text-foreground mb-1">Colecciones</h1>
            <p className="text-sm text-muted-foreground mb-8">
                Explora nuestras selecciones temáticas
            </p>

            {collections.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No hay colecciones disponibles por el momento.
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collections.map((col) => (
                        <Link
                            key={col._id}
                            href={`/colecciones/${col.slug}`}
                            className="group relative overflow-hidden bg-background-secondary
                                       hover:border-foreground/20 transition-all duration-200 hover:shadow-md"
                        >
                            {/* Imagen o bloque de color */}
                            <div
                                className="relative w-full aspect-[4/3] overflow-hidden"
                                style={{ backgroundColor: col.color ?? "var(--color-background-secondary)" }}
                            >
                                {col.image && (
                                    <Image
                                        src={col.image}
                                        alt={col.name}
                                        fill
                                        unoptimized
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                )}
                                {/* Overlay al hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <div className="flex items-center gap-1.5">
                                    {col.icon && (
                                        <span className="text-base leading-none" aria-hidden="true">
                                            {col.icon}
                                        </span>
                                    )}
                                    <span className="text-sm font-semibold text-foreground truncate">
                                        {col.name}
                                    </span>
                                </div>
                                {col.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {col.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}