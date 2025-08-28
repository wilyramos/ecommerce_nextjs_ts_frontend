import Link from "next/link";
import CreateProductForm from "@/components/admin/products/CreateProductForm";
import { getAllSubcategories } from "@/src/services/categorys";

export default async function NewProductPage() {
    const categorias = await getAllSubcategories();

    return (
        <main className="p-4">
            {/* Encabezado */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-3">
                <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>

                <Link
                    href="/admin/products"
                    className="hidden md:inline-block bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                >
                    Volver
                </Link>
            </header>

            {/* Formulario */}
            <section className="mt-6">
                <CreateProductForm categorias={categorias} />
            </section>
        </main>
    );
}
