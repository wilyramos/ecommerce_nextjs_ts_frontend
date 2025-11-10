"use client";

import Image from "next/image";
import Link from "next/link";
import type { TProductListSchema } from "@/src/schemas";

type Props = {
    item: TProductListSchema;
};

export default function ProductResultSearch({ item }: Props) {
    return (
        <li className="hover:bg-gray-50 transition">
            <Link
                href={`/productos/${item.slug}`}
                className="flex items-center gap-2 p-2 cursor-pointer"
            >
                {item.imagenes?.[0] ? (
                    <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        width={56}
                        height={56}
                        className="w-12 h-12 object-cover "
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                )}

                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-gray-800 text-xs md:text-sm font-medium truncate">
                        {item.nombre}
                    </span>
                    <span className="text-gray-800 text-sm">
                        S/. {item.precio?.toFixed(2)}
                    </span>
                </div>
            </Link>
        </li>
    );
}
