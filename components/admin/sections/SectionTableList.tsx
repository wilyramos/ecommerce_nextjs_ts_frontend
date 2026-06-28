"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionResponse, SECTION_TYPE_LABELS, SECTION_TYPE_COLORS } from "@/src/schemas/section.schema";
import { reorderSectionsAction, deleteSectionAction } from "@/actions/section-action";
import { Edit2, Trash2, GripVertical, EyeOff, MoreVertical, Video, FileText } from "lucide-react";
import { toast } from "sonner";
import { FaImage } from "react-icons/fa";

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

import { Badge } from "@/components/ui/badge";

interface TableListProps {
    initialSections: SectionResponse[];
}

const TYPE_COLOR_MAP: Record<string, string> = {
    indigo: "bg-info/10 text-info hover:bg-info/15 border-info/20",
    emerald: "bg-success/10 text-success hover:bg-success/15 border-success/20",
    amber: "bg-warning/10 text-warning hover:bg-warning/15 border-warning/20",
};

export default function SectionTableList({ initialSections }: TableListProps) {
    const [sections, setSections] = useState<SectionResponse[]>(initialSections);
    const [isMutating, setIsMutating] = useState<boolean>(false);

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

        setIsMutating(true);
        const result = await reorderSectionsAction(payload);
        setIsMutating(false);

        if (result.ok) {
            toast.success("Posiciones reordenadas y guardadas correctamente");
        } else {
            toast.error(result.error || "Error al actualizar las posiciones");
            setSections(initialSections);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar permanentemente esta sección estructural?")) return;

        setIsMutating(true);
        const result = await deleteSectionAction(id);
        setIsMutating(false);

        if (result.ok) {
            toast.success("Sección eliminada con éxito");
            setSections((prev) => prev.filter((s) => s._id !== id));
        } else {
            toast.error(result.error || "No se pudo eliminar la sección");
        }
    };

    return (
        <div className=" overflow-hidden transition-all">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Table>
                    <TableHeader className="bg-muted/40 select-none">
                        <TableRow>
                            <TableHead className="w-12 text-center"></TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Título Interno</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Identificador (Slug)</TableHead>
                            <TableHead className="font-semibold text-xs uppercase tracking-wider">Tipo de Componente</TableHead>
                            <TableHead className="text-center font-semibold text-xs uppercase tracking-wider">Elementos / Contenido</TableHead>
                            <TableHead className="text-center font-semibold text-xs uppercase tracking-wider">Estado</TableHead>
                            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider pr-5">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <SortableContext items={sections.map((s) => s._id)} strategy={verticalListSortingStrategy}>
                        <TableBody>
                            {sections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm font-medium">
                                        No se encontraron secciones configuradas en el sistema.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sections.map((section) => (
                                    <SortableRow
                                        key={section._id}
                                        section={section}
                                        onDelete={handleDelete}
                                        disabled={isMutating}
                                    />
                                ))
                            )}
                        </TableBody>
                    </SortableContext>
                </Table>
            </DndContext>
        </div>
    );
}

interface RowProps {
    section: SectionResponse;
    disabled: boolean;
    onDelete: (id: string) => void;
}

function SortableRow({ section, disabled, onDelete }: RowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: section._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.5 : 1,
    };

    const colorKey = SECTION_TYPE_COLORS[section.type] || "indigo";
    const badgeStyle = TYPE_COLOR_MAP[colorKey] || TYPE_COLOR_MAP.indigo;

    const renderContentCount = () => {
        if (section.type === "rich_text") {
            return (
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
                    <FileText className="w-3.5 h-3.5 text-warning/70" />
                    <span>HTML / Texto</span>
                </div>
            );
        }

        const totalBlocks = section.blocks?.length || 0;
        let videoCount = 0;
        let imageOnlyCount = 0;

        section.blocks?.forEach((b) => {
            if (b.videoUrl && b.videoUrl.trim() !== "") {
                videoCount++;
            } else if (b.imageUrl && b.imageUrl.trim() !== "") {
                imageOnlyCount++;
            }
        });

        return (
            <div className="flex flex-col items-center justify-center gap-0.5 text-xs text-foreground/80 font-medium">
                <div>{totalBlocks} {totalBlocks === 1 ? "bloque" : "bloques"}</div>
                {(videoCount > 0 || imageOnlyCount > 0) && (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {imageOnlyCount > 0 && (
                            <span className="flex items-center gap-0.5 text-success font-semibold"><FaImage className="w-3 h-3" /> {imageOnlyCount}</span>
                        )}
                        {videoCount > 0 && (
                            <span className="flex items-center gap-0.5 text-info font-semibold"><Video className="w-3 h-3" /> {videoCount}</span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            data-state={isDragging ? "selected" : undefined}
            className="hover:bg-muted/30 data-[state=selected]:bg-muted group transition-colors"
        >
            <TableCell
                className="text-center align-middle cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground select-none w-12"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-4 h-4 mx-auto opacity-40 group-hover:opacity-100 transition-opacity" />
            </TableCell>

            <TableCell className="font-semibold text-foreground text-sm align-middle max-w-[220px] truncate">
                {section.title}
            </TableCell>

            <TableCell className="align-middle font-mono text-xs text-muted-foreground">
                <span className="bg-background/80 px-2 py-0.5 rounded border border-border tracking-tight shadow-2xs">
                    {section.slug}
                </span>
            </TableCell>

            <TableCell className="align-middle">
                <Badge variant="outline" className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-full border shadow-2xs ${badgeStyle}`}>
                    {SECTION_TYPE_LABELS[section.type]}
                </Badge>
            </TableCell>

            <TableCell className="text-center align-middle">
                {renderContentCount()}
            </TableCell>

            <TableCell className="text-center align-middle">
                {section.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-md border border-success/20 shadow-3xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                        Activo
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-md border border-border shadow-3xs">
                        <EyeOff className="w-3 h-3 opacity-60" />
                        Inactivo
                    </span>
                )}
            </TableCell>

            <TableCell className="text-right align-middle pr-4">
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            disabled={disabled}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 shadow-md rounded-lg border-border bg-popover text-popover-foreground">
                            <DropdownMenuLabel className="text-xs text-muted-foreground tracking-wide uppercase font-bold">Opciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer font-medium text-sm">
                                <Link href={`/admin/sections/${section._id}/edit`} className="flex items-center gap-2.5 w-full">
                                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span>Editar Sección</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                disabled={disabled}
                                onClick={() => onDelete(section._id)}
                                className="flex items-center gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-semibold text-sm"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar Sección</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </tr>
    );
}