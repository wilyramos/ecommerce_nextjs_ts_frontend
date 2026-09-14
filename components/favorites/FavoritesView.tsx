// File: frontend/components/favorites/FavoritesView.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/src/store/favoriteStore";
import { productService } from "@/src/services/product-service-v3";
import ProductCard from "@/components/home/product/ProductCard";
import { H1, P } from "@/components/ui/TypographyV3";
import { FavoritesGridSkeleton } from "@/components/favorites/FavoritesSkeleton";
import type { TApiProduct } from "@/src/schemas";

export default function FavoritesView() {
    const favorites = useFavoriteStore((state) => state.favorites);
    const [products, setProducts] = useState<TApiProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        let isMounted = true;

        async function fetchFavoriteProducts() {
            if (favorites.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const promises = favorites.map(async (id) => {
                    try {
                        return await productService.getById(id);
                    } catch {
                        return null;
                    }
                });

                const results = await Promise.all(promises);

                if (isMounted) {
                    setProducts(results.filter((p): p is TApiProduct => p !== null));
                }
            } catch (error) {
                console.error("Error al cargar favoritos", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchFavoriteProducts();

        return () => {
            isMounted = false;
        };
    }, [favorites, isHydrated]);

    if (!isHydrated || loading) {
        return <FavoritesGridSkeleton />;
    }

    if (favorites.length === 0 || products.length === 0) {
        return (
            <div className="mx-auto my-12 max-w-md rounded-radius-xl border border-dashed border-border-primary/80 bg-surface-secondary/40 p-12 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-radius-full border border-border-primary/60 bg-surface-primary shadow-xs">
                    <Heart className="size-8 text-text-disabled" />
                </div>
                <H1 className="mb-2 text-xl font-semibold tracking-tight text-text-primary">
                    Tu lista de favoritos está vacía
                </H1>
                <P className="mb-6 text-sm text-text-secondary">
                    Explora nuestro catálogo y guarda los productos que más te gusten para encontrarlos fácilmente.
                </P>
                <Link
                    href="/catalogo"
                    className="inline-flex items-center justify-center rounded-radius-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-text-inverse transition-colors duration-fast hover:bg-brand-primary/90"
                >
                    Explorar catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-border-primary/85 pb-4">
                <H1 className="text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
                    Mis Favoritos ({products.length})
                </H1>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}