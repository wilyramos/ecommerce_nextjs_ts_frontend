// src/components/admin/layout/admin-page-header.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode; // Para botones de acción (ej. "Crear Producto")
    className?: string;
}

export function AdminPageHeader({ title, description, children, className }: AdminPageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">{title}</h1>
                {description && <p className="text-sm text-zinc-500">{description}</p>}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}