import Link from "next/link";
import { MdOutlineArrowBackIos } from "react-icons/md";
import ProductSearchInputPurchase from "@/components/POS/compras/ProductSearchInputPurchase";
import NewPurchaseForm from "@/components/POS/compras/NewPurchaseForm";
import { getProductList } from "@/src/services/products";
import type { ProductResponse } from "@/src/schemas";
import ProductResultsPurchase from "@/components/POS/compras/ProductResultsPurchase";

type SearchParams = Promise<{
    q?: string;
}>;

export default async function NewPurchasePage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;


    const dataProducts = await getProductList({ q: params.q });
    

    return (
        <section className="p-2">
            {/* Header */}
            <header className="flex items-center border-b pb-2 border-gray-300">
                <Link href="/pos/compras" className="flex items-center text-gray-600 hover:text-black">
                    <MdOutlineArrowBackIos className="mr-1" />
                    <span className="text-sm font-medium">Volver</span>
                </Link>
                <h1 className="text-xl font-bold px-4">Nueva Compra</h1>
            </header>

            <div className="py-2">
                <ProductSearchInputPurchase />
            </div>

            <div>
                <ProductResultsPurchase
                    dataProducts={dataProducts}
                />
            </div>

            <main className="py-2 space-y-4">
                {/* Formulario de compra */}
                <NewPurchaseForm />
            </main>
        </section>
    );
}
