// File: frontend/src/modules/page/admin/PageTableList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { deletePageAction } from "../page.actions";
import { Edit2, Trash2, Eye, EyeOff, MoreVertical, FileText } from "lucide-react";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageData {
    _id: string;
    title: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
}

interface TableListProps {
    initialPages: PageData[];
}

export default function PageTableList({ initialPages }: TableListProps) {
    const [pages, setPages] = useState<PageData[]>(initialPages);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar permanentemente esta página institucional?")) return;

        const result = await deletePageAction(id);
        if (result.success) {
            toast.success(result.message);
            setPages((prev) => prev.filter((p) => p._id !== id));
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead>Título de la Página</TableHead>
                        <TableHead>Ruta Relativa (Slug)</TableHead>
                        <TableHead>Fecha de Creación</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pages.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                                No se encontraron páginas institucionales configuradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        pages.map((page) => (
                            <TableRow 
                                key={page._id} 
                                className="border-b border-border hover:bg-muted/30 transition-colors"
                            >
                                <TableCell className="font-medium text-foreground align-middle">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        {page.title}
                                    </div>
                                </TableCell>

                                <TableCell className="align-middle font-mono text-xs text-muted-foreground">
                                    <span className="bg-background px-2 py-1 rounded border border-border">
                                        /{page.slug}
                                    </span>
                                </TableCell>

                                <TableCell className="align-middle text-sm text-muted-foreground">
                                    {new Date(page.createdAt).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </TableCell>

                                <TableCell className="text-center align-middle">
                                    {page.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                                            <Eye className="w-3 h-3" /> Visible
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                                            <EyeOff className="w-3 h-3" /> Oculta
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="text-right align-middle">
                                    <div className="flex items-center justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors outline-none">
                                                <MoreVertical className="w-4 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <Link href={`/admin/pages/${page._id}`} className="flex items-center gap-2 w-full">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        <span>Editar</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(page._id)} 
                                                    className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Eliminar</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}