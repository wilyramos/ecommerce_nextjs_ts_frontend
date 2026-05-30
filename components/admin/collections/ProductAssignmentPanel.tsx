// File: frontend/components/admin/collections/ProductAssignmentPanel.tsx

"use client";

import { useTransition, useState, useCallback, useEffect } from "react";
import { addProductsToCollectionAction } from "@/src/actions/collection-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Loader2, X, CheckCircle2, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SearchProduct {
    _id: string;
    nombre: string;
    precio: number;
    imagenes?: string[];
    stock?: number;
}

interface Props {
    collectionId: string;
    slug: string;
    assignedIds: string[]; // Para marcar los ya asignados
}

export default function ProductAssignmentPanel({ collectionId, slug, assignedIds }: Props) {
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) { setResults([]); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(Array.isArray(data) ? data : data.products || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => handleSearch(search), 400);
        return () => clearTimeout(t);
    }, [search, handleSearch]);

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleAssign = () => {
        if (selected.size === 0) return;
        startTransition(async () => {
            const result = await addProductsToCollectionAction(
                collectionId,
                slug,
                Array.from(selected)
            );
            if (result.success) {
                toast.success(`${selected.size} producto${selected.size > 1 ? "s" : ""} vinculado${selected.size > 1 ? "s" : ""}`);
                setSelected(new Set());
                setSearch("");
                setResults([]);
            } else {
                toast.error(result.error || "Error al vincular productos");
            }
        });
    };

    return (
        <div className="space-y-3">

            {/* Buscador */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar producto..."
                    className="pl-9 text-xs h-9"
                />
                {search && (
                    <button
                        onClick={() => { setSearch(""); setResults([]); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Seleccionados */}
            {selected.size > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-background-secondary rounded-sm border border-border/60">
                    <span className="text-xs text-muted-foreground">
                        <span className="font-bold text-foreground">{selected.size}</span> seleccionado{selected.size > 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelected(new Set())}
                            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Limpiar
                        </button>
                        <Button
                            size="sm"
                            className="h-7 text-[10px] font-bold uppercase tracking-wider px-3"
                            onClick={handleAssign}
                            disabled={isPending}
                        >
                            {isPending
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <><Plus className="w-3 h-3 mr-1" /> Vincular</>
                            }
                        </Button>
                    </div>
                </div>
            )}

            {/* Resultados */}
            <div className="border border-border/60 rounded-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="divide-y divide-border/40 max-h-[400px] overflow-y-auto">
                        {results.map((product) => {
                            const isSelected = selected.has(product._id);
                            const isAssigned = assignedIds.includes(product._id);

                            return (
                                <button
                                    key={product._id}
                                    type="button"
                                    onClick={() => !isAssigned && toggleSelect(product._id)}
                                    disabled={isAssigned}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 text-left transition-colors",
                                        isAssigned && "opacity-50 cursor-not-allowed bg-background-secondary/30",
                                        isSelected && !isAssigned && "bg-background-secondary",
                                        !isSelected && !isAssigned && "hover:bg-background-secondary/50"
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
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">
                                            {product.nombre}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-muted-foreground">
                                                S/ {product.precio.toFixed(2)}
                                            </span>
                                            {product.stock !== undefined && (
                                                <span className={cn(
                                                    "text-[10px] font-medium",
                                                    product.stock === 0 ? "text-destructive" : "text-muted-foreground"
                                                )}>
                                                    {product.stock === 0 ? "Sin stock" : `${product.stock} uds`}
                                                </span>
                                            )}
                                          
                                        </div>
                                    </div>

                                    {/* Estado */}
                                    <div className="shrink-0">
                                        {isAssigned ? (
                                            <span className="text-[10px] text-muted-foreground font-medium">Ya asignado</span>
                                        ) : isSelected ? (
                                            <CheckCircle2 className="w-4 h-4 text-action-cta" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-border" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-10 text-center text-xs text-muted-foreground">
                        {search.length >= 2 ? "Sin resultados" : "Escribe para buscar productos"}
                    </div>
                )}
            </div>
        </div>
    );
}