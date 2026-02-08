"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductLine } from "@/src/schemas/line.schema";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Definimos las props que necesitamos recibir desde el componente padre
// para ejecutar las acciones (ya que las columnas no tienen acceso directo al estado)
interface ColumnActions {
    onEdit: (line: ProductLine) => void;
    onDelete: (id: string) => void;
}

// Función creadora de columnas (para poder pasarle las acciones)
export const getColumns = ({ onEdit, onDelete }: ColumnActions): ColumnDef<ProductLine>[] => [
    {
        accessorKey: "nombre",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("slug")}</span>,
    },
    {
        accessorKey: "brand",
        header: "Marca",
        cell: ({ row }) => {
            // Como brand viene populado, accedemos al objeto
            const brand = row.original.brand;
            return <span>{brand.nombre}</span>;
        },
    },
    {
        accessorKey: "category",
        header: "Categoría",
        cell: ({ row }) => {
            const category = row.original.category;
            return <span>{category?.nombre || "-"}</span>;
        },
    },
    {
        accessorKey: "isActive",
        header: "Estado",
        cell: ({ row }) => {
            const active = row.getValue("isActive") as boolean;
            return (
                <Badge variant={active ? "default" : "destructive"}>
                    {active ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const line = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(line)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(line._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            );
        },
    },
];