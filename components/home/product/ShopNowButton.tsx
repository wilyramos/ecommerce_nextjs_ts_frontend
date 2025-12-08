'use client';

import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart; // Variante seleccionada (opcional)
    disabled?: boolean;    // Prop opcional que viene del padre
}

export default function ShopNowButton({ product, variant, disabled }: Props) {
    const { addToCart } = useCartStore();
    const router = useRouter();

    const stock = variant?.stock ?? product.stock ?? 0;

    // Detectamos si falta seleccionar variante para mostrar el mensaje correcto
    const hasVariants = product.variants && product.variants.length > 0;
    // Si tiene variantes y no se ha pasado una variante válida, está incompleto
    const isSelectionIncomplete = hasVariants && !variant;

    // Determinamos si visualmente debe verse bloqueado
    // Consideramos la prop 'disabled' del padre O si no hay stock O si falta selección
    const isVisuallyDisabled = disabled || stock <= 0 || isSelectionIncomplete;

    const handleClick = () => {
        // 1. Validar si faltan opciones (Variantes)
        if (isSelectionIncomplete) {
            toast.error("Por favor, selecciona las opciones para continuar.");
            return;
        }

        // 2. Validar stock
        if (stock <= 0) {
            toast.error("Lo sentimos, este producto se encuentra agotado.");
            return;
        }

        // 3. Proceso de compra
        addToCart(product, variant);
        toast.success("Producto procesado, yendo al carrito...");
        router.push("/carrito");
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`
                w-full px-6 py-2 rounded font-medium flex items-center justify-center gap-2 text-sm
                transition duration-200 transform
                ${isVisuallyDisabled
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-90'
                    : 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 cursor-pointer'}
            `}
        >
            <IoBagCheckOutline size={20} />
            Comprar ahora
        </button>
    );
}