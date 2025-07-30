"use client";
import { ProductWithCategoryResponse } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from 'sonner';

export default function AddProductToCart({ product }: { product: ProductWithCategoryResponse }) {
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
            className="w-full px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-800 text-white font-medium flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
            onClick={handleClick}
        >
            <FaShoppingCart size={18} className="shrink-0" />
            <span className="inline">Añadir al carrito</span>
            <FaPlus size={12} className=" group-hover:inline " />
        </button>
    );
}