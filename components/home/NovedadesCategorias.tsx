

import { getAllSubcategories } from "@/src/services/categorys";
import GridCategoriasDestacadas from "./GridCategoriasDestacadas";


export default async function NovedadesCategorias() {


    const subcategories = await getAllSubcategories();

    return (
        <>
            <GridCategoriasDestacadas categorias={subcategories} />
        </>
    )
}
