"use client";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas/category.schema";
import { routes } from "@/lib/routes";
import HeaderConTituloConControles from "@/components/ui/HeaderConTituloConControles";

export default function CategoriasDestacadas({ categorias }: { categorias: CategoryListResponse }) {
    const categoriasVisibles = categorias.slice(0, 8);

    return (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-16 select-none">
            {/* Header */}
            <HeaderConTituloConControles
                title="Categorías destacadas"
                viewAllHref="/categorias"
            />
                

            {/* Grid adaptable */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                {categoriasVisibles.map((c) => (
                    <Link
                        key={c._id}
                        href={routes.catalog({ category: c.slug })}
                        className="group flex flex-col items-center text-center transition-all duration-300"
                    >
                        {/* Círculo */}
                        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-background border border-border group-hover:border-action-cta group-hover:shadow-lg transition-all duration-300 flex items-center justify-center flex-shrink-0">
                            <div className="relative w-full h-full">
                                {c.image ? (
                                    <Image
                                        src={c.image}
                                        alt={c.nombre}
                                        fill
                                        className="object-contain p-2 md:p-3 transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                        sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 200px"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground/30">
                                        <ImageOff size={32} strokeWidth={1} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nombre */}
                        <h3 className="mt-3 md:mt-4 text-xs md:text-sm font-medium text-foreground group-hover:text-action-cta transition-colors duration-200 line-clamp-2 w-full px-1">
                            {c.nombre}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}