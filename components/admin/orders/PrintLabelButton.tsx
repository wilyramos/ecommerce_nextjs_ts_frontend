"use client";

import { useState } from "react";
import { FaTags } from "react-icons/fa"; // O FaTruck

interface Props {
    orderId: string;
}

export default function PrintLabelButton({ orderId }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePrintLabel = () => {
        setIsLoading(true);
        // Abrimos el PDF de la etiqueta en una nueva pestaña
        window.open(`/api/orders/${orderId}/label?action=view`, "_blank");
        setIsLoading(false);
    };

    return (
        <button 
            onClick={handlePrintLabel}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-[var(--store-text)] text-[var(--store-surface)] rounded-md hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
            title="Imprimir Etiqueta de Envío"
        >
            <FaTags className="text-gray-300" /> 
            Etiqueta
        </button>
    );
}