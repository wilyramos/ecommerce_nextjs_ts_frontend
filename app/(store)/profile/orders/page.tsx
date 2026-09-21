// File: frontend/app/(shop)/profile/orders/page.tsx
import Link from "next/link";
import { Package } from "lucide-react";
import { verifySession } from "@/src/auth/dal";
import { orderService } from "@/src/services/order-v3.service";
import { OrderListCard } from "@/src/components/profile-v3/OrderListCard";
import type { OrderResponse } from "@/src/schemas/order-v3.schema"; // Importar el tipo

export const metadata = {
    title: "Mis Órdenes | Mi Perfil",
};

export default async function ProfileOrdersPage() {
    const session = await verifySession();

    // Declarar el tipo explícitamente evita que TS lo infiera como `never[]`
    let result: { data: OrderResponse[]; total: number } = { data: [], total: 0 };
    
    try {
        result = await orderService.getMyOrders(session.token);
    } catch (error) {
        console.error("Error cargando órdenes:", error);
    }

    const orders = result.data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Historial de Órdenes
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Revisa el estado de tus compras y verifica tus detalles de envío.
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-xl border border-border border-dashed">
                    <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">
                        Aún no tienes órdenes
                    </h3>
                    <p className="text-muted-foreground mt-1 text-center max-w-sm">
                        Cuando realices tu primera compra, aparecerá aquí todo el seguimiento.
                    </p>
                    <Link
                        href="/productos"
                        className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Empezar a comprar
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <OrderListCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}