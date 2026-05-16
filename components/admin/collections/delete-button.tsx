"use client";

import { useTransition } from "react";
import { deleteCollectionAction } from "@/src/actions/collection-action";

interface Props {
    id: string;
    slug: string;
}

export default function DeleteCollectionButton({ id, slug }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("¿Seguro que deseas desactivar esta colección temática?")) return;

        startTransition(async () => {
            const res = await deleteCollectionAction(id, slug);
            if (!res.success && res.error) {
                alert(res.error);
            }
        });
    };

    return (
        <button 
            onClick={handleDelete} 
            disabled={isPending}
            className="text-sm font-medium text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
        >
            {isPending ? "Desactivando..." : "Desactivar"}
        </button>
    );
}