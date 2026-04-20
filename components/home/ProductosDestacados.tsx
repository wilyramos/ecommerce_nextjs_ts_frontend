import { getDestacadosProducts } from '@/src/services/products';
import ProductCardHome from './product/ProductCardHome';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="bg-[var(--color-bg-primary)] py-6  border-y border-[var(--color-border-subtle)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Cabecera Premium */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0 mb-8 md:mb-12">
                    <div className="space-y-3 flex-1">
                      

                        {/* Título */}
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text-secondary)]">
                                Los productos más destacados del momento
                            </h2>
                         
                        </div>
                    </div>

                    {/* Link "Ver todo" - Desktop */}
                    <Link 
                        href="/productos" 
                        className="hidden md:flex items-center gap-2 text-[var(--color-action-tertiary)] hover:text-[var(--color-action-tertiary-hover)] font-semibold transition-colors group text-sm"
                    >
                        Ver todos 
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid de Productos */}
                <div
                    className="
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-3
                        md:gap-6
                        lg:gap-8
                    "
                >
                    {productos.slice(0, 8).map((product, idx) => (
                        <div 
                            key={product._id} 
                            className=""
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <ProductCardHome product={product} />
                        </div>
                    ))}
                </div>

                {/* CTA "Ver todos" - Mobile */}
                <div className="mt-8 md:hidden flex justify-center">
                    <Button 
                        asChild
                        variant="default"
                        size="default"
                        className="flex items-center gap-2"
                    >
                        <Link href="/productos">
                            Ver todos los productos
                            <ChevronRight size={16} />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}