'use client'

import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import {
    PencilSquareIcon,
    TrashIcon,
    StarIcon,
    SquaresPlusIcon,
    XCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { SlOptions } from "react-icons/sl"


interface Props {
    productId: string
    isFeatured?: boolean
}

export default function ProductMenuAction({ productId, isFeatured }: Props) {
    const toggleFeatured = () => {
        console.log(`Cambiar destacado: ${productId}`)
    }

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            console.log(`Eliminar producto: ${productId}`)
        }
    }

    const handleAdjustStock = () => {
        console.log(`Ajustar stock para producto: ${productId}`)
    }

    const handleDisableProduct = () => {
        console.log(`Desactivar producto: ${productId}`)
    }

    return (
        <Popover className="relative">
            <PopoverButton className="p-1.5 rounded-md hover:bg-gray-100 transition">
                <SlOptions className="w-4 h-4" />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <PopoverPanel className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="py-2 text-sm text-gray-700">
                        <Link
                            href={`/admin/products/${productId}`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                        >
                            <PencilSquareIcon className="w-4 h-4 text-gray-500" />
                            Editar
                        </Link>

                        <button
                            onClick={toggleFeatured}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                            <StarIcon className={`w-4 h-4 ${isFeatured ? 'text-yellow-500' : 'text-gray-400'}`} />
                            {isFeatured ? 'Quitar destacado' : 'Destacar'}
                        </button>

                        <button
                            onClick={handleAdjustStock}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                            <SquaresPlusIcon className="w-4 h-4 text-gray-500" />
                            Ajustar stock
                        </button>

                        <button
                            onClick={handleDisableProduct}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                            <XCircleIcon className="w-4 h-4 text-gray-500" />
                            Desactivar producto
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Eliminar
                        </button>
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}
