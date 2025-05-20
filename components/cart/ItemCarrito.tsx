
import Image from "next/image"
import type { CartItem } from "@/src/schemas"


export default function ItemCarrito({ item }: { item: CartItem }) {

    return (
       <>
           <li className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                     <Image
                          src={item.imagenes[0] || '/logo.svg'}
                          alt={item.nombre}
                          width={60}
                          height={60}
                          className="rounded"
                     />
                     <div className="ml-4">
                          <h3 className="text-sm font-medium">{item.nombre}</h3>
                          <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                     </div>
                </div>
                <div className="text-sm font-semibold">
                     S/. {(item.precio * item.cantidad).toFixed(2)}
                </div>
                


            </li>
       </>
    )
}
