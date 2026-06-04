import { notFound, redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { getTokenOptional } from "@/src/auth/dal";
import Image from "next/image";
// import UpdateStatusForm from "@/components/admin/orders/UpdateStatusForm";
import AssignTrackingForm from "@/components/admin/orders/AssignTrackingForm";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/src/schemas/order.schema";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
    const { id } = await params;

    // 1. Obtener el token de forma segura desde las cookies del servidor (Aislado de fugas del DAL)
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

    const isGuest = !order.user; // Flag para determinar si fue una compra rápida como invitado
    const currency = order.currency || "PEN";

    return (

        <>

            <pre>
                {JSON.stringify(order, null, 2)}
            </pre>
            <AdminPageWrapper
                title={`Detalle de Orden: ${order.orderNumber}`}
                breadcrumbItems={[{ label: "Órdenes", href: "/admin/orders" }]}
                breadcrumbCurrent={order.orderNumber}
                showBackButton={true}
            >


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-foreground">

                    {/* Columna Izquierda: Contenido de la Orden, Clientes e Historiales */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Ítems del Pedido (Soporta Producto Simple y Producto con Variantes de forma óptima) */}
                        <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-4 shadow-xs">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Productos Solicitados</h3>
                            <div className="divide-y divide-border/60">
                                {order.items.map((item, index) => {
                                    // Extraer el ID real sin importar si el campo viene plano o poblado como objeto
                                    const extractedProductId = typeof item.productId === "object" && item.productId !== null
                                        ? item.productId._id
                                        : item.productId;

                                    // Generar una llave compuesta única para evitar problemas en el árbol de renderizado de React
                                    const itemKey = item.variantId
                                        ? `${extractedProductId}_${item.variantId}_${index}`
                                        : `${extractedProductId}_${index}`;

                                    const hasAttributes = item.variantAttributes && Object.keys(item.variantAttributes).length > 0;

                                    return (
                                        <div key={itemKey} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                                            <div className="relative w-12 h-12 rounded-[var(--radius-sm)] overflow-hidden bg-white border border-border shrink-0 select-none p-0.5 flex items-center justify-center">
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

                                                {/* Renderizado dinámico de Atributos de Variantes (Ej: Color: Negro, Almacenamiento: 128GB) */}
                                                {hasAttributes && (
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {Object.entries(item.variantAttributes!).map(([key, val]) => (
                                                            <span key={key} className="text-[10px] bg-background-secondary border border-border px-1.5 py-0.5 rounded-sm font-semibold text-muted-foreground uppercase tracking-tight">
                                                                {key}: <strong className="text-foreground font-black">{val}</strong>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Historial Técnico de Almacén */}
                                                <div className="flex gap-3 text-[10px] font-mono font-bold text-muted-foreground mt-1 select-all">
                                                    {item.sku ? (
                                                        <span className="bg-muted/40 px-1 rounded border border-border/30">SKU: {item.sku}</span>
                                                    ) : (
                                                        <span className="text-destructive/70 italic font-sans font-medium">Sin SKU</span>
                                                    )}
                                                    {item.barcode && (
                                                        <span className="bg-muted/40 px-1 rounded border border-border/30">BAR: {item.barcode}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-bold font-mono text-foreground">{currency} {item.price.toFixed(2)}</p>
                                                <p className="text-[10px] font-black text-muted-foreground mt-0.5 select-none">Cant: {item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Perfil del Comprador y Dirección */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Datos del Cliente: Lee de customerProfile para evitar fallos si es usuario invitado */}
                            <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-3 shadow-xs">
                                <div className="flex justify-between items-center select-none">
                                    <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Información del Cliente</h3>
                                    <span className={`text-[9px] tracking-wider uppercase font-black px-2 py-0.5 rounded-full border ${isGuest
                                            ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                                            : "bg-blue-500/10 border-blue-500/20 text-blue-600"
                                        }`}>
                                        {isGuest ? "Invitado" : "Registrado"}
                                    </span>
                                </div>
                                <div className="text-xs font-semibold space-y-2">
                                    <p><span className="text-muted-foreground font-bold select-none">Nombre:</span> {order.customerProfile.nombre} {order.customerProfile.apellidos}</p>
                                    <p><span className="text-muted-foreground font-bold select-none">Email:</span> <span className="select-all font-medium">{order.customerProfile.email}</span></p>
                                    <p><span className="text-muted-foreground font-bold select-none">Teléfono:</span> <span className="select-all font-mono font-medium">{order.customerProfile.telefono}</span></p>
                                    {order.customerProfile.tipoDocumento && (
                                        <p><span className="text-muted-foreground font-bold select-none">{order.customerProfile.tipoDocumento}:</span> <span className="select-all font-mono font-medium">{order.customerProfile.numeroDocumento}</span></p>
                                    )}
                                </div>
                            </div>

                            {/* Destino de Envío */}
                            <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-3 shadow-xs">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Destino de Envío</h3>
                                <div className="text-xs font-semibold space-y-2">
                                    <p><span className="text-muted-foreground font-bold select-none">Ubicación:</span> {order.shippingAddress.departamento} — {order.shippingAddress.provincia} — {order.shippingAddress.distrito}</p>
                                    <p><span className="text-muted-foreground font-bold select-none">Dirección:</span> {order.shippingAddress.direccion} {order.shippingAddress.numero ? `, N° ${order.shippingAddress.numero}` : ""} {order.shippingAddress.pisoDpto ? `, ${order.shippingAddress.pisoDpto}` : ""}</p>
                                    {order.shippingAddress.referencia && (
                                        <p className="text-muted-foreground font-medium italic"><span className="text-foreground font-bold not-italic select-none">Ref:</span> {order.shippingAddress.referencia}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Línea de Tiempo / Historial de Estados */}
                        <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-3 shadow-xs">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Línea de Tiempo del Pedido</h3>
                            <div className="relative border-l border-border/80 ml-2 pl-4 space-y-4">
                                {[...order.statusHistory].reverse().map((history, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-border border-2 border-card" />
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                                            <span className="font-bold text-foreground">
                                                {ORDER_STATUS_LABELS[history.status] || history.status.replace("_", " ")}
                                            </span>
                                            <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                                                {new Date(history.changedAt).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notas Adicionales del Cliente */}
                        {order.notes && (
                            <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-2 shadow-xs">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Notas Adicionales del Pedido</h3>
                                <p className="text-xs text-foreground bg-background-secondary p-3 rounded-[var(--radius-sm)] border border-border leading-relaxed font-semibold">
                                    {order.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha: Finanzas, Transacción Bancaria y Controles */}
                    <div className="space-y-6">
                        {/* Resumen de Totales */}
                        <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-3.5 shadow-xs">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Totales de Venta</h3>
                            <div className="text-xs space-y-2 divide-y divide-border/60">
                                <div className="flex justify-between font-bold pt-1 text-muted-foreground">
                                    <span className="select-none">Subtotal:</span>
                                    <span className="text-foreground font-mono">{currency} {order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold pt-2 text-muted-foreground">
                                    <span className="select-none">Costo de Envío:</span>
                                    <span className="text-foreground font-mono">{currency} {order.shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-black pt-2 text-sm text-foreground">
                                    <span className="uppercase tracking-wide text-xs select-none">Total General:</span>
                                    <span className="font-mono text-base">{currency} {order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detalles Técnicos de la Transacción en Pasarela */}
                        <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-3 shadow-xs">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Auditoría de Pago</h3>
                            {order.payment ? (
                                <div className="text-xs font-semibold space-y-2.5">
                                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                                        <span className="text-muted-foreground">Pasarela:</span>
                                        <span className="text-foreground uppercase font-bold">{order.payment.provider}</span>
                                    </div>
                                    {order.payment.method && (
                                        <div className="flex justify-between border-b border-border/40 pb-1.5">
                                            <span className="text-muted-foreground">Método:</span>
                                            <span className="text-foreground uppercase font-bold">{order.payment.method}</span>
                                        </div>
                                    )}
                                    {order.payment.transactionId && (
                                        <div className="flex flex-col gap-1 border-b border-border/40 pb-1.5">
                                            <span className="text-muted-foreground">ID Transacción:</span>
                                            <span className="text-[10px] font-mono font-bold text-foreground select-all bg-background-secondary px-2 py-1 rounded-sm border border-border/50 break-all">
                                                {order.payment.transactionId}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-0.5">
                                        <span className="text-muted-foreground">Estado Financiero:</span>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border ${order.payment.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                                                order.payment.status === "pending" ? "bg-amber-500/10 border-amber-500/20 text-amber-600" :
                                                    "bg-destructive/10 border-destructive/20 text-destructive"
                                            }`}>
                                            {PAYMENT_STATUS_LABELS[order.payment.status] || order.payment.status}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs font-medium text-muted-foreground/80 italic">
                                    Sin registros de intento de pago en pasarelas.
                                </p>
                            )}
                        </div>

                        {/* Acciones de Control Técnico Logístico */}
                        <div className="bg-card border border-border rounded-[var(--radius-md)] p-5 space-y-5 shadow-xs">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">Controles Logísticos</h3>

                            aCTUALIZAR EL ESTADO
                            {/* <UpdateStatusForm orderId={order._id} currentStatus={order.status} /> */}
                            {/* <AssignTrackingForm orderId={order._id} trackingNumber={order.trackingNumber} /> */}
                            <AssignTrackingForm />
                        </div>
                    </div>

                </div>
            </AdminPageWrapper>

        </>

    );
}