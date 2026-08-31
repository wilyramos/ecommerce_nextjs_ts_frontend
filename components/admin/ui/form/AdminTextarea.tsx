// File: frontend/components/admin/ui/form/AdminTextarea.tsx
import React, { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
    ({ className, hasError, ...props }, ref) => {
        return (
            <Textarea
                ref={ref}
                className={cn(
                    "text-xs bg-white resize-y",
                    hasError && "border-destructive focus-visible:ring-destructive/30",
                    className
                )}
                {...props}
            />
        );
    }
);
AdminTextarea.displayName = "AdminTextarea";