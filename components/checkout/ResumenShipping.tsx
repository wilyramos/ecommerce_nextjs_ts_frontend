

interface ShippingData {
    direccion: string;
    ciudad: string;
    telefono: string;
}

export default function ResumenShipping({ shippingData }: { shippingData: ShippingData }) {
    return (
        <>
            <h2 className="text-lg font-medium mb-3">Datos de envío</h2>
            <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Dirección:</strong> {shippingData.direccion}</li>
                <li><strong>Ciudad:</strong> {shippingData.ciudad}</li>
                <li><strong>Teléfono:</strong> {shippingData.telefono}</li>
            </ul>
        </>
    )
}
