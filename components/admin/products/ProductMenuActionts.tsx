'use client'

import { Fragment } from 'react'
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from '@headlessui/react'
import {
    Bars3Icon,
    PencilIcon,
    EyeIcon,
    TrashIcon,
    StarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Props {
    productId: string
    isFeatured?: boolean
}

export default function ProductMenuAction({ productId, isFeatured }: Props) {
    const onToggleFeatured = () => {
        console.log(`Toggle featured for ${productId}`)
    }

    const onDelete = () => {
        if (window.confirm('¿Eliminar este producto?')) {
            console.log(`Eliminar producto ${productId}`)
        }
    }

    return (
        <Popover className="relative">
            <PopoverButton className="p-2 rounded hover:bg-gray-100 focus:outline-none">
                <Bars3Icon className="w-5 h-5 text-gray-600" />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-75 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <PopoverPanel className="absolute right-0 z-10 mt-2 w-48 rounded-xl bg-white shadow-md ring-1 ring-gray-200">
                    <div className="py-2 text-sm text-gray-800">
                        <Link
                            href={`/admin/products/${productId}`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                        >
                            <EyeIcon className="w-4 h-4 text-gray-500" />
                            Ver producto
                        </Link>

                        <Link
                            href={`/admin/products/${productId}/edit`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                        >
                            <PencilIcon className="w-4 h-4 text-gray-500" />
                            Editar
                        </Link>

                        <button
                            onClick={onToggleFeatured}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50"
                        >
                            <StarIcon
                                className={`w-4 h-4 ${isFeatured ? 'text-yellow-500' : 'text-gray-500'
                                    }`}
                            />
                            {isFeatured ? 'Quitar destacado' : 'Marcar destacado'}
                        </button>

                        <div className="border-t my-2"></div>

                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
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
