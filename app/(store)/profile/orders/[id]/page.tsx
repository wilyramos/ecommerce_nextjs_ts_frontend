import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { orderService } from "@/src/services/order-service";
import { getTokenOptional } from "@/src/auth/dal";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import OrderStepper from "@/components/ui/OrderStepper";
import { BsArrowLeft } from "react-icons/bs";

type Props = {
    params: Promise<{ id: string }>;
};

// Interface para el objeto de producto poblado según tu esquema de Zod
interface PopulatedProduct {
    _id: string;
    nombre: string;
    slug?: string;
    precio?: number;
    imagenes?: string[];
    [key: string]: unknown;
}

export default async function OrderProfilePage({ params }: Props) {
    const { id } = await params;
    const token = await getTokenOptional();

    // Bloqueo inmediato en servidor si no hay token activo de sesión
    if (!token) {
        return notFound();
    }

    let order;
    try {
        order = await orderService.getOrderById(id, token);
    } catch (error) {
        console.error("❌ Error cargando vista de detalle de orden del cliente:", error);
        return notFound();
    }

    if (!order) {
        return notFound();
    }

    return (
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-foreground">
            {/* Encabezado Principal */}
            <div className="flex justify-between items-center gap-4 select-none">
                <div className="space-y-1.5">
                    <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                        Pedido: {order.orderNumber}
                    </h1>
                    <p className="text-xs font-semibold text-muted-foreground">
                        Realizado el {new Date(order.createdAt).toLocaleDateString("es-PE", { dateStyle: "long" })}
                    </p>
                </div>
                <Link
                    href="/profile/orders"
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                    <BsArrowLeft size={14} strokeWidth={1} /> Volver
                </Link>
            </div>

            {/* Línea de tiempo y Stepper Dinámico */}
            <section className="bg-card border border-border rounded-[var(--radius-lg)] p-5 md:p-6 shadow-xs select-none">
                <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">
                    Estado de envío
                </h2>
                <OrderStepper status={order.status} />
            </section>

            {/* Módulos de Metadata de Facturación / Envío */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Caja 1: Estado del Pago */}
                <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-xs space-y-3">
                    <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground select-none">
                        Transacción y Pago
                    </h2>
                    <div className="flex items-center gap-2">
                        {order.payment && <PaymentStatusBadge status={order.payment.status} />}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground pt-1 space-y-1.5">
                        <p>
                            Método: <strong className="text-foreground uppercase font-bold">{order.payment?.method || "Pasarela Externa"}</strong>
                        </p>
                        {order.payment?.transactionId && (
                            <p className="truncate">
                                ID: <strong className="text-foreground font-mono select-all text-[11px]">{order.payment.transactionId}</strong>
                            </p>
                        )}
                        {order.trackingNumber && (
                            <p className="bg-background-secondary border border-border p-2 rounded-sm mt-2 text-foreground font-bold">
                                Tracking N°: <span className="font-mono select-all text-primary">{order.trackingNumber}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Caja 2: Destino Físico */}
                <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-xs space-y-2.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground select-none">
                        Dirección de Entrega
                    </h2>
                    <div className="text-xs font-semibold text-muted-foreground leading-relaxed">
                        <p className="text-foreground font-bold">
                            {order.shippingAddress.direccion} {order.shippingAddress.numero || ""}
                        </p>
                        {order.shippingAddress.pisoDpto && <p>Piso/Dpto: {order.shippingAddress.pisoDpto}</p>}
                        <p>
                            {order.shippingAddress.distrito} — {order.shippingAddress.provincia}
                        </p>
                        <p className="uppercase tracking-wider text-[11px] font-bold text-foreground">
                            {order.shippingAddress.departamento}
                        </p>
                        {order.shippingAddress.referencia && (
                            <p className="text-muted-foreground font-medium italic mt-1.5 border-l-2 border-border pl-2">
                                Ref: {order.shippingAddress.referencia}
                            </p>
                        )}
                    </div>
                </div>

                {/* Caja 3: Tabla Consolidada de Totales */}
                <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 shadow-xs space-y-3.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground select-none">
                        Resumen Económico
                    </h2>
                    <div className="text-xs font-semibold space-y-2 divide-y divide-border/60">
                        <div className="flex justify-between text-muted-foreground pt-0.5">
                            <span>Subtotal:</span>
                            <span className="font-mono text-foreground">{order.currency} {order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground pt-2">
                            <span>Costo de Despacho:</span>
                            <span className="font-mono text-foreground">{order.currency} {order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black text-foreground pt-2 text-sm">
                            <span className="uppercase text-[11px] font-bold select-none">Total Pagado:</span>
                            <span className="font-mono">{order.currency} {order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listado de Artículos Comprados */}
            <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 md:p-6 shadow-xs">
                <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 select-none">
                    Productos incluidos en el paquete
                </h2>
                <ul className="divide-y divide-border/60">
                    {order.items.map((item) => {
                        // Type Narrowing seguro sin usar 'any' para extraer el ID primitivo de un string o un objeto poblado
                        const isPopulated = typeof item.productId === "object" && item.productId !== null;
                        const prodId = isPopulated
                            ? (item.productId as PopulatedProduct)._id || item.nombre
                            : (item.productId as string);

                        const itemKey = item.variantId ? `${prodId}_${item.variantId}` : prodId;

                        return (
                            <li key={itemKey} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-4 min-w-0">
                                    {item.imagen && (
                                        <div className="relative w-14 h-14 rounded-[var(--radius-sm)] overflow-hidden bg-background-secondary border border-border shrink-0 select-none">
                                            <Image
                                                src={item.imagen}
                                                alt={item.nombre}
                                                fill
                                                unoptimized
                                                className="object-contain p-1 mix-blend-multiply"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-xs font-bold text-foreground uppercase truncate">
                                            {item.nombre || "Producto sin nombre"}
                                        </p>
                                        
                                        {/* Renderizado condicional estricto de atributos de variantes */}
                                        {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {Object.entries(item.variantAttributes).map(([key, value]) => (
                                                    <span key={key} className="text-[10px] text-muted-foreground font-medium bg-background-secondary px-1.5 py-0.5 rounded-xs border border-border">
                                                        {key}: <strong className="text-foreground">{value}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <p className="text-[10px] text-muted-foreground font-bold mt-1 select-none">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-xs font-bold font-mono text-foreground shrink-0 text-right">
                                    {order.currency} {item.price.toFixed(2)}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}