'use client';

import { useEffect, useState } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart;
}

export default function AddProductToCart({ product, variant }: Props) {
    const addToCart = useCartStore((state) => state.addToCart);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const cart = useCartStore((state) => state.cart);

    const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(variant ?? null);

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

        console.log("Añadiendo al carrito:", product, activeVariant);

        addToCart(product, activeVariant);
        toast.success("Producto añadido al carrito");
        setCartOpen(true);
    };

    return (
        <div className="w-full">
            <Button
                onClick={handleClick}
                disabled={isVisuallyDisabled}
                variant={isOutOfStock ? "destructive" : "accent"}
                size="default"
                className="w-full  "
            >
                <FaPlus size={14} />
                {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
            </Button>
        </div>
    );
}