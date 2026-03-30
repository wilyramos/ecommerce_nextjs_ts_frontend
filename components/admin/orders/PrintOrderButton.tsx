"use client";

import { useState } from "react";
import { FaPrint, FaDownload } from "react-icons/fa";

interface Props {
    orderId: string;
}

export default function PrintOrderButton({ orderId }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    // Abre el PDF en una nueva pestaña (ideal para previsualizar e imprimir)
    const handleViewPdf = () => {
        setIsLoading(true);
        // Asumiendo que tu ruta de API en Next.js es /api/orders/[id]/pdf
        window.open(`/api/orders/${orderId}/pdf?action=view`, "_blank");
        setIsLoading(false);
    };

    // Fuerza la descarga del archivo sin abrirlo
    const handleDownloadPdf = () => {
        setIsLoading(true);
        const link = document.createElement("a");
        link.href = `/api/orders/${orderId}/pdf?action=download`;
        link.setAttribute("download", `Orden-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        setIsLoading(false);
    };

    return (
        <div className="flex gap-2">
            <button 
                onClick={handleViewPdf}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:text-[var(--store-primary)] transition-colors shadow-sm disabled:opacity-50"
                title="Ver e Imprimir PDF"
            >
                <FaPrint className="text-gray-400" /> 
                Imprimir
            </button>

            <button 
                onClick={handleDownloadPdf}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:text-[var(--store-primary)] transition-colors shadow-sm disabled:opacity-50"
                title="Descargar PDF"
            >
                <FaDownload className="text-gray-400" />
                Descargar
            </button>
        </div>
    );
}