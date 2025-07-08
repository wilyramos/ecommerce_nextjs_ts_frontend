//FILE: frontend/components/home/product/CategoriasFiltros.tsx
import ProductsFilters from "./ProductsFilters";
import { getAllSubcategories } from "@/src/services/categorys";



export default async function CategoriasFiltros() {

    // const categories = await getCategories();
    const subcategories = await getAllSubcategories();

    return (
        <ProductsFilters categorias={subcategories} />
    )
}
