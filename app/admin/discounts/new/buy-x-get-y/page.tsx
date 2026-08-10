import React from "react";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import BuyXGetYForm from "@/components/admin/discounts/forms/BuyXGetYForm";

export default function NewBuyXGetYDiscountPage() {
    return (
        <AdminPageContainer>
            <AdminPageHeader 
                title="Crear promoción Compra X y Obtén Y" 
            />
            <div className="w-full">
                <BuyXGetYForm />
            </div>
        </AdminPageContainer>
    );
}