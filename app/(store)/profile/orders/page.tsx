// File: frontend/app/(store)/profile/orders/page.tsx

import { getOrdersByUser } from "@/src/services/orders";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";
// import Pagination from "@/components/home/Pagination";
import Pagination from "@/components/ui/Pagination";

type PageOrdersProps = {
    searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function OrdersProfilePage({ searchParams }: PageOrdersProps) {
    const { page = "1", limit = "5" } = await searchParams;
    const currentPage = +page;
    const data = await getOrdersByUser({ page: currentPage, limit: +limit });

    if (!data?.orders.length) {
        return <p className="text-center text-gray-500 py-20">Aún no tienes pedidos.</p>;
    }

    return (
        <>
            <section className="max-w-3xl mx-auto px-4 space-y-2">
                <h1 className="text-2xl font-semibold mb-4">Mis pedidos</h1>

                {data.orders.map((o) => (
                    <div key={o._id} className="bg-white border rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>#{o._id}</span>
                            <span>{formatDate(o.createdAt)}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <span>Total: <strong>S/ {o.totalPrice.toFixed(2)}</strong></span>
                            <span>Envío: {o.shippingMethod}</span>
                            <PaymentStatusBadge status={o.paymentStatus} />
                            <OrderStatusBadge status={o.status} />
                            <Link
                                href={`/profile/orders/${o._id}`}
                                className="text-blue-600 ml-auto hover:underline"
                            >
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                limit={+limit}
                pathname="/profile/orders"
                
            />
        </>
    );
}
