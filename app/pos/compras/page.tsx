import { getPurchases } from "@/src/services/purchases";
import ComprasTable from "@/components/POS/compras/ComprasTable";
import Pagination from "@/components/ui/Pagination";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
    sort?: string;
}>;

export default async function ComprasPage({ searchParams }: { searchParams: SearchParams }) {
    const { page, limit, query, sort } = await searchParams;
    const currentPage = page ? parseInt(page, 10) : 1;
    const itemsPerPage = limit ? parseInt(limit, 10) : 10;

    // 👉 Pasamos filtros y orden a la función del servicio
    const purchasesResponse = await getPurchases({
        page: currentPage,
        limit: itemsPerPage,
        query,
        sort,
    });
    console.log("Purchases response:", purchasesResponse.purchases);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 border-b-4 border-rose-600">Lista de Compras</h2>

            {purchasesResponse.purchases.length > 0 ? (
                <>
                    <ComprasTable purchases={purchasesResponse.purchases} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(purchasesResponse.total / itemsPerPage)}
                        limit={itemsPerPage}
                        pathname="/pos/compras"
                    />
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No se encontraron compras.</p>
                </div>
            )}
        </div>
    );
}
