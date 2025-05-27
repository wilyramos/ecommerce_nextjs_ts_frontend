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
            className="flex items-center justify-center gap-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-xs md:text-sm"
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