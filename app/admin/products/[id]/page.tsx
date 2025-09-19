import { getProduct } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import EditProductForm from "@/components/admin/products/EditProductForm";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";
import Link from "next/link";
import BackButton from "../../../../components/ui/BackButton";
import { getActiveBrands } from "@/src/services/brands";
// import EditStatusProductButton from "@/components/admin/products/EditStatusProductButton";

type Params = Promise<{
    id: string;
}>;

export default async function ProductDetailsPage({ params }: { params: Params }) {
    
    const { id } = await params;
    const categorias = await getCategories();
    const product = await getProduct(id);
    const brands = await getActiveBrands();

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
        <div className="">
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-2">
                <h1 className="text-xl font-semibold text-gray-800">{product.nombre}</h1>
                <div className="flex gap-2">
                    <BackButton />
                    <DeleteProductButton productId={product._id} />
                    {/* <EditStatusProductButton productId={product._id} isActive={product.isActive} /> */}
                </div>
            </div>

            <EditProductForm product={product} categorias={categorias} brands={brands} />
        </div>
    );
}
