import { Metadata } from "next";
import { getAllSubcategories } from "@/src/services/categorys";
import CategoryCard from "@/components/category/category-card";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
    title: "Categorías | GoPhone",
    description: "Explora todas nuestras subcategorías y encuentra productos específicos organizados para ti.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/categorias`,
    },
};

export default async function CategoriesPage() {
    // Usamos exclusivamente el servicio de subcategorías solicitado
    const subcategories = await getAllSubcategories();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Subcategorías de Productos",
        "description": "Lista de subcategorías especializadas",
        "itemListElement": subcategories.map((c, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `${process.env.NEXT_PUBLIC_BASE_URL}/categoria/${c.slug}`
        }))
    };

    return (
        <main className="bg-[var(--store-bg)] min-h-screen py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4">
                <Breadcrumbs segments={[]} current="Categorías" />

                <header className="mb-12 mt-6">
                    <h1 className="text-4xl font-bold text-[var(--store-text)] tracking-tight">
                        Explora por Categoría
                    </h1>
                    <p className="text-[var(--store-text-muted)] mt-2 max-w-2xl">
                        Encuentra exactamente lo que buscas navegando por nuestras especialidades.
                    </p>
                </header>

                {/* Grilla Principal basada en getAllSubcategories */}
                <section>
                    <h2 className="text-[10px] font-bold text-[var(--store-text-muted)] uppercase tracking-[0.2em] mb-8">
                        Catálogo Especializado
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {subcategories.map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                </section>

                {/* SEO Sitemap Section */}
                <section className="mt-24 border-t border-[var(--store-border)] pt-12 pb-20">
                    <h2 className="text-[10px] font-bold text-[var(--store-text-muted)] uppercase tracking-[0.2em] mb-8">
                        Índice Completo
                    </h2>
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-12 space-y-4">
                        {[...subcategories]
                            .sort((a, b) => a.nombre.localeCompare(b.nombre))
                            .map((c) => (
                                <div key={c._id} className="break-inside-avoid">
                                    <Link
                                        href={`/categoria/${c.slug}`}
                                        className="text-sm text-[var(--store-text)] hover:text-[var(--store-primary)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[var(--store-border)] group-hover:bg-[var(--store-primary)] transition-colors" />
                                        {c.nombre}
                                    </Link>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </main>
    );
}