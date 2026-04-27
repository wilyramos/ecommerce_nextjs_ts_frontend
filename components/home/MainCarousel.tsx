"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ProductResponse } from "@/src/schemas";
import { CustomDot } from "../ui/CustomDot";
import { CustomArrow } from "../ui/CustomArrows";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet:  { breakpoint: { max: 1024, min: 768 },  items: 1 },
    mobile:  { breakpoint: { max: 768,  min: 0 },    items: 1 },
};

export default function MainCarousel({ products }: { products: ProductResponse[] }) {
    if (!products?.length) return null;

    return (
        <section className="w-full overflow-hidden">
            <Carousel
                responsive={responsive}
                autoPlay
                autoPlaySpeed={5500}
                infinite
                showDots
                renderDotsOutside={false}
                customDot={<CustomDot />}
                customLeftArrow={<CustomArrow direction="left" />}
                customRightArrow={<CustomArrow direction="right" />}
                containerClass="w-full"
                itemClass="w-full"
                dotListClass="!bottom-4 md:!bottom-6"
            >
                {products.map((product, index) => {
                    const imageUrl = product.imagenes?.[0] || "/logo.svg";
                    
                    const isDark = index % 2 === 0;
                    const bgColor = isDark ? "#0a0a0a" : "#ffffff";
                    const textColor = isDark ? "rgba(255,255,255,0.96)" : "#0f0f0f";
                    const subTextColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)";
                    const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
                    
                    const hasDiscount =
                        product.precioComparativo &&
                        product.precioComparativo > (product.precio ?? 0);
                    
                    const discount = hasDiscount
                        ? Math.round(((product.precioComparativo! - product.precio!) / product.precioComparativo!) * 100)
                        : null;

                    return (
                        <div key={product._id} className="w-full">
                            <Link
                                href={`/productos/${product.slug}`}
                                className="relative flex items-center justify-center w-full group outline-none overflow-hidden transition-colors duration-500"
                                style={{
                                    backgroundColor: bgColor,
                                    // Height reduced here
                                    minHeight: "clamp(380px, 55vh, 500px)",
                                }}
                            >
                                {/* ── BACKGROUND GLOW ── */}
                                <div
                                    aria-hidden
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: isDark 
                                            ? "radial-gradient(circle at 50% 50%, rgba(255,100,20,0.1) 0%, transparent 40%)"
                                            : "radial-gradient(circle at 50% 50%, rgba(255,80,20,0.04) 0%, transparent 40%)",
                                    }}
                                />

                                {/* ── RESPONSIVE GRID ── */}
                                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:grid md:grid-cols-[1fr_1.2fr_1fr] items-center gap-4 md:gap-4 py-8 md:py-0">

                                    {/* — COLUMN: Info — */}
                                    <div className="flex flex-col gap-2 md:gap-3 order-2 md:order-1 text-center md:text-left w-full">
                                        {product.brand?.nombre && (
                                            <div className="flex items-center justify-center md:justify-start gap-2">
                                                <span
                                                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                                                    style={{ color: subTextColor }}
                                                >
                                                    {product.brand.nombre}
                                                </span>
                                                <span className="hidden md:block flex-1 h-px" style={{ background: borderColor }} />
                                            </div>
                                        )}

                                        <h2
                                            className="font-black leading-[1.1] tracking-tighter"
                                            style={{
                                                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                                                color: textColor,
                                            }}
                                        >
                                            {product.nombre}
                                        </h2>

                                        <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                            <div className="flex items-start gap-0.5">
                                                <span className="font-bold text-xs md:text-sm mt-1" style={{ color: subTextColor }}>S/</span>
                                                <span className="font-black text-3xl md:text-5xl tracking-tighter" style={{ color: textColor }}>
                                                    {product.precio?.toFixed(2)}
                                                </span>
                                            </div>

                                            {hasDiscount && (
                                                <div className="flex flex-col items-start leading-none">
                                                    <span className="text-xs line-through opacity-50" style={{ color: textColor }}>
                                                        S/ {product.precioComparativo?.toFixed(2)}
                                                    </span>
                                                    <span className="bg-[#F5470E] text-white text-[10px] font-black px-1.5 py-0.5 mt-0.5">
                                                        −{discount}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* — COLUMN: Image — */}
                                    <div
                                        className="relative flex items-center justify-center order-1 md:order-2 w-full"
                                        style={{
                                            // Image height reduced to fit the smaller container
                                            height: "clamp(220px, 40vh, 400px)",
                                        }}
                                    >
                                        <div
                                            className="absolute w-3/4 h-3/4 rounded-full blur-[80px] opacity-30 pointer-events-none"
                                            style={{
                                                background: isDark ? "rgba(255,80,0,0.12)" : "rgba(255,120,0,0.06)",
                                            }}
                                        />

                                        <div className="relative w-full h-full transition-transform duration-1000 ease-out group-hover:scale-[1.03]">
                                            <Image
                                                src={imageUrl}
                                                alt={product.nombre || "Producto"}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 900px) 90vw, (max-width: 1600px) 70vw, 60vw"
                                                priority
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    {/* — COLUMN: Promo Label — */}
                                    <div className="flex flex-col gap-4 order-3 md:items-end w-full">
                                        {hasDiscount && (
                                            <div className="relative w-full max-w-[150px] h-[60px] mx-auto md:mr-0">
                                                <div
                                                    className="absolute top-0 right-0 flex items-center bg-[#F5470E] text-white font-black text-lg uppercase px-3 py-1 z-[2]"
                                                    style={{ transform: "rotate(2deg)" }}
                                                >
                                                    OFERTA
                                                </div>
                                                <div
                                                    className="absolute bottom-0 right-2 bg-black text-white dark:bg-white dark:text-black font-black text-sm uppercase px-3 py-1 z-[1]"
                                                    style={{ transform: "rotate(-2deg)" }}
                                                >
                                                    LIMITADA
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="hidden md:flex flex-col items-end">
                                             <p className="text-[9px] font-bold uppercase tracking-widest opacity-40" style={{ color: textColor }}>
                                                Envío gratis a todo el país
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── BOTTOM DECORATIVE LINE ── */}
                                <div
                                    aria-hidden
                                    className="absolute bottom-0 left-0 right-0 h-[1px] opacity-10"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${isDark ? '#fff' : '#000'}, transparent)`,
                                    }}
                                />
                            </Link>
                        </div>
                    );
                })}
            </Carousel>
        </section>
    );
}