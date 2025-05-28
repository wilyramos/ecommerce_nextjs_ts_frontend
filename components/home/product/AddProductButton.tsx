"use client";
import { Product } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from 'sonner';

export default function AddProductButton({ product }: { product: Product }) {
    const addToCart = useCartStore(state => state.addToCart);

    return (
        <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            onClick={() => {
                addToCart(product);
                toast.success("Producto añadido al carrito");
            }}
        >
            <FaPlus className="w-3 h-3 md:w-4 md:h-4" />

            <FaShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
        </button>
    );
}
