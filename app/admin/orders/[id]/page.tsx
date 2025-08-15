// FILE:

import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FaBoxOpen } from "react-icons/fa";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import Image from "next/image";

type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-lg text-gray-600">Pedido no encontrado</h1>
                <Link href="/admin/orders" className="mt-3 inline-block text-sm text-blue-600 underline">
                    Volver a pedidos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-gray-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <FaBoxOpen className="text-gray-500" />
                        Pedido #{order._id.slice(-6).toUpperCase()}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Creado el {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            {/* Acción Rápida */}
            <div className="flex flex-wrap gap-2">
                <Link href="/admin/orders" className="text-sm text-white bg-gray-800 px-3 py-1 rounded hover:bg-gray-900">
                    &larr; Volver
                </Link>
                <button className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Entregado</button>
                <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Imprimir</button>
                <button className="text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Archivar</button>
            </div>

            {/* Info agrupada */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Cliente */}
                <div className="bg-white border rounded p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Cliente</h2>
                    <p className="text-sm"><strong>Nombre:</strong> {order.user.nombre} </p>
                </div>

                {/* Pago */}
                <div className="bg-white border rounded p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Pago</h2>
                    <p className="text-sm"><strong>Método:</strong> {order.payment.provider}</p>
                    <p className="text-sm"><strong>ID pago:</strong> {order.payment.transactionId || "—"}</p>
                    <p className="text-sm"><strong>Estado:</strong> {order.payment.status || "—"}</p>
                </div>

                {/* Envío */}
                <div className="bg-white border rounded p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">Envío</h2>
                    <p className="text-sm">{order.shippingAddress?.direccion}, {order.shippingAddress?.numero}</p>
                    <p className="text-sm">{order.shippingAddress?.distrito}, {order.shippingAddress?.provincia}, {order.shippingAddress?.departamento}</p>
                    {order.shippingAddress?.referencia && <p className="text-sm"><strong>Ref:</strong> {order.shippingAddress.referencia}</p>}

                </div>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white border rounded p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Productos</h2>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                        <tr>
                            <th className="text-left py-2 px-3">Producto</th>
                            <th className="text-center py-2 px-3">Cantidad</th>
                            <th className="text-right py-2 px-3">Precio</th>
                            <th className="text-right py-2 px-3">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, i) => {
                            const product = item.productId;
                            return (
                                <tr key={i} className="border-b">
                                    <td className="py-2 px-3 flex items-center gap-2">
                                        <Image
                                            src={product.imagenes?.[0] || "/logomini.svg"}
                                            alt={product.nombre || "Producto sin imagen"}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                        <span>{product.nombre}</span>
                                        
                                    </td>
                                    <td className="text-center py-2 px-3">{item.quantity}</td>
                                    <td className="text-right py-2 px-3">S/. {item.price.toFixed(2)}</td>
                                    <td className="text-right py-2 px-3">S/. {(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Notas + Historial + Totales */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Notas & Historial */}
                <div className="space-y-3">
                   

                    <div className="bg-white border rounded p-3">
                        <h3 className="font-medium text-sm text-gray-700 mb-2">Historial de estado</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            {/* {order.} */}
                        </ul>
                    </div>
                </div>

                {/* Totales */}
                <div className="bg-white border rounded p-4 space-y-2 shadow-sm">
                    <h3 className="font-semibold text-gray-700 text-base">Resumen del pedido</h3>
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>Subtotal:</span>
                        <span>S/. {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>Envío:</span>
                        <span>S/. {order.shippingCost.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-base font-bold text-black">
                        <span>Total:</span>
                        <span>S/. {order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}