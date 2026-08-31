// File: frontend/components/admin/ui/form/FormActions.tsx
"use client";

import React from "react";
import { Loader2, Save, Trash2, ArrowLeft } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormActionsProps {
    isPending?: boolean;
    onCancel?: () => void;
    onDelete?: () => void;
    onSaveAndCreateAnother?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    showDelete?: boolean;
    className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
    isPending = false,
    onCancel,
    onDelete,
    onSaveAndCreateAnother,
    saveLabel = "Guardar cambios",
    cancelLabel = "Cancelar",
    showDelete = false,
    className,
}) => {
    const {
        formState: { isDirty },
    } = useFormContext();

    const handleCancel = () => {
        if (isDirty) {
            const confirmed = window.confirm("Tienes cambios sin guardar. ¿Seguro que deseas salir?");
            if (!confirmed) return;
        }
        onCancel?.();
    };

    const handleDelete = () => {
        const confirmed = window.confirm("¿Estás completamente seguro de eliminar este registro permanentemente?");
        if (confirmed) {
            onDelete?.();
        }
    };

    return (
        <div
            className={cn(
                "border-t border-zinc-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20",
                className
            )}
        >
            <div className="flex items-center gap-2 w-full sm:w-auto">
                {showDelete && onDelete && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleDelete}
                        className="h-9 px-3 text-[12px] text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto"
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Eliminar
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleCancel}
                        className="h-9 px-4 text-[12px] border-zinc-200 text-zinc-700 hover:bg-zinc-50 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {cancelLabel}
                    </Button>
                )}

                {onSaveAndCreateAnother && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={onSaveAndCreateAnother}
                        className="h-9 px-4 text-[12px] border-zinc-200 text-zinc-900 hover:bg-zinc-50 w-full sm:w-auto"
                    >
                        {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                        Guardar y crear otro
                    </Button>
                )}

                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-9 px-5 text-[12px] font-semibold bg-zinc-900 text-white hover:bg-zinc-800 border-0 w-full sm:w-auto"
                >
                    {isPending ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {saveLabel}
                </Button>
            </div>
        </div>
    );
};