"use client"

import { useState } from "react"
import DeliveryForm from "@/components/cart/DeliveryForm"
import ResumenFinalCarrito from "@/components/cart/ResumenFinalCarrito"
import PaymentForm from "@/components/cart/PaymentForm"

export default function PaymentClientWrapper() {

    const [deliveryInfo, setDeliveryInfo] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        correo: ""
    })

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <section>
                <h1 className="text-2xl font-bold mb-4">Datos de Entrega</h1>
                <DeliveryForm
                    deliveryInfo={deliveryInfo}
                    setDeliveryInfo={setDeliveryInfo}
                />
            </section>

            <aside>
                <h2 className="text-xl font-semibold mb-4">Resumen de Compra</h2>
                <ResumenFinalCarrito />
            </aside>

            <section className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
                <PaymentForm deliveryInfo={deliveryInfo} />
            </section>
        </div>
    )
}
