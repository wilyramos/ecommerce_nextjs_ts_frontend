import { getProduct } from "@/src/services/products";
import EditProductForm from "@/components/admin/products/EditProductForm";
import { getCategories } from "@/src/services/categorys";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";


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

            <div className="p-2">
                <div className="flex justify-between items-center">

                    <h1 className="text-xl font-semibold text-gray-700">{product.nombre}</h1>
                    <div className="flex gap-2">
                        <Link
                            href={"/admin/products"}
                            className="bg-gray-800 text-white text-sm font-bold px-4 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out md:block"
                        >
                            Volver
                        </Link>
                        <DeleteProductButton productId={product._id} />

                        
                    </div>


                </div>


                <div className="">
                    <EditProductForm product={product} categorias={categorias} />
                </div>

            </div>

           



        </>
    )
}
