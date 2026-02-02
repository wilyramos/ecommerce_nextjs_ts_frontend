import Link from "next/link";
import { ProductResponse } from "@/src/schemas";
import { formatPrice } from "@/lib/utils";
import ProductCardImage from "./product-card-image";
import ColorCircle from "../ui/ColorCircle";

interface ProductCardProps {
    product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { nombre, slug, precio, precioComparativo, imagenes, brand, stock, atributos } = product;
    const color = atributos?.Color || atributos?.color;

    // Lógica de descuento
    const discount = precioComparativo
        ? Math.round(((precioComparativo - precio) / precioComparativo) * 100)
        : 0;

    // Lógica de stock
    const isOutOfStock = !stock || stock <= 0;

    return (
        <article className="group relative flex flex-col w-full h-full bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[1.25rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[rgba(0,0,0,0.06)] hover:border-[var(--store-border)]">
            
            {/* Badges Flotantes (Solo Nuevo y Descuento) */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                {product.esNuevo && (
                    <span className="bg-[var(--store-primary)] text-[var(--store-primary-text)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Nuevo
                    </span>
                )}
                {discount > 0 && (
                    <span className="bg-[var(--store-text)] text-[var(--store-surface)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        -{discount}%
                    </span>
                )}
            </div>

            <Link href={`/productos/${slug}`} className="flex flex-col h-full">
                {/* 1. Contenedor de Imagen con Zoom Suave */}
                <div className="relative aspect-square w-full bg-[var(--store-bg)] overflow-hidden">
                    {/* Overlay para productos agotados */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 z-10 bg-[var(--store-surface)]/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="px-3 py-1 bg-[var(--store-text-muted)] text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                Agotado
                            </span>
                        </div>
                    )}
                    
                    {/* Imagen con transición */}
                    <div className={`w-full h-full transition-transform duration-500 ease-out ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}>
                        <ProductCardImage imagenes={imagenes || []} nombre={nombre} />
                    </div>
                </div>

                {/* 2. Información del Producto */}
                <div className="flex flex-col flex-grow p-5">
                    
                    {/* Header: Marca y Color */}
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--store-text-muted)] uppercase">
                            {brand?.nombre || "GO PHONE"}
                        </span>
                        {color && (
                            <div className="flex items-center gap-1">
                                <ColorCircle color={color} size={12} />
                            </div>
                        )}
                    </div>

                    {/* Título: Altura fija para alineación en grids */}
                    <h3 className="text-[15px] leading-snug font-semibold text-[var(--store-text)] line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-[var(--store-primary)] transition-colors">
                        {nombre}
                    </h3>

                    {/* Footer: Precios (Push to bottom) */}
                    <div className="mt-auto flex flex-col">
                        {precioComparativo && precioComparativo > precio && (
                            <span className="text-xs text-[var(--store-text-muted)] line-through decoration-slate-300 mb-0.5">
                                {formatPrice(precioComparativo)}
                            </span>
                        )}
                        <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold tracking-tight ${isOutOfStock ? 'text-[var(--store-text-muted)]' : 'text-[var(--store-text)]'}`}>
                                {formatPrice(precio)}
                            </span>
                            
                            {/* Flecha sutil que aparece en hover (Toque moderno) */}
                            {!isOutOfStock && (
                                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--store-primary)]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}