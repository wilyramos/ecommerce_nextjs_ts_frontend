// File: frontend/app/(store)/profile/orders/page.tsx

import { getOrdersByUser } from "@/src/services/orders";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
import Pagination from "@/components/ui/Pagination";

type PageOrdersProps = {
    searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function OrdersProfilePage({ searchParams }: PageOrdersProps) {
    const { page = "1", limit = "5" } = await searchParams;
    const currentPage = +page;
    const data = await getOrdersByUser({ page: currentPage, limit: +limit });

    if (!data?.orders.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <p className="text-[var(--color-text-secondary)] mb-6">Aún no tienes pedidos.</p>
                <Link 
                    href="/productos" 
                    className="text-sm font-medium text-[var(--color-action-primary)] hover:underline"
                >
                    Explorar productos
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="max-w-3xl mx-auto px-4 space-y-4">
                <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">Mis pedidos</h1>

                <div className="grid gap-4">
                    {data.orders.map((o) => (
                        <div 
                            key={o._id} 
                            className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)] rounded-2xl p-6 transition-all hover:border-[var(--color-border-strong)]"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">
                                        ID de Pedido
                                    </span>
                                    <span className="text-xs font-mono text-[var(--color-text-secondary)]">#{o._id}</span>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="block text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">
                                        Fecha
                                    </span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">{formatDate(o.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold">Total</span>
                                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">S/ {o.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PaymentStatusBadge status={o.payment.status} />
                                        <OrderStatusBadge status={o.status} />
                                    </div>
                                </div>

                                <Link
                                    href={`/profile/orders/${o._id}`}
                                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium bg-[var(--color-bg-primary)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] rounded-full hover:bg-[var(--color-surface-hover)] transition-colors ml-auto md:ml-0"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex justify-center pb-10">
                <Pagination
                    currentPage={currentPage}
                    totalPages={data.totalPages}
                    limit={+limit}
                    pathname="/profile/orders"
                />
            </div>
        </div>
    );
}