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
            className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors cursor-pointer"
            onClick={() => {
                addToCart(product);
                toast.success("Producto añadido al carrito");
            }}
        >
            <FaPlus className="w-3 h-3 md:w-6 md:h-6" />

            {/* <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> */}
        </button>
    );
}
