import React from 'react'
import CreateProductForm from '@/components/admin/products/CreateProductForm'
import Link from 'next/link'
import { getCategories } from '@/src/services/categorys'


export default async function NewProductPage() {


    const categorias = await getCategories()

    return (
        <>
            <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
                <h1 className='text-2xl font-bold text-gray-800'>Nuevo producto</h1>
                <div className='flex gap-4'>
                </div>
                <Link
                    href={"/admin/products"}
                    className='bg-gray-800 text-white text-sm font-bold px-4 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out hidden md:block'
                >
                    Volver
                </Link>
            </div>

            <div className='flex flex-col w-full mx-auto mt-10'>
                <CreateProductForm categorias={categorias} />
            </div>
        </>
    )
}
