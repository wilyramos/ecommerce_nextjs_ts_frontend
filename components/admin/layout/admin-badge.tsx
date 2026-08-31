// File: frontend/components/admin/ui/admin-badge.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AdminBadgeProps {
    children: React.ReactNode;
    variant?: "success" | "warning" | "danger" | "neutral" | "brand";
    className?: string;
}

export function AdminBadge({ children, variant = "neutral", className }: AdminBadgeProps) {
    const variants = {
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        danger: "bg-red-50 text-red-700 border-red-200",
        neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
        brand: "bg-blue-50 text-blue-700 border-blue-200",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}