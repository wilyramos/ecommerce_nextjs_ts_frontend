import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getAllSubcategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function NewProductPage() {
    const categorias = await getAllSubcategories();
    const brands = await getActiveBrands();

    return (
        <AdminPageWrapper
            title="Nuevo producto"
            actions={
                <>
                    {/* <Button variant="secondary">Vista previa</Button> */}
                    {/* <Button variant="default">Guardar borrador</Button> */}
                </>
            }
        >
            <CreateProductForm categorias={categorias} brands={brands} />
        </AdminPageWrapper>
    );
}