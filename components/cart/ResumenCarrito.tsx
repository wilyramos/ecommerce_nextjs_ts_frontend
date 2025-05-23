"use client"

import { useCartStore } from "@/src/store/cartStore"
import ItemCarrito from "./ItemCarrito"

export default function ResumenCarrito() {
    
    const { cart } = useCartStore()
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0)

    return (
        <>
            <h2 className="text-lg font-light">Resumen del Carrito</h2>
            <ul className="mt-2">
                {cart.map(item => (
                    <ItemCarrito key={item._id} item={item} />
                ))}
            </ul>
            <div className="mt-4 text-gray-800 text-end border-t border-gray-300 pt-2">
                Total: S/. <span className="text-xl font-bold text-gray-950">{total.toFixed(2)}</span>
            </div>
        </>
    )
}
