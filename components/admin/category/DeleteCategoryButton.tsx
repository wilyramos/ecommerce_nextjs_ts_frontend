"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { deleteCategoryAction, type ActionStateType } from "@/actions/category/category-action";
import { Button } from "@/components/ui/button";
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

type Props = {
    categoryId: string;
    categoryName: string;
};

export default function DeleteCategoryButton({ categoryId, categoryName }: Props) {
    const router = useRouter();

    // Adaptación nativa de la firma de useActionState (state, payload) para React 19/Next 15
    const [state, dispatch] = useActionState(
        async (prevState: ActionStateType) => {
            return deleteCategoryAction(categoryId, prevState);
        },
        {
            errors: [],
            success: "",
        }
    );

    useEffect(() => {
        state.errors.forEach((e) => toast.error(e));
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products/category");
        }
    }, [state, router]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Eliminar
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar categoría?</DialogTitle>
                    <DialogDescription>
                        Estás a punto de eliminar{" "}
                        <span className="font-semibold text-foreground">
                            {categoryName}
                        </span>
                        . Esta acción no se puede deshacer. Solo es posible si la
                        categoría no tiene subcategorías ni productos vinculados.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <form action={dispatch}>
                        <Button type="submit" variant="destructive" className="w-full">
                            Confirmar eliminación
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}