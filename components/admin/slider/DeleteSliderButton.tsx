// File: frontend/components/admin/slider/DeleteSliderButton.tsx
"use client";

import { deleteSliderBannerAction } from "@/actions/slider-actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSliderButtonProps {
    bannerId: string;
    bannerName: string;
}

export default function DeleteSliderButton({ bannerId, bannerName }: DeleteSliderButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteSliderBannerAction(bannerId);

            if (result.success) {
                toast.success(result.message || "Banner eliminado");
                setOpen(false);
            } else {
                toast.error(result.message || "Error al eliminar el banner");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex h-7 w-7 items-center justify-center "
                    aria-label="Eliminar banner"
                    title="Eliminar"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 rounded-full ">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <DialogTitle className="text-xl">¿Confirmar eliminación?</DialogTitle>
                    <DialogDescription className="">
                        Esta acción no se puede deshacer. El banner <span className=" font-medium">
                            {bannerName}
                        </span> será eliminado permanentemente.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-row gap-2 sm:justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                        className="flex-1 bg-transparent"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            "Eliminar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}