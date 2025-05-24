import { getCategories } from "@/src/services/categorys";
import ProductsFilters from "./ProductsFilters";



export default async function CategoriasFiltros() {

    const categories = await getCategories();

    return (
        <ProductsFilters categorias={categories} />
    )
}
