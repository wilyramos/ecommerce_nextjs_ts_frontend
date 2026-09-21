// File: frontend/components/profile/orders/OrderDetailView.tsx
import Image from "next/image";
import { MapPin, CreditCard, User } from "lucide-react";
import  OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import type { OrderResponse } from "@/src/schemas/order-v3.schema";

interface OrderDetailViewProps {
    order: OrderResponse;
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
    const date = new Date(order.createdAt).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="space-y-6">
            {/* Cabecera de la Orden */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900 text-white rounded-xl shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-mono font-bold tracking-tight">
                        Pedido #{order.orderNumber}
                    </h1>
                    <p className="text-zinc-400 mt-1 text-sm">Realizado el {date}</p>
                </div>
                <div className="self-start md:self-auto">
                    {/* Reutilizamos el badge pero forzando un estilo que resalte en fondo oscuro si es necesario, 
                        o el componente Badge base se adaptará si usamos 'solid' variants */}
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Principal: Productos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-border bg-muted/50">
                            <h3 className="font-semibold text-foreground">Artículos en tu pedido</h3>
                        </div>
                        <div className="divide-y divide-border">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-6">
                                    <div className="relative w-20 h-20 bg-muted rounded-lg border border-border overflow-hidden shrink-0">
                                        {item.imagen ? (
                                            <Image
                                                src={item.imagen}
                                                alt={item.nombre}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                Sin foto
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                                            {item.nombre}
                                        </h4>
                                        {item.sku && (
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                SKU: {item.sku}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-muted-foreground">
                                                Cant: {item.quantity}
                                            </span>
                                            <span className="text-sm font-medium text-foreground">
                                                S/ {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna Secundaria: Resumen y Datos */}
                <div className="space-y-6">
                    {/* Resumen Financiero */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-foreground mb-4">Resumen de Compra</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>S/ {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Costo de envío</span>
                                <span>
                                    {order.shippingCost === 0
                                        ? "Gratis"
                                        : `S/ ${order.shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Descuento</span>
                                    <span>- S/ {order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg text-foreground">
                                <span>Total</span>
                                <span>S/ {order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Datos de Envío y Cliente */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6 text-sm">
                        <div>
                            <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
                                <User className="w-4 h-4" />
                                Datos del Cliente
                            </div>
                            <div className="text-muted-foreground space-y-1">
                                <p>{order.customerProfile.nombre} {order.customerProfile.apellidos}</p>
                                <p>{order.customerProfile.email}</p>
                                <p>Tel: {order.customerProfile.telefono}</p>
                                {order.customerProfile.numeroDocumento && (
                                    <p>
                                        {order.customerProfile.tipoDocumento || "Doc"}:{" "}
                                        {order.customerProfile.numeroDocumento}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
                                <MapPin className="w-4 h-4" />
                                Dirección de Envío
                            </div>
                            <div className="text-muted-foreground space-y-1">
                                <p>
                                    {order.shippingAddress.direccion}{" "}
                                    {order.shippingAddress.numero && `#${order.shippingAddress.numero}`}
                                </p>
                                {order.shippingAddress.pisoDpto && (
                                    <p>{order.shippingAddress.pisoDpto}</p>
                                )}
                                <p>
                                    {order.shippingAddress.distrito}, {order.shippingAddress.provincia}
                                </p>
                                <p>{order.shippingAddress.departamento}</p>
                                {order.shippingAddress.referencia && (
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                        Ref: {order.shippingAddress.referencia}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
                                <CreditCard className="w-4 h-4" />
                                Método de Pago
                            </div>
                            <div className="text-muted-foreground space-y-1 capitalize">
                                <p>Proveedor: {order.payment?.provider || "N/A"}</p>
                                {order.payment?.method && <p>Método: {order.payment.method}</p>}
                                {order.payment?.transactionId && (
                                    <p className="text-xs text-zinc-400 mt-1 break-all">
                                        Ref: {order.payment.transactionId}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}