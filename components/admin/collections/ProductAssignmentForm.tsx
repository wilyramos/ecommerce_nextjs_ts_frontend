"use client";

import { useTransition, useState } from "react";
import { addProductsToCollectionAction } from "@/src/actions/collection-action";
import { Button } from "@/components/ui/button";
import ProductReferenceSelector from "../shared/ProductReferenceSelector";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
    collectionId: string;
    slug: string;
}

export default function ProductAssignmentForm({ collectionId, slug }: Props) {
    const [isPending, startTransition] = useTransition();
    const [selectedProductId, setSelectedProductId] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId) return;

        startTransition(async () => {
            const result = await addProductsToCollectionAction(
                collectionId, 
                slug, 
                [selectedProductId]
            );

            if (result.success) {
                toast.success("Producto vinculado correctamente");
                setSelectedProductId(""); // Limpiar selección
            } else {
                toast.error(result.error || "Error al vincular producto");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ProductReferenceSelector
                label="Seleccionar Producto"
                onSelect={(id) => setSelectedProductId(id)}
            />
            
            <Button 
                type="submit" 
                className="w-full font-bold uppercase tracking-wider text-xs"
                disabled={isPending || !selectedProductId}
            >
                {isPending ? (
                    <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Vinculando...</>
                ) : (
                    "Confirmar Vinculación"
                )}
            </Button>
        </form>
    );
}