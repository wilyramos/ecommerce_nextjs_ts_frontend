// src/components/ui/table.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return (
        <div className="w-full overflow-x-auto">
            <table
                className={cn("w-full caption-bottom bg-white text-base md:text-base", className)}
                {...props}
            />
        </div>
    );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead
            className={cn(
                "bg-gray-50 text-xs md:text-base uppercase tracking-wide text-gray-600 sticky top-0 z-10 rounded-t-2xl",
                className
            )}
            {...props}
        />
    );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody
            className={cn("divide-y divide-gray-100", className)}
            {...props}
        />
    );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn(
                "border-b border-gray-100 transition-colors hover:bg-gray-100 even:bg-gray-50",
                className
            )}
            {...props}
        />
    );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn("px-6 py-3 text-left font-semibold text-gray-700", className)}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn("px-6 py-4 align-middle text-gray-800", className)}
            {...props}
        />
    );
}
