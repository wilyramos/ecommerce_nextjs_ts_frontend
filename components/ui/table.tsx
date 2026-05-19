import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return (
        <div className="w-full overflow-x-auto rounded-sm border border-border/60 bg-background">
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
                "bg-background-secondary text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/90 border-b border-border sticky top-0 z-10",
                className
            )}
            {...props}
        />
    );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody
            className={cn("divide-y divide-border/40 bg-background", className)}
            {...props}
        />
    );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn(
                "transition-colors hover:bg-background-secondary/60 data-[state=selected]:bg-background-secondary",
                className
            )}
            {...props}
        />
    );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn("px-4 py-3 text-left font-bold text-foreground/90 align-middle h-10", className)}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn("px-4 py-3.5 align-middle text-muted-foreground font-medium h-12", className)}
            {...props}
        />
    );
}