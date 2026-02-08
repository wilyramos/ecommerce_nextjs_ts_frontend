import { getProduct } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service"; // <--- 1. Importar servicio

import EditProductForm from "@/components/admin/products/EditProductForm";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";

type Params = Promise<{
    id: string;
}>;

export default async function ProductDetailsPage({ params }: { params: Params }) {
    const { id } = await params;

    // 2. Optimización: Usamos Promise.all para cargar todo en paralelo
    // Esto reduce el tiempo de carga significativamente vs hacer await uno por uno.
    const [product, categorias, brands, lines] = await Promise.all([
        getProduct(id),
        getCategories(),
        getActiveBrands(),
        linesService.getAllActive(), // <--- Obtenemos las líneas
    ]);

    if (!product) {
        return (
            <div className="p-6 flex flex-col items-center gap-4">
                <h1 className="text-xl text-gray-600">Producto no encontrado</h1>
                <Link
                    href="/admin/products"
                    className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded"
                >
                    Volver a productos
                </Link>
            </div>
        );
    }

    return (
        <AdminPageWrapper
            title={`Editar: ${product.nombre}`}
            actions={
                <div className="flex gap-2">
                    <DeleteProductButton productId={product._id} />
                </div>
            }
        >
            <EditProductForm
                product={product}
                categorias={categorias}
                brands={brands}
                lines={lines} // <--- 3. Pasamos las líneas al formulario
            />
        </AdminPageWrapper>
    );
}