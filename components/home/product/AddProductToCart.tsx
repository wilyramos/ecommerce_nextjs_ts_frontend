'use client';

import { useEffect, useState } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";

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
        <div className="flex w-full">
            <button
                type="button"
                onClick={handleClick}
                className={`
                    w-full px-6 py-2 rounded font-medium flex items-center justify-center gap-2 text-sm
                    transition duration-200 transform
                    ${isVisuallyDisabled
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-90'
                        : 'bg-black text-white hover:bg-gray-800 hover:scale-105 cursor-pointer'}
                `}
            >
                <FaShoppingCart size={18} className="shrink-0" />
                Añadir al carrito
                <FaPlus size={12} />
            </button>
        </div>
    );
}