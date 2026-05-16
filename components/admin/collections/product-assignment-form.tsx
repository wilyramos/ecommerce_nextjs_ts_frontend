//File: frontend/components/admin/collections/product-assignment-form.tsx

"use client";

import { useTransition, useState } from "react";
import { addProductsToCollectionAction } from "@/src/actions/collection-action";

interface Props {
    collectionId: string;
    slug: string;
}

export default function ProductAssignmentForm({ collectionId, slug }: Props) {
    const [isPending, startTransition] = useTransition();
    const [inputIds, setInputIds] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Limpiar strings y filtrar IDs vacíos
        const productIds = inputIds
            .split(",")
            .map(id => id.trim())
            .filter(id => id.length > 0);

        if (productIds.length === 0) {
            setError("Por favor, introduce al menos un ID de producto válido.");
            return;
        }

        startTransition(async () => {
            const res = await addProductsToCollectionAction(collectionId, slug, productIds);
            if (res.success) {
                setSuccess(true);
                setInputIds(""); // Limpiar campo
            } else {
                setError(res.error || "Ocurrió un error al vincular los productos.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    IDs de Productos (Separados por comas)
                </label>
                <textarea
                    value={inputIds}
                    onChange={(e) => setInputIds(e.target.value)}
                    placeholder="65f1a2..., 65f1b4..., 65f1c9..."
                    rows={5}
                    className="w-full border border-gray-300 p-2.5 rounded-md text-sm font-mono focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                    disabled={isPending}
                    required
                />
                <p className="text-xs text-gray-400 mt-1">
                    Copia y pega uno o varios identificadores de MongoDB separados por comas `,`.
                </p>
            </div>

            {error && (
                <div className="text-xs text-red-500 bg-red-50 border border-red-200 p-2.5 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-xs text-green-600 bg-green-50 border border-green-200 p-2.5 rounded-md">
                    Productos vinculados correctamente a la colección.
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black hover:bg-gray-800 text-white p-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
                {isPending ? "Procesando..." : "Asignar a la Colección"}
            </button>
        </form>
    );
}