import { getOrder } from "@/src/services/orders";
import PendingClient from "@/components/checkout/PendingClient";


type SearchParams = Promise<{
    orderId?: string;
}>;

export default async function PendingPageCheckout({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { orderId } = await searchParams;

    if (!orderId) {
        return <p>Order ID is missing</p>;
    }

    const order = await getOrder(orderId);

    if (!order) {
        return <p>Order not found</p>;
    }

    return <PendingClient order={order} />;
}