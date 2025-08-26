"use client";

import { Sale } from '@/src/schemas';
import { FaEye, FaPrint } from 'react-icons/fa';
import Link from 'next/link';

export default function ActionsButtonsVentas({ venta }: { venta: Sale }) {

    const handleImprimir = () => {
        console.log('Imprimir venta:', venta._id);
        window.open(`/api/sales/${venta._id}/pdf`, '_blank');
    };

    return (
        <div className="flex gap-1">
            {/* Ver Detalle */}
            <Link href={`/pos/ventas/${venta._id}`} className="p-2 rounded" title="Ver detalle">
                <FaEye className="text-gray-600 hover:text-gray-950" />
            </Link>

            {/* Imprimir */}
            <button
                onClick={handleImprimir}
                className="p-2 rounded"
                title="Imprimir"
            >
                <FaPrint className="text-gray-600 hover:text-gray-950" />
            </button>

            {/* Anular (solo si no está anulada) */}
            
        </div>
    );
}