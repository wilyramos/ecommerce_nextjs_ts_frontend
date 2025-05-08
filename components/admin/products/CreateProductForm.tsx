"use client"


import React from 'react'
import ProductForm from './ProductForm'

export default function CreateProductForm() {


    return (
        <form className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-10"
            noValidate
        // action{dispatch}

        >

            
            <ProductForm />
            <input
                type='submit'
                className='bg-gray-800 text-white text-sm font-bold px-4 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out'
                value={"Crear producto"}
            />

        </form>
    )
}
