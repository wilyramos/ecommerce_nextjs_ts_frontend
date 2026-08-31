// File: frontend/components/admin/categories-v3/CategoryListClient.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Edit,
    Trash2,
    Copy,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Power,
} from "lucide-react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { AdminDataTable } from "@/components/admin/ui/table/AdminDataTable";
import { AdminDataTableColumnHeader } from "@/components/admin/ui/table/AdminDataTableColumnHeader";
import type { TableTab } from "@/components/admin/ui/table/AdminDataTableToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { diccionarioColores } from "@/src/utils/constants/colores";
import { useConfirm } from "@/components/admin/ui/modal/useConfirm";

import {
    deleteCategoryAction,
    toggleCategoryStatusAction,
    bulkUpdateCategoryStatusAction,
    bulkDeleteCategoryAction,
    reorderCategoriesAction
} from "@/actions/category-v3.actions";
import type { CategoryResponse } from "@/src/schemas/category-v3.schema";

type CategoryRow = CategoryResponse & { level: number; pathName: string };

interface CategoryListClientProps {
    data: CategoryRow[];
}

export default function CategoryListClient({ data: initialData }: CategoryListClientProps) {
    const router = useRouter();
    const confirm = useConfirm();
    const [activeTab, setActiveTab] = useState<string>("all");

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`);
    };

    const handleDelete = useCallback(async (id: string, nombre: string) => {
        const isConfirmed = await confirm({
            title: "Eliminar Categoría",
            description: (
                <p>
                    ¿Estás seguro de que deseas eliminar la categoría{" "}
                    <strong className="text-zinc-900 font-bold">&quot;{nombre}&quot;</strong>?
                    Esta acción no se puede deshacer si no contiene subcategorías activas.
                </p>
            ),
            confirmLabel: "Eliminar definitivamente",
            variant: "danger",
        });

        if (!isConfirmed) return;

        const result = await deleteCategoryAction(id);
        if (result?.ok) {
            toast.success(result.message || "Categoría eliminada");
            router.refresh();
        } else {
            toast.error(result?.error || "Error al eliminar categoría");
        }
    }, [confirm, router]);

    const handleToggleStatus = useCallback(async (id: string) => {
        const result = await toggleCategoryStatusAction(id);
        if (result?.ok) {
            toast.success(result.message || "Estado actualizado");
            router.refresh();
        } else {
            toast.error(result?.error || "Error al cambiar estado");
        }
    }, [router]);

    const columns = useMemo<ColumnDef<CategoryRow>[]>(() => [
        {
            id: "expander",
            size: 40,
            enableResizing: false,
            header: () => null,
            cell: ({ row }) => {
                return (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            row.toggleExpanded();
                        }}
                        className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                        {row.getIsExpanded() ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                );
            },
        },
        {
            accessorKey: "nombre",
            size: 260,
            minSize: 180,
            maxSize: 400,
            header: ({ column }) => <AdminDataTableColumnHeader column={column} title="Categoría" />,
            cell: ({ row }) => (
                <div style={{ paddingLeft: `${row.original.level * 1.5}rem` }} className="flex items-center gap-2">
                    {row.original.level > 0 && <span className="text-zinc-300 font-mono select-none">└─</span>}
                    <div className="flex flex-col">
                        <Link
                            href={`/admin/category-v3/${row.original._id}`}
                            className="font-semibold text-zinc-900 hover:text-indigo-600 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {row.original.nombre}
                        </Link>
                        {row.original.descripcion && (
                            <span className="text-[11px] text-zinc-400 line-clamp-1">
                                {row.original.descripcion}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "slug",
            size: 200,
            minSize: 140,
            header: ({ column }) => <AdminDataTableColumnHeader column={column} title="Slug / URL" />,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 group">
                    <span className="font-mono text-[12px] text-zinc-500 truncate">{row.original.slug}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(row.original.slug || "", "Slug");
                        }}
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            ),
        },
        {
            accessorKey: "attributes",
            size: 140,
            header: "Atributos",
            cell: ({ row }) => {
                const count = row.original.attributes?.length || 0;
                return (
                    <Badge variant="outline" className="text-[11px] font-normal border-zinc-200 bg-zinc-50 text-zinc-600">
                        {count} configurado(s)
                    </Badge>
                );
            },
        },
        {
            accessorKey: "isActive",
            size: 120,
            header: ({ column }) => <AdminDataTableColumnHeader column={column} title="Estado" />,
            cell: ({ row }) => (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(row.original._id);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold border border-zinc-200 cursor-pointer ${row.original.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}
                >
                    {row.original.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {row.original.isActive ? "Activo" : "Inactivo"}
                </button>
            ),
        },
        {
            id: "actions",
            size: 70,
            enableResizing: false,
            header: () => <div className="text-right text-[11px] font-bold uppercase tracking-wider text-zinc-400">Acciones</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-900">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[170px] border-zinc-200 bg-white">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase text-zinc-400 px-2 py-1">Opciones</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="text-xs cursor-pointer">
                                <Link href={`/admin/category-v3/${row.original._id}`}>
                                    <Edit className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Editar
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-xs cursor-pointer"
                                onClick={() => handleToggleStatus(row.original._id)}
                            >
                                <Power className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                                {row.original.isActive ? "Desactivar" : "Activar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-xs cursor-pointer"
                                onClick={() => handleCopy(row.original._id, "ID")}
                            >
                                <Copy className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Copiar ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-100" />
                            <DropdownMenuItem
                                className="text-xs cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                onClick={() => handleDelete(row.original._id, row.original.nombre)}
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" /> Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ], [handleDelete, handleToggleStatus]);

    const filteredData = useMemo(() => {
        if (activeTab === "active") return initialData.filter(d => d.isActive);
        if (activeTab === "inactive") return initialData.filter(d => !d.isActive);
        return initialData;
    }, [initialData, activeTab]);

    const tabs: TableTab[] = [
        { value: "all", label: "Todas", badge: initialData.length },
        { value: "active", label: "Activas", badge: initialData.filter(d => d.isActive).length },
        { value: "inactive", label: "Inactivas", badge: initialData.filter(d => !d.isActive).length },
    ];

    const handleExport = (format: "csv" | "excel" | "pdf", rowsToExport: CategoryRow[]) => {
        if (format === "csv") {
            const headers = ["ID", "Nombre", "Slug", "Ruta", "Activo"];
            const csvRows = rowsToExport.map(r => [
                `"${r._id}"`,
                `"${r.nombre}"`,
                `"${r.slug || ""}"`,
                `"${r.pathName}"`,
                `"${r.isActive ? "SI" : "NO"}"`
            ]);

            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map(e => e.join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `categorias_${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Archivo CSV generado exitosamente");
        } else {
            toast.info(`Exportación a formato ${format.toUpperCase()} en preparación.`);
        }
    };

    const handleReorder = async (newData: CategoryRow[]) => {
        const formattedItems = newData.map((cat, idx) => {
            let parentId: string | null = null;
            if (typeof cat.parent === "string" && cat.parent.trim() !== "") {
                parentId = cat.parent.trim();
            } else if (cat.parent && typeof cat.parent === "object" && "_id" in (cat.parent as Record<string, unknown>)) {
                parentId = String((cat.parent as Record<string, unknown>)._id);
            }

            return {
                id: String(cat._id),
                order: idx,
                parent: parentId,
            };
        });

        const payload = { items: formattedItems };
        const res = await reorderCategoriesAction(payload);

        if (res?.ok) {
            toast.success(res.message || "Orden guardado correctamente");
            router.refresh();
        } else {
            toast.error(res?.error || "Error al actualizar el orden");
        }
    };

    const handleBulkStatus = async (selectedRows: CategoryRow[], isActive: boolean, clearSelection: () => void) => {
        const ids = selectedRows.map(r => r._id);
        const res = await bulkUpdateCategoryStatusAction(ids, isActive);
        if (res?.ok) {
            toast.success(res.message || "Estados actualizados");
            clearSelection();
            router.refresh();
        } else {
            toast.error(res?.error || "Error al actualizar estados");
        }
    };

    const handleBulkDelete = async (selectedRows: CategoryRow[], clearSelection: () => void) => {
        const isConfirmed = await confirm({
            title: "Eliminación Masiva de Categorías",
            description: (
                <p>
                    ¿Estás seguro de que deseas eliminar{" "}
                    <strong className="text-zinc-900 font-bold">{selectedRows.length}</strong>{" "}
                    categoría(s) seleccionada(s)? Esta acción no se puede deshacer.
                </p>
            ),
            confirmLabel: `Eliminar (${selectedRows.length})`,
            confirmTextMatch: "ELIMINAR",
            confirmTextMatchPlaceholder: "Escribe ELIMINAR para continuar...",
            variant: "danger",
        });

        if (!isConfirmed) return;

        const ids = selectedRows.map(r => r._id);
        const res = await bulkDeleteCategoryAction(ids);
        if (res?.ok) {
            toast.success(res.message || "Categorías eliminadas");
            clearSelection();
            router.refresh();
        } else {
            toast.error(res?.error || "Error al eliminar categorías");
        }
    };

    return (
        <AdminDataTable
            columns={columns}
            data={filteredData}
            searchPlaceholder="Buscar por categoría, slug o descripción..."
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}

            enableDragAndDrop={true}
            onReorder={handleReorder}

            enableRowSelection={true}
            renderBulkActions={(selectedRows, clearSelection) => (
                <>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs font-semibold bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:text-white border-0"
                        onClick={() => handleBulkStatus(selectedRows, true, clearSelection)}
                    >
                        Activar ({selectedRows.length})
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs font-semibold bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:text-white border-0"
                        onClick={() => handleBulkStatus(selectedRows, false, clearSelection)}
                    >
                        Desactivar ({selectedRows.length})
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs font-semibold bg-red-600 hover:bg-red-700"
                        onClick={() => handleBulkDelete(selectedRows, clearSelection)}
                    >
                        Eliminar ({selectedRows.length})
                    </Button>
                </>
            )}

            onExport={handleExport}

            renderSubComponent={({ row }) => (
                <div className="space-y-3 bg-white p-3 border border-zinc-200">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Atributos Definidos para {row.nombre}
                        </span>
                        <Button asChild variant="outline" size="sm" className="h-6 text-[11px] border-zinc-200">
                            <Link href={`/admin/category-v3/${row._id}`}>
                                Gestionar Atributos
                            </Link>
                        </Button>
                    </div>

                    {row.attributes && row.attributes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {row.attributes.map((attr, index) => {
                                const isColor = attr.name.trim().toLowerCase().includes("color");

                                return (
                                    <div key={index} className="p-2.5 bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                                        <div className="flex items-center justify-between font-semibold text-zinc-800">
                                            <span>{attr.name}</span>
                                            {attr.isVariant && (
                                                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.5 font-mono border border-indigo-200">
                                                    Variante
                                                </span>
                                            )}
                                        </div>

                                        {isColor ? (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {attr.values.map((colorVal, cIdx) => {
                                                    const normalized = colorVal.toLowerCase().trim();
                                                    const colorClass = diccionarioColores[normalized];
                                                    return (
                                                        <div
                                                            key={cIdx}
                                                            className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-zinc-200 text-[11px]"
                                                        >
                                                            {colorClass ? (
                                                                <span className={`w-3 h-3 rounded-full border border-black/10 shrink-0 ${colorClass}`} />
                                                            ) : (
                                                                <span className="w-3 h-3 rounded-full border border-dashed border-zinc-400 bg-zinc-200 shrink-0" />
                                                            )}
                                                            <span className="capitalize">{colorVal}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-[11px] text-zinc-500 truncate">
                                                Valores: {attr.values.join(", ")}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-zinc-400 py-1">Esta categoría no tiene atributos personalizados asignados.</p>
                    )}
                </div>
            )}

            onRowDoubleClick={(row) => router.push(`/admin/category-v3/${row._id}`)}
        />
    );
}