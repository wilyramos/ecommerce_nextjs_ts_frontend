import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-lg text-gray-600">Pedido no encontrado</h1>
                <Link
                    href="/admin/orders"
                    className="mt-3 inline-block text-sm text-blue-600 underline"
                >
                    Volver a pedidos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-gray-800">
            {/* Volver */}
            <Link
                href="/admin/orders"
                className="inline-block text-sm text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-900 transition"
            >
                &larr; Volver a pedidos
            </Link>

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h1 className="text-lg font-semibold">Pedido #{order._id}</h1>
                <span
                    className={`px-3 py-1 text-xs rounded-full font-medium w-fit
                        ${order.status === "PENDIENTE"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "ENVIADO"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "ENTREGADO"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {order.status}
                </span>
            </div>

            {/* Información del pedido */}
            <div className="grid gap-6 md:grid-cols-2 text-sm">
                <div>
                    <h2 className="font-medium mb-2 text-gray-700">Cliente</h2>
                    <div className="space-y-1">
                        <p><strong>Nombre:</strong> {order.user?.nombre || "Anónimo"}</p>
                        <p><strong>Teléfono:</strong> {order.shippingAddress?.telefono}</p>
                        <p><strong>Dirección:</strong> {order.shippingAddress?.direccion}</p>
                        <p><strong>Ciudad:</strong> {order.shippingAddress?.ciudad}</p>
                    </div>
                </div>

                <div>
                    <h2 className="font-medium mb-2 text-gray-700">Pedido</h2>
                    <div className="space-y-1">
                        {order.createdAt && (
                            <p><strong>Fecha:</strong> {formatDate(order.createdAt)}</p>
                        )}
                        <p><strong>Pago:</strong> {order.paymentMethod || "—"}</p>
                        <p><strong>Tracking:</strong> {order.trackingId || "—"}</p>
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Producto</th>
                            <th className="px-4 py-3 text-center">Cantidad</th>
                            <th className="px-4 py-3 text-right">Precio</th>
                            <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {order.items.map((item, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3 flex items-center gap-3">
                                    <Image
                                        src={item.product.imagenes[0] || '/logo.svg'}
                                        alt={item.product.nombre}
                                        width={40}
                                        height={40}
                                        className="rounded border"
                                    />
                                    <span>{item.product.nombre}</span>
                                </td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="text-right text-base font-medium">
                Total: ${order.totalPrice.toFixed(2)}
            </div>
        </div>
    );
}
