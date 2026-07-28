// File: frontend/app/admin/orders-v2/[id]/page.tsx
import { notFound } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Image from "next/image";
import UpdateStatusForm from "@/components/admin/orders/UpdateStatusForm";
import AssignTrackingForm from "@/components/admin/orders/AssignTrackingForm";
import RefundOrderForm from "@/components/admin/orders/RefundOrderForm";
import OrderPDFPrintModal from "@/components/admin/orders/OrderPDFPrintModal";
import OrderTrackingLink from "@/components/admin/orders/OrderTrackingLink";
import OrderInvoiceCard from "@/components/admin/orders/OrderInvoiceCard";
import ResendConfirmationEmailButton from "@/components/admin/orders/ResendConfirmationEmailButton";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/src/schemas/order.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    ShieldAlert,
    Laptop,
    MapPin,
    User,
    Receipt,
    Package,
    Truck,
} from "lucide-react";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
    const { id } = await params;

    let order;
    try {
        order = await orderService.getOrderById(id);
    } catch (error) {
        console.error("❌ Error cargando orden en administración:", error);
        return notFound();
    }

    if (!order) return notFound();

    const isGuest = !order.user;
    const currency = order.currency || "PEN";
    const isCanceled = order.status === "canceled";

    return (
        <AdminPageWrapper
            title={`Orden ${order.orderNumber}`}
            showBackButton={true}
            actions={<OrderPDFPrintModal orderIds={[order._id]} />}
        >
            <div className="space-y-6 text-foreground">
                {/* ═══════════════════════════════════════════════
            CABECERA DE ESTADO RÁPIDO
        ═══════════════════════════════════════════════ */}
                <Card className="border-border/60">
                    <CardContent className="pt-5 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge
                                    variant={isCanceled ? "destructive" : "default"}
                                    className="text-xs font-black uppercase px-3 py-1"
                                >
                                    {ORDER_STATUS_LABELS[order.status] || order.status}
                                </Badge>

                                {order.payment?.status && (
                                    <Badge
                                        variant={order.payment.status === "approved" ? "secondary" : "outline"}
                                        className="text-[10px] font-bold uppercase"
                                    >
                                        Pago: {PAYMENT_STATUS_LABELS[order.payment.status]}
                                    </Badge>
                                )}

                                <span className="text-xs text-muted-foreground font-medium">
                                    Creada: {new Date(order.createdAt).toLocaleString("es-PE")}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs  text-muted-foreground">
                                <span className="bg-muted px-2 py-1 rounded border border-border/40">
                                    ID: {order._id}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    {/* ═══════════════════════════════════════════════
              COLUMNA PRINCIPAL (Izquierda)
          ═══════════════════════════════════════════════ */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* PRODUCTOS */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Productos ({order.items.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y divide-border/50">
                                {order.items.map((item, index) => {
                                    const extractedProductId =
                                        typeof item.productId === "object" && item.productId !== null
                                            ? item.productId._id
                                            : item.productId;

                                    const itemKey = item.variantId
                                        ? `${extractedProductId}_${item.variantId}_${index}`
                                        : `${extractedProductId}_${index}`;

                                    const hasAttributes =
                                        item.variantAttributes &&
                                        Object.keys(item.variantAttributes).length > 0;

                                    return (
                                        <div
                                            key={itemKey}
                                            className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-border shrink-0 p-1 flex items-center justify-center">
                                                <Image
                                                    src={item.imagen || "/placeholder.png"}
                                                    alt={item.nombre}
                                                    width={48}
                                                    height={48}
                                                    className="object-contain mix-blend-multiply"
                                                    unoptimized
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                <p className="text-sm font-bold leading-tight">
                                                    {item.nombre}
                                                </p>

                                                {hasAttributes && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {Object.entries(item.variantAttributes!).map(
                                                            ([key, val]) => (
                                                                <Badge
                                                                    key={key}
                                                                    variant="outline"
                                                                    className="text-[10px] px-1.5 py-0 rounded-sm uppercase font-semibold"
                                                                >
                                                                    {key}:{" "}
                                                                    <span className="font-bold ml-1 text-foreground">
                                                                        {val}
                                                                    </span>
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2 text-[10px]  font-bold text-muted-foreground">
                                                    {item.sku ? (
                                                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border/40">
                                                            SKU: {item.sku}
                                                        </span>
                                                    ) : (
                                                        <span className="text-destructive/70">Sin SKU</span>
                                                    )}
                                                    {item.barcode && (
                                                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border/40">
                                                            BAR: {item.barcode}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 space-y-0.5">
                                                <p className="text-sm font-bold ">
                                                    {currency} {item.price.toFixed(2)}
                                                </p>
                                                <p className="text-[11px] font-black text-muted-foreground">
                                                    × {item.quantity}
                                                </p>
                                                <p className="text-xs font-bold  text-foreground/80">
                                                    {currency} {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* CLIENTE + ENVÍO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cliente */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Cliente
                                        </CardTitle>
                                        <Badge
                                            variant={isGuest ? "secondary" : "default"}
                                            className="text-[9px] font-black uppercase"
                                        >
                                            {isGuest ? "Invitado" : "Registrado"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-xs space-y-2.5">
                                    <div>
                                        <p className="text-muted-foreground font-bold mb-0.5">
                                            Nombre
                                        </p>
                                        <p className="font-semibold">
                                            {order.customerProfile.nombre}{" "}
                                            {order.customerProfile.apellidos}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground font-bold mb-0.5">
                                            Email
                                        </p>
                                        <p className="font-medium text-blue-600 select-all break-all">
                                            {order.customerProfile.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground font-bold mb-0.5">
                                            Teléfono
                                        </p>
                                        <p className=" font-medium select-all">
                                            {order.customerProfile.telefono}
                                        </p>
                                    </div>
                                    {order.customerProfile.tipoDocumento && (
                                        <div>
                                            <p className="text-muted-foreground font-bold mb-0.5">
                                                {order.customerProfile.tipoDocumento}
                                            </p>
                                            <p className=" font-medium select-all">
                                                {order.customerProfile.numeroDocumento}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Envío */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Envío
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-3">
                                    <div>
                                        <p className="text-muted-foreground font-bold mb-1">
                                            Método / Courier
                                        </p>
                                        <Badge variant="outline" className="text-[10px]">
                                            {order.shippingMethod || "No especificado"}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground font-bold mb-0.5">
                                            Ubicación
                                        </p>
                                        <p className="font-semibold">
                                            {order.shippingAddress.departamento} —{" "}
                                            {order.shippingAddress.provincia} —{" "}
                                            {order.shippingAddress.distrito}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground font-bold mb-0.5">
                                            Dirección
                                        </p>
                                        <p className="font-medium leading-relaxed">
                                            {order.shippingAddress.direccion}
                                            {order.shippingAddress.numero
                                                ? `, N° ${order.shippingAddress.numero}`
                                                : ""}
                                            {order.shippingAddress.pisoDpto
                                                ? `, ${order.shippingAddress.pisoDpto}`
                                                : ""}
                                        </p>
                                    </div>

                                    {order.shippingAddress.referencia && (
                                        <div>
                                            <p className="text-muted-foreground font-bold mb-0.5">
                                                Referencia
                                            </p>
                                            <p className="font-medium text-muted-foreground">
                                                {order.shippingAddress.referencia}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-border/50">
                                        <OrderTrackingLink
                                            trackingNumber={order.trackingNumber}
                                            shippingMethod={order.shippingMethod}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CANCELACIÓN (solo si aplica) */}
                        {isCanceled && order.canceledAt && (
                            <Card className="border-destructive/40 bg-destructive/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-black text-destructive uppercase flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4" />
                                        Orden Cancelada
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs space-y-2 font-semibold text-destructive/90">
                                    <p>
                                        <span className="font-bold">Fecha:</span>{" "}
                                        {new Date(order.canceledAt).toLocaleString("es-PE")}
                                    </p>
                                    <p>
                                        <span className="font-bold">Ejecutado por:</span>{" "}
                                        <code className="bg-background border px-1.5 py-0.5 rounded text-foreground text-[10px]">
                                            {order.canceledBy}
                                        </code>
                                    </p>
                                    <p>
                                        <span className="font-bold">Motivo:</span>{" "}
                                        {order.cancelReason || "No se especificó motivo."}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* HISTORIAL */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Historial de Estados
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l-2 border-border/70 ml-2.5 pl-5 space-y-5">
                                    {[...order.statusHistory].reverse().map((history, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-card shadow-sm" />
                                            <div className="space-y-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <span className="font-bold text-sm">
                                                        {ORDER_STATUS_LABELS[history.status] ||
                                                            history.status}
                                                    </span>
                                                    <span className="text-[11px]  text-muted-foreground">
                                                        {new Date(history.changedAt).toLocaleString("es-PE")}
                                                    </span>
                                                </div>
                                                {history.actionBy && (
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Por:{" "}
                                                        <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] ">
                                                            {history.actionBy}
                                                        </code>
                                                    </p>
                                                )}
                                                {history.reason && (
                                                    <p className="text-[11px] text-muted-foreground bg-muted/50 p-2 rounded-md border border-dashed mt-1">
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

                    {/* ═══════════════════════════════════════════════
              COLUMNA LATERAL (Derecha) — Sticky
          ═══════════════════════════════════════════════ */}
                    <div className="space-y-6 xl:sticky xl:top-6">
                        {/* TOTALES */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-black uppercase text-muted-foreground">
                                    Resumen de Venta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className=" font-semibold text-foreground">
                                        {currency} {order.subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Envío</span>
                                    <span className=" font-semibold text-foreground">
                                        {currency} {order.shippingCost.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-border/60">
                                    <span className="font-black uppercase text-xs ">
                                        Total
                                    </span>
                                    <span className=" text-lg font-black">
                                        {currency} {order.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CONTROLES LOGÍSTICOS */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Controles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <UpdateStatusForm
                                    orderId={order._id}
                                    currentStatus={order.status}
                                />
                                <AssignTrackingForm
                                    orderId={order._id}
                                    trackingNumber={order.trackingNumber}
                                />
                                <div className="pt-1 border-t border-border/50">
                                    <ResendConfirmationEmailButton
                                        orderId={order._id}
                                        customerEmail={order.customerProfile.email}
                                    />
                                </div>
                                <RefundOrderForm
                                    orderId={order._id}
                                    orderStatus={order.status}
                                    paymentStatus={order.payment?.status}
                                />
                            </CardContent>
                        </Card>

                        {/* PAGO */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                                    <Receipt className="w-4 h-4" />
                                    Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.payment ? (
                                    <div className="text-xs space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Proveedor</span>
                                            <span className="font-bold uppercase">
                                                {order.payment.provider}
                                            </span>
                                        </div>
                                        {order.payment.method && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Método</span>
                                                <span className="font-bold uppercase">
                                                    {order.payment.method}
                                                </span>
                                            </div>
                                        )}
                                        {order.payment.transactionId && (
                                            <div className="space-y-1">
                                                <span className="text-muted-foreground block">
                                                    ID Transacción
                                                </span>
                                                <code className="block text-[10px]  bg-muted p-2 rounded border break-all select-all">
                                                    {order.payment.transactionId}
                                                </code>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-muted-foreground">Estado</span>
                                            <Badge
                                                variant={
                                                    order.payment.status === "approved"
                                                        ? "default"
                                                        : "destructive"
                                                }
                                                className="text-[10px] font-bold uppercase"
                                            >
                                                {PAYMENT_STATUS_LABELS[order.payment.status]}
                                            </Badge>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Sin registros de pago.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* FACTURA SUNAT */}
                        <OrderInvoiceCard
                            orderId={order._id}
                            invoice={order.invoice}
                            creditNote={order.creditNote}
                            voidInfo={order.voidInfo}
                        />

                        {/* METADATOS TÉCNICOS */}
                        {order.deviceInfo && (
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                        <Laptop className="w-3.5 h-3.5" />
                                        Metadatos Técnicos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-[11px]  space-y-1.5 select-all">
                                    <p>
                                        <span className="text-muted-foreground font-semibold">
                                            IP:
                                        </span>{" "}
                                        {order.deviceInfo.ipAddress || "Desconocida"}
                                    </p>
                                    <p className="truncate">
                                        <span className="text-muted-foreground font-semibold">
                                            UA:
                                        </span>{" "}
                                        {order.deviceInfo.userAgent || "Desconocido"}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageWrapper>
    );
}