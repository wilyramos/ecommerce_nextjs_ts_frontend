// File: frontend/app/admin/discounts/new/free-shipping/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import FreeShippingForm from "@/components/admin/discounts/forms/FreeShippingForm";

export default function NewFreeShippingDiscountPage() {
    return (
        <AdminPageWrapper
            title="Cupón de Envío Gratis"
            breadcrumbItems={[
                { label: "Ventas", href: "/admin/orders-v2" },
                { label: "Cupones", href: "/admin/discounts" },
            ]}
            breadcrumbCurrent="Envío Gratis"
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto">
                <FreeShippingForm />
            </div>
        </AdminPageWrapper>
    );
}