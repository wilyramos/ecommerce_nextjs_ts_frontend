import CreateCategoryForm from "@/components/admin/category/CreateCategoryForm"
import Link from "next/link";
import { getCategories } from "@/src/services/categorys";

export default async function NewCategoryPage() {

    const categories = await getCategories();

    return (
        <>
            <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
                <h1 className='text-2xl font-bold text-gray-800'>Nueva Categoria</h1>
                <div className='flex gap-4'>
                </div>
                <Link
                    href={"/admin/products/category"}
                    className='bg-gray-800 text-white text-sm font-bold px-4 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out hidden md:block'
                >
                    Volver
                </Link>
            </div>

            <div className="flex flex-col w-full mx-auto mt-10">
                {/* <CreateCategoryForm categories={categories} /> */}
            </div>
        </>
    )
}