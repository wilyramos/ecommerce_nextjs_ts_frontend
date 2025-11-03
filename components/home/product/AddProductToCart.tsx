'use client';

import { useEffect, useState } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart; // variante seleccionada desde ProductDetails
}

export default function AddProductToCart({ product, variant }: Props) {
    const addToCart = useCartStore((state) => state.addToCart);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const cart = useCartStore((state) => state.cart);

    // Estado interno para la variante seleccionada (opcional)
    const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(variant ?? null);

    // Sincroniza si la prop cambia
    useEffect(() => {
        setSelectedVariant(variant ?? null);
    }, [variant]);

    const handleClick = () => {
        const activeVariant = selectedVariant ?? undefined;

        const productInCart = cart.find((item) => {
            if (activeVariant) return item._id === product._id && item.variant?._id === activeVariant._id;
            return item._id === product._id && !item.variant;
        });

        const stock = activeVariant?.stock ?? product.stock ?? 0;

        if (stock <= 0) {
            toast.error("Este producto no tiene stock disponible");
            return;
        }

        if (productInCart && productInCart.cantidad >= stock) {
            toast.warning(`Solo hay ${stock} unidades disponibles`);
            return;
        }

        addToCart(product, activeVariant);
        toast.success("Producto añadido al carrito");
        setCartOpen(true);
    };

    return (
        <div className="flex w-full">
            <button
                type="button"
                className="w-full px-6 py-2 rounded bg-black text-white font-medium flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={handleClick}
                disabled={!product.variants?.length && selectedVariant === null}
            >
                <FaShoppingCart size={18} className="shrink-0" />
                <span className="inline">Añadir al carrito</span>
                <FaPlus size={12} />
            </button>
        </div>
    );
}
