'use client'

import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    PencilIcon, TrashIcon,
    StarIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

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
        // Aquí podrías abrir un modal o redirigir a una página específica
    }

    const handleDisableProduct = () => {
        console.log(`Desactivar producto: ${productId}`)
        // Aquí podrías abrir un modal de confirmación
    }

    return (
        <Popover className="relative inline-block text-left">
            <PopoverButton className="p-2 rounded-md hover:bg-gray-100 transition">
                <Bars3Icon className="w-5 h-5 text-gray-500" />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <PopoverPanel className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/10">
                    <div className="py-2 text-sm text-gray-700">


                        <Link
                            href={`/admin/products/${productId}`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        >
                            <PencilIcon className="w-4 h-4 text-gray-500" />
                            Editar
                        </Link>

                        <button
                            onClick={toggleFeatured}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            <StarIcon className={`w-4 h-4 ${isFeatured ? 'text-yellow-500' : 'text-gray-500'}`} />
                            {isFeatured ? 'Quitar destacado' : 'Destacar producto'}
                        </button>

                        <button
                            onClick={handleAdjustStock}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            <Squares2X2Icon className="w-4 h-4 text-gray-500" />
                            Ajustar stock
                        </button>


                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
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
