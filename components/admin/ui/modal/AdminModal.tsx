// File: frontend/components/admin/ui/modal/AdminModal.tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  hideCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] h-[90vh]",
};

export function AdminModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  hideCloseButton = false,
}: AdminModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] border border-zinc-200 bg-white p-0 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            sizeClasses[size],
            className
          )}
        >
          {/* Fallback de Accesibilidad Radix UI cuando no se pasa title/description en la cabecera */}
          {!title && (
            <DialogPrimitive.Title className="sr-only">
              Ventana modal
            </DialogPrimitive.Title>
          )}
          {!description && (
            <DialogPrimitive.Description className="sr-only">
              Contenido de la ventana modal
            </DialogPrimitive.Description>
          )}

          {/* Cabecera Visible */}
          {(title || description) && (
            <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4 bg-zinc-50/50">
              <div className="space-y-1 pr-6">
                {title && (
                  <DialogPrimitive.Title className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                    {title}
                  </DialogPrimitive.Title>
                )}
                {description && (
                  <DialogPrimitive.Description className="text-xs text-zinc-500 leading-relaxed">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              {!hideCloseButton && (
                <DialogPrimitive.Close className="h-6 w-6 border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors focus:outline-none">
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Cerrar</span>
                </DialogPrimitive.Close>
              )}
            </div>
          )}

          {/* Cuerpo */}
          <div className="p-5 max-h-[75vh] overflow-y-auto slim-scrollbar text-sm text-zinc-700">
            {children}
          </div>

          {/* Pie de acción */}
          {footer && (
            <div className="border-t border-zinc-200 bg-zinc-50/50 px-5 py-3 flex items-center justify-end gap-2">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}