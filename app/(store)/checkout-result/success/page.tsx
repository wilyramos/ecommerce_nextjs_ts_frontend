// File: frontend/app/%28store%29/checkout-result/success/page.tsx

import SuccessClient from "@/components/checkout/SuccessClient"
import { getOrder } from "@/src/services/orders";


type SearchParams = Promise<{
    orderId?: string;
}>;



export default async function SuccessPageCheckout(    { searchParams }: { searchParams: SearchParams }) {

    const { orderId } = await searchParams;
    if (!orderId) {
        return <p>Order ID is missing</p>;
    }

    // Debugging log
    console.log("Order IDDDDDDDDDDDDDDDDDD:", orderId);

    const order = await getOrder(orderId);

    if (!order) {
        return <p>Order not found</p>;
    }


    return (
        <>
            <SuccessClient order={order} />
        </>
    )
}
