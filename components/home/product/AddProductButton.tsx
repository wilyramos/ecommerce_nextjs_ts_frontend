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
            className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-700 cursor-pointer flex items-center justify-center text-xs md:text-base"
            onClick={() => {
                addToCart(product);
                toast.success("Producto añadido al carrito")
            }}
        >
            <FaShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            <FaPlus className="h-4 w-4 ml-1" />
        </button>
    )
}