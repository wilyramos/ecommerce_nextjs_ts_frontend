// File: frontend/components/admin/collections/CollectionActionsMenu.tsx
"use client";

import Link from "next/link";
import { MoreVertical, Layers, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteCollectionButton from "@/components/admin/collections/delete-button";

interface CollectionActionsMenuProps {
    id: string;
    slug: string;
    isActive: boolean;
}

export function CollectionActionsMenu({ id, slug, isActive }: CollectionActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                    <Link href={`/admin/collections/${id}/products`} className="w-full flex items-center gap-2 cursor-pointer">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Productos</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/collections/${id}/edit`} className="w-full flex items-center gap-2 cursor-pointer">
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Editar</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/colecciones/${slug}`} target="_blank" className="w-full flex items-center gap-2 cursor-pointer">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Ver en tienda</span>
                    </Link>
                </DropdownMenuItem>
                {isActive && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={(e) => e.preventDefault()}
                            className="p-0"
                        >
                            <div className="w-full [&_button]:w-full [&_button]:justify-start [&_button]:px-2 [&_button]:py-1.5 [&_button]:h-auto [&_button]:font-normal [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-destructive">
                                <DeleteCollectionButton id={id} slug={slug} />
                            </div>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}