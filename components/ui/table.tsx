import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return (
        <div className="w-full overflow-x-auto rounded-[var(--radius-sm)] bg-card text-card-foreground">
            <table
                className={cn("w-full caption-bottom text-xs md:text-sm border-collapse", className)}
                {...props}
            />
        </div>
    );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead
            className={cn(
                "bg-background-secondary text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] border-b border-border sticky top-0 z-10",
                className
            )}
            {...props}
        />
    );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody
            className={cn("divide-y divide-border bg-card", className)}
            {...props}
        />
    );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn(
                "border-b border-border transition-colors hover:bg-background-secondary data-[state=selected]:bg-background-secondary",
                className
            )}
            {...props}
        />
    );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn("px-4 py-3 text-left font-bold text-foreground align-middle h-10 select-none", className)}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn("px-4 py-3.5 align-middle font-medium h-12 text-foreground", className)}
            {...props}
        />
    );
}