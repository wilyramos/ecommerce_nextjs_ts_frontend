// File: frontend/components/admin/ui/table/AdminDataTableRow.tsx
"use client";

import React, { CSSProperties } from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AdminDataTableRowProps<TData> {
    row: Row<TData>;
    enableDragAndDrop?: boolean;
    onRowClick?: (row: TData) => void;
    onRowDoubleClick?: (row: TData) => void;
}

export function AdminDataTableRow<TData>({ row, enableDragAndDrop, onRowClick, onRowDoubleClick }: AdminDataTableRowProps<TData>) {
    const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({ id: row.id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? 0.9 : 1,
        zIndex: isDragging ? 30 : 0,
        position: "relative",
    };

    return (
        <tr
            ref={enableDragAndDrop ? (setNodeRef as React.Ref<HTMLTableRowElement>) : undefined}
            style={enableDragAndDrop ? style : undefined}
            data-state={row.getIsSelected() && "selected"}
            onClick={() => onRowClick && onRowClick(row.original)}
            onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
            className={cn(
                "group border-b border-zinc-200/60 transition-colors hover:bg-zinc-50/80 data-[state=selected]:bg-indigo-50/50",
                (onRowClick || onRowDoubleClick) && "cursor-pointer",
                isDragging && "bg-white border border-zinc-300 outline outline-indigo-500"
            )}
        >
            {enableDragAndDrop && (
                <TableCell className="w-[40px] px-2 py-0 text-center align-middle bg-inherit">
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-600 p-1.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-zinc-200"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                </TableCell>
            )}
            {row.getVisibleCells().map((cell) => {
                const isPinned = cell.column.getIsPinned();
                return (
                    <TableCell 
                        key={cell.id} 
                        className={cn(
                            "px-3 py-2 align-middle text-zinc-700 bg-inherit transition-colors group-hover:bg-zinc-50/80 data-[state=selected]:bg-indigo-50/50",
                            isPinned ? "sticky z-10 border-l border-r border-zinc-200" : ""
                        )}
                        style={{
                            left: isPinned === 'left' ? cell.column.getStart('left') : undefined,
                            right: isPinned === 'right' ? cell.column.getAfter('right') : undefined,
                            width: cell.column.getSize(),
                        }}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                );
            })}
        </tr>
    );
}