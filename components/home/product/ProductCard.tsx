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

    // Stores
    const addToCart = useCartStore((state) => state.addToCart);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const cart = useCartStore((state) => state.cart);
    const { favorites, toggleFavorite } = useFavoriteStore();

    // Estados locales
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
    
    // --- COLORES ---
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

    // --- NUEVO ---
    useEffect(() => {
        if (!product.createdAt) return;
        const days = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        setIsNew(days <= 30);
    }, [product.createdAt]);

    // --- DESCUENTO ---
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

    // --- COLOR SELECT ---
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

    // --- NAVEGACIÓN IMÁGENES ---
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
    
    // --- ACCIONES SECUNDARIAS ---
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex h-full flex-col rounded-[1.25rem] border border-border-primary/40 bg-surface-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-border-primary hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setCurrentIndex(0); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <Link
                href={`/productos/${product.slug}`}
                className="relative flex h-full flex-col rounded-[1.25rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 overflow-hidden"
            >
                {/* ── IMAGEN (Con físicas de resorte) ── */}
                <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
                    {previewImages.length > 0 ? (
                        <>
                            <motion.div
                                className="flex h-full w-full"
                                animate={{ x: `-${currentIndex * 100}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative h-full min-w-full shrink-0 p-4">
                                        <Image
                                            src={img}
                                            alt={`${product.nombre} - vista ${idx + 1}`}
                                            fill
                                            sizes="(max-width: 640px) 50vw, 25vw"
                                            className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </motion.div>

                            {/* Controles de navegación Glassmorphism */}
                            {previewImages.length > 1 && (
                                <>
                                    <AnimatePresence>
                                        {isHovered && (
                                            <>
                                                <motion.button
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                                                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary/20 bg-surface-primary/60 text-text-primary shadow-sm backdrop-blur-md transition-colors hover:bg-surface-primary"
                                                >
                                                    <ChevronLeft size={16} strokeWidth={2} />
                                                </motion.button>
                                                <motion.button
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                                                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-primary/20 bg-surface-primary/60 text-text-primary shadow-sm backdrop-blur-md transition-colors hover:bg-surface-primary"
                                                >
                                                    <ChevronRight size={16} strokeWidth={2} />
                                                </motion.button>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    {/* Indicador de paginación estilo Apple (píldora translúcida) */}
                                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-surface-inverse/20 px-2 py-1.5 backdrop-blur-md transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                                        {previewImages.map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-300",
                                                    currentIndex === i ? "w-3 bg-surface-primary" : "w-1.5 bg-surface-primary/50"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-text-disabled">
                            <MdOutlineImageNotSupported size={28} />
                        </div>
                    )}

                    {/* Etiqueta Nuevo / Descuento */}
                    <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
                        {isNew && (
                            <span className="rounded-full bg-surface-primary/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-text-primary backdrop-blur-md shadow-sm">
                                Nuevo
                            </span>
                        )}
                        {discountPct > 0 && (
                            <span className="rounded-full bg-status-error/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-text-inverse backdrop-blur-md shadow-sm">
                                -{discountPct}%
                            </span>
                        )}
                    </div>

                    {/* Botón Favoritos (Esquina superior derecha) */}
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        className={cn(
                            "pointer-events-auto absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary/60 text-text-secondary shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-surface-primary hover:text-status-error",
                            // Si NO está en favoritos, lo ocultamos en escritorio hasta que haya hover en la tarjeta
                            !isFavorited && "md:opacity-0 md:group-hover:opacity-100"
                        )}
                    >
                        <Heart
                            size={16}
                            className={cn("transition-colors duration-300", isFavorited && "fill-status-error text-status-error")}
                        />
                    </button>
                </div>

                {/* ── INFORMACIÓN ── */}
                <div className="flex flex-1 flex-col gap-2 p-4">
                    {/* Selector de color y Marca */}
                    <div className="flex items-center justify-between gap-2">
                        <Small className="truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
                            {product.brand?.nombre || "\u00A0"}
                        </Small>

                        {uniqueColors.length > 0 && (
                            <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                                {uniqueColors.slice(0, 4).map((c, index) => (
                                    <button
                                        key={`${c}-${index}`}
                                        type="button"
                                        onClick={(e) => handleColorSelect(e, c)}
                                        className={cn(
                                            "flex items-center justify-center rounded-full p-[2px] transition-all duration-300 ease-out",
                                            selectedColor === c ? "scale-110 ring-1 ring-border-strong" : "hover:scale-110"
                                        )}
                                        aria-label={`Seleccionar color ${c}`}
                                    >
                                        <ColorCircle color={c} size={12} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Nombre */}
                    <H3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-relaxed tracking-tight text-text-primary transition-colors duration-300 group-hover:text-brand-accent sm:text-[15px]">
                        {product.nombre}
                    </H3>

                    {/* Precio y Acciones Footer */}
                    <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="flex flex-col">
                            {discountPct > 0 && (
                                <span className="text-[11px] font-medium line-through text-text-tertiary">
                                    S/ {product.precioComparativo!.toFixed(2)}
                                </span>
                            )}
                            <span className="text-[15px] font-semibold tracking-tight text-text-primary sm:text-base">
                                S/ {precio.toFixed(2)}
                            </span>
                        </div>

                        {stock <= 0 ? (
                            <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-[10px] font-medium text-text-disabled">
                                Agotado
                            </span>
                        ) : !hasVariants && product.isActive !== false ? (
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-text-inverse shadow-sm transition-all duration-300 hover:scale-105 hover:bg-brand-primary-light active:scale-95 md:opacity-0 md:-translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                                aria-label="Añadir al carrito"
                            >
                                <FaCartPlus size={14} />
                            </button>
                        ) : null}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}