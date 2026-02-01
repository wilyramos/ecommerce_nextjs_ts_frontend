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

    const discount = precioComparativo
        ? Math.round(((precioComparativo - precio) / precioComparativo) * 100)
        : 0;

    return (
        <article className="group relative bg-[var(--store-surface)] border border-[var(--store-border)] rounded-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1">

            {/* Badges de Estado */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.esNuevo && (
                    <span className="bg-[var(--store-primary)] text-[var(--store-primary-text)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Nuevo
                    </span>
                )}
                {discount > 0 && (
                    <span className="bg-[var(--store-text)] text-[var(--store-surface)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        -{discount}%
                    </span>
                )}
            </div>

            <Link href={`/productos/${slug}`} className="block">
                {/* Contenedor de Imagen */}
                <div className="aspect-square relative overflow-hidden rounded-t-xl bg-[var(--store-bg)]">
                    <ProductCardImage imagenes={imagenes || []} nombre={nombre} />
                </div>

                {/* Información del Producto */}
                <div className="p-4">
                    <div className="mb-1 flex justify-between items-start">
                        <p className="text-[10px] text-[var(--store-text-muted)] uppercase font-semibold tracking-widest">
                            {brand?.nombre || "General"}
                        </p>
                        {color && (
                            <div className="flex items-center">
                                <ColorCircle color={color} size={10} />
                            </div>
                        )}
                    </div>

                    <h3 className="text-sm font-medium text-[var(--store-text)] line-clamp-2 min-h-[40px] mb-3 group-hover:text-[var(--store-primary)] transition-colors duration-200">
                        {nombre}
                    </h3>

                    <div className="flex items-end justify-between">
                        <div className="flex flex-col leading-tight">
                            {precioComparativo && precioComparativo > precio && (
                                <span className="text-[11px] text-[var(--store-text-muted)] line-through decoration-[var(--store-text-muted)]/50">
                                    {formatPrice(precioComparativo)}
                                </span>
                            )}
                            <span className="text-lg font-bold text-[var(--store-text)]">
                                {formatPrice(precio)}
                            </span>
                        </div>

                        {/* Stock dinámico usando solo variables de texto y fondo */}
                        <div className="flex items-center">
                            {stock && stock > 0 ? (
                                <span className="text-[9px] uppercase tracking-wide font-bold text-[var(--store-primary)] bg-[var(--store-primary)]/10 px-2 py-1 rounded">
                                    Disponible
                                </span>
                            ) : (
                                <span className="text-[9px] uppercase tracking-wide font-bold text-[var(--store-text-muted)] bg-[var(--store-surface-hover)] px-2 py-1 rounded">
                                    Agotado
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}