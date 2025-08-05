import CreateProductForm from '@/components/admin/products/CreateProductForm'
import Link from 'next/link'
import { getAllSubcategories } from '@/src/services/categorys'


export default async function NewProductPage() {

    const categorias = await getAllSubcategories()

    return (
        <section className='p-6'>
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-2">
                <h1 className='text-lg font-semibold text-gray-800 '>Nuevo producto</h1>
                <Link
                    href={"/admin/products"}
                    className='bg-gray-800 text-white text-sm px-2 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out hidden md:block'
                >
                    Volver
                </Link>
            </div>

            <div className='w-full mx-auto mt-10'>
                <CreateProductForm categorias={categorias} />
            </div>
        </section>
    )
}
