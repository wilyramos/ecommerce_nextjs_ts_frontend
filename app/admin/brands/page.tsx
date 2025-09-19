// app/admin/brands/page.tsx
import { getBrands } from "@/src/services/brands";
import { Button } from "@/components/ui/button";
import BrandTable from "@/components/admin/brands/BrandTable";
import NewBrandDialog from "@/components/admin/brands/NewBrandDialog";

export default async function BrandsPage() {
    const brands = await getBrands();

    console.log("Brands:", brands);

    return (
        <section className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Administrar Marcas</h1>
                <NewBrandDialog
                    trigger={<Button>+ Nueva Marca</Button>}

                />
            </header>

            <BrandTable brands={brands} />
        </section>
    );
}
