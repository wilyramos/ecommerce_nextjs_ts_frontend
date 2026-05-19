'use client'

import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import Link from 'next/link'
import { SlOptions } from "react-icons/sl"
import { RiEditLine, RiExternalLinkLine } from "react-icons/ri"
import DeleteProductForm from './DeleteProductButton'

interface Props {
    productId: string
    isFeatured?: boolean
    productSlug?: string
}

export default function ProductMenuAction({ productId, productSlug }: Props) {
    return (
        <Popover className="relative">
            <PopoverButton className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-background-secondary/80 transition-colors outline-none cursor-pointer">
                <SlOptions className="w-3.5 h-3.5" />
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
                <PopoverPanel className="absolute right-0 mountaineer z-20 mt-1 w-44 origin-top-right rounded-sm border border-border bg-background shadow-xs outline-none">
                    <div className="py-1 text-[13px] font-medium text-foreground">
                        <Link
                            href={`/admin/products/${productId}`}
                            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-background-secondary/60 transition-colors outline-none"
                        >
                            <RiEditLine className="w-4 h-4 text-muted-foreground/70" />
                            <span>Editar</span>
                        </Link>

                        {productSlug && (
                            <Link
                                href={`/productos/${productSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-background-secondary/60 transition-colors outline-none"
                            >
                                <RiExternalLinkLine className="w-4 h-4 text-muted-foreground/70" />
                                <span>Ver en tienda</span>
                            </Link>
                        )}

                        <div className="border-t border-border/60 my-1" />
                        
                        <div className="px-1.5 py-0.5">
                            <DeleteProductForm productId={productId} />
                        </div>
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}