import { getProduct } from "@/src/services/products";
import EditProductForm from "@/components/admin/products/EditProductForm";
import { getCategories } from "@/src/services/categorys";


type params = Promise<{
    id: string;
}>; // This is a promise that resolves to an object with an id property

export default async function ProductDetailsPage({ params }: { params: params }) {
    const { id } = await params;

    const product = await getProduct(id); // Fetch the product details using the id

    const categorias = await getCategories();

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <h1 className="text-3xl font-semibold text-gray-700">No hay producto</h1>
            </div>
        );
    }

    return (
        <>

            <div className="p-6">
                <h1 className="text-3xl font-semibold text-gray-700">{product.nombre}</h1>

                <div>
                    <EditProductForm product={product} categorias={categorias} />
                </div>

            </div>


        </>
    )
}
