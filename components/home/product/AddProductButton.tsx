"use client";
import { Product } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus, FaShoppingCart } from "react-icons/fa";



export default function AddProductButton({ product }: { product: Product }) {

    const addToCart = useCartStore(state => state.addToCart);

    return (
        <button
            type="button"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 cursor-pointer flex items-center justify-center"
            onClick={() => {
                addToCart(product);
            }}
        >
            <FaShoppingCart size={18} />
            <FaPlus size={12} className="ml-1" />
        </button>
    )
}

