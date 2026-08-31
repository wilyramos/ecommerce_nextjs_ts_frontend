// File: frontend/components/admin/ui/table/AdminDataTable.tsx
"use client";

import React, { useState, useEffect, useId } from "react"; // <-- AÑADIDO useId
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    ExpandedState,
    ColumnPinningState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AlertCircle } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { AdminDataTableToolbar, type TableTab } from "./AdminDataTableToolbar";
import { AdminDataTablePagination } from "./AdminDataTablePagination";
import { AdminDataTableRow } from "./AdminDataTableRow";

interface AdminDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;

    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    pageCount?: number;
    rowCount?: number;
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
    onSortingChange?: (sorting: SortingState) => void;

    searchPlaceholder?: string;
    tabs?: TableTab[];
    activeTab?: string;
    onTabChange?: (value: string) => void;
    onExport?: (format: "csv" | "excel" | "pdf", data: TData[]) => void;

    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    renderBulkActions?: (selectedRows: TData[], clearSelection: () => void) => React.ReactNode;

    enableDragAndDrop?: boolean;
    onReorder?: (newData: TData[]) => void;
    onRowClick?: (row: TData) => void;
    onRowDoubleClick?: (row: TData) => void;
    renderSubComponent?: (props: { row: TData }) => React.ReactElement;
}

