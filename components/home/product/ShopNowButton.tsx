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
            className={`
        w-full px-6 py-2 rounded font-medium flex items-center justify-center gap-2 text-sm
        transition duration-200 transform
        ${disabled || stock <= 0
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
                    : 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 cursor-pointer'}
    `}
        >
            <IoBagCheckOutline size={20} />
            Comprar ahora
        </button>

    );
}
