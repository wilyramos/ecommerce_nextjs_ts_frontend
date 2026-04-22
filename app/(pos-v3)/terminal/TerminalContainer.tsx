"use client";

import { useState, useEffect, useRef } from 'react';
import { PackageSearch, X, Search, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

// Acciones y UI
import { searchProductsAction } from '@/actions/product-actions';
import { ProductGrid } from '@/src/components/pos/ProductGrid';
import { CartSidebar } from '@/src/components/pos/CartSidebar';
import { Product } from '@/src/schemas/product.schema';
import { cn } from '@/lib/utils';

interface TerminalContainerProps {
    initialProducts: Product[];
    isCashOpen: boolean;
    userId: string;
}

export default function TerminalContainer({ initialProducts, userId }: TerminalContainerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const results = await searchProductsAction(debouncedSearch);
                setProducts(results);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (debouncedSearch.length > 0) {
            fetchProducts();
        } else {
            setProducts(initialProducts);
            setIsLoading(false);
        }
    }, [debouncedSearch, initialProducts]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-full w-full overflow-hidden bg-[var(--color-bg-secondary)]">
            <section className="flex flex-1 flex-col min-w-0 relative">
                <header className="p-4 md:p-6 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] sticky top-0 z-20 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-6xl mx-auto">

                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[var(--color-text-tertiary)]">
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin text-[var(--color-text-primary)]" />
                                ) : (
                                    <Search size={20} strokeWidth={2.5} />
                                )}
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Busca productos o escanea código [ / ]..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-14 pr-12 bg-[var(--color-bg-tertiary)] border-2 border-transparent rounded-2xl text-sm font-bold transition-all outline-none focus:bg-[var(--color-bg-primary)] focus:border-[var(--color-action-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-5 flex items-center text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {products.length > 0 ? (
                        <div className="max-w-7xl mx-auto">
                            <ProductGrid products={products} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-tertiary)] space-y-6">
                            <div className="h-32 w-32 bg-[var(--color-bg-primary)] rounded-[2.5rem] flex items-center justify-center border border-[var(--color-border-subtle)] shadow-inner">
                                <PackageSearch size={48} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Sin resultados</p>
                                <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase">Intente con otro SKU o escanee nuevamente</p>
                            </div>
                        </div>
                    )}
                    <div className="h-28 lg:hidden" />
                </main>
            </section>

            <aside className={cn(
                "fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[var(--color-bg-primary)] transition-all duration-500 lg:relative lg:translate-x-0 lg:border-l lg:border-[var(--color-border-subtle)]",
                isMobileCartOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"
            )}>
                <CartSidebar userId={userId} onClose={() => setIsMobileCartOpen(false)} />
            </aside>
        </div>
    );
}