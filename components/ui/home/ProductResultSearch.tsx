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
            className="group block relative bg-white dark:bg-neutral-900 p-3 transition-all hover:shadow-xs hover:ring-1 hover:ring-gray-200 dark:hover:ring-neutral-700"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-neutral-800 mb-3">
                {item.imagenes?.[0] ? (
                    <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        sizes="(max-width: 768px) 40vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2 leading-snug min-h-[2.5rem] mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                    {item.nombre}
                </h3>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        S/. {item.precio?.toFixed(2)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
