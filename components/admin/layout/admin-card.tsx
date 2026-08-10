import React from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    bodyClassName?: string;
}

export function AdminCard({ title, description, children, footer, className, bodyClassName }: AdminCardProps) {
    return (
        <div className={cn("bg-white border border-zinc-200/80 rounded-lg shadow-2xs overflow-hidden flex flex-col", className)}>
            {(title || description) && (
                <div className="px-3.5 py-2.5 border-b border-zinc-100 bg-white">
                    {title && <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">{title}</h3>}
                    {description && <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{description}</p>}
                </div>
            )}

            <div className={cn("p-3.5 flex-1", bodyClassName)}>
                {children}
            </div>

            {footer && (
                <div className="px-3.5 py-2 bg-zinc-50/60 border-t border-zinc-100 flex items-center justify-end gap-2 rounded-b-lg">
                    {footer}
                </div>
            )}
        </div>
    );
}