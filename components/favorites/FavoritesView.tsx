// File: frontend/components/favorites/FavoritesView.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { useFavoriteStore } from "@/src/store/favoriteStore";
import { productService } from "@/src/services/product-service-v3";
import ProductCard from "@/components/home/product/ProductCard";
import { H1, P } from "@/components/ui/TypographyV3";
import { FavoritesGridSkeleton } from "@/components/favorites/FavoritesSkeleton";
import type { TApiProduct } from "@/src/schemas";

export default function FavoritesView() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const [products, setProducts] = useState<TApiProduct[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let isMounted = true;

    if (favorites.length === 0) {
      setProducts([]);
      return;
    }

    startTransition(async () => {
      try {
        const data = await productService.getByIds(favorites);
        if (isMounted) {
          // Conservar únicamente los elementos que sigan existiendo en el store
          setProducts(data.filter((p) => favorites.includes(p._id)));
        }
      } catch (error) {
        console.error("Error al sincronizar favoritos:", error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [favorites, isHydrated]);

  if (!isHydrated || (isPending && products.length === 0 && favorites.length > 0)) {
    return <FavoritesGridSkeleton />;
  }

  // Estado vacío: Apple Card Centrada
  if (favorites.length === 0 || products.length === 0) {
    return (
      <main className="container mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center rounded-radius-xl border border-border-primary/70 bg-surface-primary p-8 text-center shadow-md transition-all duration-normal md:p-10">
          <div className="relative mb-5 flex size-16 items-center justify-center rounded-full bg-brand-secondary">
            <Heart className="size-7 stroke-[1.75] text-text-tertiary" />
          </div>

          <H1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            Tu lista está vacía
          </H1>

          <P className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
            Guarda los equipos y accesorios que más te interesen tocando el ícono de corazón para revisarlos cuando quieras.
          </P>

          <div className="mt-7 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 text-xs font-semibold text-text-inverse shadow-sm transition-all duration-fast hover:bg-brand-primary-light active:scale-98"
            >
              <span>Explorar catálogo</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Encabezado */}
      <header className="mb-8 flex flex-col justify-between gap-4 border-b border-border-primary/60 pb-6 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <H1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              Mis Favoritos
            </H1>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-secondary px-2 font-mono text-[11px] font-semibold text-text-secondary">
              {products.length}
            </span>
          </div>
        </div>

        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors duration-fast hover:text-brand-primary"
        >
          <ShoppingBag className="size-3.5" />
          <span>Seguir comprando</span>
        </Link>
      </header>

      {/* Rejilla de productos */}
      <section
        aria-label="Lista de productos favoritos"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4"
      >
        {products.map((product) => (
          <article key={product._id} className="h-full">
            <ProductCard product={product} />
          </article>
        ))}
      </section>
    </main>
  );
}