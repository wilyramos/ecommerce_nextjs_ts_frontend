import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FaBoxOpen, FaArchive } from "react-icons/fa";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import Image from "next/image";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import OrderActions from "@/components/admin/orders/OrderActions";
import PrintOrderButton from "@/components/admin/orders/PrintOrderButton";
import PrintLabelButton from "@/components/admin/orders/PrintLabelButton";

type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-sm font-bold text-muted-foreground">Pedido no encontrado</h1>
                <Link href="/admin/orders" className="mt-3 inline-block text-xs font-bold text-action-cta hover:underline">
                    &larr; Volver a pedidos
                </Link>
            </div>
        );
    }

    const currency = order.currency || "PEN";

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 bg-background text-foreground">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight text-foreground">
                        <FaBoxOpen className="text-muted-foreground" />
                        {order.orderNumber}
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                        Creado el {formatDate(order.createdAt)}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Acciones Rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background-secondary/30 p-3 rounded-sm border border-border">
                <div className="flex gap-2">
                    <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider bg-background border border-border px-4 py-2 rounded-sm hover:bg-background-secondary transition-colors">
                        &larr; Volver
                    </Link>
                    <OrderActions orderId={id} currentStatus={order.status} />
                </div>

                <div className="flex gap-2 items-center">
                    <PrintOrderButton orderId={id} />
                    <PrintLabelButton orderId={id} />
                    <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 bg-background border border-border rounded-sm hover:bg-background-secondary transition-colors">
                        <FaArchive className="text-muted-foreground" /> Archivar
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Cliente */}
                <div className="bg-background border border-border rounded-sm p-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Cliente</h2>
                    <p className="text-xs font-medium text-foreground">{order.user.nombre} {order.user.apellidos}</p>
                    <p className="text-xs text-muted-foreground mt-1">{order.user.email}</p>
                </div>

                {/* Pago */}
                <div className="bg-background border border-border rounded-sm p-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Pago</h2>
                    <p className="text-xs text-foreground"><span className="font-bold">Método:</span> {order.payment.provider}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">ID: {order.payment.transactionId || "—"}</p>
                    <div className="mt-2">
                        <PaymentStatusBadge status={order.payment.status} />
                    </div>
                </div>

                {/* Envío */}
                <div className="bg-background border border-border rounded-sm p-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Envío</h2>
                    <p className="text-xs text-foreground font-medium">{order.shippingAddress?.direccion}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {order.shippingAddress?.distrito}, {order.shippingAddress?.provincia}
                    </p>
                </div>
            </div>

            {/* Productos */}
            <div className="bg-background border border-border rounded-sm p-5 overflow-x-auto">
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Productos</h2>
                <table className="w-full text-xs min-w-[600px]">
                    <thead className="bg-background-secondary/50 text-muted-foreground font-bold uppercase tracking-wider border-b border-border">
                        <tr>
                            <th className="text-left py-3 px-3">Producto</th>
                            <th className="text-center py-3 px-3">Cantidad</th>
                            <th className="text-right py-3 px-3">Precio</th>
                            <th className="text-right py-3 px-3">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {order.items.map((item, i) => (
                            <tr key={i}>
                                <td className="py-4 px-3 flex items-center gap-3">
                                    <Image src={item.imagen || "/placeholder.png"} alt={item?.nombre || "Producto"} className="w-10 h-10 object-contain mix-blend-multiply border rounded-sm" width={40} height={40} unoptimized />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-foreground">{item.nombre}</span>
                                        {item.variantAttributes && Object.entries(item.variantAttributes).map(([k, v]) => (
                                            <span key={k} className="text-[10px] text-muted-foreground">{k}: {v}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="text-center py-4 px-3 font-bold">{item.quantity}</td>
                                <td className="text-right py-4 px-3">{currency} {item.price.toFixed(2)}</td>
                                <td className="text-right py-4 px-3 font-bold">{currency} {(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totales */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background border border-border rounded-sm p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4 border-b border-border/40 pb-2">Historial</h3>
                    {order.statusHistory?.length ? (
                        <div className="space-y-4">
                            {[...order.statusHistory].reverse().map((h, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-xs">
                                    <div className="w-2 h-2 rounded-full bg-action-cta" />
                                    <div>
                                        <p className="font-bold uppercase tracking-tight">{h.status.replace(/_/g, ' ')}</p>
                                        <p className="text-muted-foreground">{formatDate(String(h.changedAt))}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-xs text-muted-foreground italic">Sin movimientos</p>}
                </div>

                <div className="bg-background border border-border rounded-sm p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Resumen</h3>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtotal:</span>
                        <span>{currency} {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Envío:</span>
                        <span>{currency} {order.shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-foreground border-t border-border/40 pt-3">
                        <span>Total:</span>
                        <span>{currency} {order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}