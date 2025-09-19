"use client";

import { useActionState, useState, useEffect } from "react";
import { editBrandAction } from "@/actions/brand/edit-brand-action";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/src/services/brands";
import { toast } from "sonner";
import UploadBrandImage from "./UploadBrandImage";

export default function EditBrandDialog({
    brand,
    trigger,
}: {
    brand: Brand;
    trigger: React.ReactNode;
}) {
    // estado para controlar apertura/cierre del diálogo
    const [open, setOpen] = useState(false);

    const editBrandWithId = editBrandAction.bind(null, brand._id);
    const [state, dispatch] = useActionState(editBrandWithId, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors.length) {
            state.errors.forEach(err => toast.error(err));
        }
        if (state.success) {
            toast.success(state.success);
            setOpen(false);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar Marca</DialogTitle>
                </DialogHeader>

                <form action={dispatch} className="space-y-4">
                    <Input
                        name="nombre"
                        defaultValue={brand.nombre}
                        placeholder="Nombre"
                    />
                    <Input
                        name="descripcion"
                        defaultValue={brand.descripcion}
                        placeholder="Descripción"
                    />
                    {/* <Input
                        name="logo"
                        defaultValue={brand.logo}
                        placeholder="URL del logo"
                    /> */}

                    <UploadBrandImage 
                        defaultImage={brand.logo}
                    />

                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
