"use client";

import React from "react";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collection, CollectionType, HomepageLayoutType } from "@/src/schemas/collection.schema";
import { CollectionActionsMenu } from "./CollectionActionsMenu";
import { Home, Layers, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableCollectionRowProps {
    col: Collection;
    isReorderEnabled: boolean;
}

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
    featured: "Destacados (Home)",
    new_arrivals: "Novedades (Home)",
    best_sellers: "Más Vendidos (Home)",
    on_sale: "Ofertas (Home)",
    promotion: "Promoción",
    theme: "Temática",
    editorial: "Editorial",
    seasonal: "Temporada",
};

const COLLECTION_TYPE_VARIANTS: Record<CollectionType, "default" | "secondary" | "outline" | "destructive"> = {
    featured: "default",
    new_arrivals: "secondary",
    best_sellers: "default",
    on_sale: "destructive",
    promotion: "destructive",
    theme: "outline",
    editorial: "secondary",
    seasonal: "outline",
};

const LAYOUT_TYPE_LABELS: Record<HomepageLayoutType, string> = {
    grid: "Grid",
    carousel: "Cinta",
};

// Se declara aquí para que se ejecute en el lado del cliente sin violar la serialización de Next.js
function PromotionDates({ col }: { col: Collection }) {
    if (col.type !== "promotion" || (!col.startsAt && !col.endsAt)) return null;

    const now = new Date();
    const startsAt = col.startsAt ? new Date(col.startsAt) : null;
    const endsAt = col.endsAt ? new Date(col.endsAt) : null;

    const isLive = startsAt && endsAt && startsAt <= now && endsAt >= now;
    const isExpired = endsAt && endsAt < now;
    const isPending = startsAt && startsAt > now;

    const fmt = (d: Date) => d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <div className="flex flex-col gap-0.5 mt-0.5">
            {startsAt && (
                <span className="text-[10px] text-muted-foreground font-mono">
                    {fmt(startsAt)} → {endsAt ? fmt(endsAt) : "—"}
                </span>
            )}
            {isLive && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">● En curso</span>}
            {isExpired && <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">● Vencida</span>}
            {isPending && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">● Programada</span>}
        </div>
    );
}

export function SortableCollectionRow({ col, isReorderEnabled }: SortableCollectionRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: col._id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 30 : undefined,
        position: isDragging ? "relative" : undefined,
        opacity: isDragging ? 0.6 : undefined,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b transition-colors hover:bg-secondary text-sm ${
                isDragging ? "bg-muted/80 shadow-md" : ""
            }`}
        >
            {isReorderEnabled ? (
                <TableCell className="w-[40px] align-middle p-0 text-center">
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className="p-2 text-muted-foreground/60 hover:text-primary cursor-grab active:cursor-grabbing rounded-sm transition-colors"
                        title="Arrastrar para reordenar"
                    >
                        <GripVertical size={15} />
                    </button>
                </TableCell>
            ) : null}

            <TableCell className="font-bold text-sm">
                <div className="flex items-center gap-2">
                    {col.color && (
                        <span
                            className="w-2 h-2 rounded-full shrink-0 border border-border"
                            style={{ backgroundColor: col.color }}
                        />
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span>{col.name}</span>
                            {col.isSystem && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-warning/30 bg-warning/10 text-warning font-bold uppercase tracking-wider rounded-[var(--radius-sm)]">
                                    Sistema
                                </Badge>
                            )}
                        </div>
                        <div className="text-xs font-normal text-muted-foreground">
                            <PromotionDates col={col} />
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <Badge variant={COLLECTION_TYPE_VARIANTS[col.type]} className="text-[10px] uppercase tracking-wider font-semibold rounded-[var(--radius-sm)]">
                    {COLLECTION_TYPE_LABELS[col.type]}
                </Badge>
            </TableCell>

            <TableCell className="text-xs text-muted-foreground font-mono">
                {col.slug}
            </TableCell>

            <TableCell>
                {col.badgeLabel ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[var(--radius-sm)] shadow-xs border border-border" style={{ backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" }}>
                        {col.badgeLabel}
                    </span>
                ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                )}
            </TableCell>

            <TableCell>
                {col.showInHomepage ? (
                    <div className="flex flex-col gap-0.5 text-xs font-medium">
                        <div className="flex items-center gap-1 text-success">
                            <Home size={12} strokeWidth={2.5} />
                            <span>Posición: {col.homepageOrder}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                            <Layers size={11} />
                            <span>{LAYOUT_TYPE_LABELS[col.homepageLayout]} ({col.maxHomepageItems} items)</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-muted-foreground text-xs">No visible</span>
                )}
            </TableCell>

            <TableCell className="text-sm font-semibold">
                {col.order}
            </TableCell>

            <TableCell>
                <Badge variant={col.isActive ? "default" : "destructive"} className="text-[10px] uppercase tracking-wider font-semibold rounded-[var(--radius-sm)]">
                    {col.isActive ? "Activo" : "Inactivo"}
                </Badge>
            </TableCell>

            <TableCell className="text-right">
                <CollectionActionsMenu id={col._id} slug={col.slug} isActive={col.isActive} />
            </TableCell>
        </tr>
    );
}