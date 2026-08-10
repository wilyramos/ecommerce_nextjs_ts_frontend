import React from "react";
import { cn } from "@/lib/utils";

interface AdminFormSplitLayoutProps {
    sidebar: React.ReactNode;
    main: React.ReactNode;
    className?: string;
}

export function AdminFormSplitLayout({ sidebar, main, className }: AdminFormSplitLayoutProps) {
    return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-4 items-start", className)}>
            <div className="lg:col-span-2 flex flex-col gap-4">
                {main}
            </div>
            <div className="flex flex-col gap-4">
                {sidebar}
            </div>
        </div>
    );
}