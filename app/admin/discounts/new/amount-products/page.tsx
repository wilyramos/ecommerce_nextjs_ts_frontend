// File: frontend/app/admin/discounts/new/amount-products/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ProductsAmountForm from "@/components/admin/discounts/forms/ProductsAmountForm";

export default function NewAmountProductsDiscountPage() {
    return (
        <AdminPageWrapper
            title="Monto de Descuento en Productos"
            breadcrumbItems={[
                { label: "Ventas", href: "/admin/orders-v2" },
                { label: "Cupones", href: "/admin/discounts" },
            ]}
            breadcrumbCurrent="Monto en Productos"
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto">
                <ProductsAmountForm />
            </div>
        </AdminPageWrapper>
    );
}