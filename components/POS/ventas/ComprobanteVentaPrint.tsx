// components/ComprobanteVentaPrint.tsx
import { Sale } from '@/src/schemas';
import React from 'react';

const ComprobanteVentaPrint = React.forwardRef<HTMLDivElement, { venta: Sale }>(
  ({ venta }, ref) => {
    return (
      <div ref={ref} className="p-4 text-sm font-mono">
        <h2 className="text-center text-lg font-bold mb-4">Comprobante de Venta</h2>
        <p><strong>ID:</strong> {venta._id}</p>
        {/* <p><strong>Cliente:</strong> {venta.cliente?.nombre || 'No especificado'}</p> */}
        <p><strong>Fecha:</strong> {new Date(venta.createdAt).toLocaleString()}</p>
        <p><strong>Total:</strong> S/ {venta.totalPrice.toFixed(2)}</p>
        {/* Más detalles aquí */}
      </div>
    );
  }
);

ComprobanteVentaPrint.displayName = 'ComprobanteVentaPrint';

export default ComprobanteVentaPrint;
