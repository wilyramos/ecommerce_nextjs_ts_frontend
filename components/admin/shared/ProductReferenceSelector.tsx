//File: frontend/components/admin/shared/ProductReferenceSelector.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    Search,
    Package,
    Loader2,
    CheckCircle2,
    X,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Product {
    _id: string;
    nombre: string;
    precio: number;
    imagenes?: string[];
}

interface Props {
    name?: string;
    initialProduct?: Product | null;
    initialId?: string;
    label?: string;
    onSelect?: (id: string) => void;
}

export default function ProductReferenceSelector({
    name = "referenceId",
    initialProduct = null,
    initialId,
    label = "Producto Vinculado",
    onSelect,
}: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Product | null>(initialProduct);
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        const hydrate = async () => {
            if (selected || !initialId) return;

            try {
                const res = await fetch("/api/products/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ids: [initialId],
                    }),
                });

                if (!res.ok) return;

                const data: Product[] = await res.json();

                if (data?.length) {
                    setSelected(data[0]);
                }
            } catch (error) {
                console.error(error);
            }
        };

        hydrate();
    }, [initialId, selected]);

    const handleSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `/api/products/search?q=${encodeURIComponent(query)}`
            );

            const data = await res.json();

            setResults(Array.isArray(data) ? data : data.products || []);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search, handleSearch]);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>

            {selected ? (
                <div className="flex items-center gap-3 border rounded-md p-2">
                    <div className="relative w-12 h-12 border bg-white shrink-0">
                        <Image
                            src={selected.imagenes?.[0] || "/placeholder.png"}
                            alt={selected.nombre}
                            fill
                            className="object-contain p-1"
                            unoptimized
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs">{selected.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                            S/ {selected.precio.toFixed(2)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSelected(null);
                            if (onSelect) onSelect("");
                        }}
                        className="p-1 hover:opacity-70"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="border border-dashed rounded-md p-4 text-xs text-muted-foreground flex items-center justify-center">
                    Ningún producto seleccionado
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                    >
                        <Package className="w-4 h-4 mr-2" />
                        Buscar Producto
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>
                            Buscar Producto
                        </DialogTitle>

                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar producto..."
                                className="pl-10"
                            />
                        </div>
                    </DialogHeader>

                    <div className="h-[50vh] overflow-y-auto p-6 space-y-1">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="animate-spin w-5 h-5" />
                            </div>
                        ) : results.length ? (
                            results.map((product) => {
                                const active =
                                    selected?._id === product._id;

                                return (
                                    <button
                                        type="button"
                                        key={product._id}
                                        onClick={() => {
                                            setSelected(product);
                                            setOpen(false);
                                            if (onSelect) onSelect(product._id);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-2 border-b text-left transition-colors",
                                            active
                                                ? "bg-muted"
                                                : "hover:bg-muted/50"
                                        )}
                                    >
                                        <div className="relative w-12 h-12 border bg-white shrink-0">
                                            <Image
                                                src={
                                                    product.imagenes?.[0] ||
                                                    "/placeholder.png"
                                                }
                                                alt={product.nombre}
                                                fill
                                                className="object-contain p-1"
                                                unoptimized
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">
                                                {product.nombre}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                S/{" "}
                                                {product.precio.toFixed(2)}
                                            </p>
                                        </div>

                                        {active && (
                                            <CheckCircle2 className="w-4 h-4" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                {search.length >= 2
                                    ? "Sin resultados"
                                    : "Escribe para buscar"}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <input
                type="hidden"
                name={name}
                value={selected?._id || ""}
            />
        </div>
    );
}