// File: frontend/components/admin/ui/table/AdminDataTablePagination.tsx
"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PaginationProps<TData> {
    table: Table<TData>;
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export function AdminDataTablePagination<TData>({ table, onPaginationChange }: PaginationProps<TData>) {
    const handlePageChange = (page: number) => {
        table.setPageIndex(page);
        if (onPaginationChange) {
            onPaginationChange({ pageIndex: page, pageSize: table.getState().pagination.pageSize });
        }
    };

    const handlePageSizeChange = (size: number) => {
        table.setPageSize(size);
        if (onPaginationChange) {
            onPaginationChange({ pageIndex: 0, pageSize: size });
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 border-t border-zinc-200 bg-white">
            <div className="text-[13px] text-zinc-500 font-medium w-full text-center sm:text-left">
                {table.getFilteredRowModel().rows.length} elemento(s) en total.
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 w-full">
                <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-zinc-500 hidden sm:block">Mostrar</p>
                    <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => handlePageSizeChange(Number(value))}>
                        <SelectTrigger className="h-8 w-[65px] text-[13px] font-medium bg-white border-zinc-200 focus:ring-0">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top" className="bg-white border-zinc-200">
                            {[15, 30, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`} className="text-[13px] font-medium cursor-pointer">{pageSize}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-600">
                    Pág 
                    <Input 
                        type="number" 
                        className="w-12 h-8 px-1 text-center text-[13px] border-zinc-200" 
                        value={table.getState().pagination.pageIndex + 1}
                        min={1}
                        max={table.getPageCount() || 1}
                        onChange={(e) => {
                            const val = e.target.value ? Number(e.target.value) - 1 : 0;
                            handlePageChange(val);
                        }}
                    /> 
                    de {table.getPageCount() || 1}
                </div>

                <div className="flex items-center gap-1 bg-white border border-zinc-200 p-0.5">
                    <Button variant="ghost" className="h-7 w-7 p-0 hidden sm:flex text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" onClick={() => handlePageChange(0)} disabled={!table.getCanPreviousPage()}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)} disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-[1px] h-4 bg-zinc-200 mx-0.5" />
                    <Button variant="ghost" className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)} disabled={!table.getCanNextPage()}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="h-7 w-7 p-0 hidden sm:flex text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" onClick={() => handlePageChange(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}