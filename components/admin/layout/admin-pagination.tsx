// File: frontend/components/admin/ui/admin-pagination.tsx
"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
}

export function AdminPagination({ currentPage, totalPages, totalItems }: AdminPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-zinc-100 rounded-b-xl">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs text-zinc-500">
                        Página <span className="font-semibold text-zinc-900">{currentPage}</span> de{" "}
                        <span className="font-semibold text-zinc-900">{totalPages}</span>
                        {totalItems !== undefined && (
                            <span> (Total: {totalItems} registros)</span>
                        )}
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-l-md rounded-r-none border-zinc-200 text-zinc-500 hover:bg-zinc-50 h-8 px-2"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                        >
                            <span className="sr-only">Anterior</span>
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-r-md rounded-l-none border-zinc-200 text-zinc-500 hover:bg-zinc-50 h-8 px-2"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            <span className="sr-only">Siguiente</span>
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    );
}