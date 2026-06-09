// File: frontend/components/catalog/CatalogPagination.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface Props {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
}

export default function CatalogPagination({ currentPage, totalPages, siblingCount = 1 }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (Number(page) === 1) params.delete("page");
        else params.set("page", page.toString());
        return `${pathname}?${params.toString()}`;
    };

    const generatePagination = () => {
        const totalNumbers = siblingCount + 5;
        if (totalPages <= totalNumbers) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        if (!shouldShowLeftDots && shouldShowRightDots) return [...Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1), "...", totalPages];
        if (shouldShowLeftDots && !shouldShowRightDots) return [1, "...", ...Array.from({ length: 3 + 2 * siblingCount }, (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1)];
        return [1, "...", ...Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i), "...", totalPages];
    };

    return (
        <nav aria-label="Navegación del catálogo" className="flex justify-center items-center gap-1 select-none">
            <PaginationButton href={createPageUrl(currentPage - 1)} isDisabled={currentPage <= 1}>
                <ChevronLeft className="w-4 h-4" />
            </PaginationButton>

            {generatePagination().map((p, i) => (
                p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-[10px] text-muted-foreground tracking-widest">...</span>
                ) : (
                    <PaginationButton key={p} href={createPageUrl(p)} isActive={currentPage === p}>
                        {p}
                    </PaginationButton>
                )
            ))}

            <PaginationButton href={createPageUrl(currentPage + 1)} isDisabled={currentPage >= totalPages}>
                <ChevronRight className="w-4 h-4" />
            </PaginationButton>
        </nav>
    );
}

interface PaginationButtonProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
    href: string;
    isActive?: boolean;
    isDisabled?: boolean;
    children: React.ReactNode;
}

function PaginationButton({ href, isActive, isDisabled, children, className, ...props }: PaginationButtonProps) {
    const baseStyles = "flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] text-[11px] font-black uppercase tracking-widest transition-all duration-200 border";

    if (isDisabled) {
        return (
            <span className={cn(baseStyles, "border-transparent text-muted-foreground opacity-30 cursor-not-allowed")}>
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            scroll={false}
            className={cn(
                baseStyles,
                isActive
                    ? "bg-action-cta text-action-cta-foreground border-action-cta shadow-sm"
                    : "bg-card text-foreground border-border hover:border-action-cta hover:text-action-cta active:scale-95",
                className
            )}
            {...props}
        >
            {children}
        </Link>
    );
}