import Image from "next/image";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MdOutlineImageNotSupported } from "react-icons/md";

export default function ItemCarrito({ item }: { item: CartItem }) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const productId = item._id;
    const variantId = item.variant?._id;
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
    const price = item.variant?.precio ?? item.precio ?? 0;
    const subtotal = price * item.cantidad;
    const stockMax = item.variant?.stock ?? item.stock ?? 0;

    const atributos = item.variant?.atributos
        ? Object.values(item.variant.atributos).join(" · ")
        : null;

    return (
        <div className="flex flex-col py-2 gap-2 ">
            {/* Nombre ocupa todo el ancho superior */}
            <p className="text-[13px] font-medium leading-tight text-[var(--color-text-primary)]">
                {item.nombre}
            </p>

            <div className="flex gap-3 items-center">
                {/* Imagen */}
                <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-[var(--color-bg-secondary)]">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={item.variant?.nombre ?? item.nombre}
                            fill
                            className="object-cover"
                            quality={60}
                            unoptimized
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-[var(--color-text-tertiary)]">
                            <MdOutlineImageNotSupported size={16} />
                        </div>
                    )}
                </div>

                {/* Info al costado de la imagen */}
                <div className="flex flex-col flex-1 min-w-0 gap-2">
                    {/* Atributos */}
                    {atributos && (
                        <p className="text-[11px] text-[var(--color-text-tertiary)] -mt-1">
                            {atributos}
                        </p>
                    )}

                    {/* Cantidad + Precio Unitario + Eliminar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
                                    disabled={item.cantidad <= 1}
                                    className="w-5 h-5 flex items-center justify-center border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--color-border-strong)] transition-colors"
                                >
                                    <Minus size={8} strokeWidth={2.5} />
                                </button>
                                <span className="text-[12px] font-medium text-[var(--color-text-primary)] tabular-nums min-w-[12px] text-center">
                                    {item.cantidad}
                                </span>
                                <button
                                    onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
                                    disabled={item.cantidad >= stockMax}
                                    className="w-5 h-5 flex items-center justify-center border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--color-border-strong)] transition-colors"
                                >
                                    <Plus size={8} strokeWidth={2.5} />
                                </button>
                            </div>
                            
                            {/* Precio al costado de las cantidades */}
                            <span className="text-[12px] font-semibold text-[var(--color-text-primary)]">
                                S/ {subtotal.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={() => removeFromCart(productId, variantId)}
                            aria-label={`Eliminar ${item.nombre}`}
                            className="p-1 text-[var(--color-text-tertiary)] hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}