"use client"

import { useCartStore } from "@/src/store/cartStore"
import ItemCarrito from "./ItemCarrito"

export default function ResumenCarrito() {
    
    const { cart } = useCartStore()
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0)

    return (
        <>
            <h2 className="text-lg font-semibold">Resumen del Carrito</h2>
            <ul className="mt-4">
                {cart.map(item => (
                    <ItemCarrito key={item._id} item={item} />
                ))}
            </ul>
            <div className="mt-4 font-semibold">
                Total: S/. {total.toFixed(2)}
            </div>
        </>
    )
}
