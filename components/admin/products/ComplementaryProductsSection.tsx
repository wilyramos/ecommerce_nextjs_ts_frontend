"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, Package, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface SelectedProduct {
    _id: string;
    nombre: string;
    precio: number;
    imagenes?: string[];
}

interface Props {
    initialItems?: (SelectedProduct | string)[];
}

export default function ComplementaryProductsSection({ initialItems = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [searchResults, setSearchResults] = useState<SelectedProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    useEffect(() => {
        const hydrate = async () => {
            const idsToFetch = initialItems.filter(item => typeof item === 'string') as string[];
            const alreadyPopulated = initialItems.filter(item => typeof item !== 'string') as SelectedProduct[];

            if (idsToFetch.length === 0) {
                setSelectedProducts(alreadyPopulated);
                return;
            }

            setLoadingInitial(true);
            try {
                const res = await fetch("/api/products/batch", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids: idsToFetch })
                });
                if (!res.ok) throw new Error("Hydration failed");
                const fetched: SelectedProduct[] = await res.json();
                setSelectedProducts([...alreadyPopulated, ...fetched]);
            } catch (error) {
                console.error("Error hydrating complementary products:", error);
                setSelectedProducts(alreadyPopulated);
            } finally {
                setLoadingInitial(false);
            }
        };
        hydrate();
    }, [initialItems]);

    const handleSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setLoadingSearch(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(Array.isArray(data) ? data : (data.products || []));
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setLoadingSearch(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) handleSearch(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, handleSearch]);

    const toggleProduct = (product: SelectedProduct) => {
        const isSelected = selectedProducts.some(p => p._id === product._id);
        setSelectedProducts(prev => 
            isSelected ? prev.filter(p => p._id !== product._id) : [...prev, product]
        );
    };

    return (
        <div className="p-5 border border-border/60 bg-background rounded-sm space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Complementarios ({selectedProducts.length})</Label>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider gap-1.5 px-3 rounded-sm">
                            <Plus className="w-3.5 h-3.5" /> Vincular
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl bg-background border border-border rounded-sm shadow-xs outline-none">
                        <DialogHeader>
                            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                                Buscar Productos
                            </DialogTitle>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Escribe para buscar..." 
                                    className="h-10 pl-9 bg-background-secondary border-border/40 rounded-sm text-xs focus:border-muted-foreground/60 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </DialogHeader>

                        <div className="h-[300px] overflow-y-auto space-y-1 py-2">
                            {loadingSearch ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((p) => {
                                    const isSelected = selectedProducts.some(sel => sel._id === p._id);
                                    return (
                                        <div 
                                            key={p._id} 
                                            onClick={() => toggleProduct(p)}
                                            className={cn(
                                                "flex items-center gap-3 p-2 rounded-sm transition-colors cursor-pointer border border-transparent",
                                                isSelected ? "bg-background-secondary border-action-cta/20" : "hover:bg-background-secondary/60"
                                            )}
                                        >
                                            <div className="relative w-10 h-10 bg-background border border-border/40 rounded-sm overflow-hidden flex items-center justify-center shrink-0">
                                                <Image src={p.imagenes?.[0] || "/placeholder.png"} alt={p.nombre} fill className="object-contain p-0.5 mix-blend-multiply" unoptimized />
                                            </div>
                                            <div className="flex-1 text-xs">
                                                <p className="font-bold text-foreground">{p.nombre}</p>
                                                <p className="text-muted-foreground">S/ {p.precio.toFixed(2)}</p>
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-action-cta" />}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center text-xs text-muted-foreground/60 font-medium">
                                    {searchTerm.length >= 2 ? "Sin resultados" : "Escribe para buscar productos"}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-border/40">
                            <Button onClick={() => setIsModalOpen(false)} size="sm" className="text-xs font-bold rounded-sm px-6">Cerrar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {loadingInitial ? (
                    <div className="col-span-full py-4 flex justify-center">
                        <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                    </div>
                ) : selectedProducts.map((p) => (
                    <div key={`sel-${p._id}`} className="flex items-center gap-3 p-2 border border-border/40 bg-background-secondary/30 rounded-sm group">
                        <div className="relative w-8 h-8 bg-background border border-border/40 rounded-sm overflow-hidden flex-shrink-0">
                            <Image src={p.imagenes?.[0] || "/placeholder.png"} alt={p.nombre} fill className="object-contain p-0.5 mix-blend-multiply" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0 text-[11px]">
                            <p className="font-bold text-foreground truncate">{p.nombre}</p>
                            <p className="text-muted-foreground">S/ {p.precio.toFixed(2)}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedProducts(prev => prev.filter(i => i._id !== p._id))}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors outline-none"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <input type="hidden" name="complementarios" value={p._id} />
                    </div>
                ))}

                {!loadingInitial && selectedProducts.length === 0 && (
                    <div className="col-span-full p-4 border border-dashed border-border/60 flex items-center justify-center gap-2 bg-background-secondary/20">
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground/60">Sin productos vinculados</span>
                    </div>
                )}
            </div>
        </div>
    );
}