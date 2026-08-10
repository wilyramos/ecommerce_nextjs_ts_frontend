// File: frontend/components/admin/layout/admin-page-container.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function AdminPageContainer({ children, className }: AdminPageContainerProps) {
    return (
        <div className={cn("flex flex-col w-full min-h-full p-4 md:p-6 lg:p-8 gap-6 max-w-7xl mx-auto", className)}>
            {children}
        </div>
    );
}

export default AdminPageContainer;