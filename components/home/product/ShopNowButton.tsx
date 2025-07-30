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
        addToCart(product);
        toast.success("Producto añadido al carrito");
        router.push("/carrito");
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-950 text-white font-medium flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
        >
            <IoBagCheckOutline size={20} />
            Comprar ahora
        </button>
    );
}
