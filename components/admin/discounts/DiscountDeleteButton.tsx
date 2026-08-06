// File: frontend/components/admin/discounts/DiscountDeleteButton.tsx

"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteDiscountAction } from "@/actions/discount-actions";
import { toast } from "sonner";

interface Props {
    id: string;
    title: string;
}

export default function DiscountDeleteButton({ id, title }: Props) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteDiscountAction(id);
            if (res?.ok) {
                toast.success(res.message);
                setOpen(false);
            } else if (res?.error) {
                toast.error(res.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className="text-destructive hover:text-destructive"
                >
                    {isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                    Eliminar
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Confirmar eliminación?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará permanentemente la promoción &quot;{title}&quot;. No se podrá recuperar.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancelar
                        </Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                        {isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}