// File: frontend/components/home/product/AddProductToCart.tsx
'use client';

import { useEffect, useState, useRef } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "sonner";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import { globalAnimationStore } from "@/hooks/useAddToCartAnimation";
import { cn } from "@/lib/utils";

interface Props {
  product: ProductWithCategoryResponse;
  variant?: VariantCart;
}

export default function AddProductToCart({ product, variant }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const cart = useCartStore((state) => state.cart);

  const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(variant ?? null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelectedVariant(variant ?? null);
  }, [variant]);

  const stock = selectedVariant?.stock ?? product.stock ?? 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const isSelectionIncomplete = hasVariants && !selectedVariant;
  const isOutOfStock = stock <= 0;
  const isVisuallyDisabled = isSelectionIncomplete || isOutOfStock || product.isActive === false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.isActive === false) {
      toast.error("Este producto no está disponible para la venta comercial.");
      return;
    }

    if (isSelectionIncomplete) {
      toast.info("Por favor, selecciona tus opciones (color, modelo, etc.) antes de añadir al carrito.");
      return;
    }

    if (isOutOfStock) {
      toast.error("Lo sentimos, este producto no tiene stock disponible en este momento.");
      return;
    }

    const activeVariant = selectedVariant ?? undefined;

    const productInCart = cart.find((item) => {
      if (activeVariant) return item._id === product._id && item.variant?._id === activeVariant._id;
      return item._id === product._id && !item.variant;
    });

    if (productInCart && productInCart.cantidad >= stock) {
      toast.warning(`Solo hay ${stock} unidades disponibles. Ya tienes todo el stock en tu carrito.`);
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const productImage = selectedVariant?.imagenes?.[0] ?? product.imagenes?.[0];

      globalAnimationStore.trigger({
        fromRect: rect,
        productImage,
      });
    }

    setTimeout(() => {
      addToCart(product, activeVariant);
      toast.success("Producto añadido al carrito");
      setCartOpen(true);
    }, 50);
  };

  // Determinación de estado visual del botón
  let btnVariant: "secondary" | "destructive" = "secondary";
  let btnText = "Añadir al carrito";

  if (product.isActive === false) {
    btnText = "No disponible";
  } else if (isOutOfStock) {
    btnVariant = "destructive";
    btnText = "Sin stock";
  }

  return (
    <ButtonV3
      ref={buttonRef}
      onClick={handleClick}
      variant={btnVariant}
      size="full"
      aria-disabled={isVisuallyDisabled}
      className={cn(isVisuallyDisabled && "opacity-60")}
    >
      <FaCartPlus />
      {btnText}
    </ButtonV3>
  );
}