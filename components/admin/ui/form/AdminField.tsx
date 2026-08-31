// File: frontend/components/admin/ui/form/AdminField.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AdminFieldProps {
    label?: string;
    htmlFor?: string;
    error?: string;
    description?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function AdminField({ 
    label, 
    htmlFor, 
    error, 
    description, 
    required, 
    children, 
    className 
}: AdminFieldProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <Label 
                    htmlFor={htmlFor} 
                    className={cn(
                        "text-[11px] font-bold uppercase tracking-wider text-zinc-600", 
                        error && "text-destructive"
                    )}
                >
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            )}
            
            {children}
            
            {description && !error && (
                <p className="text-[10px] text-muted-foreground">{description}</p>
            )}
            
            {error && (
                <p className="text-[10px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">{error}</p>
            )}
        </div>
    );
}