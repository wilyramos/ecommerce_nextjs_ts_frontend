// File: frontend/app/admin/discounts/[id]/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import DiscountDetailCard from "@/components/admin/discounts/DiscountDetailCard";
import { getTokenOptional } from "@/src/auth/dal";
import { discountService } from "@/src/services/discount-service";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminDiscountDetailPage({ params }: PageProps) {
    const token = await getTokenOptional();
    const { id } = await params;

    let discount = null;
    let analytics = null;

    try {
        // Consultar el detalle completo y las analíticas en paralelo al backend
        const [discountData, analyticsData] = await Promise.all([
            discountService.getDiscountById(id, token),
            discountService.getDiscountAnalytics(id, token).catch(() => null),
        ]);

        discount = discountData;
        analytics = analyticsData;
    } catch (error) {
        console.error("[AdminDiscountDetailPage] Error al consultar el descuento:", error);
    }

    if (!discount) {
        notFound();
    }

    return (
        <AdminPageWrapper
            title={`Detalle: ${discount.title}`}
            breadcrumbItems={[
                { label: "Ventas", href: "/admin/orders-v2" },
                { label: "Cupones", href: "/admin/discounts" },
            ]}
            breadcrumbCurrent={discount.code || "Detalle"}
            showBackButton={true}
        >
            <div className="max-w-5xl mx-auto space-y-6">
                <DiscountDetailCard discount={discount} analytics={analytics} />
            </div>
        </AdminPageWrapper>
    );
}