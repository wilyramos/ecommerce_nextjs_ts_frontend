import AddProductButton from "@/components/admin/products/AddProductButton";
import Link from "next/link";
import { getProducts } from "@/src/services/products";
import ProductsTable from "@/components/admin/products/ProductsTable";
import Pagination from "@/components/ui/Pagination";



type SearchParams = {
    page?: string;
    limit?: string;
};

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams; // Añade await aquí
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;

    // Obtener los productos desde la API
    const productsData = await getProducts({ page: currentPage, limit: itemsPerPage });

    if (!productsData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-700">No hay productos</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Listado de Productos</h1>
                <AddProductButton />
            </div>

            {/* Enlace a categorías */}
            <div className="mb-4">
                <Link
                    href="/admin/products/category"
                    className="text-blue-600 hover:underline text-sm"
                >
                    Ver Categorías →
                </Link>
            </div>

            {/* Tabla de productos */}
            <ProductsTable products={productsData} />

            {/* Paginación */}
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(productsData.totalProducts / itemsPerPage)}
                limit={itemsPerPage}
                pathname="/admin/products"
            />
        </div>
    );
}