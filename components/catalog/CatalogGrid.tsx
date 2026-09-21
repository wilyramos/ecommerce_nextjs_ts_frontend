// File: frontend/components/catalog/CatalogGrid.tsx
import type { TApiProduct } from "@/src/schemas/index";
import ProductCard from "../home/product/ProductCard";
import { LuSearchX } from "react-icons/lu";
import Link from "next/link";

interface Props {
  products: TApiProduct[];
  isFallback: boolean;
}

export default function CatalogGrid({ products, isFallback }: Props) {
  // CASO A: NO HAY RESULTADOS EXACTOS (FALLBACK)
  if (isFallback) {
    return (
      <div className="space-y-8 py-6">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-border-primary/30 bg-surface-secondary/50 p-8 text-center backdrop-blur-md md:p-14">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-primary shadow-sm border border-border-primary/40">
            <LuSearchX className="h-10 w-10 text-text-tertiary" />
          </div>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            No encontramos coincidencias exactas
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
            Intenta ajustar tus filtros, eliminar la selección de categoría o buscar términos más generales.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-brand-primary-light active:scale-95"
          >
            Ver todo el catálogo
          </Link>
        </div>

        {/* Separador sugerencias */}
        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border-primary/40"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface-primary px-4 text-xs font-bold uppercase tracking-widest text-text-tertiary">
              Podría interesarte
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // CASO B: GRID VACÍO TOTAL
  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] bg-surface-secondary/30">
        <p className="text-lg font-medium text-text-secondary">No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 md:gap:4 sm:grid-cols-3 md:grid-cols-4 ">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}