import { getPurchases } from "@/src/services/purchases";
import ComprasTable from "@/components/POS/compras/ComprasTable";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { HeadingH2 } from "@/components/ui/Heading";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
    sort?: string;
    numeroCompra?: string;
    proveedor?: string;
    fecha?: string;
    // total?: string;    
}>;

export default async function ComprasPage({ searchParams }: { searchParams: SearchParams }) {
    const { page, limit, numeroCompra, proveedor, fecha } = await searchParams;
    const currentPage = page ? parseInt(page, 10) : 1;
    const itemsPerPage = limit ? parseInt(limit, 10) : 10;

    // 👉 Pasamos filtros y orden a la función del servicio
    const purchasesResponse = await getPurchases({
        page: currentPage,
        limit: itemsPerPage,
        numeroCompra,
        proveedor,
        fecha
    });


    console.log("Purchases response:", purchasesResponse);

    return (
        <div>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                <HeadingH2>Compras</HeadingH2>

                <div>
                    <Link href="/pos/compras/new" className="bg-rose-600 text-white px-4 py-2 rounded-2xl hover:bg-rose-700 transition font-bold">
                        Nueva Compra
                    </Link>
                </div>
            </div>

            <>
                <ComprasTable purchases={purchasesResponse?.purchases} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={purchasesResponse?.total ?? 1}
                    limit={itemsPerPage}
                    pathname="/pos/compras"
                />
            </>
        </div>
    );
}
