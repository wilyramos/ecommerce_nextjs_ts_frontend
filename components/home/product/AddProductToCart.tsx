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

    const stock = selectedVariant?.stock ?? product.stock ?? 0;

    const handleClick = () => {
        if (stock <= 0) {
            toast.error("Este producto no tiene stock disponible");
            return;
        }

        const activeVariant = selectedVariant ?? undefined;

        const productInCart = cart.find((item) => {
            if (activeVariant) return item._id === product._id && item.variant?._id === activeVariant._id;
            return item._id === product._id && !item.variant;
        });

        if (productInCart && productInCart.cantidad >= stock) {
            toast.warning(`Solo hay ${stock} unidades disponibles`);
            return;
        }
        console.log("Añadiendo al carrito:", product, activeVariant);

        addToCart(product, activeVariant);
        toast.success("Producto añadido al carrito");
        setCartOpen(true);
        console.log("Items en el carrito:", cart);
    };

    return (
        <div className="flex w-full">
            <button
                type="button"
                className="w-full px-6 py-2 rounded bg-black text-white font-medium flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClick}
                disabled={product.variants?.length ? !selectedVariant || stock <= 0 : stock <= 0}
            >
                <FaShoppingCart size={18} className="shrink-0" />
                <span className="inline">Añadir al carrito</span>
                <FaPlus size={12} />
            </button>
        </div>
    );
}
