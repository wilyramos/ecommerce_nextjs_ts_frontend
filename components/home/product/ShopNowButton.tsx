'use client';

import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importación añadida

interface Props {
    product: ProductWithCategoryResponse;
    variant?: VariantCart; 
    disabled?: boolean;    
}

export default function ShopNowButton({ product, variant, disabled }: Props) {
    const { addToCart } = useCartStore();
    const router = useRouter();

    const stock = variant?.stock ?? product.stock ?? 0;

    const hasVariants = product.variants && product.variants.length > 0;
    const isSelectionIncomplete = hasVariants && !variant;

    // Se incluye product.isActive === false en el bloqueo visual
    const isVisuallyDisabled = disabled || stock <= 0 || isSelectionIncomplete || product.isActive === false;

    const handleClick = () => {
        if (product.isActive === false) {
            toast.error("Este producto no está disponible actualmente.");
            return;
        }
        
        if (isSelectionIncomplete) {
            toast.error("Por favor, selecciona las opciones para continuar.");
            return;
        }

        if (stock <= 0) {
            toast.error("Lo sentimos, este producto se encuentra agotado.");
            return;
        }

        addToCart(product, variant);
        toast.success("Producto procesado, yendo al carrito...");
        router.push("/carrito");
    };

    return (
        <Button
            onClick={handleClick}
            // SE ELIMINÓ EL disabled NATIVO AQUÍ
            variant={stock <= 0 ? "destructive" : "secondary"}
            size="default"
            className={cn(
                "w-full",
                isVisuallyDisabled && "opacity-50 cursor-not-allowed pointer-events-auto"
            )}
        >
            <IoBagCheckOutline size={18} />
            {product.isActive === false ? "No disponible" : stock <= 0 ? "Agotado" : "Comprar ahora"}
        </Button>
    );
}