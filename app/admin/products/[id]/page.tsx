import { getProduct } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import EditProductForm from "@/components/admin/products/EditProductForm";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";
import Link from "next/link";

type Params = Promise<{
    id: string;
}>;

export default async function ProductDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const categorias = await getCategories();
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <h1 className="text-2xl text-gray-600">Producto no encontrado</h1>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto p-6 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-2">
                <h1 className="text-xl font-semibold text-gray-800">{product.nombre}</h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/products"
                        className="bg-gray-700 hover:bg-gray-900 text-white px-3 py-1 rounded text-sm"
                    >
                        Volver
                    </Link>
                    <DeleteProductButton productId={product._id} />
                </div>
            </div>

            <EditProductForm product={product} categorias={categorias} />
        </div>
    );
}
