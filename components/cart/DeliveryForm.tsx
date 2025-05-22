import React from 'react'

type DeliveryInfo = {
    nombre: string
    direccion: string
    telefono: string
    correo: string
}

type Props = {
    deliveryInfo: DeliveryInfo
    setDeliveryInfo: React.Dispatch<React.SetStateAction<DeliveryInfo>>
}

export default function DeliveryForm({ deliveryInfo, setDeliveryInfo }: Props) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        console.log(name, value)
        setDeliveryInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    console.log(deliveryInfo)

    return (
        <form className="space-y-2 px-6">
            <div>
                <label htmlFor="nombre" className="block text-sm text-gray-700 mb-1 font-bold">
                    Nombre completo
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={deliveryInfo.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                />
            </div>

            <div>
                <label htmlFor="direccion" className="block text-sm font-bold text-gray-700 mb-1">
                    Dirección de entrega
                </label>
                <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={deliveryInfo.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Av. Siempre Viva 742"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                />
            </div>

            <div>
                <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-1">
                    Teléfono de contacto
                </label>
                <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={deliveryInfo.telefono}
                    onChange={handleChange}
                    required
                    placeholder="Ej. 987654321"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="correo" className="block text-sm font-bold text-gray-700 mb-1">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={deliveryInfo.correo}
                    onChange={handleChange}
                    placeholder="Ej. juanperez@example.com"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm"
                />
            </div>
        </form>
    )
}
