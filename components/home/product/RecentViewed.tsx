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
        <section className="max-w-7xl mx-auto py-6 ">
            <h3 className="text-lg uppercase font-normal mb-3 text-neutral-900">Vistos recientemente</h3>
            <div className="">
                <div className="border-b border-2 border-black w-14 md:w-20 mb-4"></div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.map((p) => (
                    <Link
                        key={p.slug}
                        href={`/productos/${p.slug}`}
                        className="group bg-white"
                    >
                        <div className="relative w-full h-32">
                            {p.imagenes && p.imagenes.length > 0 ? (
                                <Image
                                    src={p.imagenes[0]}
                                    alt={p.nombre}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                    <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                            )}
                        </div>

                        <p className="text-sm font-medium mt-2 line-clamp-2">{p.nombre}</p>
                        <p className="text-sm  text-neutral-900">
                            S/. {p.precio?.toFixed(2)}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
