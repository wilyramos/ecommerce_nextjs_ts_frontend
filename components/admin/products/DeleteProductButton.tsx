"use client";

import { DeleteProduct } from "@/actions/product/delete-product-action";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FiTrash } from "react-icons/fi";
import { AlertCircle, Loader2 } from "lucide-react";
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

export default function DeleteProductButton({ productId }: { productId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const deleteProductWithId = DeleteProduct.bind(null, productId);
    const [state, dispatch] = useActionState(deleteProductWithId, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
            setOpen(false);
            router.push("/admin/products");
        }
    }, [state, router]);

    const handleDelete = () => {
        startTransition(() => {
            dispatch();
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 cursor-pointer"
                >
                    <FiTrash className="w-4 h-4" />
                    Eliminar
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3">
                        <AlertCircle/>
                    </div>
                    <DialogTitle className="text-xl">¿Confirmar eliminación?</DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-row gap-2 sm:justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="flex-1"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            "Confirmar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}