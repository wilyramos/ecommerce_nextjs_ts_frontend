import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getAllSubcategories } from "@/src/services/categorys";
import BackButton from "@/components/ui/BackButton";

export default async function NewProductPage() {
    const categorias = await getAllSubcategories();

    return (
        <main className="">
            {/* Encabezado */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-3">
                <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>

                <BackButton />
            </header>

            {/* Formulario */}
            <section className="mt-6">
                <CreateProductForm categorias={categorias} />
            </section>
        </main>
    );
}
