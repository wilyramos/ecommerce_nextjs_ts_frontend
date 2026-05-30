'use client'

import Link from 'next/link'
import { SlOptions } from "react-icons/sl"
import { RiEditLine, RiExternalLinkLine } from "react-icons/ri"
import DeleteProductForm from './DeleteProductButton'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface Props {
    productId: string
    isFeatured?: boolean
    productSlug?: string
}

export default function ProductMenuAction({ productId, productSlug }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-background-secondary/80 transition-colors outline-none cursor-pointer">
                <SlOptions className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-44">
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

                <DropdownMenuSeparator />

                <div className="px-1.5 py-0.5">
                    <DeleteProductForm productId={productId} />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}