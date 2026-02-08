import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getAllSubcategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service"; // Importamos el servicio
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function NewProductPage() {
    // Parallel Data Fetching
    const [categorias, brands, lines] = await Promise.all([
        getAllSubcategories(),
        getActiveBrands(),
        linesService.getAllActive() // Obtenemos líneas activas
    ]);

    return (
        <AdminPageWrapper
            title="Nuevo producto"
            actions={<>{/* Botones opcionales */}</>}
        >
            <CreateProductForm
                categorias={categorias}
                brands={brands}
                lines={lines} // Pasamos las líneas
            />
        </AdminPageWrapper>
    );
}