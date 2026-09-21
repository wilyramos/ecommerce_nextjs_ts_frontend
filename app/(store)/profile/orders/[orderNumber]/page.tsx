// File: frontend/app/(shop)/profile/orders/[orderNumber]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { verifySession } from "@/src/auth/dal";
import { orderService } from "@/src/services/order-v3.service";
import { OrderDetailView } from "@/src/components/profile-v3/OrderDetailView";

export const metadata = {
    title: "Detalle de Orden | Mi Perfil",
};

interface PageProps {
    params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailPage({
    params,
}: PageProps) {


    const { orderNumber } = await params;
    // 1. Validar sesión
    const session = await verifySession();

    // 2. Consultar orden específica
    let order;
    try {
        order = await orderService.getByOrderNumber(orderNumber, session.token);
    } catch (error) {
        console.error("Error cargando detalle de orden:", error);
        // Si el backend arroja 404
        return notFound();
    }

    if (!order) return notFound();

    return (
        <div className="space-y-6">
            {/* Botón de regreso (fuera del card principal para mejor UX) */}
            <div className="flex items-center justify-between">
                <Link
                    href="/profile/orders"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a mis órdenes
                </Link>
            </div>

            {/* Vista delegada a componente UI */}
            <OrderDetailView order={order} />
        </div>
    );
}