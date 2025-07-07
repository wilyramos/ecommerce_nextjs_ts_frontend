// File: frontend/app/(store)/profile/orders/[id]/page.tsx

import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import { BsArrowLeft } from "react-icons/bs";
import OrderStepper from "@/components/ui/OrderStepper";
import Image from "next/image";

type Params = Promise<{ id: string }>;

export default async function OrderProfilePage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-gray-600 text-lg">Pedido no encontrado</h1>
                <Link href="/profile/orders" className="text-blue-600 mt-3 inline-block text-sm underline">
                    Volver a pedidos
                </Link>
            </div>
        );
    }

    return (
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            {/* Título */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resumen del pedido</h1>
                    <p className="text-sm text-gray-500">#{order._id.slice(-6)} — {formatDate(order.createdAt)}</p>
                </div>
                <Link href="/profile/orders" className="flex items-center text-blue-600 text-sm hover:underline">
                    <BsArrowLeft className="mr-1" /> Volver a pedidos
                </Link>
            </div>

            <section className="bg-white border rounded-xl p-4 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Progreso del pedido</h2>
                <OrderStepper status={order.status} />
            </section>

            {/* Estado y resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estado */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3 col-span-1">
                    <h2 className="text-base font-semibold text-gray-900">Estado</h2>
                    <div className="flex flex-wrap gap-2 text-sm">
                        Estado del pago:
                        <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="text-sm text-gray-600 pt-2">
                        Método de pago: <strong>{order.paymentMethod}</strong><br />
                        Envío: <strong>{order.shippingMethod}</strong>
                    </div>
                </div>

                {/* Envío */}
                <div className="bg-white border rounded-xl p-5 shadow-sm col-span-1">
                    <h2 className="text-base font-semibold text-gray-900 mb-2">Envío</h2>
                    <div className="text-sm text-gray-700 leading-6">
                        <p>{order.shippingAddress.direccion}, {order.shippingAddress.numero}</p>
                        <p>{order.shippingAddress.distrito}, {order.shippingAddress.provincia}</p>
                        <p>{order.shippingAddress.departamento}</p>
                        {order.shippingAddress.referencia && (
                            <p className="text-gray-500 italic">Referencia: {order.shippingAddress.referencia}</p>
                        )}
                    </div>
                </div>

                {/* Totales */}
                <div className="bg-white border rounded-xl p-5 shadow-sm col-span-1">
                    <h2 className="text-base font-semibold text-gray-900 mb-2">Resumen</h2>
                    <div className="text-sm space-y-1 text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>S/ {order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Envío:</span>
                            <span>S/ {order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                            <span>Total:</span>
                            <span>S/ {order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Productos comprados</h2>
                <ul className="divide-y divide-gray-200">
                    {order.items.map((item, i) => (
                        <li key={i} className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-md overflow-hidden bg-gray-100 border">


                                    <Image

                                        src={item.productId.imagenes?.[0] || "/logob.svg"}
                                        alt={item.productId.nombre}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 object-cover"

                                    />

                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.productId.nombre}</p>
                                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-800">S/ {item.price.toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
