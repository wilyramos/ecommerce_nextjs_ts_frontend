//FILE: frontend/components/home/product/CategoriasFiltros.tsx
import ProductsFilters from "./ProductsFilters";
import { getAllSubcategories } from "@/src/services/categorys";
import DrawerFiltersGeneral from "./DrawerFiltersGeneral";


export default async function CategoriasFiltros() {

    // const categories = await getCategories();
    const subcategories = await getAllSubcategories();

    return (
        <div>
            <div className="hidden sm:block">
                <ProductsFilters categorias={subcategories} />
            </div>

            <div className="sm:hidden">
                <DrawerFiltersGeneral categorias={subcategories} />
            </div>
        </div>
    )
}