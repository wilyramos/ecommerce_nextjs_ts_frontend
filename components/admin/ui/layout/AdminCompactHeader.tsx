// File: frontend/components/admin/ui/layout/AdminCompactHeader.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminCompactHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminCompactHeader({
  breadcrumbs,
  badge,
  actions,
  className,
}: AdminCompactHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5",
        className
      )}
    >
      {/* ── BREADCRUMBS & BADGE ── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs select-none">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={index}>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-semibold",
                    isLast ? "text-zinc-900 font-bold" : "text-zinc-500"
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 text-zinc-300 shrink-0" />}
            </React.Fragment>
          );
        })}

        {badge && <div className="ml-1.5 flex items-center">{badge}</div>}
      </nav>

      {/* ── ACCIONES DIRECTAS ── */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}