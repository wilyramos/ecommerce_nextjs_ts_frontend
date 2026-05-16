"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCollectionAction, updateCollectionAction } from "@/src/actions/collection-action";
import { Collection } from "@/src/schemas/collection.schema";

interface Props {
    isOpen: boolean;
    collectionToEdit: Collection | null;
}

export default function CollectionModal({ isOpen, collectionToEdit }: Props) {
    const router = useRouter();

    // Enlace dinámico del Server Action según operación (Creación vs Edición)
    const actionCall = collectionToEdit 
        ? updateCollectionAction.bind(null, collectionToEdit._id) 
        : createCollectionAction;

    const [state, formAction, isPending] = useActionState(actionCall, null);

    const handleClose = () => {
        // Cierra el modal limpiando los query parameters de la URL en Next.js
        router.push("/admin/collections");
    };

        // Efecto para cerrar el modal tras una acción exitosa
    useEffect(() => {
        if (state?.success) {
            handleClose();
        }
    }, [state?.success]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {collectionToEdit ? `Editar ${collectionToEdit.name}` : "Nueva Colección Temática"}
                </h2>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre de la sección</label>
                        <input 
                            name="name" 
                            type="text" 
                            defaultValue={collectionToEdit?.name || ""} 
                            className="w-full border border-gray-200 p-2.5 rounded-md mt-1 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                            required 
                            disabled={isPending}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción corta</label>
                        <textarea 
                            name="description" 
                            defaultValue={collectionToEdit?.description || ""} 
                            className="w-full border border-gray-200 p-2.5 rounded-md mt-1 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                            rows={3}
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Color Hex (Opcional)</label>
                            <input 
                                name="color" 
                                type="text" 
                                defaultValue={collectionToEdit?.color || ""} 
                                placeholder="#ffffff"
                                className="w-full border border-gray-200 p-2.5 rounded-md mt-1 text-sm focus:ring-1 focus:ring-black outline-none font-mono transition-all"
                                disabled={isPending}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Orden de prioridad</label>
                            <input 
                                name="order" 
                                type="number" 
                                defaultValue={collectionToEdit?.order ?? 0} 
                                className="w-full border border-gray-200 p-2.5 rounded-md mt-1 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            defaultChecked={collectionToEdit ? collectionToEdit.isActive : true}
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            disabled={isPending}
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none">
                            Colección activa y visible en la tienda
                        </label>
                    </div>

                    {state?.error && (
                        <div className="text-xs text-red-500 bg-red-50 border border-red-200 p-2.5 rounded-md mt-2">
                            {state.error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6 pt-2 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors" 
                            disabled={isPending}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors" 
                            disabled={isPending}
                        >
                            {isPending ? "Guardando..." : "Guardar Sección"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}