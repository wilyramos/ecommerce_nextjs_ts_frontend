// File: frontend/app/admin/discounts/new/amount-order/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import OrderAmountForm from "@/components/admin/discounts/forms/OrderAmountForm";

export default function NewAmountOrderDiscountPage() {
    return (
        <AdminPageWrapper
            title="Monto de Descuento en el Pedido"
            breadcrumbItems={[
                { label: "Ventas", href: "/admin/orders-v2" },
                { label: "Cupones", href: "/admin/discounts" },
            ]}
            breadcrumbCurrent="Descuento en Pedido"
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto">
                <OrderAmountForm />
            </div>
        </AdminPageWrapper>
    );
}