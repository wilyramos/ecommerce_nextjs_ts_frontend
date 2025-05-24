import FiltrosClient from "./FiltrosClient";


export default async function FiltrosPorCategoria({ categorySlug  }: { categorySlug: string }) {

    // const brands = await getBrandsByCategory(); //TODO: Implementar servicio para obtener marcas por categoría

    return (
        <FiltrosClient
            categorySlug={categorySlug}
            // brands={brands} //TODO: Descomentar cuando se implemente el servicio
        />
    )
}
