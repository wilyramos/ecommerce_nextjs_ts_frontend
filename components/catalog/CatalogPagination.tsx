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
    <nav aria-label="Navegación del catálogo" className="flex items-center justify-center gap-1.5 select-none">
      <PaginationButton href={createPageUrl(currentPage - 1)} isDisabled={currentPage <= 1}>
        <ChevronLeft className="size-4" />
      </PaginationButton>

      {generatePagination().map((p, i) => (
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-xs font-semibold tracking-widest text-text-tertiary">...</span>
        ) : (
          <PaginationButton key={p} href={createPageUrl(p)} isActive={currentPage === p}>
            {p}
          </PaginationButton>
        )
      ))}

      <PaginationButton href={createPageUrl(currentPage + 1)} isDisabled={currentPage >= totalPages}>
        <ChevronRight className="size-4" />
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
  const baseStyles = "flex size-9 items-center justify-center rounded-radius-sm text-xs font-semibold transition-all duration-fast border outline-none";

  if (isDisabled) {
    return (
      <span 
        className={cn(baseStyles, "border-transparent bg-transparent text-text-disabled cursor-not-allowed")}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        baseStyles,
        isActive
          ? "border-brand-primary bg-brand-primary text-text-inverse shadow-xs pointer-events-none"
          : "border-border-primary/80 bg-surface-primary text-text-primary hover:border-border-strong hover:bg-surface-secondary active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}