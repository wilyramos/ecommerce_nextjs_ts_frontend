// File: frontend/components/admin/collections/delete-button.tsx

"use client";

import { useState, useTransition } from "react";
import { deleteCollectionAction } from "@/src/actions/collection-action";
import { CollectionType } from "@/src/schemas/collection.schema";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    id: string;
    slug: string;
    type?: CollectionType;
}

export default function DeleteCollectionButton({ id, slug, type }: Props) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            const res = await deleteCollectionAction(id, slug, type);
            if (res.success) setOpen(false);
        });
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setOpen(true)}
                disabled={isPending}
            >
                Eliminar
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm bg-background border border-border rounded-sm shadow-xs outline-none">
                    <DialogHeader>
                        <DialogTitle className="text-xs font-bold uppercase tracking-widest text-foreground">
                            ¿Eliminar colección?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground pt-1">
                            La colección{" "}
                            <span className="font-bold text-foreground font-mono">{slug}</span>{" "}
                            será desactivada y dejará de ser visible en el sitio. Puedes reactivarla editándola.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="text-xs font-bold bg-destructive hover:bg-destructive/90 text-white"
                            onClick={handleConfirm}
                            disabled={isPending}
                        >
                            {isPending ? "Eliminando..." : "Sí, eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}