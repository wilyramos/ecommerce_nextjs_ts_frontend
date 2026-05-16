import { collectionService } from "@/src/services/collection-service";
import ProductAssignmentForm from "@/components/admin/collections/product-assignment-form";
import { removeProductFromCollectionAction } from "@/src/actions/collection-action";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CollectionProductsPage({ params }: Props) {
    const { id } = await params;

    // Obtener todas las colecciones para buscar la correspondiente al ID sin requerir un método getById adicional
    const collections = await collectionService.getAll();
    const collection = collections.find((c) => c._id === id);
    
    if (!collection) notFound();

    // Reutilizar el método getBySlug existente para traer los productos asignados a esta colección
    const { products: assignedProducts } = await collectionService.getBySlug(collection.slug, 1, 100);

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href="/admin/collections" className="text-sm text-gray-500 hover:underline">
                    &larr; Volver a colecciones
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">
                    {/* Productos en: <span className="text-blue-600">{collection.nombre}</span> */}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Vincula o desvincula productos pertenecientes a esta sección temática.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel Izquierdo: Formulario de asignación masiva */}
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Vincular Productos</h2>
                    <ProductAssignmentForm collectionId={id} slug={collection.slug} />
                </div>

                {/* Panel Derecho: Lista de productos actualmente asignados */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">Productos Vinculados ({assignedProducts.length})</h2>
                    </div>

                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {assignedProducts.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400">
                                No hay productos asignados a esta colección todavía.
                            </div>
                        ) : (
                            assignedProducts.map((product) => (
                                <div key={product._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                            <span>Slug: {product.slug}</span>
                                            <span className="font-semibold text-gray-700">${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    <form action={async () => {
                                        "use server";
                                        await removeProductFromCollectionAction(id, collection.slug, product._id);
                                    }}>
                                        <button 
                                            type="submit"
                                            className="text-xs text-red-600 hover:text-red-900 font-medium border border-red-200 hover:border-red-400 px-2.5 py-1 rounded bg-red-50 transition-colors"
                                        >
                                            Remover
                                        </button>
                                    </form>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}