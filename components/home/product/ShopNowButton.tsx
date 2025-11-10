'use client';

import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart; // Variante seleccionada (opcional)
    disabled?: boolean;    // Permite deshabilitar el botón
}

export default function ShopNowButton({ product, variant, disabled }: Props) {
    const { addToCart } = useCartStore();
    const router = useRouter();

    const stock = variant?.stock ?? product.stock ?? 0;

    const handleClick = () => {
        if (stock <= 0) {
            toast.error("Este producto está agotado.");
            return;
        }

        addToCart(product, variant);
        toast.success("Producto agregado al carrito.");

        router.push("/carrito");
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || stock <= 0}
            className={`w-full px-6 py-2 rounded bg-gray-500 text-white font-medium flex items-center justify-center gap-2 transition-transform duration-200
                hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                ${!disabled && stock > 0 ? 'hover:bg-gray-700' : ''}`}
        >
            <IoBagCheckOutline size={20} />
            Comprar ahora
        </button>
    );
}
