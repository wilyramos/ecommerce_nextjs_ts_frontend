// File: frontend/app/(store)/checkout-result/success/page.tsx
import { notFound } from "next/navigation";
import SuccessClient from "@/components/checkout/SuccessClient";
import { orderService } from "@/src/services/order-service";

type SearchParams = Promise<{
    orderNumber?: string;
}>;

export default async function SuccessPageCheckout({ searchParams }: { searchParams: SearchParams }) {
    const { orderNumber } = await searchParams;
    
    if (!orderNumber) {
        return notFound();
    }

    const order = await orderService.getOrderByNumber(orderNumber);

    if (!order) {
        return notFound();
    }

    return <SuccessClient order={order} />;
}