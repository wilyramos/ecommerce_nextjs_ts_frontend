"use client";

import { Sale } from '@/src/schemas';
import { FaEye, FaPrint, FaTimes } from 'react-icons/fa';

export default function ActionsButtonsVentas({ venta }: { venta: Sale }) {

    const handleVerDetalle = () => {
        console.log('Ver detalle de venta:', venta._id);
        
    };

    const handleImprimir = () => {
        console.log('Imprimir venta:', venta._id);
        // Lógica de impresión
    };

    const handleAnular = () => {
        console.log('Anular venta:', venta._id);
        // Confirmación + lógica de anulación
    };

    return (
        <div className="flex gap-1">
            {/* Ver Detalle */}
            <button
                onClick={handleVerDetalle}
                className="p-2 rounded"
                title="Ver detalle"
            >
                <FaEye className="text-gray-600 hover:text-gray-950" />
            </button>

            {/* Imprimir */}
            <button
                onClick={handleImprimir}
                className="p-2 rounded"
                title="Imprimir"
            >
                <FaPrint className="text-gray-600 hover:text-gray-950" />
            </button>

            {/* Anular (solo si no está anulada) */}
            {venta.status !== 'ANULADA' && (
                <button
                    onClick={handleAnular}
                    className="p-2 rounded"
                    title="Anular venta"
                >
                    <FaTimes className="text-gray-600 hover:text-gray-950" />
                </button>
            )}
        </div>
    );
}