"use client";

import React, { useState, useTransition } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { Collection } from "@/src/schemas/collection.schema";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Imports de dnd-kit
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Componente hijo importado
import { SortableCollectionRow } from "./SortableCollectionRow";

// Actions
import { updateGeneralOrderAction, updateHomepageOrderAction } from "@/src/actions/collection-action";

interface CollectionTableProps {
    initialCollections: Collection[];
}

type ViewMode = "all" | "reorder_general" | "reorder_homepage";

export function CollectionTable({ initialCollections }: CollectionTableProps) {
    const [collections, setCollections] = useState<Collection[]>(initialCollections);
    const [viewMode, setViewMode] = useState<ViewMode>("all");
    const [isPending, startTransition] = useTransition();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    if (collections.length === 0) {
        return (
            <Table>
                <TableBody>
                    <TableRow>
                        <td className="h-24 text-center text-muted-foreground text-xs font-medium">
                            No hay colecciones creadas actualmente.
                        </td>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    const getProcessedCollections = (): Collection[] => {
        if (viewMode === "reorder_homepage") {
            return [...collections]
                .filter((c) => c.showInHomepage)
                .sort((a, b) => a.homepageOrder - b.homepageOrder);
        }
        if (viewMode === "reorder_general") {
            return [...collections].sort((a, b) => a.order - b.order);
        }
        return collections;
    };

    const displayCollections = getProcessedCollections();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = displayCollections.findIndex((c) => c._id === active.id);
        const newIndex = displayCollections.findIndex((c) => c._id === over.id);

        const sortedSubset = arrayMove(displayCollections, oldIndex, newIndex);
        const orderedIds = sortedSubset.map((c) => c._id);

        setCollections((prev) => {
            const updated = [...prev];
            sortedSubset.forEach((col, idx) => {
                const target = updated.find((c) => c._id === col._id);
                if (target) {
                    if (viewMode === "reorder_homepage") target.homepageOrder = idx + 1;
                    if (viewMode === "reorder_general") target.order = idx + 1;
                }
            });
            return updated;
        });

        startTransition(async () => {
            if (viewMode === "reorder_general") {
                await updateGeneralOrderAction(orderedIds);
            } else if (viewMode === "reorder_homepage") {
                await updateHomepageOrderAction(orderedIds);
            }
        });
    };

    const isReorderEnabled = viewMode !== "all";

    return (
        <div className="w-full flex flex-col">
            <div className="flex items-center justify-between p-3  border-border/60 bg-muted/20 gap-4">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-auto">
                    <TabsList className="grid grid-cols-3 h-8 text-xs p-0.5">
                        <TabsTrigger value="all" className="text-xs px-3">Vista Lista</TabsTrigger>
                        <TabsTrigger value="reorder_general" className="text-xs px-3">Ordenar Catálogo</TabsTrigger>
                        <TabsTrigger value="reorder_homepage" className="text-xs px-3">Ordenar Home</TabsTrigger>
                    </TabsList>
                </Tabs>

                {isPending && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground animate-pulse">
                        <Loader2 size={14} className="animate-spin text-primary" />
                        <span>Guardando cambios...</span>
                    </div>
                )}
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {isReorderEnabled ? <TableHead className="w-[40px]"></TableHead> : null}
                            <TableHead>Nombre</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Badge</TableHead>
                            <TableHead>Maquetación Home</TableHead>
                            <TableHead>Orden Catálogo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right w-[60px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <SortableContext items={displayCollections.map((c) => c._id)} strategy={verticalListSortingStrategy}>
                            {displayCollections.map((col) => (
                                <SortableCollectionRow
                                    key={col._id}
                                    col={col}
                                    isReorderEnabled={isReorderEnabled}
                                />
                            ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    );
}