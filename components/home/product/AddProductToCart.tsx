"use client";
import { Product } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from 'sonner';

export default function AddProductToCart({ product }: { product: Product }) {
    const addToCart = useCartStore(state => state.addToCart);
    const setCartOpen = useCartStore(state => state.setCartOpen);

    const handleClick = () => {
        addToCart(product);
        toast.success("Producto añadido al carrito");
        setCartOpen(true); // Abrir el carrito al añadir un producto
    };

    return (
        <button
            type="button"
            className="group relative bg-blue-800 text-white p-4 rounded-full shadow-md hover:bg-indigo-700 cursor-pointer flex items-center justify-center text-sm md:text-base transition-all duration-300 gap-2 w-full max-w-xs"
            onClick={handleClick}
        >
            <FaShoppingCart size={18} className="shrink-0" />
            <span className="inline">Añadir al carrito</span>
            <FaPlus size={12} className="ml-1 hidden group-hover:inline shrink-0" />
        </button>
    );
}