export function AdminDataTable<TData, TValue>({
    columns,
    data: initialData,
    isLoading = false,
    isError = false,
    onRetry,
    manualPagination = false,
    manualSorting = false,
    manualFiltering = false,
    pageCount,
    rowCount,
    onPaginationChange,
    onSortingChange,
    searchPlaceholder = "Buscar registros...",
    tabs,
    activeTab,
    onTabChange,
    onExport,
    enableRowSelection = false,
    onRowSelectionChange,
    renderBulkActions,
    enableDragAndDrop = false,
    onReorder,
    onRowClick,
    onRowDoubleClick,
    renderSubComponent,
}: AdminDataTableProps<TData, TValue>) {

    const [data, setData] = useState<TData[]>(initialData);
    
    // <-- AÑADIDO: Generar ID determinista para evitar el error de hidratación de DndKit
    const dndId = useId(); 

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: [], right: ["actions"] });

    useEffect(() => setData(initialData), [initialData]);

    const tableColumns = React.useMemo(() => {
        const cols = [...columns];
        if (enableRowSelection) {
            cols.unshift({
                id: "select",
                enableResizing: false,
                size: 40,
                header: ({ table }) => (
                    <div className="px-2 flex items-center justify-center">
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            className="w-4 h-4 border-zinc-300 data-[state=checked]:bg-zinc-900"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="px-2 flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            className="w-4 h-4 border-zinc-300 data-[state=checked]:bg-zinc-900"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            });
        }
        return cols;
    }, [columns, enableRowSelection]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getRowId: (row, index) => (row as { _id?: string })._id || String(index),

        manualPagination,
        manualSorting,
        manualFiltering,
        pageCount,
        rowCount,

        state: { 
            sorting, 
            columnFilters, 
            globalFilter, 
            columnVisibility, 
            rowSelection, 
            expanded, 
            columnPinning 
        },

        onSortingChange: (updater) => {
            setSorting(updater);
            if (onSortingChange && typeof updater !== "function") onSortingChange(updater);
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onExpandedChange: setExpanded,
        onColumnPinningChange: setColumnPinning,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),

        columnResizeMode: "onChange",
        getRowCanExpand: () => !!renderSubComponent,
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    const clearSelection = () => table.toggleAllPageRowsSelected(false);

    useEffect(() => {
        if (onRowSelectionChange) onRowSelectionChange(selectedRows);
    }, [rowSelection, onRowSelectionChange, selectedRows]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = data.findIndex((item) => ((item as { _id?: string })._id || String(data.indexOf(item))) === active.id);
            const newIndex = data.findIndex((item) => ((item as { _id?: string })._id || String(data.indexOf(item))) === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newData = arrayMove(data, oldIndex, newIndex);
                setData(newData);
                if (onReorder) onReorder(newData);
            }
        }
    };

    if (isError) {
        return (
            <div className="w-full border border-red-200 bg-red-50 p-6 flex flex-col items-center justify-center text-red-600">
                <AlertCircle className="w-8 h-8 mb-3" />
                <h3 className="text-sm font-bold mb-1">Error al cargar los datos</h3>
                <p className="text-xs text-red-500 mb-4">No se pudo establecer conexión con el servidor.</p>
                {onRetry && <Button variant="outline" onClick={onRetry} className="bg-white border-red-200 text-red-600 hover:bg-red-50 text-xs h-8">Reintentar consulta</Button>}
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200 overflow-hidden flex flex-col">
            <AdminDataTableToolbar 
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                searchPlaceholder={searchPlaceholder}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                selectedRows={selectedRows}
                clearSelection={clearSelection}
                renderBulkActions={renderBulkActions}
                onExport={onExport}
            />

            <div className="overflow-auto relative min-h-[250px] w-full slim-scrollbar">
                {/* <-- AÑADIDO: id={dndId} en DndContext */}
                <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <Table className="w-full text-[13px] table-fixed">
                        <TableHeader className="bg-zinc-50 sticky top-0 z-20 border-b border-zinc-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent border-0">
                                    {enableDragAndDrop && <TableHead className="w-[40px] px-2"></TableHead>}
                                    {headerGroup.headers.map((header) => {
                                        const isPinned = header.column.getIsPinned();
                                        return (
                                            <TableHead 
                                                key={header.id} 
                                                className={`py-2.5 px-3 text-zinc-600 font-semibold h-10 border-r border-zinc-200 last:border-0 relative ${isPinned ? "sticky bg-zinc-50 z-30" : ""}`}
                                                style={{
                                                    width: header.getSize(),
                                                    left: isPinned === "left" ? `${header.column.getStart("left")}px` : undefined,
                                                    right: isPinned === "right" ? `${header.column.getAfter("right")}px` : undefined,
                                                }}
                                            >
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize user-select-none touch-none hover:bg-indigo-500/50 ${header.column.getIsResizing() ? "bg-indigo-500" : "bg-transparent"}`}
                                                    />
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: table.getState().pagination.pageSize || 10 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={tableColumns.length + (enableDragAndDrop ? 1 : 0)} className="p-3 border-b border-zinc-100">
                                            <div className="flex items-center gap-4 animate-pulse">
                                                <div className="w-4 h-4 bg-zinc-200" />
                                                <div className="h-4 bg-zinc-200 w-1/4" />
                                                <div className="h-4 bg-zinc-200 w-1/4" />
                                                <div className="h-4 bg-zinc-200 w-8 ml-auto" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                <SortableContext items={table.getRowModel().rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                                    {table.getRowModel().rows.map((row) => (
                                        <React.Fragment key={row.id}>
                                            <AdminDataTableRow 
                                                row={row} 
                                                enableDragAndDrop={enableDragAndDrop} 
                                                onRowClick={onRowClick}
                                                onRowDoubleClick={onRowDoubleClick}
                                            />
                                            {row.getIsExpanded() && renderSubComponent && (
                                                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-b border-zinc-200">
                                                    <TableCell colSpan={row.getVisibleCells().length + (enableDragAndDrop ? 1 : 0)} className="p-0">
                                                        <div className="p-4 border-l-4 border-indigo-500 animate-in slide-in-from-top-2">
                                                            {renderSubComponent({ row: row.original })}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={tableColumns.length + (enableDragAndDrop ? 1 : 0)} className="h-[300px] text-center">
                                        <div className="flex flex-col items-center justify-center text-zinc-400">
                                            <p className="text-sm font-semibold text-zinc-600 mb-1">Sin resultados</p>
                                            <span className="text-xs">Intenta limpiar los filtros o realizar otra búsqueda.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            
            <AdminDataTablePagination table={table} onPaginationChange={onPaginationChange} />
        </div>
    );
}