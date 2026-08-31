// File: frontend/app/admin/comparisons/components/comparisons-table.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";

import { AdminTableToolbar } from "@/components/admin/layout/admin-table-toolbar";
import { AdminPagination } from "@/components/admin/layout/admin-pagination";
import { AdminBadge } from "@/components/admin/layout/admin-badge";
import { Button } from "@/components/ui/button";

import type { ComparisonResponse } from "@/src/schemas/comparison.schema";
import {
    deleteComparisonAction,
    toggleComparisonStatusAction,
    toggleComparisonFeaturedAction,
} from "@/actions/comparison.actions";

interface ComparisonsTableProps {
    items: ComparisonResponse[];
    meta: {
        total?: number;
        page?: number;
        pages?: number;
    };
}

export function ComparisonsTable({ items, meta }: ComparisonsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    // Actualiza la URL cuando el usuario escribe en el buscador
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearch) {
            params.set("search", debouncedSearch);
            params.set("page", "1"); // Resetea a la primera página al buscar
        } else {
            params.delete("search");
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedSearch, pathname, router, searchParams]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`¿Estás seguro de eliminar la comparativa "${title}"?`)) return;
        
        const result = await deleteComparisonAction(id);
        if (result?.ok) {
            toast.success(result.message);
        } else {
            toast.error(result?.error || "Error al eliminar");
        }
    };

    const handleToggleStatus = async (id: string) => {
        const result = await toggleComparisonStatusAction(id);
        if (result?.ok) {
            toast.success(result.message);
        } else {
            toast.error(result?.error || "Error al actualizar estado");
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const result = await toggleComparisonFeaturedAction(id);
        if (result?.ok) {
            toast.success(result.message);
        } else {
            toast.error(result?.error || "Error al actualizar destaque");
        }
    };

    return (
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-2xs flex flex-col">
            <AdminTableToolbar
                searchPlaceholder="Buscar por título o slug..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Título / Slug</th>
                            <th className="px-4 py-3">Productos</th>
                            <th className="px-4 py-3">Vistas</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-sm">
                                    No se encontraron comparativas.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-zinc-900 truncate max-w-[250px]">
                                                {item.title}
                                            </span>
                                            <span className="text-[11px] text-zinc-500 font-mono truncate max-w-[250px]">
                                                /{item.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 text-xs">
                                        <span className="font-medium bg-zinc-100 px-2 py-0.5 rounded">
                                            {item.products.length} vs
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 font-mono text-xs">
                                        {item.viewCount}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2 items-center h-full">
                                        <AdminBadge variant={item.isActive ? "success" : "neutral"}>
                                            {item.isActive ? "Activo" : "Oculto"}
                                        </AdminBadge>
                                        {item.isFeatured && (
                                            <AdminBadge variant="brand">
                                                Destacado
                                            </AdminBadge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-400 hover:text-amber-500 hover:bg-amber-50"
                                                onClick={() => handleToggleFeatured(item._id)}
                                                title="Destacar"
                                            >
                                                <Star className={item.isFeatured ? "fill-amber-500 text-amber-500" : ""} size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50"
                                                onClick={() => handleToggleStatus(item._id)}
                                                title="Cambiar visibilidad"
                                            >
                                                {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </Button>
                                            <Link href={`/admin/comparisons/${item._id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(item._id, item.title)}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AdminPagination 
                currentPage={meta.page || 1} 
                totalPages={meta.pages || 1} 
                totalItems={meta.total} 
            />
        </div>
    );
}