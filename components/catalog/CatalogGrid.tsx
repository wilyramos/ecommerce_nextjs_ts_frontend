import type { TApiProduct } from "@/src/schemas/index"; // Use the specific Catalog Schema
import ProductCard from "../home/product/ProductCard"; // Your existing Card component
import { LuSearchX, LuShoppingBag } from "react-icons/lu";
import Link from "next/link";

interface Props {
    products: TApiProduct[]; // Updated type to match CatalogResponse
    isFallback: boolean;
}

export default function CatalogGrid({ products, isFallback }: Props) {

    // CASO A: NO HAY RESULTADOS EXACTOS (FALLBACK)
    // El backend no encontró nada con los filtros actuales, pero devuelve sugerencias (isFallback = true)
    if (isFallback) {
        return (
            <div className="py-8 space-y-12 animate-in fade-in duration-700">
                {/* Mensaje de "No encontrado" */}
                <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                        <LuSearchX className="w-8 h-8 text-[var(--store-text-muted)]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--store-text)] mb-2">
                        No encontramos coincidencias exactas
                    </h2>
                    <p className="text-[var(--store-text-muted)] mb-6 max-w-md mx-auto">
                        Intenta ajustar tus filtros, eliminar la selección de línea o buscar términos más generales.
                    </p>
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[var(--store-text)] hover:bg-gray-800 transition-colors"
                    >
                        Ver todo el catálogo
                    </Link>
                </div>

                {/* Separador de Sugerencias */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-[var(--store-border)]"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[var(--store-surface)] px-4 text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)]">
                            Podría interesarte
                        </span>
                    </div>
                </div>

                {/* Grid de Sugerencias */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        );
    }

    // CASO B: GRID VACÍO (NI SIQUIERA FALLBACK)
    // Esto pasa si la base de datos está totalmente vacía o el fallback falló
    if (!products || products.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--store-text-muted)] border border-dashed border-[var(--store-border)] rounded-2xl bg-gray-50">
                <LuShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">No hay productos disponibles.</p>
            </div>
        );
    }

    // CASO C: GRID NORMAL CON RESULTADOS
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}