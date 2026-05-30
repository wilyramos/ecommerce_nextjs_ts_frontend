// File: frontend/components/admin/orders/[id]/page.tsx

import { getOrder } from "@/src/services/orders";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FaArchive } from "react-icons/fa";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import Image from "next/image";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import OrderActions from "@/components/admin/orders/OrderActions";
import PrintOrderButton from "@/components/admin/orders/PrintOrderButton";
import PrintLabelButton from "@/components/admin/orders/PrintLabelButton";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { H2, H3, Muted } from "@/components/ui/Typography";

type Params = Promise<{ id: string }>;

export default async function OrderDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <div className="p-12 text-center bg-background">
                <H2 className="text-muted-foreground select-none">Pedido no encontrado</H2>
                <Link href="/admin/orders" className="mt-3 inline-block text-xs font-bold text-action-cta hover:bg-background-secondary px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors">
                    &larr; Volver a pedidos
                </Link>
            </div>
        );
    }

    const currency = order.currency || "PEN";

    return (
        <AdminPageWrapper
            title={`Pedido ${order.orderNumber}`}
            breadcrumbItems={[{ label: "Pedidos", href: "/admin/orders" }]}
            breadcrumbCurrent={order.orderNumber}
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto space-y-6 ">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border pb-6 flex-wrap gap-4">
                    <div className="space-y-1">

                        <Muted className="font-semibold">
                            Creado el {formatDate(order.createdAt)}
                        </Muted>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>

                {/* Acciones Rápidas */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-background-secondary p-3 rounded-[var(--radius-md)] border border-border">
                    <div className="flex gap-2">
                        <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider bg-card border border-border px-4 py-2 rounded-[var(--radius-sm)] hover:bg-background transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring">
                            &larr; Volver
                        </Link>
                        <OrderActions orderId={id} currentStatus={order.status} />
                    </div>

                    <div className="flex gap-2 items-center">
                        <PrintOrderButton orderId={id} />
                        <PrintLabelButton orderId={id} />
                        <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 bg-card border border-border rounded-[var(--radius-sm)] hover:bg-background transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring">
                            <FaArchive className="text-muted-foreground" /> Archivar
                        </button>
                    </div>
                </div>

                {/* Tarjetas Informativas */}
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Cliente */}
                    <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 text-card-foreground">
                        <H3 className="uppercase tracking-wider mb-3 text-xs">Cliente</H3>
                        <p className="text-xs font-bold text-foreground">{order.user.nombre} {order.user.apellidos}</p>
                        <p className="text-xs font-medium text-muted-foreground mt-1">{order.user.email}</p>
                    </div>

                    {/* Pago */}
                    <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 text-card-foreground">
                        <H3 className="uppercase tracking-wider mb-3 text-xs">Pago</H3>
                        <p className="text-xs font-medium text-foreground"><span className="font-bold">Método:</span> {order.payment.provider}</p>
                        <p className="text-xs font-mono font-semibold text-muted-foreground mt-0.5">ID: {order.payment.transactionId || "—"}</p>
                        <div className="mt-3">
                            <PaymentStatusBadge status={order.payment.status} />
                        </div>
                    </div>

                    {/* Envío */}
                    <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 text-card-foreground">
                        <H3 className="uppercase tracking-wider mb-3 text-xs">Envío</H3>
                        <p className="text-xs text-foreground font-bold leading-snug">{order.shippingAddress?.direccion}</p>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">
                            {order.shippingAddress?.distrito}, {order.shippingAddress?.provincia}
                        </p>
                    </div>
                </div>

                {/* Productos */}
                <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 overflow-x-auto text-card-foreground">
                    <H3 className="uppercase tracking-wider mb-4 text-xs">Productos</H3>
                    <table className="w-full text-xs min-w-[600px] border-collapse">
                        <thead className="bg-background-secondary border-b border-border text-foreground select-none">
                            <tr>
                                <th className="text-left py-3 px-3 font-bold uppercase tracking-wider">Producto</th>
                                <th className="text-center py-3 px-3 font-bold uppercase tracking-wider">Cantidad</th>
                                <th className="text-right py-3 px-3 font-bold uppercase tracking-wider">Precio</th>
                                <th className="text-right py-3 px-3 font-bold uppercase tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {order.items.map((item, i) => (
                                <tr key={i} className="hover:bg-background-secondary/50 transition-colors">
                                    <td className="py-4 px-3 flex items-center gap-3">
                                        <div className="relative w-10 h-10 shrink-0 bg-background-secondary border border-border rounded-[var(--radius-sm)] overflow-hidden flex items-center justify-center p-0.5">
                                            <Image
                                                src={item.imagen || "/placeholder.png"}
                                                alt={item?.nombre || "Producto"}
                                                width={40}
                                                height={40}
                                                unoptimized
                                                className="object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-foreground truncate max-w-[300px]">{item.nombre}</span>
                                            {item.variantAttributes && Object.entries(item.variantAttributes).map(([k, v]) => (
                                                <span key={k} className="text-[10px] text-muted-foreground font-semibold">{k}: {v}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-3 font-bold text-foreground">{item.quantity}</td>
                                    <td className="text-right py-4 px-3 font-semibold text-muted-foreground">{currency} {item.price.toFixed(2)}</td>
                                    <td className="text-right py-4 px-3 font-bold text-foreground">{currency} {(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen e Historial */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Historial */}
                    <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 text-card-foreground">
                        <H3 className="uppercase tracking-wider mb-4 border-b border-border pb-2 text-xs">Historial de Estados</H3>
                        {order.statusHistory?.length ? (
                            <div className="space-y-4">
                                {[...order.statusHistory].reverse().map((h, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-action-cta shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold uppercase tracking-tight text-foreground">{h.status.replace(/_/g, ' ')}</p>
                                            <p className="text-muted-foreground font-semibold text-[11px] mt-0.5">{formatDate(String(h.changedAt))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground font-medium italic select-none">Sin movimientos registrados</p>
                        )}
                    </div>

                    {/* Resumen */}
                    <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-3 text-card-foreground">
                        <H3 className="uppercase tracking-wider mb-2 text-xs">Resumen Monetario</H3>
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                            <span>Subtotal:</span>
                            <span className="font-mono">{currency} {order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                            <span>Costo de Envío:</span>
                            <span className="font-mono">{currency} {order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-3 select-none">
                            <span>Total de Transacción:</span>
                            <span className="font-mono text-lg font-black">{currency} {order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPageWrapper>
    );
}