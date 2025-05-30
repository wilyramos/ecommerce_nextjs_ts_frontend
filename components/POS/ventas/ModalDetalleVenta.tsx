import React from 'react'

export default function ModalDetalleVenta() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Detalle de Venta</h2>
                {/* Aquí puedes agregar el contenido del detalle de la venta */}
                <p>Detalles de la venta...</p>
            </div>
        </div>
        
    )
}
