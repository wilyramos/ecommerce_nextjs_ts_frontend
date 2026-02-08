"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LineForm } from "./line-form";
import { ProductLine } from "@/src/schemas/line.schema";
import type { Brand } from "@/src/services/brands";

interface LineModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: ProductLine | null;
    brands: Brand[];
    categories: { _id: string; nombre: string }[];
}

export function LineModal({
    isOpen,
    onClose,
    initialData,
    brands,
    categories
}: LineModalProps) {

    // Evitamos que el dialogo se cierre al hacer click fuera si se desea (opcional)
    const onOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Editar Línea" : "Crear Nueva Línea"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Modifica los detalles de la línea seleccionada."
                            : "Completa el formulario para registrar una nueva línea."}
                    </DialogDescription>
                </DialogHeader>

                <LineForm
                    initialData={initialData}
                    brands={brands}
                    categories={categories}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}