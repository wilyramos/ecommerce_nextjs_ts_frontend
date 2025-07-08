import FiltrosClient from "./FiltrosClient";
import { getCategoryBySlug } from "@/src/services/categorys";
import { Attributes } from "@/src/schemas";


export default async function FiltrosPorCategoria({ categorySlug }: { categorySlug: string }) {

        const category = await getCategoryBySlug(categorySlug);

        // console.log(category)

        if (!category) {
            return (
                <main className="max-w-7xl mx-auto p-5">
                    <div className="text-center py-10 text-gray-500">
                        No se encontró la categoría.
                    </div>
                </main>
            );
        }
        const attributes: Attributes = category.attributes || [];


    // const brands = await getBrandsByCategory(); //TODO: Implementar servicio para obtener marcas por categoría

    return (
        <FiltrosClient
            categorySlug={categorySlug}
            attributes={attributes}
        />
    )
}
