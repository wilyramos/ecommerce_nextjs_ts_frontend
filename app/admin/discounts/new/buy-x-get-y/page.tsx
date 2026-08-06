// File: frontend/app/admin/discounts/new/buy-x-get-y/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import BuyXGetYForm from "@/components/admin/discounts/forms/BuyXGetYForm";

export default function NewBuyXGetYDiscountPage() {
    return (
        <AdminPageWrapper
            title="Crear promoción Compra X y Obtén Y"
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto">
                <BuyXGetYForm />
            </div>
        </AdminPageWrapper>
    );
}