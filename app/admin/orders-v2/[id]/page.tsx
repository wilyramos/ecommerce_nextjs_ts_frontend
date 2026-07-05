// File: frontend/app/admin/orders-v2/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { getTokenOptional } from "@/src/auth/dal";
import Image from "next/image";
import UpdateStatusForm from "@/components/admin/orders/UpdateStatusForm";
import AssignTrackingForm from "@/components/admin/orders/AssignTrackingForm";
import RefundOrderForm from "@/components/admin/orders/RefundOrderForm";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/src/schemas/order.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ShieldAlert, Laptop, MapPin, User, Receipt } from "lucide-react";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
    const { id } = await params;
    const token = await getTokenOptional();
    
    if (!token) {
        redirect("/auth/login");
    }

    let order;
    try {
        order = await orderService.getOrderById(id, token);
    } catch (error) {
        console.error("❌ Error cargando orden en administración:", error);
        return notFound();
    }

    if (!order) return notFound();

    const isGuest = !order.user;
    const currency = order.currency || "PEN";

    return (
        <AdminPageWrapper
            title={`Orden ${order.orderNumber}`}
            breadcrumbItems={[{ label: "Órdenes", href: "/admin/orders" }]}
            breadcrumbCurrent={order.orderNumber}
            showBackButton={true}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-foreground">
                
                {/* COLUMNA IZQUIERDA */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Productos Solicitados */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Productos Solicitados</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/60">
                            {order.items.map((item, index) => {
                                const extractedProductId = typeof item.productId === "object" && item.productId !== null
                                    ? item.productId._id
                                    : item.productId;

                                const itemKey = item.variantId
                                    ? `${extractedProductId}_${item.variantId}_${index}`
                                    : `${extractedProductId}_${index}`;

                                const hasAttributes = item.variantAttributes && Object.keys(item.variantAttributes).length > 0;

                                return (
                                    <div key={itemKey} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white border border-border shrink-0 p-0.5 flex items-center justify-center">
                                            <Image
                                                src={item.imagen || "/placeholder.png"}
                                                alt={item.nombre}
                                                width={44}
                                                height={44}
                                                className="object-contain mix-blend-multiply"
                                                unoptimized
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-foreground uppercase tracking-tight leading-tight">
                                                {item.nombre}
                                            </p>

                                            {hasAttributes && (
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {Object.entries(item.variantAttributes!).map(([key, val]) => (
                                                        <Badge key={key} variant="outline" className="text-[10px] px-1.5 py-0 rounded-xs uppercase font-semibold">
                                                            {key}: <span className="font-bold ml-1 text-foreground">{val}</span>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-3 text-[10px] font-mono font-bold text-muted-foreground mt-1">
                                                {item.sku ? (
                                                    <span className="bg-muted px-1 rounded border border-border/30">SKU: {item.sku}</span>
                                                ) : (
                                                    <span className="text-destructive/70 italic font-sans font-medium">Sin SKU</span>
                                                )}
                                                {item.barcode && (
                                                    <span className="bg-muted px-1 rounded border border-border/30">BAR: {item.barcode}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-bold font-mono text-foreground">{currency} {item.price.toFixed(2)}</p>
                                            <p className="text-[10px] font-black text-muted-foreground mt-0.5">Cant: {item.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Cliente & Envío */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <User className="w-4 h-4" /> Información del Cliente
                                </CardTitle>
                                <Badge variant={isGuest ? "secondary" : "default"} className="text-[9px] font-black uppercase">
                                    {isGuest ? "Invitado" : "Registrado"}
                                </Badge>
                            </CardHeader>
                            <CardContent className="text-xs font-semibold space-y-2 pt-2">
                                <p><span className="text-muted-foreground font-bold">Nombre:</span> {order.customerProfile.nombre} {order.customerProfile.apellidos}</p>
                                <p><span className="text-muted-foreground font-bold">Email:</span> <span className="select-all font-medium text-blue-600">{order.customerProfile.email}</span></p>
                                <p><span className="text-muted-foreground font-bold">Teléfono:</span> <span className="select-all font-mono font-medium">{order.customerProfile.telefono}</span></p>
                                {order.customerProfile.tipoDocumento && (
                                    <p><span className="text-muted-foreground font-bold">{order.customerProfile.tipoDocumento}:</span> <span className="select-all font-mono font-medium">{order.customerProfile.numeroDocumento}</span></p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Destino de Envío
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs font-semibold space-y-2">
                                <p><span className="text-muted-foreground font-bold">Courier / Método:</span> <Badge variant="outline" className="ml-1 text-[10px]">{order.shippingMethod || "No especificado"}</Badge></p>
                                <p><span className="text-muted-foreground font-bold">Ubicación:</span> {order.shippingAddress.departamento} — {order.shippingAddress.provincia} — {order.shippingAddress.distrito}</p>
                                <p><span className="text-muted-foreground font-bold">Dirección:</span> {order.shippingAddress.direccion} {order.shippingAddress.numero ? `, N° ${order.shippingAddress.numero}` : ""} {order.shippingAddress.pisoDpto ? `, ${order.shippingAddress.pisoDpto}` : ""}</p>
                                {order.shippingAddress.referencia && (
                                    <p className="text-muted-foreground font-medium italic"><span className="text-foreground font-bold not-italic">Ref:</span> {order.shippingAddress.referencia}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Auditoría Raíz / Cancelación */}
                    {order.status === "canceled" && order.canceledAt && (
                        <Card className="border-destructive/40 bg-destructive/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black text-destructive uppercase tracking-wider flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4" /> Datos de Cancelación Atómica
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-1.5 font-semibold text-destructive/90">
                                <p><span>Fecha de Ejecución:</span> {new Date(order.canceledAt).toLocaleString("es-PE")}</p>
                                <p><span>Responsable / Ejecutor:</span> <code className="bg-background border px-1 rounded text-foreground text-[10px]">{order.canceledBy}</code></p>
                                <p><span>Motivo del Sistema:</span> {order.cancelReason || "No se especificó motivo."}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Línea de Tiempo del Historial */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Historial de Auditoría Interna
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-border/80 ml-2 pl-4 space-y-4">
                                {[...order.statusHistory].reverse().map((history, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-border border-2 border-card" />
                                        <div className="flex flex-col space-y-1 text-xs">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <span className="font-bold text-foreground">
                                                    {ORDER_STATUS_LABELS[history.status] || history.status}
                                                </span>
                                                <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                                                    {new Date(history.changedAt).toLocaleString("es-PE")}
                                                </span>
                                            </div>
                                            {history.actionBy && (
                                                <p className="text-[11px] text-muted-foreground">
                                                    Modificado por: <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono text-foreground font-medium">{history.actionBy}</code>
                                                </p>
                                            )}
                                            {history.reason && (
                                                <p className="text-[11px] italic text-muted-foreground bg-muted/40 p-2 rounded-xs border border-dashed mt-0.5">
                                                    {history.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-6">
                    
                    {/* Resumen Monetario */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Totales de Venta</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-2 divide-y divide-border/60">
                            <div className="flex justify-between font-bold pt-1 text-muted-foreground">
                                <span>Subtotal:</span>
                                <span className="text-foreground font-mono">{currency} {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 text-muted-foreground">
                                <span>Envío:</span>
                                <span className="text-foreground font-mono">{currency} {order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-black pt-2 text-sm text-foreground">
                                <span className="uppercase tracking-wide text-xs">Total:</span>
                                <span className="font-mono text-base">{currency} {order.totalPrice.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pasarela y Control Técnico */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Receipt className="w-4 h-4" /> Pasarela de Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.payment ? (
                                <div className="text-xs font-semibold space-y-2.5">
                                    <div className="flex justify-between border-b pb-1.5">
                                        <span className="text-muted-foreground">Proveedor:</span>
                                        <span className="text-foreground uppercase font-bold">{order.payment.provider}</span>
                                    </div>
                                    {order.payment.method && (
                                        <div className="flex justify-between border-b pb-1.5">
                                            <span className="text-muted-foreground">Método:</span>
                                            <span className="text-foreground uppercase font-bold">{order.payment.method}</span>
                                        </div>
                                    )}
                                    {order.payment.transactionId && (
                                        <div className="flex flex-col gap-1 border-b pb-1.5">
                                            <span className="text-muted-foreground">ID Transacción:</span>
                                            <span className="text-[10px] font-mono font-bold text-foreground bg-muted p-1.5 rounded-sm border break-all select-all">
                                                {order.payment.transactionId}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-0.5 items-center">
                                        <span className="text-muted-foreground">Estado Finanzas:</span>
                                        <Badge variant={order.payment.status === 'approved' ? 'default' : 'destructive'} className="text-[10px] font-bold uppercase">
                                            {PAYMENT_STATUS_LABELS[order.payment.status]}
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground/80 italic">Sin registros de transacciones.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Dispositivo y Fraude */}
                    {order.deviceInfo && (
                        <Card>
                            <CardHeader className="py-3">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Laptop className="w-3.5 h-3.5" /> Metadatos Técnicos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-[11px] font-mono space-y-1 select-all">
                                <p><span className="text-muted-foreground font-sans font-semibold">Dirección IP:</span> {order.deviceInfo.ipAddress || "Desconocida"}</p>
                                <p className="truncate"><span className="text-muted-foreground font-sans font-semibold">User Agent:</span> {order.deviceInfo.userAgent || "Desconocido"}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Controles Logísticos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Controles de Estado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <UpdateStatusForm orderId={order._id} currentStatus={order.status} />
                            <AssignTrackingForm orderId={order._id} trackingNumber={order.trackingNumber} />
                            <RefundOrderForm orderId={order._id} orderStatus={order.status} paymentStatus={order.payment?.status} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPageWrapper>
    );
}