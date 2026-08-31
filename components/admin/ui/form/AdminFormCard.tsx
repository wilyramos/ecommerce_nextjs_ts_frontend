// File: frontend/components/admin/ui/form/AdminFormCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminFormCardProps {
    title: string;
    description?: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    error?: string; // Para mostrar errores a nivel de la tarjeta (ej. en arrays)
}

export function AdminFormCard({ 
    title, 
    description, 
    headerAction, 
    children, 
    className,
    contentClassName,
    error 
}: AdminFormCardProps) {
    return (
        <Card className={cn("overflow-hidden transition-colors", error && "border-destructive/50 shadow-sm shadow-destructive/10", className)}>
            <CardHeader className="flex flex-row items-center justify-between bg-zinc-50/50 border-b border-zinc-100 pb-4">
                <div className="space-y-1">
                    <CardTitle className={cn("text-sm", error && "text-destructive")}>{title}</CardTitle>
                    {description && <CardDescription className="text-xs">{description}</CardDescription>}
                </div>
                {headerAction && <div>{headerAction}</div>}
            </CardHeader>
            <CardContent className={cn("pt-6", contentClassName)}>
                {error && <p className="text-xs text-destructive mb-4 font-medium">{error}</p>}
                {children}
            </CardContent>
        </Card>
    );
}