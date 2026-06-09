import Link from "next/link";
import { redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import { getTokenOptional } from "@/src/auth/dal";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import Pagination from "@/components/ui/Pagination";
import type { OrderResponse } from "@/src/schemas/order.schema";

type PageOrdersProps = {
    searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function OrdersProfilePage({ searchParams }: PageOrdersProps) {
    const { page = "1", limit = "10" } = await searchParams;
    const currentPage = Math.max(1, Number(page));
    const currentLimit = Math.max(1, Number(limit));

    // Recuperamos el token de sesión de forma segura en el servidor
    const token = await getTokenOptional();
    if (!token) {
        redirect("/login?callbackUrl=/profile/orders");
    }

    let response;
    try {
        // Invocación al nuevo servicio core unificado V2
        response = await orderService.getMyOrders(token, currentPage, currentLimit);
    } catch (error) {
        console.error("❌ Error recuperando historial de órdenes del cliente:", error);
        return (
            <p className="text-center py-10 font-bold text-muted-foreground select-none">
                Ocurrió un error al cargar tus pedidos. Por favor, intenta de nuevo más tarde.
            </p>
        );
    }

    // Desestructuración basada exactamente en OrderPaginatedApiResponse
    const orders = (response?.data || []) as OrderResponse[];
    const totalPages = Math.max(1, Number(response?.meta?.pages ?? 1));

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 select-none">
                <p className="text-[var(--color-text-secondary)] font-medium mb-6">Aún no tienes pedidos registrados.</p>
                <Link 
                    href="/productos" 
                    className="text-xs font-bold uppercase tracking-wider bg-foreground text-background py-2.5 px-6 rounded-md hover:opacity-90 transition-opacity shadow-xs"
                >
                    Explorar productos
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 text-foreground">
            <section className="max-w-3xl mx-auto px-4 space-y-5">
                <h1 className="text-xl font-bold select-none mb-6">Mis pedidos</h1>

                <div className="flex flex-col gap-4">
                    {orders.map((o) => (
                        <div 
                            key={o._id} 
                            className="bg-card border border-border rounded-[var(--radius-lg)] p-5 md:p-6 transition-all shadow-xs hover:border-muted-foreground/20"
                        >
                            <div className="flex justify-between items-start gap-4 mb-4 select-none">
                                <div className="space-y-1">
                                    <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                                        Número de Pedido
                                    </span>
                                    <span className="text-xs font-bold text-foreground select-all">
                                        {o.orderNumber}
                                    </span>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                                        Fecha de compra
                                    </span>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        {new Date(o.createdAt).toLocaleDateString("es-PE", { dateStyle: "medium" })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/60">
                                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black select-none">Importe</span>
                                        <span className="text-sm font-black font-mono text-foreground">
                                            {o.currency} {o.totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Inyección de los estados tipados provenientes de la base de datos */}
                                        {o.payment && <PaymentStatusBadge status={o.payment.status} />}
                                        <OrderStatusBadge status={o.status} />
                                    </div>
                                </div>

                                <Link
                                    href={`/profile/orders/${o._id}`}
                                    className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold border border-border text-foreground bg-card rounded-[var(--radius-md)] hover:bg-background-secondary transition-colors"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {totalPages > 1 && (
                <div className="flex justify-center pt-4 pb-10">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={currentLimit}
                        pathname="/profile/orders"
                    />
                </div>
            )}
        </div>
    );
}