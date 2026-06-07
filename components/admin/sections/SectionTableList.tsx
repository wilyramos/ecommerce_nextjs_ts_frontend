"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionResponse, SECTION_TYPE_LABELS } from "@/src/schemas/section.schema";
import { reorderSectionsAction, deleteSectionAction } from "@/actions/section-action";
import { Edit2, Trash2, GripVertical, Eye, EyeOff, MoreVertical } from "lucide-react";
import { toast } from "sonner";

// Componentes dnd-kit para habilitar el ordenamiento interactivo
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface TableListProps {
    initialSections: SectionResponse[];
}

export default function SectionTableList({ initialSections }: TableListProps) {
    const [sections, setSections] = useState<SectionResponse[]>(initialSections);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s._id === active.id);
        const newIndex = sections.findIndex((s) => s._id === over.id);

        const reorderedArray = arrayMove(sections, oldIndex, newIndex);
        setSections(reorderedArray);

        const payload = reorderedArray.map((section, index) => ({
            id: section._id,
            order: index + 1,
        }));

        const result = await reorderSectionsAction(payload);
        if (result.ok) {
            toast.success("Posiciones reordenadas y guardadas correctamente");
        } else {
            toast.error(result.error || "Error al actualizar las posiciones");
            setSections(sections);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar permanentemente esta sección estructural?")) return;

        const result = await deleteSectionAction(id);
        if (result.ok) {
            toast.success("Sección eliminada con éxito");
            setSections((prev) => prev.filter((s) => s._id !== id));
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="w-12 text-center"></TableHead>
                            <TableHead>Título Interno</TableHead>
                            <TableHead>Identificador (Slug)</TableHead>
                            <TableHead>Tipo de Componente</TableHead>
                            <TableHead className="text-center">Elementos</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <SortableContext items={sections.map((s) => s._id)} strategy={verticalListSortingStrategy}>
                        <TableBody>
                            {sections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                                        No se encontraron secciones configuradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sections.map((section) => (
                                    <SortableRow key={section._id} section={section} onDelete={handleDelete} />
                                ))
                            )}
                        </TableBody>
                    </SortableContext>
                </Table>
            </DndContext>
        </div>
    );
}

// ── SUB-COMPONENTE FILA ADAPTABLE (SORTABLE) ────────────────────────────────

interface RowProps {
    section: SectionResponse;
    onDelete: (id: string) => void;
}

function SortableRow({ section, onDelete }: RowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: section._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="border-b border-border hover:bg-muted/30 data-[state=selected]:bg-muted group transition-colors"
        >
            <TableCell
                className="text-center align-middle cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground select-none w-12"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-4 h-4 mx-auto" />
            </TableCell>

            <TableCell className="font-medium text-foreground align-middle">
                {section.title}
            </TableCell>

            <TableCell className="align-middle font-mono text-xs text-muted-foreground">
                <span className="bg-background px-2 py-1 rounded border border-border">
                    {section.slug}
                </span>
            </TableCell>

            <TableCell className="align-middle">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {SECTION_TYPE_LABELS[section.type]}
                </span>
            </TableCell>

            <TableCell className="text-center align-middle text-muted-foreground font-medium">
                {section.type === "rich_text" ? "—" : `${section.blocks?.length || 0} ítems`}
            </TableCell>

            <TableCell className="text-center align-middle">
                {section.isActive ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                        <Eye className="w-3 h-3" /> Activo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                        <EyeOff className="w-3 h-3" /> Inactivo
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
                                <Link href={`/admin/sections/${section._id}/edit`} className="flex items-center gap-2 w-full">
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Editar</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => onDelete(section._id)} 
                                className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </tr>
    );
}