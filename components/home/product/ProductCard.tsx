// File: frontend/components/home/product/ProductCard.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ColorCircle from "@/components/ui/ColorCircle";
import type { TApiProduct, ProductWithCategoryResponse } from "@/src/schemas";
import { cn } from "@/lib/utils";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { H3, Small } from "@/components/ui/TypographyV3";
import { useCartStore } from "@/src/store/cartStore";
import { useFavoriteStore } from "@/src/store/favoriteStore";
import { FaCartPlus } from "react-icons/fa";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: TApiProduct }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const addToCart = useCartStore((state) => state.addToCart);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const cart = useCartStore((state) => state.cart);
    const { favorites, toggleFavorite } = useFavoriteStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImages, setPreviewImages] = useState<string[]>(product.imagenes ?? []);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [startX, setStartX] = useState<number | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const precio = product.precio ?? 0;
    const stock = product.stock ?? 0;
    const hasVariants = product.variants && product.variants.length > 0;
    const isFavorited = favorites.includes(product._id);

    const uniqueColors = useMemo(() => {
        const colors = new Set<string>();
        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor) colors.add(mainColor);

        product.variants?.forEach((v) => {
            const vAttrs = v.atributos as Record<string, string> | undefined;
            const vColor = vAttrs?.Color || vAttrs?.color;
            if (vColor) colors.add(vColor);
        });

        return Array.from(colors);
    }, [product]);

    useEffect(() => {
        if (!product.createdAt) return;
        const days = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        setIsNew(days <= 30);
    }, [product.createdAt]);

    const discountPct =
        product.precioComparativo && product.precioComparativo > precio
            ? Math.round(((product.precioComparativo - precio) / product.precioComparativo) * 100)
            : 0;

    useEffect(() => {
        const filterColor = searchParams.get("Color") || searchParams.get("color");
        const mainColor = product.atributos?.Color || product.atributos?.color;
        let targetColor = mainColor;

        if (filterColor && uniqueColors.includes(filterColor)) targetColor = filterColor;
        if (!targetColor) return;

        setSelectedColor(targetColor);
        setCurrentIndex(0);

        if (targetColor === mainColor && product.imagenes?.length) {
            setPreviewImages(product.imagenes);
        } else {
            const foundVariant = product.variants?.find((v) => {
                const vAttrs = v.atributos as Record<string, string>;
                return vAttrs?.Color === targetColor || vAttrs?.color === targetColor;
            });
            setPreviewImages(
                foundVariant?.imagenes?.length ? foundVariant.imagenes : (product.imagenes ?? [])
            );
        }
    }, [searchParams, product, uniqueColors]);

    const handleColorSelect = (e: React.MouseEvent | React.TouchEvent, color: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedColor(color);
        setCurrentIndex(0);

        const mainColor = product.atributos?.Color || product.atributos?.color;
        if (mainColor === color && product.imagenes?.length) {
            setPreviewImages(product.imagenes);
            return;
        }

        const foundVariant = product.variants?.find((v) => {
            const vAttrs = v.atributos as Record<string, string>;
            return vAttrs?.Color === color || vAttrs?.color === color;
        });
        setPreviewImages(
            foundVariant?.imagenes?.length ? foundVariant.imagenes : (product.imagenes ?? [])
        );
    };

    const nextImage = () => setCurrentIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));

    const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50) nextImage();
        else if (diff < -50) prevImage();
        setStartX(null);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.isActive === false) {
            toast.error("Este producto no está disponible para la venta comercial.");
            return;
        }

        if (stock <= 0) {
            toast.error("Lo sentimos, este producto no tiene stock disponible.");
            return;
        }

        if (hasVariants) {
            router.push(`/productos/${product.slug}`);
            return;
        }

        const productInCart = cart.find((item) => item._id === product._id && !item.variant);

        if (productInCart && productInCart.cantidad >= stock) {
            toast.warning(`Solo hay ${stock} unidades disponibles.`);
            return;
        }

        addToCart(product as unknown as ProductWithCategoryResponse, undefined);
        toast.success("Producto añadido al carrito");
        setCartOpen(true);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product._id);
    };

    const displayIndex =
        isHovered && previewImages.length > 1
            ? (currentIndex + 1) % previewImages.length
            : currentIndex;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-surface-primary"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentIndex(0);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <Link
                href={`/productos/${product.slug}`}
                className="relative flex h-full flex-col outline-none focus-visible:ring-1 focus-visible:ring-brand-accent"
            >
                {/* Contenedor Superior: Imagen del Producto */}
                <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
                    {previewImages.length > 0 ? (
                        <>
                            <motion.div
                                className="flex h-full w-full"
                                animate={{ x: `-${displayIndex * 100}%` }}
                                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            >
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative h-full min-w-full shrink-0 p-3 sm:p-4">
                                        <Image
                                            src={img}
                                            alt={`${product.nombre} - vista ${idx + 1}`}
                                            fill
                                            sizes="(max-width: 640px) 50vw, 25vw"
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </motion.div>

                            {previewImages.length > 1 && (
                                <>
                                    <AnimatePresence>
                                        {isHovered && (
                                            <>
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        prevImage();
                                                    }}
                                                    className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-primary shadow-xs transition-colors duration-fast"
                                                    aria-label="Imagen anterior"
                                                >
                                                    <ChevronLeft size={14} strokeWidth={2} />
                                                </motion.button>
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        nextImage();
                                                    }}
                                                    className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-primary shadow-xs transition-colors duration-fast hover:bg-surface-secondary"
                                                    aria-label="Siguiente imagen"
                                                >
                                                    <ChevronRight size={14} strokeWidth={2} />
                                                </motion.button>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-border-primary bg-surface-primary/90 px-1.5 py-0.5 backdrop-blur-xs transition-opacity duration-normal md:opacity-0 md:group-hover:opacity-100">
                                        {previewImages.slice(0, 3).map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={cn(
                                                    "size-1.5 rounded-full transition-colors duration-fast",
                                                    displayIndex === idx ? "bg-text-primary" : "bg-border-primary"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-text-disabled">
                            <MdOutlineImageNotSupported size={24} />
                        </div>
                    )}

                    {/* Badges Flotantes */}
                    <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
                        {isNew && (
                            <span className="flex items-center justify-center rounded bg-surface-primary px-2 py-0.5 shadow-xs">
                                <Small className="text-[10px] font-semibold leading-tight text-text-primary">Nuevo</Small>
                            </span>
                        )}
                        {discountPct > 0 && (
                            <span className="flex items-center justify-center rounded bg-brand-accent px-2 py-0.5 shadow-xs">
                                <Small className="text-[10px] font-semibold leading-tight text-text-inverse">-{discountPct}% OFF</Small>
                            </span>
                        )}
                    </div>

                    {/* Botón Favorito */}
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        aria-label={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}
                        className={cn(
                            "pointer-events-auto absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border border-border-primary bg-surface-primary text-text-secondary transition-all duration-fast hover:border-border-strong hover:text-status-error active:scale-95",
                            !isFavorited && "md:opacity-0 md:group-hover:opacity-100"
                        )}
                    >
                        <Heart
                            size={13}
                            className={cn("transition-colors duration-fast", isFavorited && "fill-status-error text-status-error")}
                        />
                    </button>
                </div>

                {/* Contenedor Inferior: Información */}
                <div className="flex flex-1 flex-col p-2.5">
                    {/* Marca y Variantes de Color */}
                    <div className="flex min-h-[16px] items-center justify-between gap-1.5">
                        <Small className="truncate text-[11px] leading-none text-text-tertiary">
                            {product.brand?.nombre || ""}
                        </Small>

                        {uniqueColors.length > 0 && (
                            <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                                {uniqueColors.slice(0, 4).map((c, index) => (
                                    <button
                                        key={`${c}-${index}`}
                                        type="button"
                                        onClick={(e) => handleColorSelect(e, c)}
                                        className={cn(
                                            "flex items-center justify-center rounded-full p-0.5 transition-all duration-fast",
                                            selectedColor === c ? "ring-1 ring-border-strong/60 ring-offset-1 ring-offset-surface-primary" : "hover:opacity-80"
                                        )}
                                        aria-label={`Seleccionar color ${c}`}
                                    >
                                        <ColorCircle color={c} size={9} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Nombre visible en 3 filas */}
                    <H3 className="mt-1 line-clamp-3 min-h-[3.75rem] text-[13px] font-medium leading-snug tracking-tight text-text-primary transition-colors duration-fast group-hover:text-brand-accent sm:text-[13.5px]">
                        {product.nombre}
                    </H3>

                    {/* Precios uno al lado del otro y Botón de Compra */}
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border-secondary pt-2">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
                                S/ {precio.toFixed(2)}
                            </span>
                            {discountPct > 0 && (
                                <Small className="text-[11px] line-through text-text-tertiary">
                                    S/ {product.precioComparativo!.toFixed(2)}
                                </Small>
                            )}
                        </div>

                        {stock <= 0 ? (
                            <Small className="shrink-0 text-[10px] font-medium text-text-disabled">Agotado</Small>
                        ) : !hasVariants && product.isActive !== false ? (
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-button-primary-bg text-button-primary-text transition-all duration-fast hover:bg-button-primary-hover active:scale-95 md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Añadir al carrito"
                            >
                                <FaCartPlus size={11} />
                            </button>
                        ) : null}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}