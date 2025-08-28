// src/app/admin/products/category/new/page.tsx
import Link from "next/link";
import { getCategories } from "@/src/services/categorys";
import CreateCategoryForm from "@/components/admin/category/CreateCategoryForm";
import BackButton from "@/components/ui/BackButton";

export default async function NewCategoryPage() {
    const categories = await getCategories();

    return (
        <main className="mx-auto p-4">
            {/* Encabezado */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>

                <BackButton />
            </header>

            {/* Formulario */}
            <section className="mt-8">
                <CreateCategoryForm categories={categories} />
            </section>
        </main>
    );
}
