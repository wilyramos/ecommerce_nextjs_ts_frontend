// File: frontend/components/admin/ui/form/AdminInput.tsx
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
    ({ className, hasError, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                className={cn(
                    "text-xs h-8 bg-white",
                    hasError && "border-destructive focus-visible:ring-destructive/30",
                    className
                )}
                {...props}
            />
        );
    }
);
AdminInput.displayName = "AdminInput";