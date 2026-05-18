"use client";

import { useTransition } from "react";
import { deleteComparisonAction } from "@/actions/comparison-action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

interface DeleteComparisonDialogProps {
    id: string;
    slug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteComparisonDialog({
    id,
    slug,
    open,
    onOpenChange,
}: DeleteComparisonDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteComparisonAction(id, slug, {
                success: false,
                message: "",
            });
            
            if (!response.success) {
                alert(response.message);
            }
            
            onOpenChange(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Está seguro de que desea eliminar la comparativa?</DialogTitle>
                    <DialogDescription>
                        Se aplicará un borrado lógico a la comparativa{" "}
                        <span className="font-semibold text-[var(--color-text-primary)]">
                            {slug}
                        </span>
                        . Esta acción se puede revertir desde el panel de administración.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="ghost" disabled={isPending}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Eliminando..." : "Confirmar eliminación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}