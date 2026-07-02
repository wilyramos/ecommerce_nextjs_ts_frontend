// File: frontend/app/%28store%29/categorias/page.tsx

import { Metadata } from "next";
import { getRootCategories } from "@/src/services/categorys";
import CategoryCard from "@/components/category/category-card";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import React from "react";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
    title: "Categorías | GoPhone",
    description:
        "Explora todas nuestras categorías principales y encuentra productos específicos organizados para ti.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/categorias`,
    },
};

export default async function CategoriesPage() {
    // Se cambia getAllSubcategories por getRootCategories para estructurar desde la raíz
    const categories = await getRootCategories();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Categorías de Productos",
        itemListElement: categories.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/categoria/${c.slug}`,
        })),
    };

    return (
        <main className="bg-background min-h-screen py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4">
                <Breadcrumbs
                    items={[
                        { label: "Inicio", href: "/" },
                        { label: "Categorías", href: "/categorias" },
                    ]}
                />

                <header className="mt-6 mb-10">
                    <h1 className="text-3xl font-semibold text-foreground">
                        Categorías
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Navega por nuestras categorías principales y descubre todo nuestro catálogo.
                    </p>
                </header>

                {/* Grid */}
                <section>
                    <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-medium">
                        Catálogo Principal
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((c) => (
                            <CategoryCard key={c._id} category={c} />
                        ))}
                    </div>
                </section>

                {/* Sitemap */}
                <section className="mt-16 pt-8 border-t border-border">
                    <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-medium">
                        Índice Alfabético
                    </h2>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-8 space-y-3">
                        {[...categories]
                            .sort((a, b) => a.nombre.localeCompare(b.nombre))
                            .map((c) => (
                                <Link
                                    key={c._id}
                                    href={routes.catalog({ category: c.slug })}
                                    className="block text-sm text-muted-foreground hover:text-action-cta transition-colors"
                                >
                                    {c.nombre}
                                </Link>
                            ))}
                    </div>
                </section>
            </div>
        </main>
    );
}