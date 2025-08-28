import Link from "next/link";
import { MdOutlineArrowBackIos } from "react-icons/md";
import ProductSearchInputPurchase from "@/components/POS/compras/ProductSearchInputPurchase";
import NewPurchaseForm from "@/components/POS/compras/NewPurchaseForm";
import { getProductList } from "@/src/services/products";
import ProductResultsPurchase from "@/components/POS/compras/ProductResultsPurchase";

type SearchParams = Promise<{
    q?: string;
}>;

export default async function NewPurchasePage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const dataProducts = await getProductList({ q: params.q });

    return (
        <main className="p-2">
            {/* Header principal */}
            <header className="flex items-center border-b pb-2 border-gray-300">
                <nav aria-label="Volver a compras">
                    <Link
                        href="/pos/compras"
                        className="flex items-center text-gray-600 hover:text-black"
                    >
                        <MdOutlineArrowBackIos className="mr-1" />
                        <span className="text-sm font-medium">Volver</span>
                    </Link>
                </nav>
                <h1 className="text-xl font-bold px-4">Nueva Compra</h1>
            </header>

            {/* Búsqueda de productos */}
            <section className="py-2 mx-auto max-w-3xl" aria-labelledby="buscar-productos">
                <h2 id="buscar-productos" className="sr-only">
                    Buscar productos
                </h2>
                <ProductSearchInputPurchase />
            </section>

            {/* Resultados de productos */}
            <section aria-labelledby="resultados-productos" className="mx-auto max-w-3xl">
                <h2 id="resultados-productos" className="sr-only">
                    Resultados de búsqueda de productos
                </h2>
                <ProductResultsPurchase dataProducts={dataProducts} />
            </section>

            {/* Formulario de compra */}
            <section className="py-2 max-w-3xl mx-auto" aria-labelledby="formulario-compra">
                <h2 id="formulario-compra" className="sr-only">
                    Formulario de compra
                </h2>
                <NewPurchaseForm />
            </section>
        </main>
    );
}
