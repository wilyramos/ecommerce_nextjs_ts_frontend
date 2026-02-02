"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductWithCategoryResponse } from "@/src/schemas";

type Props = {
    products: ProductWithCategoryResponse[];
};

export default function RecentViewed({ products }: Props) {
    if (!products.length) return null;

    return (
        <section
            className="
        max-w-7xl mx-auto
        md:px-4
        py-8
      "
        >
            {/* Header */}
            <header className="mb-6">
                <h3
                    className="
            text-sm md:text-base
            uppercase
            tracking-wide
            font-medium
            text-[var(--store-text)]
          "
                >
                    Vistos recientemente
                </h3>

                <div
                    className="
            mt-2
            h-[2px]
            w-16 md:w-20
            bg-[var(--store-primary)]
          "
                />
            </header>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {products.map((p) => (
                    <Link
                        key={p.slug}
                        href={`/productos/${p.slug}`}
                        className="
              group
              block
              bg-[var(--store-surface)]
              rounded-sm
              p-2
              transition-colors
              hover:bg-[var(--store-surface-hover)]
            "
                    >
                        {/* Imagen */}
                        <div
                            className="
                relative
                w-full
                h-32
                mb-2
                overflow-hidden
                bg-[var(--store-surface)]
              "
                        >
                            {p.imagenes?.length ? (
                                <Image
                                    src={p.imagenes[0]}
                                    alt={p.nombre}
                                    fill
                                    quality={10}
                                    className="
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                                />
                            ) : (
                                <div
                                    className="
                    flex items-center justify-center
                    w-full h-full
                    text-xs
                    uppercase tracking-widest
                    text-[var(--store-text-muted)]
                  "
                                >
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <p
                            className="
                text-xs md:text-sm
                font-medium
                line-clamp-2
                text-[var(--store-text)]
                transition-colors
                group-hover:text-[var(--store-primary)]
              "
                        >
                            {p.nombre}
                        </p>

                        <p
                            className="
                mt-1
                text-sm
                font-semibold
                text-[var(--store-text)]
              "
                        >
                            S/. {p.precio?.toFixed(2)}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
