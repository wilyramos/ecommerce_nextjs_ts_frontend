"use client";

import { useState, useEffect, useRef } from 'react';
import { PackageSearch, X, Search, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce"; // Opcional: npm install use-debounce

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
    
    // Debounce de 300ms para evitar múltiples llamadas al servidor
    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Lógica de búsqueda conectada al Servidor
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const results = await searchProductsAction(debouncedSearch);
                setProducts(results);
            } catch (error) {
                console.error("Error fetching products:", error);
                console.error("Search error");
            } finally {
                setIsLoading(false);
            }
        };

        // Si hay búsqueda, consultamos al servidor; si no, volvemos a los iniciales
        if (debouncedSearch.length > 0) {
            fetchProducts();
        } else {
            setProducts(initialProducts);
            setIsLoading(false);
        }
    }, [debouncedSearch, initialProducts]);

    // Shortcut '/' para enfocar
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
        <div className="flex h-full w-full overflow-hidden bg-[#F8F9FA]">
            <section className="flex flex-1 flex-col min-w-0 relative">
                <header className="p-4 md:p-6 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-6xl mx-auto">
                        
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin text-black" />
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
                                className="w-full h-14 pl-14 pr-12 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold transition-all outline-none focus:bg-white focus:border-black placeholder:text-slate-400"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-red-500 transition-colors"
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
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6">
                            <div className="h-32 w-32 bg-white rounded-[2.5rem] flex items-center justify-center border border-slate-100 shadow-inner">
                                <PackageSearch size={48} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sin resultados</p>
                                <p className="text-[10px] font-bold text-slate-300 uppercase">Intente con otro SKU o escanee nuevamente</p>
                            </div>
                        </div>
                    )}
                    <div className="h-28 lg:hidden" />
                </main>
            </section>

            <aside className={cn(
                "fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white transition-all duration-500 lg:relative lg:translate-x-0 lg:border-l lg:border-slate-100",
                isMobileCartOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"
            )}>
                <CartSidebar userId={userId} onClose={() => setIsMobileCartOpen(false)} />
            </aside>
        </div>
    );
}