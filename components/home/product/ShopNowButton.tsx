"use client";

import { ProductWithCategoryResponse } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ShopNowButton({ product }: { product: ProductWithCategoryResponse }) {
    const { addToCart } = useCartStore();
    const router = useRouter();

    const handleClick = () => {
        if (product.stock === 0) {
            toast.error("Este producto está agotado.");
            return;
        }

        addToCart(product);
        toast.success("Producto agregado al carrito.");
        
        // Redirigir al carrito después de agregar el producto
        router.push("/carrito");
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full px-6 py-2 rounded bg-gray-500 hover:bg-gray-700 text-white font-medium flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
        >
            <IoBagCheckOutline size={20} />
            Comprar ahora
        </button>
    );
}
