// File: frontend/app/(store)/profile/orders/[id]/page.tsx
import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import { BsArrowLeft } from "react-icons/bs";
import OrderStepper from "@/components/ui/OrderStepper";
import Image from "next/image";
import NotFound from "./not-found";

type Params = Promise<{ id: string }>;

export default async function OrderProfilePage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        NotFound();
    }

    if (!order) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-gray-600 text-lg">Pedido no encontrado</h1>
                <Link
                    href="/profile/orders"
                    className="text-blue-600 mt-3 inline-block text-sm underline"
                >
                    Volver a pedidos
                </Link>
            </div>
        );
    }

    const transaction = order.payment?.rawResponse?.transactions?.[0];
    const card = transaction?.transactionDetails?.cardDetails;

    return (
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.orderNumber}</h1>
                    <p className="text-sm text-gray-500">
                        Creado el {formatDate(order.createdAt)}
                    </p>
                </div>
                <Link
                    href="/profile/orders"
                    className="flex items-center text-blue-600 text-sm hover:underline"
                >
                    <BsArrowLeft className="mr-1" /> Volver a pedidos
                </Link>
            </div>

            {/* Progreso */}
            <section className="bg-white border rounded-xl p-4 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Progreso del pedido</h2>
                <OrderStepper status={order.status} />
            </section>

            {/* Grid estado/envío/totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estado y pago */}
                <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
                    <h2 className="text-base font-semibold text-gray-900">Estado del pago</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <PaymentStatusBadge status={order.payment.status} />
                    </div>
                    <div className="text-sm text-gray-600 pt-2 space-y-1">
                        <p>
                            Método: <strong>{transaction?.paymentMethodType ?? order.payment.method}</strong>
                        </p>
                        {card && (
                            <p>
                                Tarjeta: <strong>{card.effectiveBrand} ••••{card.pan?.slice(-4)}</strong>
                            </p>
                        )}
                        {transaction?.transactionDetails?.cardDetails?.issuerName && (
                            <p>
                                Banco emisor:{" "}
                                <strong>{transaction.transactionDetails.cardDetails.issuerName}</strong>
                            </p>
                        )}
                        {transaction?.transactionDetails?.cardDetails?.authorizationResponse?.authorizationNumber && (
                            <p>
                                Nº Autorización:{" "}
                                <strong>
                                    {transaction.transactionDetails.cardDetails.authorizationResponse.authorizationNumber}
                                </strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* Dirección de envío */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 mb-2">Dirección de envío</h2>
                    <div className="text-sm text-gray-700 leading-6">
                        <p>
                            {order.shippingAddress.direccion}, {order.shippingAddress.numero}
                        </p>
                        <p>
                            {order.shippingAddress.distrito}, {order.shippingAddress.provincia}
                        </p>
                        <p>{order.shippingAddress.departamento}</p>
                        {order.shippingAddress.referencia && (
                            <p className="text-gray-500 italic">
                                Referencia: {order.shippingAddress.referencia}
                            </p>
                        )}
                    </div>
                </div>

                {/* Totales */}
                <div className="bg-white border rounded-xl p-5 shadow-sm">
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
            {/* Productos */}
            <div className="bg-white border rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Productos comprados</h2>
                <ul className="divide-y divide-gray-200">
                    {order.items.map((item, i) => {
                        const variant = item.variantAttributes || {};
                        const variantText = Object.entries(variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" • ");

                        const imageSrc =
                            item.imagen ||
                            item.imagen

                        const nombreProducto =
                            item.nombre ||
                            item.nombre ||
                            "Producto sin nombre";

                        return (
                            <li key={i} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-md overflow-hidden bg-gray-100 border">
                                        {imageSrc ? (
                                            <Image
                                                src={imageSrc}
                                                alt={nombreProducto}
                                                width={60}
                                                height={60}
                                                className="w-14 h-14 object-cover"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-gray-900">
                                            {nombreProducto}
                                        </p>

                                        {variantText && (
                                            <p className="text-xs text-gray-500">{variantText}</p>
                                        )}

                                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                                    </div>
                                </div>

                                <div className="text-sm font-semibold text-gray-800">
                                    S/ {item.price.toFixed(2)}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Historial de estados */}

        </section>
    );
}
