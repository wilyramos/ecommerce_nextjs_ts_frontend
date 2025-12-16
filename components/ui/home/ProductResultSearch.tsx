"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { TProductListSchema } from "@/src/schemas";

type Props = {
    item: TProductListSchema;
    onClickResult?: () => void;
};

export default function ProductResultSearch({ item, onClickResult }: Props) {
    return (
        <Link
            href={`/productos/${item.slug}`}
            onClick={onClickResult}
            className="group block relative bg-white p-3 transition-all hover:shadow-xs "
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
                {item.imagenes?.[0] ? (
                    <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        sizes="(max-width: 768px) 40vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        quality={10}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-normal text-gray-700 line-clamp-2 leading-snug min-h-[2.5rem] mb-1 group-hover:text-gray-600 transition-colors">
                    {item.nombre}
                </h3>

                <div className="flex gap-2">
                    <span className="text-sm text-gray-900">
                        S/. {item.precio?.toFixed(2)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
