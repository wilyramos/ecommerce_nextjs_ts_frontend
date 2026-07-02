// File: frontend/components/category/category-card.tsx

import Link from "next/link";
import Image from "next/image";
import type { CategoryResponse } from "@/src/schemas/category.schema";
import { routes } from "@/lib/routes";

export default function CategoryCard({ category }: { category: CategoryResponse }) {
    return (
        <Link
            href={routes.catalog({ category: category.slug })}
            className="group flex flex-col items-center p-6 bg-card border border-border rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-primary"
        >
            <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-background-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {category.image ? (
                    <Image
                        src={category.image}
                        alt={category.nombre}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                    />
                ) : (
                    <span className="text-primary font-bold text-2xl uppercase select-none">
                        {category.nombre.charAt(0)}
                    </span>
                )}
            </div>
            <h3 className="text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors line-clamp-1">
                {category.nombre}
            </h3>
        </Link>
    );
}