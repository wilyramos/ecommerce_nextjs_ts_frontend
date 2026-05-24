// File: frontend/components/admin/collections/AssignedProductsList.tsx

"use client";

import { useState } from "react";
import { removeProductFromCollectionAction } from "@/src/actions/collection-action";
import { Button } from "@/components/ui/button";
import { CollectionProduct } from "@/src/schemas/collection.schema";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/ui/Pagination";

interface Props {
    products: CollectionProduct[];
    collectionId: string;
    slug: string;
    pagination: { total: number; page: number; limit: number; pages: number };
    currentPage: number;
    pathname: string;
}

export default function AssignedProductsList({
    products,
    collectionId,
    slug,
    pagination,
    currentPage,
    pathname,
}: Props) {
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    const handleRemove = async (productId: string) => {
        setRemovingIds(prev => new Set(prev).add(productId));
        const result = await removeProductFromCollectionAction(collectionId, slug, productId);
        if (result.success) {
            toast.success("Producto desvinculado");
        } else {
            toast.error(result.error || "Error al desvincular");
            setRemovingIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    if (products.length === 0 && currentPage === 1) {
        return (
            <div className="border border-border/60 rounded-sm p-10 text-center">
                <p className="text-xs text-muted-foreground font-medium">
                    No hay productos asignados a esta colección todavía.
                </p>
            </div>
        );
    }

    return (
        <div className="border border-border/60 rounded-sm overflow-hidden">

            {/* Header */}
            <div className="px-4 py-3 border-b border-border/60 bg-background-secondary/30">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {pagination.total} producto{pagination.total !== 1 ? "s" : ""} asignado{pagination.total !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Lista */}
            <div className="divide-y divide-border/40">
                {products.map((product) => {
                    const isRemoving = removingIds.has(product._id);
                    const hasDiscount = product.precioComparativo && product.precioComparativo > product.precio;

                    return (
                        <div
                            key={product._id}
                            className={cn(
                                "p-3 flex items-center gap-3 transition-colors",
                                isRemoving ? "opacity-50" : "hover:bg-background-secondary/40"
                            )}
                        >
                            {/* Imagen */}
                            <div className="relative w-10 h-10 rounded-sm border border-border/40 overflow-hidden shrink-0 bg-background">
                                <Image
                                    src={product.imagenes?.[0] || "/placeholder.png"}
                                    alt={product.nombre}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-xs">
                                <div className="flex items-center gap-1.5">
                                    {product.esDestacado && (
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                                    )}
                                    <p className="font-medium text-foreground truncate">
                                        {product.nombre}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-bold text-foreground">
                                        S/ {product.precio.toFixed(2)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-muted-foreground line-through">
                                            S/ {product.precioComparativo!.toFixed(2)}
                                        </span>
                                    )}
                                    {product.stock !== undefined && (
                                        <span className={cn(
                                            "font-medium",
                                            product.stock === 0 ? "text-destructive" : "text-muted-foreground"
                                        )}>
                                            {product.stock === 0 ? "Sin stock" : `${product.stock} uds`}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Acción */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] h-7 font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10 shrink-0"
                                onClick={() => handleRemove(product._id)}
                                disabled={isRemoving}
                            >
                                {isRemoving
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : "Remover"
                                }
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
                <div className="border-t border-border/60">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.pages}
                        limit={pagination.limit}
                        pathname={pathname}
                    />
                </div>
            )}
        </div>
    );
}