// File: frontend/components/home/product/ShopNowButton.tsx
'use client';

import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import { cn } from "@/lib/utils";

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

  const isVisuallyDisabled = disabled || stock <= 0 || isSelectionIncomplete || product.isActive === false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.isActive === false) {
      toast.error("Este producto no está disponible actualmente.");
      return;
    }

    if (isSelectionIncomplete) {
      toast.info("Por favor, completa la selección de tus opciones (color, modelo, etc.) para continuar.");
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

  // Determinación de estado visual del botón
  let btnVariant: "default" | "destructive" | "secondary" = "default";
  let btnText = "Comprar ahora";

  if (product.isActive === false) {
    btnVariant = "secondary";
    btnText = "No disponible";
  } else if (stock <= 0) {
    btnVariant = "destructive";
    btnText = "Agotado";
  }

  return (
    <ButtonV3
      onClick={handleClick}
      variant={btnVariant}
      size="full"
      aria-disabled={isVisuallyDisabled}
      className={cn(isVisuallyDisabled && "opacity-60")}
    >
      <IoBagCheckOutline />
      {btnText}
    </ButtonV3>
  );
}