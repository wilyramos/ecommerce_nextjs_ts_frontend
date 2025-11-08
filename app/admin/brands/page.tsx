// app/admin/brands/page.tsx
import { getBrands } from "@/src/services/brands";
import { Button } from "@/components/ui/button";
import BrandTable from "@/components/admin/brands/BrandTable";
import NewBrandDialog from "@/components/admin/brands/NewBrandDialog";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function BrandsPage() {
    const brands = await getBrands();

    return (
        <AdminPageWrapper
            title="Marcas"
            showBackButton={false}
            actions={
                <NewBrandDialog
                    trigger={<Button>+ Nueva Marca</Button>}
                />
            }
        >
            <BrandTable brands={brands} />
        </AdminPageWrapper>
    );
}
