'use client';

import { useEffect, useState, useRef } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { globalAnimationStore } from "@/hooks/useAddToCartAnimation";

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart;
}

export default function AddProductToCart({ product, variant }: Props) {
    const addToCart = useCartStore((state) => state.addToCart);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const cart = useCartStore((state) => state.cart);

    const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(variant ?? null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setSelectedVariant(variant ?? null);
    }, [variant]);

    // Calcular el stock disponible según si es variante o producto simple
    const stock = selectedVariant?.stock ?? product.stock ?? 0;

    // Verificar si visualmente debería parecer deshabilitado
    const hasVariants = product.variants && product.variants.length > 0;
    const isSelectionIncomplete = hasVariants && !selectedVariant;
    const isOutOfStock = stock <= 0;

    // Esta variable controla solo el ESTILO visual, no la funcionalidad del click
    const isVisuallyDisabled = isSelectionIncomplete || isOutOfStock;

    const handleClick = () => {
        // 1. Validar si faltan seleccionar variantes
        if (product.isActive === false) {
            toast.error("Este producto no está disponible para la venta comercial.");
            return;
        }

        if (isSelectionIncomplete) {
            toast.error("Por favor, selecciona una variante antes de añadir al carrito.");
            return;
        }

        // 2. Validar si no hay stock
        if (isOutOfStock) {
            toast.error("Lo sentimos, este producto no tiene stock disponible.");
            return;
        }

        // 3. Lógica normal de añadir al carrito
        const activeVariant = selectedVariant ?? undefined;

        const productInCart = cart.find((item) => {
            if (activeVariant) return item._id === product._id && item.variant?._id === activeVariant._id;
            return item._id === product._id && !item.variant;
        });

        if (productInCart && productInCart.cantidad >= stock) {
            toast.warning(`Solo hay ${stock} unidades disponibles. Ya tienes todo el stock en tu carrito.`);
            return;
        }

        // 4. Disparar animación
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            // Obtener imagen del producto o variante
            const productImage = selectedVariant?.imagenes?.[0] ?? product.imagenes?.[0];

            globalAnimationStore.trigger({
                fromRect: rect,
                productImage,
            });
        }

        console.log("Añadiendo al carrito:", product, activeVariant);

        // Pequeño delay para que la animación sea más visible
        setTimeout(() => {
            addToCart(product, activeVariant);
            toast.success("Producto añadido al carrito");
            setCartOpen(true);
        }, 50);
    };

    return (
        <div className="w-full">
            <Button
                ref={buttonRef}
                onClick={handleClick}
                variant={isOutOfStock ? "destructive" : "accent"}
                size="default"
                className={cn(
                    "w-full transition-all active:scale-95",
                    isVisuallyDisabled && "opacity-50 cursor-not-allowed pointer-events-auto"
                )}
            >
                <FaCartPlus size={14} />
                {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
            </Button>
        </div>
    );
}