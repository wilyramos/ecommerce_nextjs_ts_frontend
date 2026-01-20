import { getDestacadosProducts } from '@/src/services/products';
import ProductCardHome from './product/ProductCardHome';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="bg-[var(--store-bg)] py-12 md:py-20 border-b border-[var(--store-border)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Cabecera Estilo Apple */}
                <div className="flex items-end justify-between mb-8 md:mb-12">
                    <div className="space-y-1">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--store-text)]">
                            Lo mejor de GoPhone.
                            <span className="text-[var(--store-text-muted)] block md:inline md:ml-2">
                                Calidad que puedes sentir.
                            </span>
                        </h2>
                    </div>

                    {/* Link "Ver todo" sutil */}
                    <Link 
                        href="/productos" 
                        className="hidden md:flex items-center gap-1 text-[var(--store-primary)] hover:underline font-medium transition-all"
                    >
                        Ver todos <ChevronRight size={18} />
                    </Link>
                </div>

                {/* Grid de Productos */}
                <div
                    className="
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-4
                        md:gap-8
                    "
                >
                    {productos.slice(0, 8).map((product) => (
                        <div key={product._id} className="transition-transform duration-500 hover:scale-[1.02]">
                            <ProductCardHome product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link 
                        href="/productos" 
                        className="text-[var(--store-primary)] font-medium flex items-center gap-1"
                    >
                        Ver todos los productos <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}