"use client";
import { ProductWithCategoryResponse } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus } from "react-icons/fa";
import { toast } from 'sonner';

export default function AddProductButton({ product }: { product: ProductWithCategoryResponse }) {
    const addToCart = useCartStore(state => state.addToCart);

    return (
        <button
            type="button"
            className="
        flex items-center justify-center
        w-7 h-7 md:w-10 md:h-10
        rounded-full
        bg-blue-600
        text-white
        shadow-sm
        hover:bg-blue-700
        active:bg-blue-800
        transition
    "
            onClick={() => {
                addToCart(product);
                toast.success("Producto añadido al carrito");
            }}
        >
            <FaPlus className="w-3 h-3 md:w-4 md:h-4" />
        </button>

    );
}
