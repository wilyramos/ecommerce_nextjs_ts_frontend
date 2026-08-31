// File: frontend/components/admin/comparisons/ComparisonTable.tsx
"use client";

import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type ComparisonResponse } from "@/src/schemas/comparison.schema";
import { 
    deleteComparisonAction, 
    toggleComparisonStatusAction, 
    toggleComparisonFeaturedAction 
} from "@/actions/comparison.actions";

interface ComparisonTableProps {
    comparisons: ComparisonResponse[];
}

export default function ComparisonTable({ comparisons }: ComparisonTableProps) {
    if (comparisons.length === 0) {
        return (
            <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                No se encontraron comparativas registradas.
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta comparativa de forma permanente?")) return;
        const result = await deleteComparisonAction(id);
        if (result?.ok) toast.success(result.message);
        else toast.error(result?.error || "Error al eliminar");
    };

    const handleToggleStatus = async (id: string) => {
        const result = await toggleComparisonStatusAction(id);
        if (result?.ok) toast.success(result.message);
        else toast.error(result?.error || "Error al cambiar estado");
    };

    const handleToggleFeatured = async (id: string) => {
        const result = await toggleComparisonFeaturedAction(id);
        if (result?.ok) toast.success(result.message);
        else toast.error(result?.error || "Error al cambiar destaque");
    };

    return (
        <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Título y Slug</th>
                        <th className="px-4 py-3 text-center">Productos</th>
                        <th className="px-4 py-3 text-center">Vistas</th>
                        <th className="px-4 py-3 text-center">Estado</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {comparisons.map((item) => (
                        <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground truncate max-w-[250px]">
                                        {item.title}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground font-mono">
                                        /{item.slug}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-[11px] font-semibold">
                                    {item.products.length} ítems
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                                {item.viewCount}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                                    }`}>
                                        {item.isActive ? "Activo" : "Oculto"}
                                    </span>
                                    {item.isFeatured && (
                                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Destacado
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-50"
                                        onClick={() => handleToggleFeatured(item._id)}
                                        title="Destacar"
                                    >
                                        <Star className={item.isFeatured ? "fill-amber-500 text-amber-500" : ""} size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleToggleStatus(item._id)}
                                        title="Cambiar Visibilidad"
                                    >
                                        {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
                                        <Link href={`/admin/comparisons/${item._id}`}>
                                            <Edit size={16} />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}